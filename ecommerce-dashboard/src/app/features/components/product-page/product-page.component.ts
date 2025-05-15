import { Component } from '@angular/core';
import { Product } from '../../../interfaces/product';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { ProductService } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [ProductCardComponent, FormsModule, CommonModule],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css',
})
export class ProductPageComponent {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  availableCategories: string[] = [];

  filters = {
    name: '',
    category: '',
    minPrice: null,
    maxPrice: null,
  };

  // Pagination
  currentPage = 1;
  pageSize = 6;

  constructor(private _productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this._productService.getProducts().subscribe({
      next: (response) => {
        this.allProducts = response;
        this.filteredProducts = [...response];
        this.availableCategories = [...new Set(response.map(product => product.category.name))];
      },
      error: (err) => console.log(err),
      complete: () => console.log('Products loaded successfully!'),
    });
  }

  applyFilters(): void {
    const { name, category, minPrice, maxPrice } = this.filters;

    this.filteredProducts = this.allProducts.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(name.toLowerCase());
      const matchesCategory = category ? product.category.name === category : true;
      const matchesMinPrice = minPrice != null ? product.price >= minPrice : true;
      const matchesMaxPrice = maxPrice != null ? product.price <= maxPrice : true;

      return matchesName && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });

    this.resetPagination();
  }

  resetPagination(): void {
    this.currentPage = 1;
  }

  paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage * this.pageSize < this.filteredProducts.length) {
      this.currentPage++;
      this.scrollToTop();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.scrollToTop();
    }
  }

  scrollToTop(): void {
    const el = document.querySelector('.row.g-4');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
