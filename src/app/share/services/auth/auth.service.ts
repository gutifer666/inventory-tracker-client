import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface CurrentUser {
  id: number;
  username: string;
  fullName: string;
  role: string;
}

// Interfaz para la solicitud de autenticación
export interface AuthRequest {
  username: string;
  password: string;
}

// Interfaz para la respuesta de autenticación con JWT
export interface AuthResponse {
  token: string;
  username: string;
  roles: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<CurrentUser | null>;
  public currentUser: Observable<CurrentUser | null>;

  private apiUrl = 'http://localhost:8080/api';
  private tokenKey = 'jwt_token';
  private userKey = 'current_user';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Intentar recuperar el usuario del localStorage al iniciar
    const storedUser = localStorage.getItem(this.userKey);
    this.currentUserSubject = new BehaviorSubject<CurrentUser | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Obtiene el valor actual del usuario
   */
  public get currentUserValue(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Autentica un usuario contra el backend usando JWT
   * @param credentials Credenciales del usuario (nombre y contraseña)
   * @returns Observable con el rol del usuario autenticado
   */
  login(credentials: AuthRequest): Observable<{ role: string }> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      map(response => {
          // Añadir log para verificar el token
          console.log('Token received:', response.token);
        // Guardar el token JWT
        localStorage.setItem(this.tokenKey, response.token);

        // Determinar el rol
        let role = '';
        if (response.roles === 'ROLE_ADMIN') {
          role = 'ADMIN';
        } else if (response.roles === 'ROLE_EMPLOYEE') {
          role = 'EMPLOYEE';
        } else {
          role = 'CUSTOMER';
        }

        // Crear objeto de usuario actual
        const user: CurrentUser = {
          id: 0, // El ID no viene en la respuesta JWT
          username: response.username,
          fullName: '', // El nombre completo no viene en la respuesta JWT
          role: role
        };

        // Guardar en localStorage y actualizar el BehaviorSubject
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUserSubject.next(user);

        return { role };
      }),
      tap(() => console.log('Usuario autenticado:', this.currentUserValue)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error durante la autenticación:', error);
        const errorMessage = error.status === 401 ?
          'Credenciales inválidas' :
          'Error en el servidor. Por favor, intente más tarde';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Cierra la sesión del usuario actual
   */
  logout(): void {
    // Eliminar token y usuario del localStorage
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);

    // Actualizar el BehaviorSubject
    this.currentUserSubject.next(null);

    // Redirigir al login
    this.router.navigate(['/login']);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtiene el token JWT almacenado
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Verifica si el token ha expirado
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      // Decodificar el token (formato: header.payload.signature)
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Verificar si el token ha expirado
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate <= new Date();
    } catch (e) {
      console.error('Error al decodificar el token JWT:', e);
      return true;
    }
  }

  /**
   * Obtiene el rol del usuario actual
   */
  getUserRole(): string | null {
    const user = this.currentUserValue;
    return user ? user.role : null;
  }

  /**
   * Actualiza el usuario actual en el BehaviorSubject
   * @param user Datos actualizados del usuario
   */
  updateCurrentUser(user: CurrentUser): void {
    this.currentUserSubject.next(user);
  }
}
