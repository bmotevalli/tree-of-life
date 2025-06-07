import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../../interfaces/question.interface';

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

    <div class="mt-6 flex gap-4">
      <button
        type="button"
        class="btn-primary px-4 py-2 rounded"
        (click)="onSave()"
      >
        ذخیره
      </button>
      <button
        type="button"
        class="btn-primary px-4 py-2 rounded"
        (click)="onSubmit()"
      >
        ارسال
      </button>
    </div>

    <!-- Template for rendering a question -->
    <ng-template #renderQuestion let-question="question">
      @if (question.type === 'short_text' || question.type === 'long_text') {
      <app-text-question
        [question]="question"
        (answerChanged)="onAnswerChanged(question.id, $event)"
      ></app-text-question>
      } @if (question.type === 'slider') {
      <app-slider-question
        [question]="question"
        (answerChanged)="onAnswerChanged(question.id, $event)"
      ></app-slider-question>
      } @if (question.type === 'number' || question.type === 'yes_no' ||
      question.type === 'tick') {
      <app-single-entry-question
        [question]="question"
        (answerChanged)="onAnswerChanged(question.id, $event)"
      ></app-single-entry-question>
      } @if (question.type === 'single_choice' || question.type ===
      'multiple_choice') {
      <app-choice-question
        [question]="question"
        (answerChanged)="onAnswerChanged(question.id, $event)"
      ></app-choice-question>
      }
    </ng-template>
  `,
})
export class AnswerQuestionFormComponent {
  readonly questions = input<Question[] | null>(null);

  private _answers = signal<Record<string, any>>({});

  onAnswerChanged(questionId: string | undefined, answer: any) {
    if (!questionId) {
      console.warn('Question ID is null, cannot update answer.');
      return;
    }
    const currentAnswers = { ...this._answers() };
    currentAnswers[questionId] = answer;
    this._answers.set(currentAnswers);
  }

  onSave() {
    console.log('Saved answers:', this._answers());
    // Add any additional logic for saving (e.g. to local storage or drafts)
  }

  onSubmit() {
    console.log('Submitted answers:', this._answers());
    // Add submission logic here (e.g. send to backend)
  }

  // Grouped Questions by groupName
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
