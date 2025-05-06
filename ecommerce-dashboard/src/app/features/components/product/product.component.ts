import { Component,OnInit } from '@angular/core';
import { Product } from '../../../product';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { ProductService } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product',
  imports: [ProductCardComponent,FormsModule,CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  allProducts:Product[]=[];

  constructor(private _productService: ProductService) {}
  ngOnInit(): void {
    this.getProducts();
  }
  getProducts() {
    this._productService.getProducts().subscribe({
      next: (response) => {
        console.log(response);
        this.allProducts = response;
        console.log(this.allProducts);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Products loaded successfully!');
      }
    });
   }

}
