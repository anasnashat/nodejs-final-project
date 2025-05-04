import { Component } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-category-form',
  imports: [FormsModule],
  templateUrl: './category-form.component.html'
})
export class CategoryFormComponent {
  name = '';
  image!: File;

  constructor(private _categoryService: CategoryService) {}

  onFileChange(event: any) {
    this.image = event.target.files[0];
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('image', this.image);

    this._categoryService.createCategory(formData).subscribe({
      next: (res) => alert('Category created!'),
      error: (err) => alert(err.error?.error || 'Error creating category')
    });
  }
}
