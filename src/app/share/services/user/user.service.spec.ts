import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../../interfaces/user.interface';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all users', () => {
    const mockUsers: User[] = [
      {
        id: 1,
        username: 'admin',
        password: 'hashedpassword',
        roles: 'ROLE_ADMIN',
        fullName: 'Admin User',
        sales: 0,
        earnings: 0
      },
      {
        id: 2,
        username: 'employee',
        password: 'hashedpassword',
        roles: 'ROLE_EMPLOYEE',
        fullName: 'Employee User',
        sales: 10,
        earnings: 1000
      }
    ];

    service.getUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should get a user by id', () => {
    const mockUser: User = {
      id: 1,
      username: 'admin',
      password: 'hashedpassword',
      roles: 'ROLE_ADMIN',
      fullName: 'Admin User',
      sales: 0,
      earnings: 0
    };

    service.getUserById(1).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should add a new user', () => {
    const newUser: User = {
      id: 0, // ID will be assigned by the server
      username: 'newuser',
      password: 'password123',
      roles: 'ROLE_EMPLOYEE',
      fullName: 'New User',
      sales: 0,
      earnings: 0
    };

    const mockResponse: User = {
      ...newUser,
      id: 3 // Server assigned ID
    };

    service.addUser(newUser).subscribe(user => {
      expect(user).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(mockResponse);
  });

  it('should update an existing user', () => {
    const userToUpdate: User = {
      id: 1,
      username: 'admin',
      password: 'hashedpassword',
      roles: 'ROLE_ADMIN',
      fullName: 'Updated Admin Name',
      sales: 0,
      earnings: 0
    };

    service.updateUser(userToUpdate).subscribe(user => {
      expect(user).toEqual(userToUpdate);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(userToUpdate);
    req.flush(userToUpdate);
  });

  it('should delete a user', () => {
    service.deleteUser(1).subscribe(result => {
      expect(result).toBe(true);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('should handle errors when API calls fail', () => {
    service.getUsers().subscribe({
      next: () => fail('should have failed with a 404'),
      error: (error) => {
        expect(error.message).toContain('Error Code: 404');
      }
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});
