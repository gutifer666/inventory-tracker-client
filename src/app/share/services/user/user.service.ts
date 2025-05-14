import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../../interfaces/user.interface';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://api-inventory-tracker-production.up.railway.app/api';
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
   * Hash a password using BCrypt
   * @param password Password to hash
   * @returns BCrypt hashed password
   */
  private hashPassword(password: string): string {
    try {
      // Generate a salt with cost factor 10 (default)
      // In production, you might want to increase this for better security
      const salt = bcrypt.genSaltSync(10);
      // Hash the password with the generated salt
      return bcrypt.hashSync(password, salt);
    } catch (e) {
      console.error('Error hashing password with BCrypt:', e);
      return password; // Return original password if hashing fails
    }
  }

  /**
   * Add a new user
   * @param user User to add
   * @returns Observable with the created user
   */
  addUser(user: User): Observable<User> {
      // Crear una copia del usuario para no modificar el original
      const userToSend = {
          username: user.username,
          // Hash the password with BCrypt before sending to server
          // This matches the BCrypt hashing used on the backend
          password: this.hashPassword(user.password),
          roles: user.roles,
          fullName: user.fullName
      };

      console.log('UserService - Creating new user:', {
          ...userToSend,
          password: '***HASHED***' // Don't log the actual password
      });

      return this.http.post<User>(this.apiUrl, userToSend).pipe(
          map(newUser => {
              console.log('UserService - Successfully created user:', newUser);
              return newUser;
          }),
          catchError(error => {
              // Añadir log del token para debug
              console.error('UserService - Headers:', this.http.options);
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
    // Create a copy of the user to avoid modifying the original
    const userToUpdate = {
      ...user,
      // Hash the password with BCrypt before sending to server
      password: this.hashPassword(user.password)
    };

    console.log(`UserService - Updating user with ID: ${user.id}`, {
      ...userToUpdate,
      password: '***HASHED***' // Don't log the actual password
    });

    return this.http.put<User>(`${this.apiUrl}/${user.id}`, userToUpdate).pipe(
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
   * Get the current authenticated user
   * @returns Observable with the current user
   */
  getCurrentUser(): Observable<User | undefined> {
    console.log('UserService - Fetching current user');
    return this.http.get<User>(`${this.apiUrl}/current`).pipe(
      map(user => {
        console.log('UserService - Successfully fetched current user:', user);
        return user;
      }),
      catchError(error => {
        console.error('UserService - Error fetching current user:', error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Get a user by username
   * @param username Username to search for
   * @returns Observable with the user or undefined
   */
  getUserByUsername(username: string): Observable<User | undefined> {
    console.log(`UserService - Fetching user with username: ${username}`);
    return this.http.get<User[]>(`${this.apiUrl}?username=${username}`).pipe(
      map(users => {
        if (users && users.length > 0) {
          console.log('UserService - Successfully fetched user by username:', users[0]);
          return users[0];
        }
        return undefined;
      }),
      catchError(error => {
        console.error(`UserService - Error fetching user with username ${username}:`, error);
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
