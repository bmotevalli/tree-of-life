import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-h-separator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center my-6">
      <div class="flex-grow border-t border-gray-300"></div>
      <span class="px-4 text-gray-500 font-medium text-sm whitespace-nowrap">
        {{ title() }}
      </span>
      <div class="flex-grow border-t border-gray-300"></div>
    </div>
  `,
})
export class HorizontalSeparatorComponent {
  readonly title = input<string>('Section');
}
