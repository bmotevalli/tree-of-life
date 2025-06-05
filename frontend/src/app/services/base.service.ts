import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  protected baseUrl: string;
  protected http = inject(HttpClient);

  constructor() {
    this.baseUrl = (window as any)['env']?.baseApiUrl ?? '';
  }
}
