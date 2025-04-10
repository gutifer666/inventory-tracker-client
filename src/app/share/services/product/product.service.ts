import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Product {
  id: number;
  code: string;
  cost_price: number;
  description: string;
  name: string;
  quantity: number;
  retail_price: number;
  category_id: number;
  supplier_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = [
    { id: 1, code: "GEN001", cost_price: 300, description: "Bicicleta BH de montaña", name: "Bicicleta", quantity: 20, retail_price: 500, category_id: 1, supplier_id: 1 },
    { id: 2, code: "ELEC001", cost_price: 200, description: "Teléfono inteligente de última generación", name: "Smartphone", quantity: 10, retail_price: 300, category_id: 2, supplier_id: 2 },
    { id: 3, code: "ROPA001", cost_price: 30, description: "Camiseta de algodón 100%", name: "Camiseta", quantity: 50, retail_price: 50, category_id: 3, supplier_id: 3 },
    { id: 4, code: "ALIM001", cost_price: 1, description: "Leche entera pasteurizada", name: "Leche", quantity: 100, retail_price: 2, category_id: 4, supplier_id: 1 },
    { id: 5, code: "GEN002", cost_price: 20, description: "Silla de madera para comedor", name: "Silla", quantity: 30, retail_price: 30, category_id: 1, supplier_id: 2 },
    { id: 6, code: "ELEC002", cost_price: 100, description: "Tablet de 10 pulgadas", name: "Tablet", quantity: 15, retail_price: 150, category_id: 2, supplier_id: 3 },
    { id: 7, code: "ROPA002", cost_price: 40, description: "Pantalón vaquero de hombre", name: "Pantalón", quantity: 40, retail_price: 60, category_id: 3, supplier_id: 1 },
    { id: 8, code: "ALIM002", cost_price: 0.5, description: "Pan de trigo", name: "Pan", quantity: 200, retail_price: 1, category_id: 4, supplier_id: 2 },
    { id: 9, code: "GEN003", cost_price: 50, description: "Mesa de centro de cristal", name: "Mesa", quantity: 25, retail_price: 80, category_id: 1, supplier_id: 3 },
    { id: 10, code: "ELEC003", cost_price: 80, description: "Reloj inteligente con monitor de actividad", name: "Smartwatch", quantity: 20, retail_price: 120, category_id: 2, supplier_id: 1 },
    { id: 11, code: "ROPA003", cost_price: 60, description: "Vestido de fiesta para mujer", name: "Vestido", quantity: 35, retail_price: 100, category_id: 3, supplier_id: 2 },
    { id: 12, code: "ALIM003", cost_price: 1.5, description: "Refresco de cola", name: "Refresco", quantity: 150, retail_price: 2.5, category_id: 4, supplier_id: 3 }
  ];

  constructor() { }

  // Get all products
  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  // Get a product by id
  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }

  // Get products by category id
  getProductsByCategory(category_id: number): Observable<Product[]> {
    const filtered = this.products.filter(p => p.category_id === category_id);
    return of(filtered);
  }

  // Add a new product
  addProduct(product: Product): Observable<Product> {
    product.id = this.products.length ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    this.products.push(product);
    return of(product);
  }

  // Update an existing product
  updateProduct(product: Product): Observable<Product | undefined> {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products[index] = product;
      return of(product);
    }
    return of(undefined);
  }

  // Delete a product by id
  deleteProduct(id: number): Observable<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
