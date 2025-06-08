import {
  Component,
  input,
  OnChanges,
  SimpleChanges,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Question } from '../../../interfaces/question.interface';

@Component({
  selector: 'app-text-question',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-4">
      @if (question()?.title) {
      <label class="block font-medium mb-1">
        {{ question()?.title }}
      </label>
      }
      <p class="text-gray-600 mb-2">
        {{ question()?.prompt }}
      </p>
      @if (question()?.type === 'short_text') {
      <input
        type="text"
        [value]="answer()"
        (input)="onAnswerChange($event)"
        [maxLength]="100"
        class="border border-gray-300 rounded px-3 py-2 w-full"
        [placeholder]="
          question()?.exampleAnswer || 'پاسختان را اینجا وارد کنید'
        "
      />
      } @if (question()?.type === 'long_text') {
      <textarea
        [value]="answer()"
        (input)="onAnswerChange($event)"
        [maxLength]="1000"
        rows="4"
        class="border border-gray-300 rounded px-3 py-2 w-full"
        [placeholder]="
          question()?.exampleAnswer || 'پاسختان را اینجا وارد کنید'
        "
      ></textarea>
      }
    </div>
  `,
})
export class AnswerTextQuestionComponent implements OnChanges {
  readonly question = input<Question | null>(null);
  readonly answerChanged = output<string>();

  initAnswer = input<string | null>(null);

  private _answer = signal<string>('');
  readonly answer = this._answer.asReadonly();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initAnswer']) {
      const newAnswer = this.initAnswer() || '';
      this._answer.set(newAnswer);
    }
  }

  onAnswerChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this._answer.set(value);
    this.answerChanged.emit(value);
  }
}
