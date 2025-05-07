import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api/cart/681bdf4980869658b62bbebb';
  private ordersUrl = 'http://localhost:5000/api/orders/681bdf4980869658b62bbebb';
  private paymentsUrl = 'http://localhost:5000/api/payments';

  constructor(private _httpClient: HttpClient) {}

  getCartItems() {
    return this._httpClient.get(`${this.apiUrl}`);
  }

  addToCart(productId: string) {
    return this._httpClient.post(`${this.apiUrl}/`, { productId });
  }

  createOrder(orderData: any): Observable<any> {
    return this._httpClient.post(this.ordersUrl, orderData);
  }

  createCheckoutSession(orderId: string): Observable<any> {
    return this._httpClient.get(`${this.paymentsUrl}/create-payment-intent/${orderId}`);
  }

  verifySession(sessionId: string): Observable<any> {
    return this._httpClient.get(`${this.paymentsUrl}/verify-session/${sessionId}`);
  }
}
