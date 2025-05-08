import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {data} from 'autoprefixer';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api/cart/';
  private ordersUrl = 'http://localhost:5000/api/orders/';
  private paymentsUrl = 'http://localhost:5000/api/payments';
  private authToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluMUBhZG1pbi5jb20iLCJpYXQiOjE3NDY2NzExNTl9.Woa0nhTpq7UR2Jxy4BuPMDfy450Pj4tIkLAUKbeYaRM";

  constructor(private _httpClient: HttpClient) {}

  private get headers() {
    return new HttpHeaders({
      'Authorization': this.authToken
    });
  }

  getCartItems(): Observable<any> {
    return this._httpClient.get(this.apiUrl, { headers: this.headers });
  }

  addToCart(productId: string): Observable<any> {
    return this._httpClient.post(this.apiUrl, { productId }, { headers: this.headers });
  }

  createOrder(orderData: any): Observable<any> {
    return this._httpClient.post(this.ordersUrl, orderData, { headers: this.headers });
  }

  createCheckoutSession(orderId: string): Observable<any> {
    return this._httpClient.get(`${this.paymentsUrl}/create-payment-intent/${orderId}`, { headers: this.headers });
  }

  verifySession(sessionId: string): Observable<any> {
    return this._httpClient.get(`${this.paymentsUrl}/verify-session/${sessionId}`, { headers: this.headers });
  }
}
