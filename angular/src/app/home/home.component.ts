<<<<<<< Updated upstream
=======
///  <reference types="@types/spotify-web-playback-sdk"/>

>>>>>>> Stashed changes
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

<<<<<<< Updated upstream
  constructor(private router: Router) { }

  ngOnInit(): void {
=======
  clientID = "78151092cffd4fc18f99577b2a43cc65";
  spotifyAuthEndpoint = "https://accounts.spotify.com/authorize/";
  redirectURL = window.location.href;
  scopes = "streaming%20user-modify-playback-state%20user-read-email%20user-read-private%20user-top-read";
  token = "";
  player!: Spotify.Player;
  deviceID = "-1";
  spotifyButtonVisible = true;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    const urlSearchParams = new URLSearchParams(window.location.search);
    let code = urlSearchParams.get("code");
    if (code) {
      window.location.search = "";
      window.opener.spotifyCallback(code);
      return;
    }

    this.token = this.getToken();
    // ------ testing purposes REMOVE BEFORE FINAL ---
    //console.log(this.token);

    window.onSpotifyWebPlaybackSDKReady = () => {
      this.initPlayer();
    };
>>>>>>> Stashed changes
  }


  onLogout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC"; //clear login token
    this.spotifyButtonVisible = true;
    this.router.navigate(['']);
  }
<<<<<<< Updated upstream
}
=======

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
          'Authorization': 'Basic NzgxNTEwOTJjZmZkNGZjMThmOTk1NzdiMmE0M2NjNjU6OThhOWZmZTUxMmM4NGJhNmFlNDZlYTg4YzY0OTQ0ZTU=' //encoded client id and secret
        }),
      };
      this.http.post<any>("https://accounts.spotify.com/api/token", qs.stringify({grant_type: 'authorization_code', code: payload, redirect_uri: this.redirectURL}), httpOptions).subscribe(data => {
        this.token = data.access_token;
        document.cookie = "sp_tok=" + this.token;
        this.initPlayer();
      });
    }
    this.spotifyButtonVisible = false;

  }

  initPlayer() {
    if (this.token) {
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
  }

  activateDevice() {
    this.http.put("https://api.spotify.com/v1/me/player", qs.stringify({device_ids: [`"${this.deviceID}"`], play: true})).subscribe();
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
}
>>>>>>> Stashed changes
