import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Supplier {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private suppliers: Supplier[] = [
    { id: 1, name: 'Proveedor 1' },
    { id: 2, name: 'Proveedor 2' },
    { id: 3, name: 'Proveedor 3' }
  ];

  constructor() { }

  // Get all suppliers
  getSuppliers(): Observable<Supplier[]> {
    return of(this.suppliers);
  }

  // Get a supplier by id
  getSupplierById(id: number): Observable<Supplier | undefined> {
    const supplier = this.suppliers.find(s => s.id === id);
    return of(supplier);
  }

  // Add a new supplier
  addSupplier(supplier: Supplier): Observable<Supplier> {
    supplier.id = this.suppliers.length ? Math.max(...this.suppliers.map(s => s.id)) + 1 : 1;
    this.suppliers.push(supplier);
    return of(supplier);
  }

  // Update an existing supplier
  updateSupplier(supplier: Supplier): Observable<Supplier | undefined> {
    const index = this.suppliers.findIndex(s => s.id === supplier.id);
    if (index !== -1) {
      this.suppliers[index] = supplier;
      return of(supplier);
    }
    return of(undefined);
  }

  // Delete a supplier by id
  deleteSupplier(id: number): Observable<boolean> {
    const index = this.suppliers.findIndex(s => s.id === id);
    if (index !== -1) {
      this.suppliers.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
