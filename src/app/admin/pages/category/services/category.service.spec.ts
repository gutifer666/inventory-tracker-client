import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService, Category } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService]
    });

    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all categories', () => {
    const mockCategories: Category[] = [
      {
        id: 1,
        name: 'General',
        description: 'Productos de uso general'
      },
      {
        id: 2,
        name: 'Electrónica',
        description: 'Dispositivos y gadgets electrónicos'
      }
    ];

    service.getCategories().subscribe(categories => {
      expect(categories.length).toBe(2);
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/categories');
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('should get a category by id', () => {
    const mockCategory: Category = {
      id: 1,
      name: 'General',
      description: 'Productos de uso general'
    };

    service.getCategoryById(1).subscribe(category => {
      expect(category).toEqual(mockCategory);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/categories/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockCategory);
  });

  it('should add a new category', () => {
    const newCategory: Category = {
      id: 0, // ID will be assigned by the server
      name: 'Nueva Categoría',
      description: 'Descripción de la nueva categoría'
    };

    const createdCategory: Category = {
      ...newCategory,
      id: 5 // Server assigned ID
    };

    service.addCategory(newCategory).subscribe(category => {
      expect(category).toEqual(createdCategory);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/categories');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCategory);
    req.flush(createdCategory);
  });

  it('should update a category', () => {
    const category: Category = {
      id: 1,
      name: 'General Actualizado',
      description: 'Descripción actualizada'
    };

    service.updateCategory(category).subscribe(updatedCategory => {
      expect(updatedCategory).toEqual(category);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/categories/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(category);
    req.flush(category);
  });

  it('should delete a category', () => {
    service.deleteCategory(1).subscribe(result => {
      expect(result).toBe(true);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/categories/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('should handle errors when API calls fail', () => {
    service.getCategories().subscribe({
      next: () => fail('should have failed with a 404'),
      error: (error) => {
        expect(error.message).toContain('Error Code: 404');
      }
    });

    const req = httpMock.expectOne('http://localhost:8080/api/categories');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});
