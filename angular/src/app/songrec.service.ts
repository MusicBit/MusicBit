import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import SpotifyWebApi from 'spotify-web-api-js';

// Song Recommendation Algorithm written by Carson Smith

// Currently some code/comments floating around that can be removed
// after finalizing service

// Might need to move this, according to codesandbox compiler,
// but it makes sense here as globals?
let spotify = new SpotifyWebApi();
var blackList: string[] = [];
//var Spotify = require('spotify-web-api-js');
//var s = new Spotify();

interface Song{
  Name: string;
  Artist: string;
  ID: string;
  BPM: number;
  URI: string;

}

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
    return await spotify.getMyTopTracks(JSON.stringify(req));
  }

  async getRec(seedID: string[], bpm: number) {
    return await spotify.getRecommendations({ seed_tracks: seedID, limit: 20, target_tempo: bpm });
  }
  
  async getRecommendation(token: string, bpm: number) {
    var seedID = [];
    if (blackList.length == 0) {
      var topSongs = await this.getTopTracks(token);
      console.log(topSongs);
      //var tSongs = topSongs.then(function (data) { return data.items });
      //var topLength = topSongs.then(function (data) { return data.total });
      var tSongs = topSongs.items;
      var topLength = 19;
      let randTopSong = tSongs[Math.floor(Math.random() * topLength)];
      console.log("Chosen seed: " + randTopSong.name + 'by' + randTopSong.artists[0].name);
      seedID.push(randTopSong.id);
    }
    if (blackList.length > 0 && blackList.length < 6) {
      seedID = blackList.slice();
    }
    if (blackList.length >= 6) {
      seedID = [];
      seedID.push(blackList[blackList.length - 1]);
      seedID.push(blackList[blackList.length - 2]);
      seedID.push(blackList[blackList.length - 3]);
      seedID.push(blackList[blackList.length - 4]);
      seedID.push(blackList[blackList.length - 5]);
    }
    let rec = `{seed_tracks: ${seedID}, limit: 20, target_tempo: ${bpm}}`;
    let recommendationsResponse = await this.getRec(seedID, bpm);
    
    console.log("data: " + recommendationsResponse);
    let recommendations = recommendationsResponse.tracks;
    let recIDs = [];
    for (let i = 0; i < 20; i++) {
      recIDs.push(recommendations[i].id);
    }
    let songInfo = await spotify.getAudioFeaturesForTracks(recIDs);
    let songList: Song[] = []
    for (let k = 0; k < 20; k++) {
      let flag = true;
      let curName = recommendations[k].name;
      let curArtist = recommendations[k].artists[0].name;
      let curID = recommendations[k].id;
      let curBPM = songInfo.audio_features[k].tempo;
      let curURI = recommendations[k].uri;
      if (blackList.length == 0) {
        songList.push({ Name: curName, Artist: curArtist, ID: curID, BPM: curBPM, URI: curURI })
      }
      else {
        for (let z = 0; z < blackList.length; z++) {
          if (curID == blackList[z]) {
            flag = false;
          }
          if (flag) {
            songList.push({ Name: curName, Artist: curArtist, ID: curID, BPM: curBPM, URI: curURI });
          }
        }
      }
    }
    let closestBPM = 0;
    let closestSong = 0;
    for (let j = 0; j < songList.length; j++) {
      if (Math.abs(songList[j].BPM - bpm) < Math.abs(closestBPM - bpm)) {
        closestBPM = songList[j].BPM;
        closestSong = j;
      }
    }
    console.log('Closest song: ' + songList[closestSong] + " by " + songList[closestSong].Artist);
    console.log("      BPM: " + songList[closestSong].BPM);
    blackList.push(songList[closestSong].ID);
    return songList[closestSong];
  }

  async playSong(tarSong: Song, device: string) {
    let dummyList = [];
    dummyList.push(tarSong.URI);
    // Hold response Promise as variable in case we want to do some checking
    let response = await spotify.skipToNext({ device_id: device });
  }

  async getDevice() {
    // Either spotify.getMyDevices(callback) or spotify.getMyCurrentPlaybackState(options, callback)
    let result = (await spotify.getMyCurrentPlaybackState()).device.id;
    // Actually may not have needed the callback at all - hope the async stuff doesn't break anything
  }

  async nextCheck() {
    console.log('Checking playback');
    let result = (await spotify.getMyCurrentPlaybackState());
    if (result.progress_ms == null) {
      return result.timestamp;
    }
    else if (result.item == null) {
      return 0;
    }
    else {
      return result.item.duration_ms - result.progress_ms;
    }

  }

  async qNextSong(tarSong: Song, device: string) {
    let result = await spotify.queue(tarSong.URI, { device_id: device });
  }

  setToken(token: string) {
    spotify.setAccessToken(token);
  }
}
