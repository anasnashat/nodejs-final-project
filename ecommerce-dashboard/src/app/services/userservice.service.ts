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

  approveUser(_id:string): Observable<any>{
    return this._httpClient.patch(`http://localhost:5000/api/auth/users/${_id}/approve`, _id);
  }

  deleteUser(_id: string): Observable<any>{
    return this._httpClient.delete(
      `http://localhost:5000/api/users/${_id}`
    );
  }
}
