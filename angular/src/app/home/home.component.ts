///  <reference types="@types/spotify-web-playback-sdk"/>
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  clientID = "78151092cffd4fc18f99577b2a43cc65";
  spotifyAuthEndpoint = "https://accounts.spotify.com/authorize";
  redirectURL = window.location;
  scopes = "streaming%20user-read-email%20user-read-private%20user-top-read";
  token = "";
  player!: Spotify.Player;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.token = window.location.hash.substr(1).split('&')[0].split("=")[1]
    if (this.token)
      window.opener.spotifyCallback(this.token);

    window.onSpotifyWebPlaybackSDKReady = () => {
      this.initPlayer();
    };
  }

  onLogout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC"; //clear login token
    this.router.navigate(['']);
  }

  //got popup to open to connect spotify account, but dont know how to save token or close popup --Tyree
  //https://leemartin.dev/creating-a-simple-spotify-authorization-popup-in-javascript-7202ce86a02f, following this guide but function calls is weird and just JS
  onSpotifyLogin() {
    let popup = window.open(
      `${this.spotifyAuthEndpoint}?client_id=${this.clientID}&response_type=token&redirect_uri=${this.redirectURL}&scope=${this.scopes}&show_dialog=true`,
      'Login with Spotify',
      'width=800, height=600, popup=yes, status=yes, toolbar=no, menubar=no, location=no,addressbar=no'
    );

    (window as any).spotifyCallback = (payload: any) => {
      if (popup)
          popup.close()
      this.token = payload;
      console.log(payload);
      this.initPlayer();
    }
  }

  initPlayer() {
    if (this.token) {
      this.player = new Spotify.Player({
        name: 'MusicBit Player',
        getOAuthToken: cb => { cb(this.token); },
        volume: 0.5
      });
      console.log("Player" + this.player);

      let player = this.player;
      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
      });

      player.addListener('initialization_error', ({ message }) => {
          console.error(message);
      });

      player.addListener('authentication_error', ({ message }) => {
          console.error(message);
      });

      player.addListener('account_error', ({ message }) => {
          console.error(message);
      });

      player.connect();
    }
  }

  playToggle() {
    console.log("toggle");
    this.player.togglePlay();
  }
}

