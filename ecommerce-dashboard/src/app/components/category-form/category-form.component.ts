import { Component } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-category-form',
  imports: [FormsModule,CommonModule],
  templateUrl: './category-form.component.html'
})
export class CategoryFormComponent {
  name = '';
  image!: File;

  alertMessage: string = '';
  alertType: 'success' | 'danger' = 'success';
  showAlert: boolean = false;

  constructor(private _categoryService: CategoryService) {}

  onFileChange(event: any) {
    this.image = event.target.files[0];
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('image', this.image);

    this._categoryService.createCategory(formData).subscribe({
      next: (res) => {
        this.alertMessage = 'Category created successfully!';
        this.alertType = 'success';
        this.showAlert = true;
      },
      error: (err) => {
        this.alertMessage = err.error?.error || 'Error creating category';
        this.alertType = 'danger';
        this.showAlert = true;
  }});
}
}
