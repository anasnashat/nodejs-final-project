import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product: any;
  addedToCart: boolean = false;

  constructor(private cartService: CartService) {}

  addToCart(event: Event, productId: string): void {
    event.stopPropagation(); // Prevent the card click event from triggering

    this.cartService.addToCart(productId).subscribe({
      next: (response) => {
        console.log('Product added to cart:', response);
        this.addedToCart = true;
        // Reset the added to cart status after 3 seconds
        setTimeout(() => {
          this.addedToCart = false;
        }, 3000);
      },
      error: (err) => {
        console.error('Error adding product to cart:', err);
      }
    });
  }
}
