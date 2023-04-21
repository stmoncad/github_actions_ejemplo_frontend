import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User } from 'src/app/security/models/User';
import { environment } from 'src/environments/environment';
import { Profile } from '../models/Profile';

import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let http:HttpTestingController;

  let johnProfile:Profile;
  let johnUser:User;

  beforeEach(() => {
    environment.testing = true;
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(LoginService);
    http = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    johnProfile = new Profile(require("src/assets/testsSupport/login/profile/1.json"));
    johnUser = new Profile(require("src/assets/testsSupport/login/profile/1.json"));
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('signIn - SUCCESS', () => {
    johnUser.userId = -1;
    johnUser.securityToken = "";

    service.signIn(johnUser).subscribe(
      (profile:Profile) => {
        expect(profile).toBe(johnProfile);
        expect(profile.userId).toBe(1);
        expect(profile.firstName).toEqual("John");
        expect(profile.lastName).toEqual("Doe");
      }
    );

    const req = http.expectOne("src/assets/testsSupport/login/sign-in");

    expect(req.request.method).toBe("POST");    

    req.flush(johnProfile, {status: 200, statusText: "OK"});
  });

  it('signIn - UNRECOGNIZED', () => {
    service.signIn(johnProfile).subscribe({
      error: (error) => {
        expect(error.status).withContext("status").toBe(404);
        expect(error.statusText).withContext("message").toBe("Not Found");
      }
    });

    const req = http.expectOne("src/assets/testsSupport/login/sign-in");

    req.flush("error", {
      status: 404,
      statusText: "Not Found"
    });

  });

  it("signIn - NO CREDENTIALS", () => {
    //No userName nor password
    johnUser = new User({userName: ""});

    service.signIn(johnUser).subscribe();

    http.expectNone("src/assets/testsSupport/login/sign-in");

    //No password
    johnUser = new User({userName: "john"});

    service.signIn(johnUser).subscribe();

    http.expectNone("src/assets/testsSupport/login/sign-in");

  });

  it('signOut - OK', () => {
    service.signOut(johnProfile).subscribe();

    http.expectOne("src/assets/testsSupport/login/sign-out");
  });

  it('signOut - LOCAL ERROR', () => {
    johnProfile.securityToken = "";

    expect(() => service.signOut(johnProfile)).toThrow(new Error("Security Token not detected."));
  });

  it('signOut - HTTP ERROR', () => {
    service.signOut(johnProfile).subscribe({
      error: (error) => {
        expect(error.status).withContext("status").toBe(400);
        expect(error.statusText).withContext("message").toEqual("Bad Request");
      }
    });

    const req = http.expectOne("src/assets/testsSupport/login/sign-out");

    req.flush("error", {
      status: 400,
      statusText: "Bad Request"
    });

  });
});
