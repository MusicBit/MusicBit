import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide: boolean = true;
  constructor(private fb: FormBuilder) { }

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
