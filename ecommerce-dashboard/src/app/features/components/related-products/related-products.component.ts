import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service'; // adjust path as needed
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-related-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './related-products.component.html',
  styleUrls: ['./related-products.component.css']
})
export class RelatedProductsComponent implements OnInit {
  categoryName: string = '';
  relatedProducts: any[] = [];

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
    this.categoryName = this.route.snapshot.paramMap.get('name')!;
    this.fetchRelatedProducts();
  }

  fetchRelatedProducts(): void {
    this.productService.getProducts().subscribe((products: any[]) => {
      this.relatedProducts = products.filter(
        (product) => product.category?.name === this.categoryName
      );
    });
  }
}
