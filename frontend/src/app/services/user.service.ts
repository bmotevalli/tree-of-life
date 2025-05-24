// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = (window as any)['env']?.baseApiUrl ?? '';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const body = new HttpParams()
      .set('username', email)
      .set('password', password)
      .set('grant_type', 'password');

    return this.http.post<any>(`${this.baseUrl}/auth/jwt/login`, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }

  getCurrentUser() {
    return this.http.get(`${this.baseUrl}/users/me`);
  }

  // Add other user/auth/api methods as needed
}
