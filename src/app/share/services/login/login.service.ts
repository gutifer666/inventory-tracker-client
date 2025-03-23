import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

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
  }
];

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

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
      return of({ role }).pipe(delay(500)); // simulate network delay
    } else {
      return throwError(() => new Error('Invalid credentials')).pipe(delay(500));
    }
  }
}
