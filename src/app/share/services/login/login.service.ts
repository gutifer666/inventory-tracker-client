import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface CurrentUser {
  id: number;
  username: string;
  fullName: string;
  role: string;
}

const mockUsers = [
  {
    id: 1,
    earnings: 0,
    full_name: 'Administrador de Prueba',
    password: '$2a$10$TW9wmcAMesXeH1naGswppOMcSA70FkdDs3oH9e7I8BPujPwEXwaE6',
    roles: 'ROLE_ADMIN',
    sales: 0,
    username: 'administrador_prueba'
  },
  {
    id: 2,
    earnings: 0,
    full_name: 'Empleado de Prueba',
    password: '$2a$10$TW9wmcAMesXeH1naGswppOMcSA70FkdDs3oH9e7I8BPujPwEXwaE6',
    roles: 'ROLE_EMPLOYEE',
    sales: 0,
    username: 'empleado_prueba'
  },
  {
    id: 3,
    earnings: 0,
    full_name: 'Cliente de Prueba',
    password: '$2a$10$TW9wmcAMesXeH1naGswppOMcSA70FkdDs3oH9e7I8BPujPwEXwaE6',
    roles: 'ROLE_CUSTOMER',
    sales: 0,
    username: 'cliente_prueba'
  },
  {
    id: 4,
    earnings: 0,
    full_name: 'Empleado de Prueba 2',
    password: '$2a$10$TW9wmcAMesXeH1naGswppOMcSA70FkdDs3oH9e7I8BPujPwEXwaE6',
    roles: 'ROLE_EMPLOYEE',
    sales: 0,
    username: 'empleado_prueba2'
  }
];

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private currentUser: CurrentUser | null = null;

  constructor() {
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

  login(credentials: { userName: string; password: string }): Observable<{ role: string }> {
    // For simplicity, assume any password is valid if the username exists.
    const user = mockUsers.find(u => u.username === credentials.userName);
    if (user) {
      let role = '';
      if (user.roles === 'ROLE_ADMIN') {
        role = 'ADMIN';
      } else if (user.roles === 'ROLE_EMPLOYEE') {
        role = 'EMPLOYEE';
      } else {
        role = 'CUSTOMER';
      }

      // Guardar el usuario actual
      this.currentUser = {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        role: role
      };

      // Guardar en localStorage para persistencia
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

      return of({ role }).pipe(
        delay(500), // simulate network delay
        tap(() => console.log('Usuario logueado:', this.currentUser))
      );
    } else {
      return throwError(() => new Error('Invalid credentials')).pipe(delay(500));
    }
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
