import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/security/models/User';
import { SecurityValidations } from 'src/app/security/services/security.validations';
import { environment } from 'src/environments/environment';
import { Profile } from '../models/Profile';
import { LoginRepository } from '../repositories/LoginRepository';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends SecurityValidations implements LoginRepository {

  private url:string;

  constructor(private http:HttpClient) {
    super();
    this.url = environment.baseUrl;
    if (environment.testing) {
      this.url = environment.testsUrl.login
    }
  }

  signIn(user: User): Observable<Profile> {
    let url:string = this.url + "sign-in";
    if (this.areCredentialsCompleted(user)) {
      return this.http.post<Profile>(url, user);
    }
    return new Observable();
  }

  signOut(user: User): Observable<void> {
    let url:string = this.url + "sign-out";
    if (!this.isSecurityTokenTrustworthy(user)) {
      throw new Error('Security Token not detected.');
    }
    return this.http.post<void>(url, user);
  }

  /*
  whoAmI(securityToken: string = "", user: User | undefined = undefined): Observable<Profile> {
    if (securityToken.length === 0 && user !== undefined) {
      securityToken = user.securityToken;
    }
    if (securityToken.length > 0) {
      //Set GET Method to return profile info
    }
    throw new Error('Method not implemented.');
  }
  */
}
