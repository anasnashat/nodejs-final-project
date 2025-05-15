import { HttpClient } from '@angular/common/http';
import { afterNextRender, inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth, AuthForgetPassword, AuthLogin, AuthResetPassword } from '../../interfaces/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // same as observable but with variables
  userInfo:BehaviorSubject<string|null>=new BehaviorSubject<string|null>('');
  _httpClient = inject(HttpClient);
  constructor(){
    //handle localstorage to work in browser .
    afterNextRender(()=>{
      if(localStorage.getItem('token')){
        this.userInfo.next(localStorage.getItem('token'));
      }
    })
  }
  register(formData:FormData): Observable<any> {
    return this._httpClient.post(
      'http://localhost:5000/api/auth/users/signup',
      formData
    );
  }
  login(info: AuthLogin): Observable<any> {
    return this._httpClient.post(
      'http://localhost:5000/api/auth/users/login',
      info
    );
  }
  forgetPassword(info:AuthForgetPassword): Observable<any>{
    return this._httpClient.post(
      'http://localhost:5000/api/auth/users/forget-password'
    ,info);
  }
  resetPassword(info: AuthResetPassword): Observable<any>{
    return this._httpClient.post(
      'http://localhost:5000/api/auth/users/reset-password',info
    );
  }
  saveUser(){
    this.userInfo.next(localStorage.getItem('token'));
  }
  
}
