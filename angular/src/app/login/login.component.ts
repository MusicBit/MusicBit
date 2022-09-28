import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide: boolean = true;
  constructor(private fb: FormBuilder, private router: Router) { }

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
    console.log(this.loginForm.value)
  }

}
