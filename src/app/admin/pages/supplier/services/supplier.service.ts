import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Supplier {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private baseUrl = 'http://localhost:8080/api';
  private apiUrl = `${this.baseUrl}/suppliers`;

  constructor(private http: HttpClient) { }

  /**
   * Get all suppliers
   * @returns Observable with an array of suppliers
   */
  getSuppliers(): Observable<Supplier[]> {
    console.log('SupplierService - Fetching all suppliers');
    return this.http.get<Supplier[]>(this.apiUrl).pipe(
      map(suppliers => {
        console.log('SupplierService - Successfully fetched suppliers:', suppliers.length);
        return suppliers;
      }),
      catchError(error => {
        console.error('SupplierService - Error fetching suppliers:', error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Get a supplier by id
   * @param id Supplier ID
   * @returns Observable with the supplier or undefined
   */
  getSupplierById(id: number): Observable<Supplier | undefined> {
    console.log(`SupplierService - Fetching supplier with ID: ${id}`);
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`).pipe(
      map(supplier => {
        console.log('SupplierService - Successfully fetched supplier:', supplier);
        return supplier;
      }),
      catchError(error => {
        console.error(`SupplierService - Error fetching supplier with ID ${id}:`, error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Add a new supplier
   * @param supplier Supplier to add
   * @returns Observable with the created supplier
   */
  addSupplier(supplier: Supplier): Observable<Supplier> {
    console.log('SupplierService - Creating new supplier:', supplier);
    return this.http.post<Supplier>(this.apiUrl, supplier).pipe(
      map(newSupplier => {
        console.log('SupplierService - Successfully created supplier:', newSupplier);
        return newSupplier;
      }),
      catchError(error => {
        console.error('SupplierService - Error creating supplier:', error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Update an existing supplier
   * @param supplier Supplier to update
   * @returns Observable with the updated supplier or undefined
   */
  updateSupplier(supplier: Supplier): Observable<Supplier | undefined> {
    console.log(`SupplierService - Updating supplier with ID: ${supplier.id}`, supplier);
    return this.http.put<Supplier>(`${this.apiUrl}/${supplier.id}`, supplier).pipe(
      map(updatedSupplier => {
        console.log(`SupplierService - Successfully updated supplier with ID: ${supplier.id}`, updatedSupplier);
        return updatedSupplier;
      }),
      catchError(error => {
        console.error(`SupplierService - Error updating supplier with ID ${supplier.id}:`, error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Delete a supplier by id
   * @param id Supplier ID to delete
   * @returns Observable with boolean indicating success
   */
  deleteSupplier(id: number): Observable<boolean> {
    console.log(`SupplierService - Deleting supplier with ID: ${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => {
        console.log(`SupplierService - Successfully deleted supplier with ID: ${id}`);
        return true;
      }),
      catchError(error => {
        console.error(`SupplierService - Error deleting supplier with ID ${id}:`, error);
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
        console.error('SupplierService - Authentication error:', error.status, error.message);
      }
    }

    console.error('SupplierService - Error details:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
