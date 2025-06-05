import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export class CrudBaseService<T> {
  readonly baseUrl: string;
  readonly endpoint: string;

  // ✅ Keep endpoint in the constructor, but no decorators
  constructor(protected http: HttpClient, endpoint: string) {
    this.baseUrl = (window as any)['env']?.baseApiUrl ?? '';
    this.endpoint = `${this.baseUrl}/${endpoint}`;
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.endpoint);
  }

  getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.endpoint}/${id}`);
  }

  create(data: Partial<T>): Observable<T> {
    return this.http.post<T>(this.endpoint, data);
  }

  update(id: string, data: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.endpoint}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}

@Injectable({
  providedIn: 'root',
})
export class CrudServiceFactory {
  constructor(private http: HttpClient) {}

  create<T>(endpoint: string): CrudBaseService<T> {
    return new CrudBaseService<T>(this.http, endpoint);
  }
}
