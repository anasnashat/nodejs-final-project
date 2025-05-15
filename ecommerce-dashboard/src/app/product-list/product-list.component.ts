import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { Product } from '../interfaces/product';
import { Category } from '../interfaces/category';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment'; // Adjust path if needed

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

  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  @ViewChild('productImage') productImageInput!: ElementRef;
  @ViewChild('sliderImagesInput') sliderImagesInput!: ElementRef;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = ''), 3000);
  }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data: any[]) => {
        this.products = data.map((product) => ({
          ...product,
          imageUrl: product.image
            ? `${environment.apiUrl}/uploads/${encodeURIComponent(
                product.image
              )}`
            : null,
          sliderImageUrls:
            product.sliderImages?.map(
              (image: string) =>
                `${environment.apiUrl}/uploads/${encodeURIComponent(image)}`
            ) || [],
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
    this.selectedProduct = { ...product }; // Clone the product to avoid direct mutation
    this.sliderImagePreviews =
      product.sliderImages?.map((image) => {
        if (typeof image === 'string') {
          return `${environment.apiUrl}/uploads/${encodeURIComponent(image)}`;
        } else {
          return URL.createObjectURL(image);
        }
      }) || []; // Preload slider image previews
  }

  // Handle image file changes
  onImageChange(event: any) {
    const file = event.target.files[0]; // The file should be of type File
    if (file && this.selectedProduct) {
      // Type assertion here
      this.selectedProduct.image = URL.createObjectURL(file); // Update the preview URL
    }
  }

  // Handle slider images file changes
  onSliderImagesChange(event: any) {
    const files = event.target.files as FileList; // Ensure files are of type FileList
    if (this.selectedProduct) {
      // Type assertion here as well
      this.selectedProduct.sliderImages = Array.from(files); // Update the slider images array
      this.sliderImagePreviews = Array.from(files).map(
        (file) => URL.createObjectURL(file) // Preview slider images
      );
    }
  }

  onUpdateProduct() {
    if (this.selectedProduct) {
      const formData = new FormData();
      formData.append('name', this.selectedProduct.name);
      formData.append('price', this.selectedProduct.price.toString());
      formData.append('description', this.selectedProduct.description);
      formData.append('category', this.selectedProduct.category._id);
      formData.append('stock', this.selectedProduct.stock.toString());

      // Append main image if it exists
      const productImageFile = this.productImageInput.nativeElement.files[0];
      if (productImageFile) {
        // Type assertion to ensure productImageFile is of type File
        formData.append('image', productImageFile as Blob); // Append the File object directly
      }

      // Append slider images if they exist
      const sliderFiles = this.sliderImagesInput.nativeElement.files;
      if (sliderFiles.length > 0) {
        Array.from(sliderFiles).forEach((file) => {
          // Type assertion to ensure each file is a valid File object
          formData.append('sliderImages', file as Blob); // Append the File object directly
        });
      }

      const productId = this.selectedProduct._id.replace(/[{}]/g, ''); // Clean the product ID
      this.productService.updateProduct(productId, formData).subscribe({
        next: () => {
          this.showToast('✅ Product updated successfully!', 'success');
          this.loadProducts(); // Reload products
          this.selectedProduct = null; // Close the modal
        },
        error: (err) => {
          console.error('Error updating product:', err);
          this.showToast('❌ Error updating product!', 'error');
        },
      });
    }
  }

  deleteProduct(id: string) {
    const confirmed = confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.showToast('Product deleted successfully!', 'success');
        this.loadProducts(); // Refresh list
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.showToast('Error deleting product', 'error');
      },
    });
  }
}
