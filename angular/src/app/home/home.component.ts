///  <reference types="@types/spotify-web-playback-sdk"/>

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';
import { SongrecService } from '../songrec.service';
import * as qs from "qs";
import fetch from 'node-fetch';
import { MatSliderChange } from '@angular/material/slider';
import { ChangeDetectorRef } from '@angular/core';

type HeartRate = {
  time: string;
  value: number;
}

type GetUserResponse = {
  dataset: HeartRate[];
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  clientID = "3c542655555f446f87ef90a99dae6d02";
  spotifyAuthEndpoint = "https://accounts.spotify.com/authorize/";
  redirectURL = window.location.href;
  scopes = "streaming%20user-modify-playback-state%20user-read-email%20user-read-private%20user-top-read%20user-read-currently-playing%20user-read-playback-state";
  token = "";
  player!: Spotify.Player;
  deviceID = "-1";
  spotifyButtonVisible = true;
  spotifyPlayerVisible = false;
  heartRate = 0;
  userName = '';
  desiredHeartRate = 90;
  songTitle = '';
  songArtist = '';
  songImage = '';
  icon= 'play_circle_filled';
  songFlag = false;
  intervalID = 0;
  useHeartbeat = false;


  constructor(private router: Router, private http: HttpClient, private common: CommonService, private songrec: SongrecService, private cRef: ChangeDetectorRef) {
    if(!localStorage.getItem("userName")) { 
      this.userName = this.router.getCurrentNavigation()?.extras?.state?.['userName'];
      //USERNAME IS UNDEFINED FOR SOME LOGINS ON DIFFERENT MACHINES
      localStorage.setItem("userName", this.userName);
    }
  }

  ngOnInit(): void {
    console.log(this.userName);
    if(localStorage.getItem("userName") != null) {
      let user = localStorage.getItem("userName");
      console.log(user);
      this.userName = user?.toString()!;
    }
    
    const urlSearchParams = new URLSearchParams(window.location.search);
    let code = urlSearchParams.get("code");
    if (code) {
      window.location.search = "";
      window.opener.spotifyCallback(code);
      return;
    }

    this.token = this.getToken();
    // ------ testing purposes REMOVE BEFORE FINAL ---
    console.log(this.token);

    // window.onSpotifyWebPlaybackSDKReady = () => {
    //   this.initPlayer();
    // };
  }

  ngOnDestroy() {
    //clearInterval(this.id);
  }

  async getHeartRate() {
    let client_id = '';
    let access_token = '';
    let userId = '';

    this.common.validateLogin( async (id: string) => {userId = id;
      this.http.post("https://www.musicbit.net/fitbit.php", {action: "get_fb", user_id: userId}, {responseType: 'text'}).subscribe(async data => {
        let strData = data.toString();
        let d = strData.split(":");
        access_token = d[0];
        client_id = d[1];

        try {
          const response = await fetch('https://api.fitbit.com/1/user/' + client_id + '/activities/heart/date/today/1d/1min.json', {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + access_token,
            },
          });
    
          if(!response.ok) {
            throw new Error();
          }

          const result: any = (await response.json()) as {
            activity: null;
            activityIntraday: GetUserResponse;
          }

          this.heartRate = result['activities-heart-intraday'].dataset[result['activities-heart-intraday'].dataset.length -1].value;       
        } catch (error) {
          console.log(error);
        }
      });
    });
  }


  onLogout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC"; //clear login token
    if(this.player) {
      this.player.disconnect();
    }
    this.spotifyButtonVisible = true;
    this.spotifyPlayerVisible = false;
    this.userName = '';
    localStorage.removeItem(this.userName);
    this.router.navigate(['']);
  }

  //got popup to open to connect spotify account, but dont know how to save token or close popup --Tyree
  //https://leemartin.dev/creating-a-simple-spotify-authorization-popup-in-javascript-7202ce86a02f, following this guide but function calls is weird and just JS
  onSpotifyLogin() {
    let popup = window.open(
      `${this.spotifyAuthEndpoint}?client_id=${this.clientID}&response_type=code&redirect_uri=${this.redirectURL}&scope=${this.scopes}&show_dialog=true`,
      'Login with Spotify',
      'width=800, height=600, popup=yes, status=yes, toolbar=no, menubar=no, location=no,addressbar=no'
    );

    (window as any).spotifyCallback = (payload: any) => {
      if (popup)
        popup.close()
      
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/x-www-form-urlencoded',
          'Authorization': 'Basic M2M1NDI2NTU1NTVmNDQ2Zjg3ZWY5MGE5OWRhZTZkMDI6ODkxMGY0NTZjMmNlNDU4NWIxOTliYzc5MzRlZDEyMTA=' //encoded client id and secret
        }),
      };
      this.http.post<any>("https://accounts.spotify.com/api/token", qs.stringify({grant_type: 'authorization_code', code: payload, redirect_uri: this.redirectURL}), httpOptions).subscribe(data => {
        this.token = data.access_token;
        document.cookie = "sp_tok=" + this.token;
        this.initPlayer();
      });
    }



  }

  initPlayer() {
    if (this.token) {
      this.spotifyButtonVisible = false;
      this.player = new Spotify.Player({
        name: 'MusicBit Player',
        getOAuthToken: cb => { cb(this.token); },
        volume: 0.5
      });

      let player = this.player;
      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        this.deviceID = device_id;
        this.activateDevice();
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        this.deviceID = "-1";
      });

      player.addListener('initialization_error', ({ message }) => {
        console.log("init_error");
        console.error(message);
      });

      player.addListener('authentication_error', ({ message }) => {
        console.log("auth_error");
        console.error(message);
      });

      player.addListener('account_error', ({ message }) => {
        console.log("acc_error");
        console.error(message);
      });

      player.connect();
    }
  }

  playToggle() {
    
    console.log("toggle");
    this.player.togglePlay();
    this.player.getCurrentState().then((state : any) => {
      if(state['paused'] == true) {
        this.icon = "pause_circle_filled";
      }
      else {
        this.icon = "play_circle_filled";
      }
    });
  }

  skipToggle() {
    this.player.nextTrack().then(() => {
      setTimeout(() => this.getSongInfo(), 1000)
    });
  }

  prevToggle() {
    this.player.previousTrack().then(() => {
      setTimeout(() => this.getSongInfo(), 1000)
    });
  }

  activateDevice() {
    const httpOptions = {
      headers: new HttpHeaders({
        //'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.token 
      }),
    };
    console.log(this.deviceID);
    this.http.put("https://api.spotify.com/v1/me/player", JSON.stringify({device_ids: [`${this.deviceID}`], play: true}), httpOptions).subscribe(() => {
      this.spotifyPlayerVisible = true;
      setTimeout(() => this.getSongInfo(), 1000)

      setInterval(() => {
        this.getSongRecommendation();
      }, 20000);

      setInterval(() => {
        this.getSongInfo();
      }, 5000);
    });
  }

  getToken() {
    let name = "sp_tok=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  //desired heart rate value
  onSliderChange(event : MatSliderChange) {
    console.log(event.value);
    this.desiredHeartRate = event.value!;
  }

  getSongInfo() {
    console.log("Getting song info");
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.token 
      }),
    };
    this.http.get<any>("https://api.spotify.com/v1/me/player/currently-playing", httpOptions).subscribe(response => {
      this.songArtist = response['item']['album']['artists'][0]['name'].toString();
      this.songTitle = response['item']['name'];
      this.songImage = response['item']['album']['images'][0]['url'];
      this.cRef.detectChanges();
    });
  }

  async getSongRecommendation() {
    let bpm = 0;
    if (this.useHeartbeat)
      bpm = this.heartRate;
    else
      bpm = this.desiredHeartRate;
    //Set interval on this function
    this.songrec.setToken(this.token.toString());
    //check time remaining
    let timeRemaining: Number = await this.songrec.nextCheck();
    if(timeRemaining <= 60000 && this.songFlag == false) {
      this.songFlag = true;
      console.log(this.heartRate);
      this.songrec.qNextSong(await this.songrec.getRecommendation(this.token.toString(),bpm.valueOf()),this.deviceID.toString());

    }
    if(timeRemaining > 60000) {
      this.songFlag = false;
      }
  }

}