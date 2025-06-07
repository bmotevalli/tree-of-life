import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../../interfaces/question.interface';

@Component({
  selector: 'app-single-entry-question',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-4">
      @if (question()?.title) {
      <label class="block font-medium mb-1">
        {{ question()?.title }}
      </label>
      }
      <div class="flex items-center gap-2">
        <span class="whitespace-nowrap"> {{ question()?.prompt }}: </span>

        <!-- Number Answer -->
        @if (question()?.type === 'number') {
        <input
          type="number"
          [value]="numberAnswer() ?? ''"
          (input)="onNumberAnswerChange($event)"
          class="border border-gray-300 rounded px-3 py-2 w-full md:w-auto"
          placeholder="عدد خود را وارد کنید"
        />
        }

        <!-- Yes/No Answer -->
        @if (question()?.type === 'yes_no') {
        <select
          [value]="yesNoAnswer() !== null ? yesNoAnswer() : ''"
          (change)="onYesNoAnswerChange($event)"
          class="border border-gray-300 rounded px-3 py-2 w-full md:w-auto"
        >
          <option [value]="''" disabled selected>انتخاب کنید</option>
          <option [value]="'true'">بله</option>
          <option [value]="'false'">خیر</option>
        </select>
        }

        <!-- Tick Answer -->
        @if (question()?.type === 'tick') {
        <input
          type="checkbox"
          [checked]="tickAnswer()"
          (change)="onTickAnswerChange($event)"
          class="accent-purple-500"
        />
        }
      </div>
    </div>
  `,
})
export class AnswerSingleEntryQuestionComponent {
  readonly question = input<Question | null>(null);
  readonly answerChanged = output<any>();

  // Signals for answers
  private _numberAnswer = signal<number | null>(null);
  readonly numberAnswer = this._numberAnswer.asReadonly();

  private _yesNoAnswer = signal<boolean | null>(null);
  readonly yesNoAnswer = this._yesNoAnswer.asReadonly();

  private _tickAnswer = signal<boolean>(false);
  readonly tickAnswer = this._tickAnswer.asReadonly();

  // Handlers
  onNumberAnswerChange(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this._numberAnswer.set(value);
    this.answerChanged.emit(value);
  }

  onYesNoAnswerChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    const boolValue =
      value === 'true' ? true : value === 'false' ? false : null;
    this._yesNoAnswer.set(boolValue);
    this.answerChanged.emit(boolValue);
  }

  onTickAnswerChange(event: Event) {
    const value = (event.target as HTMLInputElement).checked;
    this._tickAnswer.set(value);
    this.answerChanged.emit(value);
  }
}
