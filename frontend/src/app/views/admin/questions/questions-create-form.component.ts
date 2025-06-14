import { Component, inject, signal } from '@angular/core';
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import {
  CrudBaseService,
  CrudServiceFactory,
} from '../../../services/crud-base.service';
import { QuestionTagAssociationService } from '../../../services/question-tag-associate.service';
import { Question } from '../../../interfaces/question.interface';
import { QuestionGroup } from '../../../interfaces/question.interface';
import { QuestionTag } from '../../../interfaces/question.interface';
import { QuestionTagAssociation } from '../../../interfaces/question.interface';

import { QuestionGroupDialogButtonComponent } from './questions-dialog-group.component';
import { QuestionTagsDialogButtonComponent } from './questions-dialog-tags.component';
import { finalize, forkJoin } from 'rxjs';

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
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    QuestionGroupDialogButtonComponent,
    QuestionTagsDialogButtonComponent,
  ],
  template: `
    <div class="flex justify-center mt-10">
      <mat-card class="bg-white !bg-white shadow-lg w-full max-w-xl p-6">
        @if (error()) {
        <span class="text-red-500">{{ error() }}</span>
        } @if(loading()) {
        <mat-spinner></mat-spinner>
        } @else {
        <form [formGroup]="questionForm" (ngSubmit)="onSubmit()">
          <!-- Group -->
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>گروه تمرین (اختیاری)</mat-label>
            <mat-select formControlName="groupId">
              <mat-option
                ><app-question-group-dialog-button
                  (groupSaved)="loadQuestionGroups(true)"
                ></app-question-group-dialog-button
              ></mat-option>
              <mat-option value="">بدون گروه</mat-option>
              @for (group of questionGroups; track group.id) {
              <mat-option [value]="group.id">{{ group.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field class="w-full" appearance="outline">
            <mat-label>عنوان تمرین (اختیاری)</mat-label>
            <input matInput formControlName="title" />
          </mat-form-field>

          <mat-form-field class="w-full" appearance="outline">
            <mat-label>متن تمرین</mat-label>
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
          }

          <mat-form-field class="w-full" appearance="outline">
            <mat-label>نمونه پاسخ (اختیاری)</mat-label>
            <textarea
              matInput
              formControlName="exampleAnswer"
              rows="4"
            ></textarea>
          </mat-form-field>

          @if (questionForm.get('type')?.value === 'slider') {
          <div formGroupName="sliderMetaForm" class="grid grid-cols-2 gap-4">
            <mat-form-field class="flex-1" appearance="outline">
              <mat-label>حداقل</mat-label>
              <input matInput type="number" formControlName="min" required />
            </mat-form-field>
            <mat-form-field class="flex-1" appearance="outline">
              <mat-label>حداکثر</mat-label>
              <input matInput type="number" formControlName="max" required />
            </mat-form-field>
            <mat-form-field class="flex-1" appearance="outline">
              <mat-label>برچسب حداقل</mat-label>
              <input matInput formControlName="minLabel" />
            </mat-form-field>
            <mat-form-field class="flex-1" appearance="outline">
              <mat-label>برچسب حداکثر</mat-label>
              <input matInput formControlName="maxLabel" />
            </mat-form-field>
          </div>
          } @else {
          <mat-form-field class="w-full mt-2" appearance="outline">
            <mat-label>تنظیمات اضافی (اختیاری)</mat-label>
            <textarea
              matInput
              formControlName="meta"
              rows="4"
              [attr.placeholder]="metaPlaceholder"
            ></textarea>
          </mat-form-field>
          }

          <mat-form-field class="w-full" appearance="outline">
            <mat-label>برچسب‌ها</mat-label>
            <mat-select formControlName="tags" multiple>
              @for (tag of tags; track tag.id) {
              <mat-option [value]="tag.id">{{ tag.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <app-question-tags-dialog-button></app-question-tags-dialog-button>

          <div class="mt-6 flex justify-end">
            <button mat-raised-button color="primary" type="submit">
              {{ isEditMode ? 'بروزرسانی' : 'ایجاد' }} تمرین
            </button>

            <button
              mat-raised-button
              color="secondary"
              type="button"
              (click)="router.navigate(['/admin/questions'])"
              class="ml-2"
            >
              بازگشت
            </button>
          </div>
        </form>
        }
      </mat-card>
    </div>
  `,
})
export class QuestionFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private questionService: CrudBaseService<Question>;
  private questionGroupService: CrudBaseService<QuestionGroup>;
  private questionTagsService: CrudBaseService<QuestionTag>;
  private questionTagAssociationService = inject(QuestionTagAssociationService);

  private snackBar = inject(MatSnackBar);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  questionForm!: FormGroup;
  questionGroups: QuestionGroup[] = [];
  tags: QuestionTag[] = [];
  questionTypes: { [key: string]: string }[] = [
    { value: 'short_text', label: 'متن کوتاه' },
    { value: 'long_text', label: 'متن بلند' },
    { value: 'yes_no', label: 'بله/خیر' },
    { value: 'single_choice', label: 'انتخاب تک گزینه‌ای' },
    { value: 'multiple_choice', label: 'انتخاب چندگانه' },
    { value: 'slider', label: 'اسلایدر' },
    { value: 'tick', label: 'تیک' },
    { value: 'number', label: 'عدد' },
    { value: 'count', label: 'بشمار' },
  ];

  isEditMode = false;
  questionId: string | null = null;

  // searchTag = signal<string | null>('');

  // filteredTags() {
  //   const search = this.searchTag()?.toLowerCase();
  //   if (!search) {
  //     return this.tags;
  //   }
  //   return this.tags.filter((tag) => tag.name.toLowerCase().includes(search));
  // }

  constructor(private crudFactory: CrudServiceFactory) {
    this.questionService = this.crudFactory.create<Question>('questions');
    this.questionGroupService =
      this.crudFactory.create<QuestionGroup>('question-groups');
    this.questionTagsService =
      this.crudFactory.create<QuestionTag>('question-tags');
  }

  ngOnInit() {
    this.questionId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.questionId;
    this.initForm();
    if (this.isEditMode) {
      this.loadQuestion(this.questionId!);
    }
    this.loadQuestionGroups();
    this.loadTags();
  }

  initForm() {
    this.questionForm = this.fb.group({
      title: [''],
      prompt: ['', Validators.required],
      type: ['', Validators.required],
      options: this.fb.array([]),
      meta: [''],
      groupId: [null],
      exampleAnswer: [''],
      tags: this.fb.control([]),
      sliderMetaForm: this.fb.group({
        min: [null],
        max: [null],
        minLabel: [''],
        maxLabel: [''],
      }),
    });
  }

  get options() {
    return this.questionForm.get('options') as FormArray;
  }

  get metaPlaceholder(): string {
    return this.questionForm.get('type')?.value === 'slider'
      ? '{ "min": 0, "max": 100, "minLabel": "تاریکی", "maxLabel": "نور" }'
      : 'به فرم Json وارد کنید';
  }

  addOption() {
    this.options.push(this.fb.control('', Validators.required));
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  loadQuestion(id: string) {
    this.loading.set(true);
    this.error.set(null);
    this.questionService
      .getById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (question: Question) => {
          this.questionForm.patchValue({
            title: question.title || '',
            prompt: question.prompt,
            type: question.type,
            meta: question.meta || '',
            groupId: question.groupId || null,
            exampleAnswer: question.exampleAnswer || '',
          });

          // Set slider meta if type is slider
          if (question.type === 'slider' && question.meta) {
            this.questionForm.setControl(
              'sliderMetaForm',
              this.fb.group({
                min: [question.meta.min || null, Validators.required],
                max: [question.meta.max || null, Validators.required],
                minLabel: [question.meta.minLabel || ''],
                maxLabel: [question.meta.maxLabel || ''],
              })
            );
          }

          // ✅ Set options for multiple/single choice
          if (
            ['multiple_choice', 'single_choice'].includes(question.type) &&
            question.options
          ) {
            this.questionForm.setControl(
              'options',
              this.fb.array(
                question.options.map((opt) =>
                  this.fb.control(opt, Validators.required)
                )
              )
            );
          }

          // Set tags
          const tagsControl = this.questionForm.get('tags');
          if (tagsControl && question.tags) {
            tagsControl.setValue(question.tags.map((tag) => tag.id));
          }
        },
        error: (err: any) => {
          console.error('Error loading question:', err);
          this.error.set('خطا در بارگذاری تمرین. لطفاً دوباره تلاش کنید.');
        },
      });
  }

  loadQuestionGroups(afterDiag: boolean = false) {
    this.loading.set(true);
    this.error.set(null);
    if (afterDiag) {
      this.snackBar.open('گروه با موفقیت ذخیره شد.', 'بستن', {
        duration: 3000, // auto close in 3 seconds
        horizontalPosition: 'center',
        verticalPosition: 'bottom', // or 'top'
      });
    }
    this.questionGroupService
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (groups) => (this.questionGroups = groups),
        error: (err) => this.error.set(`Error loading groups: ${err}`),
      });
  }

  loadTags() {
    this.loading.set(true);
    this.error.set(null);
    this.questionTagsService
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (tags) => (this.tags = tags),
        error: (err) => this.error.set(`Error loading tags: ${err}`),
      });
  }

  // EVENTS

  // onSearchInput(event: Event) {
  //   const target = event.target as HTMLInputElement;
  //   this.searchTag.set(target.value);
  // }

  onSubmit() {
    if (this.questionForm.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    const formValue = this.questionForm.value;
    let parsedMeta: any = null;

    if (formValue.type === 'slider') {
      parsedMeta = this.questionForm.get('sliderMetaForm')?.value;
    } else if (formValue.meta) {
      try {
        parsedMeta = JSON.parse(formValue.meta);
      } catch (e) {
        alert('تنظیمات اضافی وارد شده JSON معتبری نیست.');
        return;
      }
    }

    const data = {
      ...formValue,
      meta: parsedMeta,
    };

    const { tags, sliderMetaForm, ...questionData } = data;

    if (this.isEditMode) {
      // TODO: Call update API
      this.questionService
        .update(this.questionId!, data)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: (updatedQuestion) => {
            this.questionTagAssociationService
              .deleteByQuestionId(this.questionId!)
              .subscribe({
                next: () => {
                  const tagRequests = tags.map((tagId: string) =>
                    this.questionTagAssociationService.create({
                      questionId: this.questionId!,
                      tagId,
                    })
                  );
                  forkJoin(tagRequests).subscribe({
                    next: () => {
                      this.snackBar.open('سوال با موفقیت ذخیره شد', 'بستن', {
                        duration: 3000, // auto close in 3 seconds
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom', // or 'top'
                      });
                      this.router.navigate(['/admin/questions']);
                    },
                    error: (err) =>
                      this.error.set(`Error updating tags: ${err}`),
                  });
                },
                error: (err) => this.error.set(`Error deleting tags: ${err}`),
              });
          },
          error: (err) => this.error.set(`Error updating question: ${err}`),
        });
    } else {
      this.questionService
        .create(data)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: (createdQuestion) => {
            const questionId = createdQuestion.id;

            const tagRequests = tags.map((tagId: string) =>
              this.questionTagAssociationService.create({
                questionId,
                tagId,
              })
            );

            forkJoin(tagRequests).subscribe({
              next: () => {
                this.snackBar.open('سوال با موفقیت ذخیره شد', 'بستن', {
                  duration: 3000, // auto close in 3 seconds
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom', // or 'top'
                });
                this.router.navigate(['/admin/questions']);
              },
              error: (err: any) => {
                this.error.set(`Error creating tags: ${err}`);
              },
            });
          },
          error: (err) => {
            this.error.set(`Error creating question: ${err}`);
          },
        });
    }
  }
}
