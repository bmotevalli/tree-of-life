import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-question-form',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class QuestionsComponent {}
