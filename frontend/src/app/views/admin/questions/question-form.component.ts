import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import { QuestionType } from '../../../interfaces/question.interface';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterModule,
  ],
  template: `
    <div class="flex justify-center mt-10">
      <mat-card class="bg-white !bg-white shadow-lg w-full max-w-xl p-6">
        <form [formGroup]="questionForm" (ngSubmit)="onSubmit()">
          <mat-form-field class="w-full" appearance="outline">
            <mat-label>متن</mat-label>
            <textarea
              matInput
              formControlName="prompt"
              rows="4"
              required
            ></textarea>
          </mat-form-field>

          <mat-form-field class="w-full" appearance="outline">
            <mat-label>نوع پاسخ</mat-label>
            <mat-select formControlName="type">
              @for (type of questionTypes; track type) {
              <mat-option [value]="type['value']">
                {{ type['label'] }}
              </mat-option>
              }
            </mat-select>
          </mat-form-field>

          @if (['multiple_choice',
          'single_choice'].includes(questionForm.get('type')?.value)) {
          <div formArrayName="options" class="w-full">
            @for (option of options.controls; track $index) {
            <div class="flex items-center gap-2">
              <mat-form-field class="flex-1" appearance="outline">
                <mat-label>گزینه {{ $index + 1 }}</mat-label>
                <input matInput [formControlName]="$index" />
              </mat-form-field>
              <button
                mat-icon-button
                color="warn"
                type="button"
                (click)="removeOption($index)"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </div>
            }
            <button
              mat-button
              color="primary"
              type="button"
              (click)="addOption()"
            >
              افزودن گزینه
            </button>
          </div>
          } @if (questionForm.get('type')?.value === 'slider') {
          <div formGroupName="meta" class="grid grid-cols-2 gap-4">
            <mat-form-field class="flex-1" appearance="outline">
              <mat-label>حداقل</mat-label>
              <input matInput type="number" formControlName="min" required />
            </mat-form-field>
            <mat-form-field class="flex-1" appearance="outline">
              <mat-label>حداکثر</mat-label>
              <input matInput type="number" formControlName="max" required />
            </mat-form-field>
            <mat-form-field class="flex-1" appearance="outline">
              <mat-label>برچسب ابتدا</mat-label>
              <input matInput formControlName="startLabel" />
            </mat-form-field>
            <mat-form-field class="flex-1" appearance="outline">
              <mat-label>برچسب انتها</mat-label>
              <input matInput formControlName="endLabel" />
            </mat-form-field>
          </div>
          }

          <div class="mt-6 flex justify-end">
            <button mat-raised-button color="primary" type="submit">
              {{ isEditMode ? 'بروزرسانی' : 'ایجاد' }} تمرین
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
})
export class QuestionFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  questionForm!: FormGroup;
  questionTypes: { [key: string]: string }[] = [
    { value: 'short_text', label: 'متن کوتاه' },
    { value: 'long_text', label: 'متن بلند' },
    { value: 'yes_no', label: 'بله/خیر' },
    { value: 'single_choice', label: 'انتخاب تک گزینه‌ای' },
    { value: 'multiple_choice', label: 'انتخاب چندگانه' },
    { value: 'slider', label: 'اسلایدر' },
    { value: 'number', label: 'عدد' },
  ];

  isEditMode = false;
  questionId: string | null = null;

  ngOnInit() {
    this.questionId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.questionId;
    this.initForm();
    if (this.isEditMode) {
      this.loadQuestion(this.questionId!);
    }
  }

  initForm() {
    this.questionForm = this.fb.group({
      prompt: ['', Validators.required],
      type: ['', Validators.required],
      options: this.fb.array([]),
      meta: this.fb.group({
        min: [],
        max: [],
        startLabel: [],
        endLabel: [],
      }),
      tagIds: this.fb.array([]),
    });
  }

  get options() {
    return this.questionForm.get('options') as FormArray;
  }

  addOption() {
    this.options.push(this.fb.control('', Validators.required));
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  loadQuestion(id: string) {
    // TODO: Load question from backend and patchValue
  }

  onSubmit() {
    if (this.questionForm.invalid) return;
    const data = this.questionForm.value;
    if (this.isEditMode) {
      // TODO: Call update API
    } else {
      // TODO: Call create API
    }
  }
}
