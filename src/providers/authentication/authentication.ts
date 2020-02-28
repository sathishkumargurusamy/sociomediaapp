import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../pages/user';
import { BiometricData } from '../../models/biometric';

@Injectable()
export class AuthenticationProvider {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  apiurl = 'https://sociomediaapp-server.herokuapp.com/api';
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(this.apiurl + `/user`, { username: username, password: password })
      .pipe(map(user => {
        if (!user) {
          localStorage.setItem('state', '');
        }
        else {
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('state', '1');
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }
  setstatus(body) {
    return this.http.put(this.apiurl + `/user/` + body.id, body);
  }
  checkusername(body) {
    return this.http.post(this.apiurl + `/checkusername`, body);
  }
  checkemail(body) {
    return this.http.post(this.apiurl + `/checkemail`, body);
  }
 confirmationMail(body)
 {
  return this.http.post(this.apiurl + `/sendconfirmmail`, body);
 }
  register(body) {
    return this.http.post(this.apiurl + `/newuser`, body);
  }
  getbiometricData(userid){
    return this.http.get<BiometricData[]>(this.apiurl + `/secure/`+userid);
  }
  putbiometricData(body){
    return this.http.put(this.apiurl + `/secure`,body);
  }
  setbiometricData(body){
    return this.http.post(this.apiurl + `/secure`, body);
  }
  logout() {
    localStorage.removeItem('currentUser');
    localStorage.setItem('state', '');
    this.currentUserSubject.next(null);
  }
}
