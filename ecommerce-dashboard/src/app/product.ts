import { Category } from "./category";

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string; // URL of the main image
  category: Category;
  stock: number;
  image: File | string | null; // The image can be a File object, string (URL), or null
  sliderImages: (File | string)[]; // This can also contain string (URLs) or File objects
  sliderImageUrls: string[]; // URLs of the slider images
}

  