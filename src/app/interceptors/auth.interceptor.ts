// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Obtenemos el accessToken directamente desde el AuthService
    const accessToken = this.authService.getAccessToken();
    //console.log('Interceptor acctk', accessToken);
    if (accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Si ocurre un error 401, intentamos refrescar el token
          const refreshToken = this.authService.getRefreshToken();
          if (refreshToken) {
            return this.authService.refreshAccessToken(refreshToken).pipe(
              switchMap((res) => {
                // Actualizamos el token en memoria
                this.authService.setAccessToken(res.accessToken);
                req = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${res.accessToken}`,
                  },
                });
                return next.handle(req);
              })
            );
          }
        }

        // En caso de error 403 o cualquier otro, redirigimos al login
        if (error.status === 403 || error.status === 401) {
          // Manejar el cierre de sesión y redirección al login
          this.router.navigate(['/login']);
        }

        throw error;
      })
    );
  }
}
