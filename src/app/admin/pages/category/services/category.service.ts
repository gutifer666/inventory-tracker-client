import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categories: Category[] = [
    { id: 1, name: 'General', description: 'Productos de uso general' },
    { id: 2, name: 'Electrónica', description: 'Dispositivos y gadgets electrónicos' },
    { id: 3, name: 'Ropa', description: 'Prendas de vestir y accesorios' },
    { id: 4, name: 'Alimentos', description: 'Productos alimenticios y bebidas' }
  ];

  constructor() { }

  // Get all categories
  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  // Get a category by id
  getCategoryById(id: number): Observable<Category | undefined> {
    const category = this.categories.find(c => c.id === id);
    return of(category);
  }

  // Add a new category
  addCategory(category: Category): Observable<Category> {
    category.id = this.categories.length ? Math.max(...this.categories.map(c => c.id)) + 1 : 1;
    this.categories.push(category);
    return of(category);
  }

  // Update an existing category
  updateCategory(category: Category): Observable<Category | undefined> {
    const index = this.categories.findIndex(c => c.id === category.id);
    if (index !== -1) {
      this.categories[index] = category;
      return of(category);
    }
    return of(undefined);
  }

  // Delete a category by id
  deleteCategory(id: number): Observable<boolean> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.categories.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
