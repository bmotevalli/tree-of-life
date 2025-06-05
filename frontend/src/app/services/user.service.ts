// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
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
