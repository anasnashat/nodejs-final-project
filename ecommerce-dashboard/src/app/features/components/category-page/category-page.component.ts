import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../interfaces/category';
import { CategoryCardComponent } from '../../../shared/components/category-card/category-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-page',
  imports: [CategoryCardComponent, FormsModule, CommonModule],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.css'
})
export class CategoryPageComponent {
  allCategories: Category[] = [];
  searchTerm: string = '';
  filteredCategories: Category[] = [];

  currentPage: number = 1;
  pageSize: number = 6;

  constructor(private _categoryService: CategoryService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this._categoryService.getCategories().subscribe({
      next: (response) => {
        this.allCategories = response;
        this.applyFilters();
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log('Categories loaded successfully!');
      }
    });
  }

  filterCategories(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    const search = this.searchTerm.toLowerCase();
    const filtered = this.searchTerm
      ? this.allCategories.filter(cat => cat.name.toLowerCase().includes(search))
      : [...this.allCategories];

    this.filteredCategories = filtered;
  }

  get paginatedCategories(): Category[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCategories.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.filteredCategories.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
