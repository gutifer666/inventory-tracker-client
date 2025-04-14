import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface CurrentUser {
  id: number;
  username: string;
  fullName: string;
  role: string;
}

// Interfaz para la solicitud de autenticación
export interface AuthRequest {
  userName: string;
  password: string;
}

// Interfaz parra la respuesta de autenticación
export interface AuthResponse {
  id: number;
  username: string;
  fullName: string;
  roles: string;
  sales: number;
  earnings: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private currentUser: CurrentUser | null = null;

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {
    // Intentar recuperar el usuario del localStorage al iniciar
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('currentUser');
      }
    }
  }

  /**
   * Autentica un usuario contra el backend
   * @param credentials Credenciales del usuario (nombre y contraseña)
   * @returns Observable con el rol del usuario autenticado
   */
  login(credentials: AuthRequest): Observable<{ role: string }> {
    // Use the complete API URL including the /api prefix
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      map(response => {
        // Determine the role
        let role = '';
        if (response.roles === 'ROLE_ADMIN') {
          role = 'ADMIN';
        } else if (response.roles === 'ROLE_EMPLOYEE') {
          role = 'EMPLOYEE';
        } else {
          role = 'CUSTOMER';
        }

        // Save the current user
        this.currentUser = {
          id: response.id,
          username: response.username,
          fullName: response.fullName,
          role: role
        };

        // Save to localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        return { role };
      }),
      tap(() => console.log('Usuario logueado:', this.currentUser)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error durante el login:', error);
        // More specific error message based on the error status
        const errorMessage = error.status === 401 ?
          'Credenciales inválidas' :
          'Error en el servidor. Por favor, intente más tarde';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Obtiene el usuario actualmente logueado
   * @returns El usuario actual o null si no hay ningún usuario logueado
   */
  getCurrentUser(): CurrentUser | null {
    return this.currentUser;
  }

  /**
   * Cierra la sesión del usuario actual
   */
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }
}
