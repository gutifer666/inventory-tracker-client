import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface LoggedUser {
  id: number;
  username: string;
  fullName: string;
  roles: string;
  sales: number;
  earnings: number;
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
    earnings: 2155,
    full_name: 'Empleado de Prueba',
    password: '$2a$10$TW9wmcAMesXeH1naGswppOMcSA70FkdDs3oH9e7I8BPujPwEXwaE6',
    roles: 'ROLE_EMPLOYEE',
    sales: 12,
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
  }
];

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private currentUserSubject = new BehaviorSubject<LoggedUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Comprobar si hay un usuario guardado en localStorage al iniciar
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
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

      // Crear objeto de usuario logueado
      const loggedUser: LoggedUser = {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        roles: user.roles,
        sales: user.sales,
        earnings: user.earnings
      };

      // Guardar en localStorage y en el BehaviorSubject
      localStorage.setItem('currentUser', JSON.stringify(loggedUser));
      this.currentUserSubject.next(loggedUser);

      return of({ role }).pipe(delay(500)); // simulate network delay
    } else {
      return throwError(() => new Error('Invalid credentials')).pipe(delay(500));
    }
  }

  // Obtener el usuario actual
  getCurrentUser(): LoggedUser | null {
    return this.currentUserSubject.value;
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
