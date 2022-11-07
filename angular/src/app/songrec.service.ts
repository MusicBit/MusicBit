import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SongrecService {
  //let?
  blackList=[];

  constructor(private http: HttpClient) { }
  getTopTracks(token:string){
    const httpOptions =(){
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
      }),
    };
    this.http.get("https://api.spotify.com/v1/me/top/tracks",qs.stringify({time_range: 'medium_term', limit: 50}), httpOptions).subscribe(data => {
      //wait tyree to save me
    }

  }
  getRecommendation(token:string,bpm:int){
    let topSongs=this

  }

}
