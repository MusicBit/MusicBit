import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide: boolean = true;
  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    
  }

  loginForm : FormGroup = this.fb.group({
    username : ['',[Validators.required, Validators.minLength(6)]],
    password : ['',[Validators.required, Validators.minLength(8)]]
  }
  )

  onLogin() {
    if(!this.loginForm.valid) {
      return;
    }
    const formData = this.loginForm.value;
    console.log(formData);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json; charset=UTF-8',
      }),
      responseType: "text" as const,
    };
    
    //login
    this.http.post("https://www.musicbit.net/login.php", JSON.stringify({action: "login", user: formData.username, pass: formData.password}), httpOptions).subscribe(data => {
      let responce = data.split("\n");
      if (responce[0] == "Login Successful.") { //good login
        let token = responce[1];
        document.cookie = "token=" + token;

        //syntax for using validateLogin, put login protected script within the anonymous callback funciton
        this.validateLogin(function(id: number) {
          if (id == -1)
            console.log("Failed to stay logged in.");
          else
            console.log("Logged in user: " + id);
        });        
      }
      else //login failed
        console.log(data);
    });
  }
  
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
