import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api';
  private apiUrl = `${this.baseUrl}/users`;

  constructor(private http: HttpClient) { }

  /**
   * Get all users
   * @returns Observable with an array of users
   */
  getUsers(): Observable<User[]> {
    console.log('UserService - Fetching all users');
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        console.log('UserService - Successfully fetched users:', users.length);
        return users;
      }),
      catchError(error => {
        console.error('UserService - Error fetching users:', error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Get a user by id
   * @param id User ID
   * @returns Observable with the user or undefined
   */
  getUserById(id: number): Observable<User | undefined> {
    console.log(`UserService - Fetching user with ID: ${id}`);
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      map(user => {
        console.log('UserService - Successfully fetched user:', user);
        return user;
      }),
      catchError(error => {
        console.error(`UserService - Error fetching user with ID ${id}:`, error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Add a new user
   * @param user User to add
   * @returns Observable with the created user
   */
  addUser(user: User): Observable<User> {
    console.log('UserService - Creating new user:', user);
    // Añadir más logs para depuración
    console.log('UserService - API URL:', this.apiUrl);
    return this.http.post<User>(this.apiUrl, user).pipe(
      map(newUser => {
        console.log('UserService - Successfully created user:', newUser);
        return newUser;
      }),
      catchError(error => {
        console.error('UserService - Error creating user:', error);
        console.error('UserService - Error status:', error.status);
        console.error('UserService - Error message:', error.message);
        if (error.error) {
          console.error('UserService - Error details:', error.error);
        }

        // Handle authentication errors specifically for user creation
        if (error.status === 401 || error.status === 403) {
          console.error('UserService - Authentication error when creating user. This might be a permissions issue.');
          return throwError(() => new Error('Permission denied: You may not have the required privileges to create users.'));
        }

        return this.handleError(error);
      })
    );
  }

  /**
   * Update an existing user
   * @param user User to update
   * @returns Observable with the updated user or undefined
   */
  updateUser(user: User): Observable<User | undefined> {
    console.log(`UserService - Updating user with ID: ${user.id}`, user);
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user).pipe(
      map(updatedUser => {
        console.log('UserService - Successfully updated user:', updatedUser);
        return updatedUser;
      }),
      catchError(error => {
        console.error(`UserService - Error updating user with ID ${user.id}:`, error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Delete a user by id
   * @param id User ID to delete
   * @returns Observable with boolean indicating success
   */
  deleteUser(id: number): Observable<boolean> {
    console.log(`UserService - Deleting user with ID: ${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => {
        console.log(`UserService - Successfully deleted user with ID: ${id}`);
        return true;
      }),
      catchError(error => {
        console.error(`UserService - Error deleting user with ID ${id}:`, error);
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
        console.error('UserService - Authentication error:', error.status, error.message);
      }
    }

    console.error('UserService - Error details:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
