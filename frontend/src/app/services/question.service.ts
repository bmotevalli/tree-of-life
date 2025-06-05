import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Question } from '../interfaces/question.interface';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionService extends BaseService {
  private endpoint = `${this.baseUrl}/questions`;

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.endpoint);
  }

  createQuestion(question: Partial<Question>): Observable<Question> {
    return this.http.post<Question>(this.endpoint, question);
  }

  updateQuestion(
    id: string,
    question: Partial<Question>
  ): Observable<Question> {
    return this.http.put<Question>(`${this.endpoint}/${id}`, question);
  }

  deleteQuestion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
