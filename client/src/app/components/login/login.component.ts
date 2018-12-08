import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AuthService, FacebookLoginProvider } from 'angular-6-social-login';
import { Router } from '@angular/router';
import LogInInfo from '../../interfaces/logininfo';
import SignInInfo from '../../interfaces/signininfo';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login: boolean;
  signin: boolean;
  logInInfo: LogInInfo;
  signInInfo: SignInInfo;

  constructor(
    private userService: UserService,
    private socialAuthService: AuthService,
    private router: Router
  ) {}

  private loginclick() {
    this.signin = false;
    this.login = !this.login;
  }

  private signinclick() {
    this.login = false;
    this.signin = !this.signin;
  }

  private sign_send() {
    this.userService.signin(this.signInInfo).subscribe(boo => {
      if (boo === true) {
        this.userService.setUser('');
      } else {
      }
    });
  }

  private login_send() {
    this.userService.login(this.logInInfo).subscribe(boo => {
      if (boo === true) {
        this.userService.setUser('');
      } else {
      }
    });
  }

  onKeyLogin(event: any) {
    if (!this.logInInfo) this.logInInfo = { email: '', password: '' };
    this.logInInfo[event.target.placeholder] = event.target.value;
  }

  onKeySignIn(event: any) {
    this.router.navigateByUrl('/recommendations');
    if (!this.signInInfo)
      this.signInInfo = { email: '', password: '', name: '' };
    this.signInInfo[event.target.placeholder] = event.target.value;
  }

  public socialSignIn(socialPlatform: string) {
    this.login = false;
    this.signin = false;
    let socialPlatformProvider;
    if (socialPlatform === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then(userData => {
      console.log(socialPlatform + ' sign in data : ', userData);
      this.userService.auth(userData);
      this.userService.userInfo.subscribe(boo => {
        if (boo === true) {
          this.userService.auth(userData);
          localStorage.setItem('router', '');
          this.router.navigateByUrl('recommendations');
        }
      });
    });
  }

  ngOnInit() {}

  ngOnChange() {}
}
