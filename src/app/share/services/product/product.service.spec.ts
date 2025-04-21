import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService, Product } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all products', () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        code: 'GEN001',
        cost_price: 300,
        description: 'Bicicleta BH de montaña',
        name: 'Bicicleta',
        quantity: 20,
        retail_price: 500,
        category_id: 1,
        supplier_id: 1
      },
      {
        id: 2,
        code: 'ELEC001',
        cost_price: 200,
        description: 'Teléfono inteligente de última generación',
        name: 'Smartphone',
        quantity: 10,
        retail_price: 300,
        category_id: 2,
        supplier_id: 2
      }
    ];

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should get a product by id', () => {
    const mockProduct: Product = {
      id: 1,
      code: 'GEN001',
      cost_price: 300,
      description: 'Bicicleta BH de montaña',
      name: 'Bicicleta',
      quantity: 20,
      retail_price: 500,
      category_id: 1,
      supplier_id: 1
    };

    service.getProductById(1).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/products/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should get products by category', () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        code: 'GEN001',
        cost_price: 300,
        description: 'Bicicleta BH de montaña',
        name: 'Bicicleta',
        quantity: 20,
        retail_price: 500,
        category_id: 1,
        supplier_id: 1
      }
    ];

    service.getProductsByCategory(1).subscribe(products => {
      expect(products.length).toBe(1);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/products?category_id=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should add a new product', () => {
    const newProduct: Product = {
      id: 0, // ID will be assigned by the server
      code: 'NEW001',
      cost_price: 100,
      description: 'New product description',
      name: 'New Product',
      quantity: 10,
      retail_price: 150,
      category_id: 1,
      supplier_id: 1
    };

    const createdProduct: Product = {
      ...newProduct,
      id: 13 // Server assigned ID
    };

    service.addProduct(newProduct).subscribe(product => {
      expect(product).toEqual(createdProduct);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(createdProduct);
  });

  it('should update a product', () => {
    const product: Product = {
      id: 1,
      code: 'GEN001',
      cost_price: 350, // Updated price
      description: 'Bicicleta BH de montaña',
      name: 'Bicicleta',
      quantity: 20,
      retail_price: 550, // Updated price
      category_id: 1,
      supplier_id: 1
    };

    service.updateProduct(product).subscribe(updatedProduct => {
      expect(updatedProduct).toEqual(product);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/products/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(product);
    req.flush(product);
  });

  it('should delete a product', () => {
    service.deleteProduct(1).subscribe(result => {
      expect(result).toBe(true);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/products/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('should handle errors when API calls fail', () => {
    service.getProducts().subscribe({
      next: () => fail('should have failed with a 404'),
      error: (error) => {
        expect(error.message).toContain('Error Code: 404');
      }
    });

    const req = httpMock.expectOne('http://localhost:8080/api/products');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});
