import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { HorizontalSeparatorComponent } from '../../../core/shared/h-separator.component';
import { Question } from '../../../interfaces/question.interface';
import {
  CrudServiceFactory,
  CrudBaseService,
} from '../../../services/crud-base.service';

@Component({
  selector: 'app-planning-page',
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
    HorizontalSeparatorComponent,
  ],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <div class="bg-white shadow-lg rounded-lg p-6">
        <mat-tab-group>
          <!-- Tab 1: Plan Setup -->
          <mat-tab label="تنظیم برنامه">
            <div class="mt-4">
              <!-- Schedule Definition -->
              <div class="mb-6">
                <h2 class="text-xl font-bold mb-2">تعریف برنامه</h2>
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
                      />
                    </mat-form-field>
                  </div>

                  <!-- Duration Unit -->
                  <div>
                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>واحد</mat-label>
                      <mat-select [(ngModel)]="durationUnit">
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
                      class="btn-primary rounded px-3 py-1 self-start"
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
              } @else {
              <p class="text-gray-600">هیچ تمرینی انتخاب نشده است.</p>
              }
            </div>
          </mat-tab>

          <!-- Tab 2: Current Plan -->
          <mat-tab label="برنامه فعلی">
            <div class="mt-4">
              <h2 class="text-xl font-bold mb-2">برنامه فعلی</h2>
              @if (selectedQuestions.length > 0) {
              <ul class="list-disc pl-6">
                @for (question of selectedQuestions; let i = $index; track
                question.id) {
                <li class="flex justify-between items-center">
                  <span>{{ question.prompt }}</span>
                  <button
                    (click)="removePractice(i)"
                    class="text-red-500 hover:underline"
                  >
                    حذف
                  </button>
                </li>
                }
              </ul>
              } @else {
              <p class="text-gray-600">هیچ تمرینی انتخاب نشده است.</p>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
})
export class PlanningComponent {
  startDate: string = '';
  durationNumber: number = 1;
  durationUnit: string = 'day';

  today = new Date();

  searchQuery: string = '';

  questionService: CrudBaseService<Question>;

  constructor(private crudFactory: CrudServiceFactory) {
    this.questionService = this.crudFactory.create<Question>('questions');
  }

  selectedQuestions: Question[] = [];
  availableQuestions: Question[] = [];

  ngOnInit() {
    this.loadQuestions();
  }

  filteredQuestions(): Question[] {
    if (!this.searchQuery.trim()) {
      return this.availableQuestions;
    }
    const query = this.searchQuery.toLowerCase();
    return this.availableQuestions.filter(
      (q) =>
        (q.title && q.title.toLowerCase().includes(query)) ||
        q.prompt.toLowerCase().includes(query) ||
        (q.tags && q.tags.some((tag) => tag.name.toLowerCase().includes(query)))
    );
  }

  // API Calls
  loadQuestions() {
    this.questionService.getAll().subscribe((questions) => {
      this.availableQuestions = questions;
    });
  }

  addPractice(question: Question) {
    // Add to selectedQuestions if not already there
    if (!this.selectedQuestions.some((q) => q.id === question.id)) {
      this.selectedQuestions.push(question);
      // Remove from availableQuestions
      this.availableQuestions = this.availableQuestions.filter(
        (q) => q.id !== question.id
      );
    }
  }

  removePractice(index: number) {
    // Remove from selectedQuestions
    const [removed] = this.selectedQuestions.splice(index, 1);
    if (removed) {
      // Add back to availableQuestions if not already there
      if (!this.availableQuestions.some((q) => q.id === removed.id)) {
        this.availableQuestions.push(removed);
        // Optional: sort availableQuestions if needed
        this.availableQuestions.sort((a, b) =>
          (a.title || '').localeCompare(b.title || '')
        );
      }
    }
  }
}
