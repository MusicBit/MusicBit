import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide: boolean = true;
  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private common: CommonService) { }

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

        //syntax for using validateLogin, put login protected script or function call within the callback arrow funciton
        this.common.validateLogin((id: number) => {
          if (id == -1)
            console.log("Failed to stay logged in.");
          else
            console.log("Logged in user: " + id);
            this.router.navigate(["home"]);
        });        
      }
      else //login failed
        console.log(data);
    });
  }
}
