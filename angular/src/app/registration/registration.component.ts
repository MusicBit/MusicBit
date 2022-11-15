import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  hide:boolean = true;
  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
  }

  registerForm : FormGroup = this.fb.group({
    firstName : ['',[Validators.required, Validators.maxLength(20)]],
    lastName : ['',[Validators.required, Validators.maxLength(20)]],
    username : ['',[Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    password : ['',[Validators.required, Validators.minLength(8)]],
    fitbitToken : ['', [Validators.required]]
  })

  onRegister() {
    if(!this.registerForm.valid) {
      return;
    }
    const formData = this.registerForm.value;
    //console.log(formData);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json; charset=UTF-8',
      }),
      responseType: "text" as const,
    };

    this.http.post("https://www.musicbit.net/register.php", JSON.stringify({action: "register", fname: formData.firstName, lname: formData.lastName, user: formData.username, pass: formData.password, fitbit_token: formData.fitbitToken}), httpOptions).subscribe(data => {
      //console.log(data);
    });

    this.router.navigate(['']);
  }

  fitbitTutorial() {
    window.open("https://drive.google.com/file/d/1obYDSvvzVhM9ufKRQ5EPXH7u0UR08J7O/view?usp=sharing", "_blank");
  }

}
