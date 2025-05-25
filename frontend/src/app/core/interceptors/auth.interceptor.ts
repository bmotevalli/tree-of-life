import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenForApi } from '../../interfaces/user.interface';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private includeTokenForRoutes: TokenForApi[] = [
    { prefix: 'auth', methods: ['*'] },
    { prefix: 'reports/admin', methods: ['GET', 'POST'] },
  ];

  private baseApiUrl = (window as any)['env']?.baseApiUrl || '';

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access_token');

    const urlWithoutBase = req.url.startsWith(this.baseApiUrl)
      ? req.url.replace(this.baseApiUrl, '')
      : req.url;

    const shouldAttachToken = this.includeTokenForRoutes.some(
      ({ prefix, methods }) =>
        urlWithoutBase.startsWith(`/${prefix}`) &&
        (methods.includes('*') ||
          methods.includes(req.method.toUpperCase() as any))
    );

    if (token && shouldAttachToken) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
