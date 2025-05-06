import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from '../../interfaces/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  _httpClient = inject(HttpClient);
  register(info: Auth): Observable<any> {
    return this._httpClient.post(
      'http://localhost:5000/api/auth/users/signup',
      info
    );
  }
}
