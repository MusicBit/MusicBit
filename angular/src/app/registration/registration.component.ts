import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  hide:boolean = true;
  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
  }

  registerForm : FormGroup = this.fb.group({
    firstName : ['',[Validators.required]],
    lastName : ['',[Validators.required]],
    username : ['',[Validators.required, Validators.minLength(6)]],
    password : ['',[Validators.required, Validators.minLength(8)]]
  })

  onRegister() {
    if(!this.registerForm.valid) {
      return;
    }
    console.log(this.registerForm.value);
    this.router.navigate(['']);
  }

}
