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
  private authToken = "Bearer " + localStorage.getItem('token') || '';

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

  removeFromCart(productId: string): Observable<any> {
    return this._httpClient.delete(`${this.apiUrl}${productId}`, { headers: this.headers });
  }

  updateQuantity(productId: string, quantity: number): Observable<any> {
    return this._httpClient.put(this.apiUrl, { productId, quantity }, { headers: this.headers });
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
