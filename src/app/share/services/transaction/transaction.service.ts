import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Define the Transaction interface
export interface Transaction {
  id: number;
  employee_name: string;
  client_name: string;
  product_code: string;
  product_name: string;
  quantity: number;
  transaction_price: number;
  created_at: string;
}

// Mock transactions data
const mockTransactions: Transaction[] = [
  { id: 1, employee_name: 'Empleado de Prueba', client_name: 'Juan Pérez', product_code: 'GEN001', product_name: 'Bicicleta', quantity: 1, transaction_price: 500, created_at: '2023-12-01 09:30:00' },
  { id: 2, employee_name: 'Empleado de Prueba', client_name: 'María López', product_code: 'ELEC001', product_name: 'Smartphone', quantity: 2, transaction_price: 600, created_at: '2023-12-02 11:45:00' },
  { id: 3, employee_name: 'Empleado de Prueba', client_name: 'Carlos Gómez', product_code: 'ROPA001', product_name: 'Camiseta', quantity: 3, transaction_price: 150, created_at: '2023-12-03 14:20:00' },
  { id: 4, employee_name: 'Empleado de Prueba', client_name: 'Ana Martínez', product_code: 'ALIM001', product_name: 'Leche', quantity: 5, transaction_price: 10, created_at: '2023-12-04 16:15:00' },
  { id: 5, employee_name: 'Empleado de Prueba', client_name: 'Pedro Sánchez', product_code: 'GEN002', product_name: 'Silla', quantity: 2, transaction_price: 60, created_at: '2023-12-05 10:00:00' },
  { id: 6, employee_name: 'Empleado de Prueba', client_name: 'Laura Fernández', product_code: 'ELEC002', product_name: 'Tablet', quantity: 1, transaction_price: 150, created_at: '2023-12-06 13:30:00' },
  { id: 7, employee_name: 'Empleado de Prueba', client_name: 'Miguel Torres', product_code: 'ROPA002', product_name: 'Pantalón', quantity: 2, transaction_price: 120, created_at: '2023-12-07 15:45:00' },
  { id: 8, employee_name: 'Empleado de Prueba', client_name: 'Carmen Ruiz', product_code: 'ALIM002', product_name: 'Pan', quantity: 10, transaction_price: 10, created_at: '2023-12-08 09:10:00' },
  { id: 9, employee_name: 'Empleado de Prueba', client_name: 'Pablo Díaz', product_code: 'GEN003', product_name: 'Mesa', quantity: 1, transaction_price: 80, created_at: '2023-12-09 12:25:00' },
  { id: 10, employee_name: 'Empleado de Prueba', client_name: 'Isabel Moreno', product_code: 'ELEC003', product_name: 'Smartwatch', quantity: 3, transaction_price: 360, created_at: '2023-12-10 17:00:00' },
  { id: 11, employee_name: 'Empleado de Prueba', client_name: 'Javier Ortiz', product_code: 'ROPA003', product_name: 'Vestido', quantity: 1, transaction_price: 100, created_at: '2023-12-11 11:30:00' },
  { id: 12, employee_name: 'Empleado de Prueba', client_name: 'Lucía Vega', product_code: 'ALIM003', product_name: 'Refresco', quantity: 6, transaction_price: 15, created_at: '2023-12-12 14:45:00' }
];

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactions: Transaction[] = [...mockTransactions];

  // Get all transactions
  getTransactions(): Observable<Transaction[]> {
    return of(this.transactions);
  }

  // Get a transaction by id
  getTransactionById(id: number): Observable<Transaction | undefined> {
    const transaction = this.transactions.find(t => t.id === id);
    return of(transaction);
  }

  // Add a new transaction
  addTransaction(transaction: Transaction): Observable<Transaction> {
    transaction.id = this.transactions.length ? Math.max(...this.transactions.map(t => t.id)) + 1 : 1;
    this.transactions.push(transaction);
    return of(transaction);
  }

  // Update an existing transaction
  updateTransaction(transaction: Transaction): Observable<Transaction | undefined> {
    const index = this.transactions.findIndex(t => t.id === transaction.id);
    if (index !== -1) {
      this.transactions[index] = transaction;
      return of(transaction);
    }
    return of(undefined);
  }

  // Delete a transaction by id
  deleteTransaction(id: number): Observable<boolean> {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
