import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../interfaces/product';

export interface CartItem {
  _id: string;
  product: Product | null;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
        console.log('Cart items response:', response.items);
        this.cartItems = response.items;
        console.log(this.cartItems)

        this.calculateTotalPrice();
        console.log('Cart items:', this.cartItems);
      },
      error: (err) => {
        this.error = 'Failed to load cart items';
        console.error(err);
      }
    });
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(item => item.product?._id !== productId);
        this.calculateTotalPrice();
      },
      error: (err) => {
        this.error = 'Failed to remove item from cart';
        console.error(err);
      }
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1) return;

    this.cartService.updateQuantity(productId, quantity).subscribe({
      next: (response) => {
        const itemIndex = this.cartItems.findIndex(item => item.product?._id === productId);
        if (itemIndex !== -1) {
          this.cartItems[itemIndex].quantity = quantity;
          this.calculateTotalPrice();
        }
      },
      error: (err) => {
        this.error = 'Failed to update quantity';
        console.error(err);
      }
    });
  }

  handleQuantityChange(productId: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target && target.value) {
      const quantity = +target.value;
      this.updateQuantity(productId, quantity);
    }
  }

  checkout(): void {
    // Check if cart is empty
    if (this.cartItems.length === 0) {
      this.error = 'Your cart is empty. Please add items before checkout.';
      return;
    }

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
