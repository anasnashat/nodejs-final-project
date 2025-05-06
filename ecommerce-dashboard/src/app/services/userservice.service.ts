import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserserviceService {
  private url = 'http://localhost:5000/api/users/';
  _httpClient = inject(HttpClient);
  getAllUsers():Observable<any>{
    return this._httpClient.get(this.url);
  }
}
