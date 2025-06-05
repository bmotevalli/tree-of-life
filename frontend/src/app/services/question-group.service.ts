import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { QuestionGroup } from '../interfaces/question.interface';

@Injectable({
  providedIn: 'root',
})
export class QuestionGroupService extends BaseService {
  private endpoint = `${this.baseUrl}/question-groups`;

  getAll(): Observable<QuestionGroup[]> {
    return this.http.get<QuestionGroup[]>(this.endpoint);
  }

  create(group: Partial<QuestionGroup>): Observable<QuestionGroup> {
    return this.http.post<QuestionGroup>(this.endpoint, group);
  }

  update(id: string, group: Partial<QuestionGroup>): Observable<QuestionGroup> {
    return this.http.put<QuestionGroup>(`${this.endpoint}/${id}`, group);
  }
}
