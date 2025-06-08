import { CrudBaseService } from './crud-base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAnswerRead } from '../interfaces/user-answer.interface';

@Injectable({
  providedIn: 'root',
})
export class UserAnswerService extends CrudBaseService<UserAnswerRead> {
  constructor(http: HttpClient) {
    super(http, 'user-answers');
  }

  getMyAnswersByTimetableDay(
    timetableId: string | undefined,
    dayOfPlan: number | undefined
  ): Observable<UserAnswerRead[]> {
    if (!timetableId || !dayOfPlan) {
      throw new Error('TimetableId and dayOfPlan should be provided!');
    }
    const params = new HttpParams({
      fromObject: {
        timetable_id: timetableId || '',
        day_of_plan: dayOfPlan || 0,
      },
    });
    return this.http.get<UserAnswerRead[]>(`${this.endpoint}/timetable-day`, {
      params,
    });
  }
}
