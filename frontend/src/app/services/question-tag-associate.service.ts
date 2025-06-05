import { CrudBaseService } from './crud-base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QuestionTagAssociation } from '../interfaces/question.interface';

@Injectable({
  providedIn: 'root',
})
export class QuestionTagAssociationService extends CrudBaseService<QuestionTagAssociation> {
  constructor(http: HttpClient) {
    super(http, 'question-tag-associations');
  }

  deleteByQuestionId(questionId: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/by-question/${questionId}`);
  }
}
