import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { Product } from '../product';
import { Category } from '../category';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedProduct: Product | null = null;
  sliderImagePreviews: string[] = [];

  @ViewChild('productImage') productImageInput!: ElementRef;
  @ViewChild('sliderImagesInput') sliderImagesInput!: ElementRef;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data: any[]) => {
        this.products = data.map((product) => ({
          ...product,
          image: product.image ? `http://localhost:5000/uploads/${product.image}` : null,
        }));
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  // Open the modal with the selected product for editing
  editProduct(product: Product) {
    this.selectedProduct = { ...product };  // Clone the product to avoid direct mutation
    this.sliderImagePreviews = product.sliderImages.map(image => `http://localhost:5000/uploads/${image}`);
  }

// Handle image file changes
onImageChange(event: any) {
  const file = event.target.files[0] as File; // Type assertion to File
  if (file && this.selectedProduct) {
    this.selectedProduct.image = URL.createObjectURL(file); // Update the preview URL
  }
}

// Handle slider images file changes
onSliderImagesChange(event: any) {
  const files = event.target.files as FileList; // Cast to FileList
  if (this.selectedProduct) {
    this.selectedProduct.sliderImages = Array.from(files); // Update the slider images array
    this.sliderImagePreviews = Array.from(files).map(file => URL.createObjectURL(file)); // Preview slider images
  }
}


onUpdateProduct() {
  if (this.selectedProduct) {
    const formData = new FormData();
    formData.append('name', this.selectedProduct.name);
    formData.append('price', this.selectedProduct.price.toString());
    formData.append('description', this.selectedProduct.description);
    
    // Ensure category is a valid ObjectId string
    formData.append('category', this.selectedProduct.category._id);

    formData.append('stock', this.selectedProduct.stock.toString());

    // Append main image if it exists
    if (this.productImageInput.nativeElement.files[0]) {
      const file = this.productImageInput.nativeElement.files[0] as File;
      formData.append('image', file); // Ensure it's a File
    }

    // Append slider images if they exist
    if (this.sliderImagesInput.nativeElement.files.length > 0) {
      Array.from(this.sliderImagesInput.nativeElement.files).forEach(file => {
        if (file instanceof File) {
          formData.append('sliderImages', file); // Ensure it's a File
        }
      });
    }

    const productId = this.selectedProduct._id.replace(/[{}]/g, '');  // Clean the product ID
    this.productService.updateProduct(productId, formData).subscribe({
      next: () => {
        alert('Product updated successfully!');
        this.loadProducts(); // Reload products
        this.selectedProduct = null; // Close the modal
      },
      error: (err) => {
        console.error('Error updating product:', err);
        alert('Error updating product');
      }
    });
  }
}




  // Method to handle product deletion
  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          alert('Product deleted successfully!');
          this.loadProducts(); // Reload products
        },
        error: (err) => alert('Error deleting product'),
      });
    }
  }
}
