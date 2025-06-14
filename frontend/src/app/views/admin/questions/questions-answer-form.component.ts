import {
  Component,
  input,
  OnInit,
  signal,
  inject,
  SimpleChanges,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Question } from '../../../interfaces/question.interface';
import {
  UserAnswerRead,
  UserAnswerSave,
} from '../../../interfaces/user-answer.interface';
import { UserAnswerService } from '../../../services/user-answer.service';

import { AnswerChoiceQuestionComponent } from './questions-type-choice.component';
import { AnswerSingleEntryQuestionComponent } from './questions-type-single-entry.component';
import { AnswerSliderQuestionComponent } from './questions-type-slider.component';
import { AnswerTextQuestionComponent } from './questions-type-text.component';
import { catchError, finalize, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-answer-question-form',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    AnswerSingleEntryQuestionComponent,
    AnswerSliderQuestionComponent,
    AnswerTextQuestionComponent,
    AnswerChoiceQuestionComponent,
  ],
  template: `
    <div [class.disabled]="isDisabled() || formSubmitted()">
      @if (formSubmitted()) {
      <div
        class=" w-fit bg-green-600 text-white text-xs px-2 py-0.5 rounded-br-lg z-10"
      >
        ثبت شده
      </div>
      }
      <div class="space-y-4">
        <!-- Render ungrouped questions -->
        @for (question of ungroupedQuestions(); track question.id) {
        <div class="bg-gray-50 rounded p-4">
          <ng-container
            [ngTemplateOutlet]="renderQuestion"
            [ngTemplateOutletContext]="{ question: question }"
          ></ng-container>
        </div>
        }

        <!-- Render grouped questions -->
        @for (group of groupedQuestions(); track group.groupName) {
        <div class="bg-white shadow rounded p-4 mb-4">
          <h3 class="text-lg font-semibold mb-2">
            {{ group.groupName }}
          </h3>
          @for (question of group.questions; track question.id) {
          <div class="bg-gray-50 rounded p-4 mb-2">
            <ng-container
              [ngTemplateOutlet]="renderQuestion"
              [ngTemplateOutletContext]="{ question: question }"
            ></ng-container>
          </div>
          }
        </div>
        }
      </div>

      @if (!isDisabled()) {
      <div class="mt-6 flex gap-4">
        <button
          type="button"
          class="c-info px-4 py-2 rounded"
          (click)="onSave()"
          [disabled]="loading()"
        >
          @if (loading()) {
          <mat-spinner
            diameter="20"
            mode="indeterminate"
            color="accent"
            [strokeWidth]="3"
          ></mat-spinner>
          } @else { ذخیره }
        </button>
        <button
          type="button"
          class="c-success px-4 py-2 rounded"
          [disabled]="loading()"
          (click)="onSubmit()"
        >
          @if (loading()) {
          <mat-spinner
            diameter="20"
            mode="indeterminate"
            color="accent"
            [strokeWidth]="3"
          ></mat-spinner>
          } @else { ارسال }
        </button>
      </div>
      }

      <!-- Template for rendering a question -->
      <ng-template #renderQuestion let-question="question">
        @if (question.type === 'short_text' || question.type === 'long_text') {
        <app-text-question
          [question]="question"
          [initAnswer]="getQuestionAnswer(question)"
          (answerChanged)="onAnswerChanged(question.id, $event)"
        ></app-text-question>
        } @if (question.type === 'slider') {
        <app-slider-question
          [question]="question"
          [initAnswer]="getQuestionAnswer(question)"
          (answerChanged)="onAnswerChanged(question.id, $event)"
        ></app-slider-question>
        } @if (question.type === 'number' || question.type === 'yes_no' ||
        question.type === 'tick') {
        <app-single-entry-question
          [question]="question"
          (answerChanged)="onAnswerChanged(question.id, $event)"
          [initAnswer]="getQuestionAnswer(question)"
        ></app-single-entry-question>
        } @if (question.type === 'single_choice' || question.type ===
        'multiple_choice') {
        <app-choice-question
          [question]="question"
          (answerChanged)="onAnswerChanged(question.id, $event)"
          [initAnswer]="getQuestionAnswer(question)"
        ></app-choice-question>
        }
      </ng-template>
    </div>
  `,
})
export class AnswerQuestionFormComponent implements OnInit {
  readonly questions = input<Question[] | null>(null);
  readonly isDisabled = input<boolean>(false);

  readonly timetableId = input<string | undefined>(undefined);
  readonly dayOfPlan = input<number | undefined>(undefined);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  private _answers = signal<Record<string, any>>({});
  storedAnswers = signal<UserAnswerRead[]>([]);
  private userAnswerService = inject(UserAnswerService);

  ngOnInit() {
    // Keep ngOnInit if you want to support initial load on component mount
    this.loadAnswersIfReady();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['timetableId'] || changes['dayOfPlan']) {
      this.loadAnswersIfReady();
    }
  }

  loadAnswersIfReady() {
    if (this.timetableId() && this.dayOfPlan() !== null) {
      this.loadAnswers();
    }
  }

  onAnswerChanged(questionId: string | undefined, answer: any) {
    if (!questionId) {
      console.warn('Question ID is null, cannot update answer.');
      return;
    }
    const currentAnswers = { ...this._answers() };
    currentAnswers[questionId] = answer;
    this._answers.set(currentAnswers);
  }

  onStore(isSubmitted: boolean) {
    const timetableId = this.timetableId();
    const dayOfPlan = this.dayOfPlan();

    if (!timetableId || !dayOfPlan) {
      console.warn('TimetableId or DayOfPlan is missing.');
      return;
    }

    this.loading.set(true); // Start loading
    this.error.set(null);

    const requests = Object.entries(this._answers()).map(
      ([questionId, answer]) => {
        const payload: UserAnswerSave = {
          timetableId,
          questionId,
          dayOfPlan,
          isSubmitted,
          answer,
        };

        return this.userAnswerService.create(payload).pipe(
          catchError((err) => {
            console.error('Error saving answer:', err);
            this.error.set(`خطایی در هنگام ذخیره پاسخ رخ داد. ${err}`);
            return of(null); // Prevent complete failure of forkJoin
          })
        );
      }
    );

    forkJoin(requests)
      .pipe(
        finalize(() => {
          this.loading.set(false); // End loading once all complete
        })
      )
      .subscribe((results) => {
        console.log('All answers saved:', results);
      });
  }

  onSave() {
    this.onStore(false);
  }

  onSubmit() {
    this.onStore(true);
  }

  loadAnswers() {
    this.error.set(null);
    this.loading.set(true);
    if (this.timetableId() && this.dayOfPlan()) {
      this.userAnswerService
        .getMyAnswersByTimetableDay(this.timetableId(), this.dayOfPlan())
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: (answers) => {
            this.storedAnswers.set(answers);
            const prefilled: Record<string, any> = {};
            answers.forEach((ans) => {
              prefilled[ans.questionId] = ans.answer;
            });
            this._answers.set(prefilled);
          },
          error: (err) => {
            console.error('Error loading answers:', err);
            this.error.set(`خطایی در بارگزاری پاسخها رخ داد: ${err}`);
          },
        });
    }
  }

  getQuestionAnswer(question: Question) {
    if (question.id) {
      return this._answers()[question.id];
    }
  }

  // Grouped Questions
  groupedQuestions(): { groupName: string; questions: Question[] }[] {
    if (!this.questions) return [];
    const groups: Record<string, { groupName: string; questions: Question[] }> =
      {};
    for (const question of this.questions() || []) {
      if (question.groupName) {
        if (!groups[question.groupName]) {
          groups[question.groupName] = {
            groupName: question.groupName,
            questions: [],
          };
        }
        groups[question.groupName].questions.push(question);
      }
    }
    return Object.values(groups).sort((a, b) =>
      a.groupName.localeCompare(b.groupName)
    );
  }

  // Ungrouped Questions
  ungroupedQuestions(): Question[] {
    if (this.questions()) {
      return (this.questions() || []).filter((q) => !q.groupName);
    }
    return [];
  }

  // COMPUTES

  readonly formSubmitted = computed(() =>
    Object.values(this.storedAnswers()).some((ans) => ans.isSubmitted)
  );
}
