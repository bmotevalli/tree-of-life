import {
  Component,
  input,
  OnInit,
  signal,
  inject,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-answer-question-form',
  standalone: true,
  imports: [
    CommonModule,
    AnswerSingleEntryQuestionComponent,
    AnswerSliderQuestionComponent,
    AnswerTextQuestionComponent,
    AnswerChoiceQuestionComponent,
  ],
  template: `
    <div [class.disabled]="isDisabled()">
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
        >
          ذخیره
        </button>
        <button
          type="button"
          class="c-success px-4 py-2 rounded"
          (click)="onSubmit()"
        >
          ارسال
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

  private _answers = signal<Record<string, any>>({});
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

    const payloads: UserAnswerSave[] = [];

    for (const [questionId, answer] of Object.entries(this._answers())) {
      payloads.push({
        timetableId: timetableId,
        questionId: questionId,
        dayOfPlan: dayOfPlan,
        answer,
        isSubmitted: isSubmitted,
      });
    }

    // Call backend for each answer (or could create a bulk endpoint)
    payloads.forEach((payload) => {
      this.userAnswerService.create(payload).subscribe({
        next: (res) => {
          console.log('Answer saved:', res);
        },
        error: (err) => {
          console.error('Error saving answer:', err);
        },
      });
    });
  }

  onSave() {
    this.onStore(false);
  }

  onSubmit() {
    this.onStore(true);
  }

  loadAnswers() {
    if (this.timetableId() && this.dayOfPlan()) {
      this.userAnswerService
        .getMyAnswersByTimetableDay(this.timetableId(), this.dayOfPlan())
        .subscribe({
          next: (answers) => {
            const prefilled: Record<string, any> = {};
            answers.forEach((ans) => {
              prefilled[ans.questionId] = ans.answer;
            });
            this._answers.set(prefilled);
          },
          error: (err) => {
            console.error('Error loading answers:', err);
          },
        });
    }
  }

  getQuestionAnswer(question: Question) {
    if (question.id) {
      console.log(this._answers());
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
}
