import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router'; // <-- Added
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { finalize } from 'rxjs/operators';

import { QuestionsListViewComponent } from '../../admin/questions/questions-list-view.component';
import { QuestionsToolbarComponent } from '../../admin/questions/questions-list-toolbar.component';

import { AnswerQuestionFormComponent } from '../../admin/questions/questions-answer-form.component';
import { HorizontalSeparatorComponent } from '../../../core/shared/h-separator.component';
import { Question } from '../../../interfaces/question.interface';
import {
  UserTimetable,
  UserTimetableSave,
} from '../../../interfaces/user-question.interface';
import {
  CrudServiceFactory,
  CrudBaseService,
} from '../../../services/crud-base.service';
import { UserService } from '../../../services/user.service';
import { parseLocalDate, formatLocalDate } from '../../../utils/utils';

@Component({
  selector: 'app-planning-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule,
    HorizontalSeparatorComponent,
    AnswerQuestionFormComponent,
    QuestionsListViewComponent,
    QuestionsToolbarComponent,
    DragDropModule,
    RouterModule,
  ],
  template: `
    <ng-template #actionButtons>
      @if (isLoading) {
      <mat-spinner></mat-spinner>
      } @else {
      <div class="mt-6 flex gap-4">
        <button
          type="button"
          class="c-warning px-4 py-2 rounded"
          (click)="router.navigate(['/notebook/planning'])"
        >
          بازگشت
        </button>
        <button
          type="button"
          class="c-info px-4 py-2 rounded"
          (click)="onSave()"
        >
          ذخیره برنامه
        </button>
        <button
          type="button"
          class="c-success px-4 py-2 rounded"
          (click)="onSubmit()"
        >
          ثبت برنامه
        </button>
      </div>
      @if (error) {
      <div class="p-2 text-red-500 text-bold">{{ error }}</div>
      } }
    </ng-template>

    <div class="p-6 max-w-4xl mx-auto">
      <div class="bg-white shadow-lg rounded-lg p-6">
        <mat-tab-group>
          <!-- Tab 1: Plan Setup -->
          <mat-tab label="تنظیم برنامه">
            <div class="mt-4">
              <!-- Schedule Definition -->
              <div class="mb-6">
                <h2 class="text-xl font-bold mb-2">تعریف برنامه</h2>
                <div>
                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>عنوان برنامه (اختیاری)</mat-label>
                    <input
                      matInput
                      [(ngModel)]="planTitle"
                      placeholder="عنوان برنامه"
                    />
                  </mat-form-field>
                </div>
                <div>
                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>یادداشت (اختیاری)</mat-label>
                    <textarea
                      rows="5"
                      matInput
                      [(ngModel)]="planNotes"
                      placeholder="اگر توضیح و یا یادداشتی دارید در اینجا وارد کنید..."
                    ></textarea>
                  </mat-form-field>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- Start Date -->
                  <div>
                    <mat-form-field appearance="outline" class="w-full">
                      <input
                        matInput
                        [matDatepicker]="picker"
                        [(ngModel)]="startDate"
                        [min]="today"
                        placeholder="تاریخ شروع"
                        required
                      />
                      <mat-datepicker-toggle
                        matSuffix
                        [for]="picker"
                      ></mat-datepicker-toggle>
                      <mat-datepicker #picker></mat-datepicker>
                    </mat-form-field>
                  </div>
                  <div>
                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>مدت زمان</mat-label>
                      <input
                        matInput
                        type="number"
                        min="1"
                        [(ngModel)]="durationNumber"
                        placeholder="مدت زمان"
                        required
                      />
                    </mat-form-field>
                  </div>

                  <!-- Duration Unit -->
                  <div>
                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>واحد</mat-label>
                      <mat-select [(ngModel)]="durationUnit" required>
                        <mat-option value="day">روز</mat-option>
                        <mat-option value="week">هفته</mat-option>
                        <mat-option value="month">ماه</mat-option>
                        <mat-option value="chelleh">چله</mat-option>
                      </mat-select>
                    </mat-form-field>
                  </div>
                </div>
              </div>

              <!-- Practice Selection -->
              <div>
                <h2 class="text-xl font-bold mb-2">انتخاب تمرینات</h2>
                <!-- Search Field -->
                <app-questions-toolbar
                  [allQuestions]="availableQuestions"
                  (filtered)="questionsFiltered = $event"
                  [(displayMode)]="displayMode"
                  [(grouping)]="grouping"
                ></app-questions-toolbar>

                <app-questions-list-view
                  [questions]="questionsFiltered"
                  [displayMode]="displayMode"
                  [grouping]="grouping"
                  [qActions]="['add']"
                  [gActions]="['add']"
                  (addQ)="onAddQ($event)"
                  (addG)="onAddG($event)"
                ></app-questions-list-view>
              </div>
            </div>

            <div class="mt-4">
              <app-h-separator title="تمرینات انتخاب شده"></app-h-separator>
              @if (selectedQuestions.length > 0) {
              <span class="text-gray-600"
                >ترتیب سوالات را میتوانید به دلخواه عوض کنید</span
              >
              <ul
                cdkDropList
                (cdkDropListDropped)="drop($event)"
                class="list-disc pl-6"
              >
                @for (question of selectedQuestions; let i = $index; track
                question.id) {

                <li>
                  <div
                    cdkDrag
                    class="flex justify-between items-center bg-white border p-2 mb-1 rounded shadow cursor-move"
                  >
                    <div class="flex gap-2">
                      @if (question.title) {<span>{{ question.title }}: </span>}
                      <span>{{ question.prompt }}</span>
                      @if (question.groupName) {
                      <span>({{ question.groupName }})</span>
                      }
                    </div>
                    <button
                      (click)="removePractice(i)"
                      class="text-red-500 hover:underline"
                    >
                      حذف
                    </button>
                  </div>
                </li>
                }
              </ul>
              <ng-container *ngTemplateOutlet="actionButtons"></ng-container>}
              @else {
              <p class="text-gray-600">هیچ تمرینی انتخاب نشده است.</p>
              }
            </div>
          </mat-tab>

          <!-- Tab 2: Current Plan -->
          <mat-tab label="برنامه فعلی">
            <div class="mt-4">
              <app-h-separator title="نمایی از برنامه فعلی"></app-h-separator>
              @if (selectedQuestions.length > 0) {
              <app-answer-question-form
                [questions]="selectedQuestions"
                [isDisabled]="true"
              ></app-answer-question-form>

              <ng-container *ngTemplateOutlet="actionButtons"></ng-container> }
              @else {
              <p class="text-gray-600">هیچ تمرینی انتخاب نشده است.</p>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
})
export class PlanningUpsertComponent {
  startDate: Date = new Date();
  durationNumber: number = 1;
  durationUnit: string = 'day';
  planTitle: string = '';
  planNotes: string = '';

  error: string | null = null;
  isLoading: boolean = false;

  today = new Date();

  selectedQuestions: Question[] = [];
  availableQuestions: Question[] = [];
  displayMode: 'table' | 'cards' | 'compact' = 'cards';
  grouping = false;
  questionsFiltered: Question[] = [];

  questionService: CrudBaseService<Question>;
  timetableService: CrudBaseService<UserTimetable>;
  userService = inject(UserService);
  route = inject(ActivatedRoute); // <-- Added
  router = inject(Router);

  timetableId: string | null = null; // <-- Added

  constructor(private crudFactory: CrudServiceFactory) {
    this.questionService = this.crudFactory.create<Question>('questions');
    this.timetableService =
      this.crudFactory.create<UserTimetable>('user-timetables');
  }

  ngOnInit() {
    this.loadQuestions();

    this.timetableId = this.route.snapshot.paramMap.get('id');
    if (this.timetableId) {
      this.loadTimetable(this.timetableId);
    }
  }

  loadQuestions() {
    this.questionService.getAll().subscribe((questions) => {
      this.availableQuestions = questions;
      this.questionsFiltered = questions;
    });
  }

  loadTimetable(timetableId: string) {
    this.isLoading = true;
    this.timetableService
      .getById(timetableId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (timetable) => {
          this.planTitle = timetable.title || '';
          this.planNotes = timetable.notes || '';
          this.startDate = parseLocalDate(timetable.startDate);
          this.durationUnit = 'day'; // Adjust if you store unit on backend
          const diffDays = this.dateDiff(
            timetable.startDate,
            timetable.endDate
          );
          this.durationNumber = diffDays;

          if (timetable.questions) {
            this.selectedQuestions = timetable.questions.map(
              (qt) => qt.question
            );
            this.availableQuestions = this.availableQuestions.filter(
              (q) => !this.selectedQuestions.some((sq) => sq.id === q.id)
            );
          }
        },
        error: (err: any) => {
          this.error = 'خطا در بارگذاری برنامه';
          console.error('Error loading timetable:', err);
        },
      });
  }

  dateDiff(start: string, end: string): number {
    const startDate = parseLocalDate(start);
    const endDate = parseLocalDate(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime() + 1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isFormValid = computed(
    () =>
      this.startDate &&
      this.durationNumber > 0 &&
      this.durationUnit &&
      this.selectedQuestions.length > 0
  );

  drop(event: CdkDragDrop<Question[]>) {
    moveItemInArray(
      this.selectedQuestions,
      event.previousIndex,
      event.currentIndex
    );
  }

  calculateEndTime(): Date {
    const start = new Date(this.startDate);
    let end = new Date(start);
    switch (this.durationUnit) {
      case 'day':
        end.setDate(end.getDate() + this.durationNumber - 1);
        break;
      case 'week':
        end.setDate(end.getDate() + this.durationNumber * 7 - 1);
        break;
      case 'month':
        end.setMonth(end.getMonth() + this.durationNumber);
        break;
      case 'chelleh':
        end.setDate(end.getDate() + this.durationNumber * 40 - 1);
        break;
    }
    return end;
  }

  get timetable(): UserTimetableSave {
    return {
      ...(this.timetableId ? { id: this.timetableId } : {}),
      startDate: formatLocalDate(this.startDate),
      endDate: formatLocalDate(this.calculateEndTime()),
      notes: this.planNotes,
      title: this.planTitle,
      isSubmitted: false,
      questionIds: this.selectedQuestions
        .map((r) => r.id)
        .filter((id): id is string => !!id),
    };
  }

  onAddQ(question: Question) {
    if (!this.selectedQuestions.some((q) => q.id === question.id)) {
      this.selectedQuestions.push(question);
      this.availableQuestions = this.availableQuestions.filter(
        (q) => q.id !== question.id
      );
    }
  }

  onAddG(groupName: string) {
    const gQuestions = this.availableQuestions.filter(
      (q) => q.groupName === groupName
    );
    gQuestions.forEach((question) => {
      this.selectedQuestions.push(question);
      this.availableQuestions = this.availableQuestions.filter(
        (q) => q.id !== question.id
      );
    });
  }

  removePractice(index: number) {
    const [removed] = this.selectedQuestions.splice(index, 1);
    if (removed && !this.availableQuestions.some((q) => q.id === removed.id)) {
      this.availableQuestions.push(removed);
    }
  }

  onStorePlan(isSubmitted: boolean) {
    this.error = null;
    this.isLoading = true;
    if (!this.isFormValid()) {
      this.error =
        'لطفاً تمام فیلدهای ضروری را پر کنید و مطمئن باشید که تمرین برای برنامه تان انتخاب کردید.';
      console.warn('Form is not valid.');
      this.isLoading = false;
      return;
    }

    const payload = { ...this.timetable, isSubmitted };

    // const request$ = this.timetableId
    //   ? this.timetableService.update(this.timetableId, payload)
    //   : this.timetableService.create(payload);

    this.timetableService
      .create(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          console.log('Timetable saved successfully');
          if (!this.timetableId && res.id) {
            // Store the id locally so subsequent saves are updates
            this.timetableId = res.id;
          }

          if (isSubmitted) {
            this.router.navigate(['/notebook/planning']);
          } else {
            this.router.navigate([
              '/notebook/planning',
              this.timetableId,
              'edit',
            ]);
          }
        },
        error: (err) => {
          this.error = 'خطا در ذخیره‌سازی برنامه: ' + err.error.detail;
          console.error(err);
        },
      });
  }

  onSave() {
    this.onStorePlan(false);
  }

  onSubmit() {
    this.onStorePlan(true);
  }
}
