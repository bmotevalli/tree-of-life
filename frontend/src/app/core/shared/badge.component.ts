import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="text-xs font-semibold px-2 py-1 rounded"
      [ngClass]="badgeClass"
    >
      {{ label() }}
    </span>
  `,
})
export class BadgeComponent {
  label = input<string>('');
  color = input<'blue' | 'green' | 'gray' | 'red'>('blue');

  get badgeClass(): string {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      gray: 'bg-gray-100 text-gray-800',
      red: 'bg-red-100 text-red-800',
    };
    return colorMap[this.color()] ?? colorMap['blue'];
  }
}
