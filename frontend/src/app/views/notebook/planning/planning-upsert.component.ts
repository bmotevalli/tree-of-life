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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/operators';

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
    HorizontalSeparatorComponent,
    AnswerQuestionFormComponent,
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
      }
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
                <div class="mb-4">
                  <label class="block font-medium mb-1">جستجوی تمرینات:</label>
                  <input
                    type="text"
                    [(ngModel)]="searchQuery"
                    placeholder="جستجو بر اساس عنوان، گروه، متن یا برچسب"
                    class="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  @for (question of filteredQuestions(); track question.id) {
                  <div class="border border-gray-300 p-4 flex flex-col gap-2">
                    <div>
                      <h3 class="font-semibold">
                        {{ question.title || 'بدون عنوان' }}
                      </h3>
                      <p class="text-gray-700">{{ question.prompt }}</p>
                      @if (question.groupName) {
                      <p class="text-sm text-gray-500">
                        گروه: {{ question.groupName }}
                      </p>
                      }
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <!-- Question Type Badge -->
                      <span
                        class="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded"
                      >
                        {{ question.type }}
                      </span>
                      <!-- Tags Badges -->
                      @if (question.tags?.length) { @for (tag of question.tags;
                      track tag.id) {
                      <span
                        class="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded"
                      >
                        {{ tag.name }}
                      </span>
                      } }
                    </div>
                    <button
                      (click)="addPractice(question)"
                      class="c-primary rounded px-3 py-1 self-start"
                    >
                      اضافه کن
                    </button>
                  </div>
                  }
                </div>
              </div>
            </div>

            <div class="mt-4">
              <app-h-separator title="تمرینات انتخاب شده"></app-h-separator>
              @if (selectedQuestions.length > 0) {
              <ul class="list-disc pl-6">
                @for (question of selectedQuestions; let i = $index; track
                question.id) {
                <li class="flex justify-between items-center">
                  <div class="flex gap-2">
                    @if (question.title) {<span>{{ question.title }}: </span>}
                    <span>{{ question.prompt }}</span>
                    @if (question.groupName) {<span
                      >({{ question.groupName }})</span
                    >}
                  </div>
                  <button
                    (click)="removePractice(i)"
                    class="text-red-500 hover:underline"
                  >
                    حذف
                  </button>
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

  searchQuery: string = '';

  selectedQuestions: Question[] = [];
  availableQuestions: Question[] = [];

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
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  filteredQuestions(): Question[] {
    if (!this.searchQuery.trim()) return this.availableQuestions;
    const query = this.searchQuery.toLowerCase();
    return this.availableQuestions.filter(
      (q) =>
        (q.title && q.title.toLowerCase().includes(query)) ||
        q.prompt.toLowerCase().includes(query) ||
        (q.tags && q.tags.some((tag) => tag.name.toLowerCase().includes(query)))
    );
  }

  isFormValid = computed(
    () =>
      this.startDate &&
      this.durationNumber > 0 &&
      this.durationUnit &&
      this.selectedQuestions.length > 0
  );

  calculateEndTime(): Date {
    const start = new Date(this.startDate);
    let end = new Date(start);
    switch (this.durationUnit) {
      case 'day':
        end.setDate(end.getDate() + this.durationNumber);
        break;
      case 'week':
        end.setDate(end.getDate() + this.durationNumber * 7);
        break;
      case 'month':
        end.setMonth(end.getMonth() + this.durationNumber);
        break;
      case 'chelleh':
        end.setDate(end.getDate() + this.durationNumber * 40);
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

  addPractice(question: Question) {
    if (!this.selectedQuestions.some((q) => q.id === question.id)) {
      this.selectedQuestions.push(question);
      this.availableQuestions = this.availableQuestions.filter(
        (q) => q.id !== question.id
      );
    }
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
          this.error = 'خطا در ذخیره‌سازی برنامه';
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
