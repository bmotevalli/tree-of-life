import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { Question } from '../../../interfaces/question.interface';

@Component({
  selector: 'app-slider-question',
  standalone: true,
  imports: [CommonModule, MatSliderModule],
  template: `
    <div class="mb-4">
      @if (question()?.title) {
      <label class="block font-medium mb-1">
        {{ question()?.title }}
      </label>
      }

      <!-- Desktop Layout -->
      <div class="hidden md:flex items-center gap-4">
        <span class="whitespace-nowrap">{{ question()?.prompt }}:</span>
        @if (question()?.meta?.minLabel) {
        <span class="text-gray-600 text-xs">
          {{ question()?.meta?.minLabel }}
        </span>
        }
        <mat-slider
          class="flex-grow"
          showTickMarks
          [min]="question()?.meta?.min || 0"
          [max]="question()?.meta?.max || 10"
          [step]="1"
        >
          <input
            matSliderThumb
            [value]="sliderValue()"
            (input)="onSliderChange($event)"
          />
        </mat-slider>
        @if (question()?.meta?.maxLabel) {
        <span class="text-gray-600 text-xs">
          {{ question()?.meta?.maxLabel }}
        </span>
        }
      </div>

      <!-- Mobile Layout -->
      <div class="flex flex-col md:hidden gap-2">
        <div class="flex items-center gap-2">
          <span class="whitespace-nowrap">{{ question()?.prompt }}:</span>
        </div>
        <div class="flex items-center gap-2">
          @if (question()?.meta?.minLabel) {
          <span class="text-gray-600 text-xs">
            {{ question()?.meta?.minLabel }}
          </span>
          }
          <mat-slider
            class="flex-grow"
            showTickMarks
            [min]="question()?.meta?.min || 0"
            [max]="question()?.meta?.max || 10"
            [step]="1"
          >
            <input
              matSliderThumb
              [value]="sliderValue()"
              (input)="onSliderChange($event)"
            />
          </mat-slider>
          @if (question()?.meta?.maxLabel) {
          <span class="text-gray-600 text-xs">
            {{ question()?.meta?.maxLabel }}
          </span>
          }
        </div>
      </div>
    </div>
  `,
})
export class AnswerSliderQuestionComponent {
  readonly question = input<Question | null>(null);
  readonly answerChanged = output<number>();

  private _sliderValue = signal<number>(0);
  readonly sliderValue = this._sliderValue.asReadonly();

  onSliderChange(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber || 0;
    this._sliderValue.set(value);
    this.answerChanged.emit(value);
  }
}
