import { Category } from "./category";

// product.ts
export interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    category: Category;
    stock: number;
    image: File | string | null;  // It can be a File or a URL (string)
    sliderImages: File[];  // Array of Files for multiple images
  }
  