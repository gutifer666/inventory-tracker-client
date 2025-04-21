import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Product {
  id: number;
  code: string;
  cost_price: number;
  description: string;
  name: string;
  quantity: number;
  retail_price: number;
  category_id: number;
  supplier_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api';
  private apiUrl = `${this.baseUrl}/products`;

  constructor(private http: HttpClient) { }

  /**
   * Get all products
   * @returns Observable with an array of products
   */
  getProducts(): Observable<Product[]> {
    console.log('ProductService - Fetching all products');
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map(products => {
        console.log('ProductService - Successfully fetched products:', products.length);
        return products;
      }),
      catchError(error => {
        console.error('ProductService - Error fetching products:', error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Get a product by id
   * @param id Product ID
   * @returns Observable with the product or undefined
   */
  getProductById(id: number): Observable<Product | undefined> {
    console.log(`ProductService - Fetching product with ID: ${id}`);
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      map(product => {
        console.log('ProductService - Successfully fetched product:', product);
        return product;
      }),
      catchError(error => {
        console.error(`ProductService - Error fetching product with ID ${id}:`, error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Get products by category id
   * @param category_id Category ID
   * @returns Observable with an array of products
   */
  getProductsByCategory(category_id: number): Observable<Product[]> {
    console.log(`ProductService - Fetching products with category ID: ${category_id}`);
    // Assuming the API supports filtering by category_id as a query parameter
    return this.http.get<Product[]>(`${this.apiUrl}?category_id=${category_id}`).pipe(
      map(products => {
        console.log(`ProductService - Successfully fetched products for category ${category_id}:`, products.length);
        return products;
      }),
      catchError(error => {
        console.error(`ProductService - Error fetching products for category ${category_id}:`, error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Add a new product
   * @param product Product to add
   * @returns Observable with the created product
   */
  addProduct(product: Product): Observable<Product> {
    console.log('ProductService - Creating new product:', product);
    return this.http.post<Product>(this.apiUrl, product).pipe(
      map(newProduct => {
        console.log('ProductService - Successfully created product:', newProduct);
        return newProduct;
      }),
      catchError(error => {
        console.error('ProductService - Error creating product:', error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Update an existing product
   * @param product Product to update
   * @returns Observable with the updated product or undefined
   */
  updateProduct(product: Product): Observable<Product | undefined> {
    console.log(`ProductService - Updating product with ID: ${product.id}`, product);
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product).pipe(
      map(updatedProduct => {
        console.log(`ProductService - Successfully updated product with ID: ${product.id}`, updatedProduct);
        return updatedProduct;
      }),
      catchError(error => {
        console.error(`ProductService - Error updating product with ID ${product.id}:`, error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Delete a product by id
   * @param id Product ID to delete
   * @returns Observable with boolean indicating success
   */
  deleteProduct(id: number): Observable<boolean> {
    console.log(`ProductService - Deleting product with ID: ${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => {
        console.log(`ProductService - Successfully deleted product with ID: ${id}`);
        return true;
      }),
      catchError(error => {
        console.error(`ProductService - Error deleting product with ID ${id}:`, error);
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
        console.error('ProductService - Authentication error:', error.status, error.message);
      }
    }

    console.error('ProductService - Error details:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
