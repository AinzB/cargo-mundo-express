import { Injectable } from '@angular/core';
import { HttpXsrfTokenExtractor, HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  constructor(private tokenExtractor: HttpXsrfTokenExtractor) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Clonar la petición para agregar withCredentials
    let reqClone = req.clone({ withCredentials: true });

    // Sólo agregar header CSRF en métodos mutantes
    if (reqClone.method !== 'GET' && reqClone.method !== 'HEAD') {
      const token = this.tokenExtractor.getToken() as string;
      if (token && !reqClone.headers.has('X-XSRF-TOKEN')) {
        reqClone = reqClone.clone({
          headers: reqClone.headers.set('X-XSRF-TOKEN', token)
        });
      }
    }

    return next.handle(reqClone);
  }
}
