// src/app/services/user.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs';
import { CrudBaseService } from './crud-base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.baseUrl = (window as any)['env']?.baseApiUrl ?? '';
  }

  login(email: string, password: string) {
    const body = new HttpParams()
      .set('username', email)
      .set('password', password)
      .set('grant_type', 'password');

    return this.http.post<any>(`${this.baseUrl}/auth/jwt/login`, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/auth/users/me`);
  }

  // Add other user/auth/api methods as needed
}
