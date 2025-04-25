import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

export const jwtInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<any> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Obtener el token JWT
  const token = authService.getToken();
  console.log('JWT Interceptor - Original request URL:', request.url);
  console.log('JWT Interceptor - Token exists:', !!token);

  // Si hay un token y no es una petición de login, añadir el token a la cabecera
  if (token && !request.url.includes('/auth/login')) {
    const clonedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('JWT Interceptor - Added token to request headers');
    console.log('JWT Interceptor - Headers:', clonedRequest.headers.keys());

    request = clonedRequest;
  } else {
    console.log('JWT Interceptor - No token added to request');
  }

  // Continuar con la petición y manejar errores
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('JWT Interceptor - Error in response:', error.status, error.message);

      // Si el error es 401 (Unauthorized) o 403 (Forbidden), redirigir al login
      if (error.status === 401 || error.status === 403) {
        console.log('JWT Interceptor - Authentication error, redirecting to login');
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
