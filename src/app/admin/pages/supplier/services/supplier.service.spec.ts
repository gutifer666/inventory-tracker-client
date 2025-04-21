import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SupplierService, Supplier } from './supplier.service';

describe('SupplierService', () => {
  let service: SupplierService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SupplierService]
    });

    service = TestBed.inject(SupplierService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all suppliers', () => {
    const mockSuppliers: Supplier[] = [
      {
        id: 1,
        name: 'Proveedor 1'
      },
      {
        id: 2,
        name: 'Proveedor 2'
      }
    ];

    service.getSuppliers().subscribe(suppliers => {
      expect(suppliers.length).toBe(2);
      expect(suppliers).toEqual(mockSuppliers);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/suppliers');
    expect(req.request.method).toBe('GET');
    req.flush(mockSuppliers);
  });

  it('should get a supplier by id', () => {
    const mockSupplier: Supplier = {
      id: 1,
      name: 'Proveedor 1'
    };

    service.getSupplierById(1).subscribe(supplier => {
      expect(supplier).toEqual(mockSupplier);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/suppliers/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSupplier);
  });

  it('should add a new supplier', () => {
    const newSupplier: Supplier = {
      id: 0, // ID will be assigned by the server
      name: 'Nuevo Proveedor'
    };

    const createdSupplier: Supplier = {
      ...newSupplier,
      id: 4 // Server assigned ID
    };

    service.addSupplier(newSupplier).subscribe(supplier => {
      expect(supplier).toEqual(createdSupplier);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/suppliers');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newSupplier);
    req.flush(createdSupplier);
  });

  it('should update a supplier', () => {
    const supplier: Supplier = {
      id: 1,
      name: 'Proveedor Actualizado'
    };

    service.updateSupplier(supplier).subscribe(updatedSupplier => {
      expect(updatedSupplier).toEqual(supplier);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/suppliers/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(supplier);
    req.flush(supplier);
  });

  it('should delete a supplier', () => {
    service.deleteSupplier(1).subscribe(result => {
      expect(result).toBe(true);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/suppliers/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('should handle errors when API calls fail', () => {
    service.getSuppliers().subscribe({
      next: () => fail('should have failed with a 404'),
      error: (error) => {
        expect(error.message).toContain('Error Code: 404');
      }
    });

    const req = httpMock.expectOne('http://localhost:8080/api/suppliers');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});
