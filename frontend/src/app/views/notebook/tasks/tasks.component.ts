import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-tasks',
  imports: [MatButtonModule, MatSliderModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent {
  importantEvents: string = '';
  forces = [
    {
      label: 'اراده من',
      light: 'خدمت، هدف روشن',
      dark: 'خودمحوری، کنترل',
      selected: '',
    },
    {
      label: 'شهود',
      light: 'بینش و درک',
      dark: 'توهم، خیال‌بافی',
      selected: '',
    },
    {
      label: 'عقل',
      light: 'تعادل، تحلیل درست',
      dark: 'قضاوت، خشک‌سری',
      selected: '',
    },
    {
      label: 'عشق',
      light: 'بخشش، مهربانی',
      dark: 'دلسوزی کنترل‌گر',
      selected: '',
    },
    {
      label: 'قدرت',
      light: 'مرز سالم، قاطعیت',
      dark: 'خشونت، قهر',
      selected: '',
    },
    {
      label: 'هویت',
      light: 'فروتنی، صداقت',
      dark: 'خودنمایی، ریا',
      selected: '',
    },
    {
      label: 'احساسات',
      light: 'پایداری، الهام',
      dark: 'هیجان‌زدگی، دمدمی',
      selected: '',
    },
    {
      label: 'بیان',
      light: 'صداقت، شفافیت',
      dark: 'فریب، کلمات مبهم',
      selected: '',
    },
    {
      label: 'ناخودآگاه',
      light: 'اتصال به درون',
      dark: 'فانتزی، خواب‌آلودگی',
      selected: '',
    },
    {
      label: 'جسم و ماده',
      light: 'حضور مقدس',
      dark: 'وابستگی، شهوت',
      selected: '',
    },
  ];

  forceValues: { [key: string]: number } = {};
  mistakenLight: string = '';
  mistakenDark: string = '';
  tomorrowChange: string = '';

  updateForceValue(label: string, value: number | null) {
    if (value !== null) {
      this.forceValues[label] = value;
    }
  }

  submitForm() {
    const data = {
      importantEvents: this.importantEvents,
      forces: this.forces.map(({ label, selected }) => ({ label, selected })),
      mistakenLight: this.mistakenLight,
      mistakenDark: this.mistakenDark,
      tomorrowChange: this.tomorrowChange,
    };
    console.log('Form Data:', data);
    // You can send `data` to your backend here
  }
}
