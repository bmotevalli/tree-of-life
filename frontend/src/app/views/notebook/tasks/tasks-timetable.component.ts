import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { differenceInCalendarDays } from 'date-fns'; // Use date-fns for date manipulations

import { AnswerQuestionFormComponent } from '../../admin/questions/questions-answer-form.component';
import {
  QuestionTimetableRead,
  UserTimetable,
} from '../../../interfaces/user-question.interface';
import { parseLocalDate } from '../../../utils/utils';
import { TimetableService } from '../../../services/timetable.service';
import { Question } from '../../../interfaces/question.interface';

@Component({
  selector: 'app-daily-practice',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    AnswerQuestionFormComponent,
  ],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <div class="bg-white shadow-lg rounded-lg p-6">
        @if (activeTimetables.length > 0) {
        <mat-tab-group>
          @for (timetable of activeTimetables; let i = $index; track
          timetable.id) {
          <mat-tab [label]="timetable.title || 'تمرین ' + (i + 1)">
            <div class="p-4 flex w-full items-center justify-between ltr">
              <!-- Day Counter (left aligned with arrows and day index) -->
              <div class="flex items-center gap-2">
                <button
                  mat-icon-button
                  (click)="navigateDay(i, -1)"
                  class="w-4 h-4 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full"
                >
                  <mat-icon class="text-gray-500">chevron_left</mat-icon>
                </button>
                <span class="text-sg text-gray-500">
                  {{ getDayIndex(i) }}/{{ getTotalDays(i) }}
                </span>
                <button
                  mat-icon-button
                  (click)="navigateDay(i, 1)"
                  class="w-4 h-4flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full"
                >
                  <mat-icon class="text-gray-500">chevron_right</mat-icon>
                </button>
              </div>

              <!-- Center Caption -->
              <div class="text-center text-sm text-gray-500">
                {{ getDayCaption(i) }}
              </div>
            </div>

            <!-- Answer Form -->
            <app-answer-question-form
              [questions]="getTimetableQuestions(timetable)"
              [isDisabled]="false"
              [timetableId]="timetable.id"
              [dayOfPlan]="getDayIndex(i)"
            ></app-answer-question-form>
          </mat-tab>
          }
        </mat-tab-group>
        } @else {
        <p class="text-gray-600">هیچ برنامه فعالی وجود ندارد.</p>
        }
      </div>
    </div>
  `,
})
export class TasksTimetableComponent implements OnInit {
  private userTimetableService = inject(TimetableService);
  activeTimetables: UserTimetable[] = [];
  dayIndexes: Record<string, number> = {};
  dayOfPlan = signal<number>(1);

  ngOnInit() {
    this.loadActiveTimetables();
  }

  loadActiveTimetables() {
    this.userTimetableService
      .getMyTimetables(true, true, false)
      .subscribe((timetables) => {
        this.activeTimetables = timetables;
        // Initialize dayIndexes
        this.activeTimetables.forEach((t) => {
          this.dayIndexes[t.id!] = this.getTodayIndex(t);
        });
      });
  }

  getTimetableQuestions(timetable: UserTimetable) {
    return (timetable?.questions || [])
      .map((qt: QuestionTimetableRead) => qt?.question)
      .filter((q: Question | undefined): q is Question => !!q);
  }

  getTodayIndex(timetable: UserTimetable): number {
    const today = new Date();
    const startDate = parseLocalDate(timetable.startDate);
    const dayIndex = differenceInCalendarDays(today, startDate) + 1;
    // this.dayOfPlan.set(dayIndex);
    return Math.min(
      Math.max(dayIndex, 1),
      this.getTotalDaysFromTimetable(timetable)
    );
  }

  getTotalDaysFromTimetable(timetable: UserTimetable): number {
    const start = parseLocalDate(timetable.startDate);
    const end = parseLocalDate(timetable.endDate);
    return differenceInCalendarDays(end, start) + 1;
  }

  getDayIndex(index: number): number {
    const timetable = this.activeTimetables[index];
    return this.dayIndexes[timetable.id!] || 1;
  }

  getTotalDays(index: number): number {
    const timetable = this.activeTimetables[index];
    return this.getTotalDaysFromTimetable(timetable);
  }

  getDayCaption(index: number): string {
    const timetable = this.activeTimetables[index];
    const today = new Date();
    const targetDayIndex = this.getDayIndex(index);
    const targetDate = new Date(parseLocalDate(timetable.startDate));
    targetDate.setDate(targetDate.getDate() + targetDayIndex - 1);

    const diff = differenceInCalendarDays(targetDate, today);
    if (diff === 0) return 'تمرینات امروز';
    if (diff === -1) return 'تمرینات دیروز';
    if (diff === 1) return 'تمرینات فردا';
    return diff < 0 ? 'روزهای قبل' : 'روزهای بعد';
  }

  navigateDay(index: number, direction: number) {
    const timetable = this.activeTimetables[index];
    const newIndex = this.dayIndexes[timetable.id!] + direction;
    if (newIndex >= 1 && newIndex <= this.getTotalDays(index)) {
      this.dayIndexes[timetable.id!] = newIndex;
    }
  }
}
