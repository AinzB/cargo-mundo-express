import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const auth = inject(AuthService);      // inyecta tu servicio de autenticación
  const router = inject(Router);         // inyecta el Router para redirecciones

  return auth.user().pipe(               // llama al endpoint GET /user
    map(user => {
      if (user) {
        return true;                     // si hay usuario, permite navegación
      }
      // si NO está autenticado, redirige a /login
      return router.createUrlTree(['/login']);
    }),
    catchError(() =>
      // ante error (p.ej. 401), también redirige a /login
      of(router.createUrlTree(['/login']))
    )
  );
};
