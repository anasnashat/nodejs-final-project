import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  sessionId: string | null = null;
  loading: boolean = true;
  error: string | null = null;
  orderDetails: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Get the session_id from the URL query parameters
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (this.sessionId) {
      this.verifyPayment(this.sessionId);
    } else {
      this.error = 'No session ID found in the URL';
      this.loading = false;
    }
  }

  verifyPayment(sessionId: string): void {
    this.cartService.verifySession(sessionId).subscribe({
      next: (response) => {
        this.orderDetails = response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error verifying payment:', err);
        this.error = 'Failed to verify payment. Please contact customer support.';
        this.loading = false;
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
