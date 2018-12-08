import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import AuthInfo from '../interfaces/authinfo';
import LogInInfo from '../interfaces/logininfo';
import SignInInfo from '../interfaces/signininfo';
import User from '../models/user';
import { ApiClientService } from './api-client.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import Show from '../models/show';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = 'http://localhost:4000';
  private _user: User;
  private userSubject = new Subject<User>();
  public user$ = this.userSubject.asObservable().pipe(
    map(user => {
      user.shows = user.shows.map(show => Show.from(show));
      return User.from(user);
    })
  );
  public userLoggedIn: Subject<boolean> = new Subject<boolean>();
  public userInfo: Subject<any> = new Subject<any>();

  get user() {
    return this._user;
  }

  set user(newValue: User) {
    if (this._user !== newValue) {
      this.userSubject.next(newValue);
    }
    this._user = newValue;
  }

  constructor(private apiClient: ApiClientService, private http: HttpClient) {}

  login(info: LogInInfo): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/login`, info);
  }

  signin(info: SignInInfo): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/signin`, info);
  }

  auth(info: AuthInfo): void {
    this.http.post<any>(`${this.baseUrl}/signup`, info).subscribe(el => {
      this.userInfo = el;
      localStorage.setItem('token', el.authToken);
    });
  }

  isLoggedIn(): boolean {
    const tokenNumber: string = localStorage.getItem('token');
    return !!tokenNumber;
  }

  setUser(token: string) {
    this.userLoggedIn.next();
  }
}
