import { CrudBaseService } from './crud-base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserTimetable } from '../interfaces/user-question.interface';

@Injectable({
  providedIn: 'root',
})
export class TimetableService extends CrudBaseService<UserTimetable> {
  constructor(http: HttpClient) {
    super(http, 'user-timetables');
  }

  getMyTimetables(
    includeQuestions: boolean = false,
    showActive: boolean = false,
    showPending: boolean = false
  ): Observable<UserTimetable[]> {
    const params = new HttpParams({
      fromObject: {
        include_questions: includeQuestions,
        show_active: showActive,
        show_pending: showPending,
      },
    });
    return this.http.get<UserTimetable[]>(`${this.endpoint}/me`, { params });
  }
}
