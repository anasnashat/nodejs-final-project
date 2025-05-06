import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../interfaces/category'; // Adjust path if needed
import { environment } from '../../environments/environment'; // Adjust path if needed

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './category-list.component.html',
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  selectedCategory: any = null;

  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  constructor(private categoryService: CategoryService) {}

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = ''), 3000);
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data: any[]) => {
        // Prefix the image path with the full URL
        this.categories = data.map((category) => ({
          ...category,
          imageUrl: category.image
            ? `${environment.apiUrl}/uploads/${encodeURIComponent(
                category.image
              )}`
            : null,
        }));
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  // Edit category
  editCategory(category: any) {
    this.selectedCategory = { ...category };
  }

  // Delete category
  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.showToast('Category deleted successfully!', 'success');
          this.loadCategories();
        },
        error: (err) => {
          this.showToast('Error deleting product', 'error');
        },
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedCategory.image = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedCategory.imageUrl = e.target.result; // Show new image preview
      };
      reader.readAsDataURL(file);
    }
  }

  // Update category
  onUpdateCategory() {
    const formData = new FormData();
    formData.append('name', this.selectedCategory.name);

    if (this.selectedCategory.image instanceof File) {
      formData.append('image', this.selectedCategory.image); // Only send if new file
    }

    this.categoryService
      .updateCategory(this.selectedCategory._id, formData)
      .subscribe({
        next: () => {
          this.showToast('Category updated successfully!', 'success');
          this.selectedCategory = null;
          this.loadCategories();
        },
        error: (err) => {
          this.showToast('Error updating category', 'error');
          console.error('Error updating category:', err);
        },
      });
  }
}
