import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../interfaces/product';
import { Category } from '../../../interfaces/category';
import { CategoryCardComponent } from '../../../shared/components/category-card/category-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CategoryCardComponent, CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  allCategories: Category[] = [];
  allProducts: Product[] = [];
  selectedCategory: string = '';
  filteredRelatedProducts: any[] = [];

  constructor(private _categoryService: CategoryService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this._categoryService.getCategories().subscribe({
      next: (response) => {
        console.log(response);
        this.allCategories = response;
        console.log(this.allCategories);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Categories loaded successfully!');
      }
    });
  }

}
