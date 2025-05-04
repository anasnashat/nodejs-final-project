import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {
  name = '';
  price: number = 0;
  stock: number = 0;
  description = '';
  category = '';
  categories: any[] = [];

  mainImage!: File;
  sliderImages: File[] = [];
  sliderImagePreviews: string[] = [];

  alertMessage: string = '';
  alertType: 'success' | 'danger' = 'success';
  showAlert: boolean = false;

  @ViewChild('sliderInput') sliderInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res;
    });
  }

  onMainImageChange(event: any) {
    this.mainImage = event.target.files[0];
  }

  onSliderImagesChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.sliderImages.push(file);

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.sliderImagePreviews.push(e.target.result);
    };
    reader.readAsDataURL(file);

    // Reset the input so user can pick the same file again if needed
    if (this.sliderInputRef) {
      this.sliderInputRef.nativeElement.value = '';
    }
  }

  onSubmit() {
      // Basic form validation
  if (!this.name || !this.description || !this.category || !this.mainImage) {
    // Change error message dynamically based on which field is missing
    if (!this.name) {
      this.alertMessage = 'Product name is required.';
    } else if (!this.description) {
      this.alertMessage = 'Product description is required.';
    } else if (!this.category) {
      this.alertMessage = 'Please select a category.';
    } else if (!this.mainImage) {
      this.alertMessage = 'Main image is required.';
    }

    this.alertType = 'danger';
    this.showAlert = true;
    return;
  }
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('price', this.price.toString());
    formData.append('description', this.description);
    formData.append('category', this.category);
    formData.append('stock', this.stock.toString());
    formData.append('image', this.mainImage);

    this.sliderImages.forEach((file) => {
      formData.append('sliderImages', file);
    });

    this.productService.createProduct(formData).subscribe({
      next: () => {
        this.alertMessage = 'Product created successfully!';
        this.alertType = 'success';
        this.showAlert = true;
      },
      error: (err) => {
        this.alertMessage = err.error?.error || 'Error creating product';
        this.alertType = 'danger';
        this.showAlert = true;
  }});
  }
}
