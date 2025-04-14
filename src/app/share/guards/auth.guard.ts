import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si el usuario está autenticado
  if (authService.isAuthenticated() && !authService.isTokenExpired()) {
    // Verificar si la ruta requiere un rol específico
    const requiredRole = route.data['role'] as string;

    if (requiredRole) {
      const userRole = authService.getUserRole();

      // Si el usuario no tiene el rol requerido, redirigir a la página de acceso denegado
      if (userRole !== requiredRole) {
        router.navigate(['/access']);
        return false;
      }
    }

    // Usuario autenticado y con el rol correcto
    return true;
  }

  // Usuario no autenticado, redirigir al login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
