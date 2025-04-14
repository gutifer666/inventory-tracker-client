import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { jwtInterceptor } from './jwt.interceptor';
import { AuthService } from '../services/auth/auth.service';

describe('JwtInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken', 'logout']);
    
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: HTTP_INTERCEPTORS, useValue: jwtInterceptor, multi: true }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should add an Authorization header with token', () => {
    const token = 'test-token';
    authService.getToken.and.returnValue(token);

    httpClient.get('/api/test').subscribe();

    const httpRequest = httpTestingController.expectOne('/api/test');
    expect(httpRequest.request.headers.has('Authorization')).toBeTrue();
    expect(httpRequest.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
  });

  it('should not add an Authorization header to login requests', () => {
    const token = 'test-token';
    authService.getToken.and.returnValue(token);

    httpClient.post('/api/auth/login', {}).subscribe();

    const httpRequest = httpTestingController.expectOne('/api/auth/login');
    expect(httpRequest.request.headers.has('Authorization')).toBeFalse();
  });

  it('should not add an Authorization header when token is null', () => {
    authService.getToken.and.returnValue(null);

    httpClient.get('/api/test').subscribe();

    const httpRequest = httpTestingController.expectOne('/api/test');
    expect(httpRequest.request.headers.has('Authorization')).toBeFalse();
  });
});
