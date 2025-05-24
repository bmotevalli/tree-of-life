import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private includeTokenForRoutes = ['users', 'reports/admin'];
  private baseApiUrl = (window as any)['env']?.baseApiUrl || '';

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access_token');

    const urlWithoutBase = req.url.startsWith(this.baseApiUrl)
      ? req.url.replace(this.baseApiUrl, '')
      : req.url;

    const shouldAttachToken = this.includeTokenForRoutes.some((prefix) =>
      urlWithoutBase.startsWith(`/${prefix}`)
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
