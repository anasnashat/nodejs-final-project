import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private API = 'http://localhost:5000/api/categories';

  constructor(private _httpClient: HttpClient) {}

  // Create a new category
  createCategory(formData: FormData): Observable<Category> {
    return this._httpClient.post<Category>(this.API, formData);
  }

  // Get all categories
  getCategories(): Observable<Category[]> {
    return this._httpClient.get<Category[]>(this.API);
  }

  // Delete a category by ID
  deleteCategory(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${this.API}/${id}`);
  }

  // Update an existing category by ID
  updateCategory(id: string, formData: FormData): Observable<Category> {
    return this._httpClient.put<Category>(`${this.API}/${id}`, formData);
  }
}
