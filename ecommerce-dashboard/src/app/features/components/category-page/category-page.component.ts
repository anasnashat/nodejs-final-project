import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../interfaces/category';
import { CategoryCardComponent } from '../../../shared/components/category-card/category-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-page',
  imports: [CategoryCardComponent,FormsModule,CommonModule],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.css'
})
export class CategoryPageComponent {
    allCategories: Category[] = [];
    searchTerm: string = '';
    filteredCategories = this.allCategories;
  
    constructor(private _categoryService: CategoryService) {}

  // Method to filter categories based on the search term
  filterCategories(): void {
    if (this.searchTerm === '') {
      // If no search term, show all categories
      this.filteredCategories = this.allCategories;
    } else {
      // Filter categories based on name or description
      this.filteredCategories = this.allCategories.filter(category => 
        category.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  
    ngOnInit(): void {
      this.getCategories();
    }
  
    getCategories() {
      this._categoryService.getCategories().subscribe({
        next: (response) => {
          console.log(response);
          this.allCategories = response;
          this.filteredCategories = response;
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
