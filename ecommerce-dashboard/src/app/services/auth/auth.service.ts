import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth, AuthForgetPassword, AuthLogin, AuthResetPassword } from '../../interfaces/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  _httpClient = inject(HttpClient);
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
}
