import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  image: string;
  sliderImages: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CartItem {
  _id: string;
  product: Product | null;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  loading: boolean = false;
  error: string | null = null;

  constructor(private cartService: CartService) {}

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0
    );
  }

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe({
      next: (response: any) => {
        this.cartItems = response;
        console.log('Cart items:', this.cartItems);
      },
      error: (err) => {
        this.error = 'Failed to load cart items';
        console.error(err);
      }
    });
  }

  checkout(): void {
    this.loading = true;
    this.error = null;

    // First create an order
    const orderData = {
      paymentMethod: 'card',
      shippingAddress: {
        fullName: 'Test User',
        phone: '1234567890',
        address: '123 Test St',
        city: 'Test City',
        postalCode: '12345',
        country: 'Test Country'
      }
    };

    this.cartService.createOrder(orderData).subscribe({
      next: (orderResponse) => {
        console.log('Order created:', orderResponse);

        // Then create a checkout session
        this.cartService.createCheckoutSession(orderResponse.order._id).subscribe({
          next: (sessionResponse) => {
            console.log('Checkout session created:', sessionResponse);

            // Redirect to Stripe Checkout
            window.location.href = sessionResponse.url;
          },
          error: (err) => {
            this.loading = false;
            this.error = 'Failed to create checkout session';
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to create order';
        console.error(err);
      }
    });
  }
}
