import {
  Component,
  input,
  output,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../../interfaces/question.interface';

@Component({
  selector: 'app-choice-question',
  standalone: true,
  imports: [CommonModule],
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

      <!-- Single Choice -->
      @if (question()?.type === 'single_choice') {
      <div class="flex flex-col gap-2">
        @for (option of question()?.options || []; track option) {
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="single-choice-{{ question()?.id }}"
            [value]="option"
            [checked]="singleSelected() === option"
            (change)="onSingleSelected(option)"
            class="accent-purple-500"
          />
          <span>{{ option }}</span>
        </label>
        }
      </div>
      }

      <!-- Multiple Choice -->
      @if (question()?.type === 'multiple_choice') {
      <div class="flex flex-col gap-2">
        @for (option of question()?.options || []; track option) {
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            [checked]="selectedOptionsMap()[option] || false"
            (change)="onMultipleSelected(option, $event)"
            class="accent-purple-500"
          />
          <span>{{ option }}</span>
        </label>
        }
      </div>
      }
    </div>
  `,
})
export class AnswerChoiceQuestionComponent implements OnChanges {
  readonly question = input<Question | null>(null);
  readonly answerChanged = output<string | string[]>();

  initAnswer = input<string | string[] | null>(null);

  // For single-choice
  private _singleSelected = signal<string>('');
  readonly singleSelected = this._singleSelected.asReadonly();

  // For multiple-choice
  private _selectedOptionsMap = signal<Record<string, boolean>>({});
  readonly selectedOptionsMap = this._selectedOptionsMap.asReadonly();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initAnswer']) {
      const answer = this.initAnswer();
      if (this.question()?.type === 'single_choice') {
        if (typeof answer === 'string') {
          this._singleSelected.set(answer);
        } else {
          this._singleSelected.set('');
        }
      }
      if (this.question()?.type === 'multiple_choice') {
        const map: Record<string, boolean> = {};
        if (Array.isArray(answer)) {
          for (const opt of answer) {
            map[opt] = true;
          }
        }
        this._selectedOptionsMap.set(map);
      }
    }
  }

  onSingleSelected(option: string) {
    this._singleSelected.set(option);
    this.answerChanged.emit(option);
  }

  onMultipleSelected(option: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const currentMap = { ...this._selectedOptionsMap() };
    currentMap[option] = checked;
    this._selectedOptionsMap.set(currentMap);
    this.answerChanged.emit(this.selectedOptions);
  }

  get selectedOptions(): string[] {
    return Object.entries(this._selectedOptionsMap())
      .filter(([_, selected]) => selected)
      .map(([option]) => option);
  }
}
