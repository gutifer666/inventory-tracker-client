import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface User {
  id: number;
  username: string;
  password: string;
  roles: string;
  fullName: string;
  sales: number;
  earnings: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

private users: User[] = [
  {
    id: 1,
    username: "administrador_prueba",
    password: "$2a$10$TW9wmcAMesXeH1naGswppOMcSA70FkdDs3oH9e7I8BPujPwEXwaE6",
    roles: "ROLE_ADMIN",
    fullName: "Administrador de Prueba",
    sales: 0,
    earnings: 0
  },
  {
    id: 2,
    username: "empleado_prueba",
    password: "$2a$10$TW9wmcAMesXeH1naGswppOMcSA70FkdDs3oH9e7I8BPujPwEXwaE6",
    roles: "ROLE_EMPLOYEE",
    fullName: "Empleado de Prueba",
    sales: 12,
    earnings: 2155
  },
  {
    id: 3,
    username: "cliente_prueba",
    password: "$2a$10$TW9wmcAMesXeH1naGswppOMcSA70FkdDs3oH9e7I8BPujPwEXwaE6",
    roles: "ROLE_CUSTOMER",
    fullName: "Cliente de Prueba",
    sales: 0,
    earnings: 0
  },
  {
    id: 4,
    username: "empleado_prueba2",
    password: "$2a$10$TW9wmcAMesXeH1naGswppOMcSA70FkdDs3oH9e7I8BPujPwEXwaE6",
    roles: "ROLE_EMPLOYEE",
    fullName: "Empleado de Prueba 2",
    sales: 25,
    earnings: 4300
  }
];

  constructor() { }

  // Get all users
  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  // Get a user by id
  getUserById(id: number): Observable<User | undefined> {
    const user = this.users.find(p => p.id === id);
    return of(user);
  }

  // Add a new user
  addUser(user: User): Observable<User> {
    user.id = this.users.length ? Math.max(...this.users.map(p => p.id)) + 1 : 1;
    this.users.push(user);
    return of(user);
  }

  // Update an existing user
  updateUser(user: User): Observable<User | undefined> {
    const index = this.users.findIndex(p => p.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
      return of(user);
    }
    return of(undefined);
  }

  // Delete a user by id
  deleteUser(id: number): Observable<boolean> {
    const index = this.users.findIndex(p => p.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
