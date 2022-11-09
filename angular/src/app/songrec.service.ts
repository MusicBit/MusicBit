import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import SpotifyWebApi from 'spotify-web-api-js';
import fetch from 'node-fetch'
import * as qs from 'qs';

// Might need to move this, according to codesandbox compiler
let spotify = new SpotifyWebApi();
var blackList: string | any[] = [];
//var Spotify = require('spotify-web-api-js');
//var s = new Spotify();

@Injectable({
  providedIn: 'root'
})
export class SongrecService {
  //let?
  

  
  constructor(private http: HttpClient) { }
  
  async getTopTracks(token: string) {
    const httpOptions = {
      header: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + token
      }),
      responseType: "text" as const,
    };
    spotify.setAccessToken(token);
    //    this.http.get("https://api.spotify.com/v1/me/top/tracks",qs.stringify({time_range: 'medium_term', limit: 50}), httpOptions).subscribe(data => {
    //wait tyree to save me
    //}
    //This might need to change, given usage of library
    let req = `{Authorization: \'Bearer \' ${token}, Content-Type: application/json, time_range: \'medium-term\', limit: 50}`
    return await spotify.getMyTopTracks(JSON.stringify(req), function (err, data) {
      if (err) {console.error(err); return null}
      else return data;
    });

  }
  async getRecommendation(token: string, bpm: number) {
    var seedID;
    if (blackList.length == 0) {
      var topSongs = await this.getTopTracks(token);
      console.log(topSongs);
      //var tSongs = topSongs.then(function (data) { return data.items });
      //var topLength = topSongs.then(function (data) { return data.total });
      var tSongs = topSongs.items;
      var topLength = topSongs.total;
      let randTopSong = tSongs[Math.floor(Math.random() * topLength)];
      console.log("Chosen seed: " + randTopSong.name + 'by' + randTopSong.artists[0].name);
      let seedID = randTopSong.id;
    }
    if (blackList.length > 0 && blackList.length < 6) {
      let seedID = blackList.slice();
    }
    if (blackList.length >= 6) {
      let seedID = [];
      seedID.push(blackList[blackList.length - 1]);
      seedID.push(blackList[blackList.length - 2]);
      seedID.push(blackList[blackList.length - 3]);
      seedID.push(blackList[blackList.length - 4]);
      seedID.push(blackList[blackList.length - 5]);
    }
    let rec = `{seed_tracks: ${seedID}, limit: 20, target_tempo: ${bpm}}`;
    let recommendationsResponse = await spotify.getRecommendations({ seed_tracks: seedID, limit: 20, target_tempo: bpm }, function (err, data) {
      if (err) { console.error(err); return null; }
      else return data;
    });
    let recommendations = recommendationsResponse.tracks;
    let recIDs = [];
    for (let i = 0; i < 20; i++) {
      recIDs.push(recommendations[i].id);
    }
    let songInfo = await spotify.getAudioFeaturesForTracks(recIDs, function (err, data) {
      if (err) { console.error(err); return null; }
      else return data;
    });
    let songList = []
    for (let k = 0; k < 20; k++) {
      let flag = true;
      let curName = recommendations[k].name;
      let curArtist = recommendations[k].artists[0].name;
      let curID = recommendations[k].id;
      let curBPM = songInfo.audio_features[k].tempo;
      let curURI = recommendations[k].uri;
      if (blackList.length == 0) {
        songList.push(/*Need to have a song struct?*/)
      }
      else {
        for (let z = 0; z < blackList.length; z++) {
          if (curID == blackList[z]) {
            flag = false;
          }
        }
      }
    }
  }

}
