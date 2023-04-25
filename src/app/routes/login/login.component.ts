import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginForm } from 'src/app/core/forms/loginForm';
import { Profile } from 'src/app/core/models/Profile';
import { FormGroup } from '@angular/forms';
import { LoginService } from 'src/app/core/services/login.service';
import { User } from 'src/app/security/models/User';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  profile!:Profile;
  imgUrl:string;

  formData:FormGroup;
  incompleteData:boolean;
  invalidData:boolean;

  constructor(private loginService:LoginService, 
    private router:Router) {
      this.formData = new LoginForm();
      this.incompleteData = false;
      this.invalidData = false;

      this.imgUrl = environment.imgUrl;
    }

  ngOnInit(): void {
    this.formData = new LoginForm();
    this.incompleteData = false;
    this.invalidData = false;

    //Validate if user has a securityToken in the web browser storage

  }

  signIn(): void {
    this.invalidData = false;
    //1. Set user data
    let userData:User = new User({
      userName: this.formData.controls['userName'].value,
      password: this.formData.controls['password'].value
    });
    //2. Validate data
    this.incompleteData = !userData.isValid;
    //3. If valid, send it to the backend
    if (!this.incompleteData) {
      this.signInSubscription(userData);
    }
  }

  register(): void {
    this.router.navigate(['register']);
  }

  private signInSubscription(user:User):void {
    this.loginService.signIn(user).subscribe({
      next: (profile:Profile) => {
        this.profile = profile;
        //4. If profile info is received, redirect to the home page
        this.router.navigate(['home', profile.userName]);
      },
      error: (error) => {
        this.invalidData = true;
      }
    });
  }

}
