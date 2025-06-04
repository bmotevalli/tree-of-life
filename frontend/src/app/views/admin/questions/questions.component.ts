import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-question-form',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class QuestionsComponent {
  data: any = {};

  onChange(event: any) {
    this.data = event.data;
  }

  submit() {
    console.log('Submitting:', this.data);
    // Here you can call your API service to create the question
  }
}
