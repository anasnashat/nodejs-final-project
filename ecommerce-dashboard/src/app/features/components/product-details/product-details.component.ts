import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productId: string | null = null;
  productDetails: any = null; // Store the product details

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService // Inject ProductService to fetch product data
  ) {}

  ngOnInit(): void {
    // Get the product ID from the route
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        this.getProductDetails(this.productId);
      }
    });
  }

  // Method to fetch product details
  getProductDetails(id: string): void {
    this.productService.getProduct(id).subscribe({
      next: (response) => {
        this.productDetails = response; // Assign the fetched product details
        console.log('Product Details:', this.productDetails.product);
      },
      error: (err) => {
        console.log('Error fetching product details:', err);
      },
      complete: () => {
        console.log('Product details fetched successfully!');
      }
    });
  }
}
