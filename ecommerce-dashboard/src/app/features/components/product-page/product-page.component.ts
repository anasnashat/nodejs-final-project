import { Component } from '@angular/core';
import { Product } from '../../../interfaces/product';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { ProductService } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product-page',
  imports: [ProductCardComponent,FormsModule,CommonModule],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent {
  allProducts:Product[]=[];
  filteredProducts: Product[] = [];
  availableCategories: string[] = [];

  filters = {
    name: '',
    category: '',
    minPrice: null,
    maxPrice: null,
  };

  constructor(private _productService: ProductService) {}
  ngOnInit(): void {
    this.getProducts();
  }
  getProducts() {
    this._productService.getProducts().subscribe({
      next: (response) => {
        console.log(response);
        this.allProducts = response;
        this.filteredProducts = [...response];
        this.availableCategories = [...new Set(response.map(product => product.category.name))];
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

   applyFilters(): void {
    const { name, category, minPrice, maxPrice } = this.filters;

    this.filteredProducts = this.allProducts.filter(product => {
      const matchesName = product.name.toLowerCase().includes(name.toLowerCase());
      const matchesCategory = category ? product.category.name === category : true;
      const matchesMinPrice = minPrice != null ? product.price >= minPrice : true;
      const matchesMaxPrice = maxPrice != null ? product.price <= maxPrice : true;

      return matchesName && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }
}
