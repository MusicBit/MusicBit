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
  redirectURL = "http://localhost:4200/home";
  clientSecret = "bcd3a90646574005aef67e13fd575cf6";
  scopes = "user-top-read";

  constructor(private router: Router) { }

  ngOnInit(): void {
  }


  onLogout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC"; //clear login token
    this.router.navigate(['']);
  }

  //got popup to open to connect spotify account, but dont know how to save token or close popup --Tyree
  //https://leemartin.dev/creating-a-simple-spotify-authorization-popup-in-javascript-7202ce86a02f, following this guide but function calls is weird and just JS
  onSpotifyLogin() {
    let popup = window.open(`${this.spotifyAuthEndpoint}?client_id=${this.clientID}&redirect_uri=${this.redirectURL}&scope=${this.scopes}&response_type=token&show_dialog=true`,
     'Login With Spotify', 'width=800,height=600')

      
  }

}
