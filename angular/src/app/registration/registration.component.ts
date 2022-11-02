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
<<<<<<< Updated upstream
    password : ['',[Validators.required, Validators.minLength(8)]]
=======
    password : ['',[Validators.required, Validators.minLength(8)]],
    fitbitToken : ['', [Validators.required]],
    fitbit_id: ['', [Validators.required]]
>>>>>>> Stashed changes
  })

  onRegister() {
    if(!this.registerForm.valid) {
      return;
    }
    const formData = this.registerForm.value;
    console.log(formData);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json; charset=UTF-8',
      }),
      responseType: "text" as const,
    };

<<<<<<< Updated upstream
    this.http.post("https://www.musicbit.net/register.php", JSON.stringify({action: "register", fname: formData.firstName, lname: formData.lastName, user: formData.username, pass: formData.password}), httpOptions).subscribe(data => {
=======
    this.http.post("https://www.musicbit.net/register.php", JSON.stringify({action: "register", fname: formData.firstName, lname: formData.lastName, user: formData.username, pass: formData.password, fitbit_token: formData.fitbitToken, fitbit_id: formData.fitbit_id}), httpOptions).subscribe(data => {
>>>>>>> Stashed changes
      console.log(data);
    });

    this.router.navigate(['']);
  }

}
