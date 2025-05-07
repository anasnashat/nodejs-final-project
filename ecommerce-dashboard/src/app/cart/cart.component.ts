import {Component, OnInit} from '@angular/core';
import {CartService} from '../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService) {
  }
  calculateTotalPrice(): void {
    this.totalPrice = 100
  }
  ngOnInit(): void {
    this.cartService.getCartItems().subscribe((response: any) => {
      this.cartItems = response;
      this.calculateTotalPrice();
      console.log('Cart items:', this.cartItems);
    });
  }

}
