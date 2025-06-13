import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { QuestionsListViewComponent } from './questions-list-view.component';
import { QuestionsToolbarComponent } from './questions-list-toolbar.component';
import {
  CrudBaseService,
  CrudServiceFactory,
} from '../../../services/crud-base.service';
import { Question } from '../../../interfaces/question.interface';

@Component({
  selector: 'app-questions-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
    MatIconModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    FormsModule,
    RouterModule,
    QuestionsListViewComponent,
    QuestionsToolbarComponent,
  ],
  template: `
    <mat-card
      class="bg-white !bg-white shadow-lg p-6 max-w-7xl mx-auto min-h-[80vh]"
    >
      @if (questions && questions.length > 0) {

      <app-questions-toolbar
        [allQuestions]="questions"
        (filtered)="questionsFiltered = $event"
        [(displayMode)]="displayMode"
        [(grouping)]="grouping"
      ></app-questions-toolbar>
      <button
        mat-raised-button
        class="c-primary max-w-[150px] m-2"
        (click)="onCreate()"
      >
        تمرین جدید
      </button>
      <app-questions-list-view
        [questions]="questionsFiltered"
        [displayMode]="displayMode"
        [grouping]="grouping"
        [qActions]="['edit', 'delete']"
        (editQ)="onEdit($event)"
        (deleteQ)="onDelete($event)"
      ></app-questions-list-view>
      } @else {
      <p>
        هیچ تمرینی وجود ندارد. برای ایجاد یک تمرین جدید، دکمه تمرین جدید را فشار
        دهید.
      </p>
      }
    </mat-card>
  `,
})
export class QuestionsAdminComponent implements OnInit {
  private router = inject(Router);

  displayMode: 'table' | 'cards' | 'compact' = 'table';
  grouping = false;

  questions: Question[] = [];
  questionsFiltered: Question[] = [];

  columns: string[] = [
    'title',
    'prompt',
    'groupName',
    'type',
    'tags',
    'actions',
  ];
  questionService: CrudBaseService<Question>;

  constructor(private crudFactory: CrudServiceFactory) {
    this.questionService = this.crudFactory.create<Question>('questions');
  }

  ngOnInit() {
    this.loadQuestions();
  }

  // API Calls
  loadQuestions() {
    this.questionService.getAll().subscribe((questions) => {
      this.questions = questions;
      this.questionsFiltered = questions; // set initial state
    });
  }

  // Event Handlers
  onCreate() {
    this.router.navigate(['/admin/questions/create']);
  }

  onEdit(id: string | undefined) {
    if (id) {
      this.router.navigate(['/admin/questions', id, 'edit']);
    }
  }

  onDelete(id: string | undefined) {
    // TODO: Call delete API
  }
}
