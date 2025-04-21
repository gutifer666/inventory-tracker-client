import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../../../share/services/auth/auth.service';

export interface Category {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = 'http://localhost:8080/api';
  private apiUrl = `${this.baseUrl}/categories`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Get all categories
   * @returns Observable with an array of categories
   */
  getCategories(): Observable<Category[]> {
    console.log('CategoryService - Fetching all categories');

    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      console.error('CategoryService - User is not authenticated');
      return throwError(() => new Error('User is not authenticated'));
    }

    // Get the token and create headers
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Category[]>(this.apiUrl, { headers }).pipe(
      map(categories => {
        console.log('CategoryService - Successfully fetched categories:', categories.length);
        return categories;
      }),
      catchError(error => {
        console.error('CategoryService - Error fetching categories:', error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Get a category by id
   * @param id Category ID
   * @returns Observable with the category or undefined
   */
  getCategoryById(id: number): Observable<Category | undefined> {
    console.log(`CategoryService - Fetching category with ID: ${id}`);

    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      console.error('CategoryService - User is not authenticated');
      return throwError(() => new Error('User is not authenticated'));
    }

    // Get the token and create headers
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Category>(`${this.apiUrl}/${id}`, { headers }).pipe(
      map(category => {
        console.log('CategoryService - Successfully fetched category:', category);
        return category;
      }),
      catchError(error => {
        console.error(`CategoryService - Error fetching category with ID ${id}:`, error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Add a new category
   * @param category Category to add
   * @returns Observable with the created category
   */
  addCategory(category: Category): Observable<Category> {
    console.log('CategoryService - Creating new category:', category);

    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      console.error('CategoryService - User is not authenticated');
      return throwError(() => new Error('User is not authenticated'));
    }

    // Check if token is expired
    if (this.authService.isTokenExpired()) {
      console.error('CategoryService - Token is expired');
      this.authService.logout(); // Force logout if token is expired
      return throwError(() => new Error('Authentication token has expired. Please log in again.'));
    }

    // Get the token and log it (for debugging)
    const token = this.authService.getToken();
    console.log('CategoryService - Using token:', token ? 'Token exists' : 'No token');

    // Create headers with the token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // Log the user role
    console.log('CategoryService - User role:', this.authService.getUserRole());

    return this.http.post<Category>(this.apiUrl, category, { headers }).pipe(
      map(newCategory => {
        console.log('CategoryService - Successfully created category:', newCategory);
        return newCategory;
      }),
      catchError(error => {
        console.error('CategoryService - Error creating category:', error);
        // Add more specific error handling
        if (error.status === 403) {
          console.error('CategoryService - Permission denied. User role may not have access to create categories.');
        }
        return this.handleError(error);
      })
    );
  }

  /**
   * Update an existing category
   * @param category Category to update
   * @returns Observable with the updated category or undefined
   */
  updateCategory(category: Category): Observable<Category | undefined> {
    console.log(`CategoryService - Updating category with ID: ${category.id}`, category);

    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      console.error('CategoryService - User is not authenticated');
      return throwError(() => new Error('User is not authenticated'));
    }

    // Get the token and create headers
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<Category>(`${this.apiUrl}/${category.id}`, category, { headers }).pipe(
      map(updatedCategory => {
        console.log(`CategoryService - Successfully updated category with ID: ${category.id}`, updatedCategory);
        return updatedCategory;
      }),
      catchError(error => {
        console.error(`CategoryService - Error updating category with ID ${category.id}:`, error);
        if (error.status === 403) {
          console.error('CategoryService - Permission denied. User role may not have access to update categories.');
        }
        return this.handleError(error);
      })
    );
  }

  /**
   * Delete a category by id
   * @param id Category ID to delete
   * @returns Observable with boolean indicating success
   */
  deleteCategory(id: number): Observable<boolean> {
    console.log(`CategoryService - Deleting category with ID: ${id}`);

    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      console.error('CategoryService - User is not authenticated');
      return throwError(() => new Error('User is not authenticated'));
    }

    // Get the token and create headers
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }).pipe(
      map(() => {
        console.log(`CategoryService - Successfully deleted category with ID: ${id}`);
        return true;
      }),
      catchError(error => {
        console.error(`CategoryService - Error deleting category with ID ${id}:`, error);
        if (error.status === 403) {
          console.error('CategoryService - Permission denied. User role may not have access to delete categories.');
        }
        return this.handleError(error);
      })
    );
  }

  /**
   * Handle HTTP errors
   * @param error The HTTP error response
   * @returns An observable with the error message
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

      // Add more specific error handling for authentication issues
      if (error.status === 401 || error.status === 403) {
        errorMessage = 'Authentication error: Please log in again';
        console.error('CategoryService - Authentication error:', error.status, error.message);
      }
    }

    console.error('CategoryService - Error details:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
