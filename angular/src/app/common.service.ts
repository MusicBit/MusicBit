import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  //validate login, do this anytime we need to make sure the user is still logged in (cookie)
  validateLogin(callback: Function) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json; charset=UTF-8',
      }),
      responseType: "text" as const,
    };

    let token = this.getToken();
    this.http.post("https://www.musicbit.net/login.php", JSON.stringify({action: "validate", token: token}), httpOptions).subscribe(data => {
      callback(parseInt(data)); //userid of logged in user on success, -1 on failure
    });
  }

  //modified from w3shcools getCookie() https://www.w3schools.com/js/js_cookies.asp
  getToken() {
    let name = "token=";
    let cookie = decodeURIComponent(document.cookie);
    let ca = cookie.split(';');
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
