import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule, Router } from '@angular/router';
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
    RouterModule,
  ],
  template: `
    <mat-card class="bg-white !bg-white shadow-lg w-full min-h-[80vh]  p-6">
      <button
        mat-raised-button
        class="mb-2 max-w-[150px]"
        color="primary"
        (click)="onCreate()"
      >
        تمرین جدید
      </button>

      @if (questions && questions.length > 0) {
      <table mat-table [dataSource]="questions" class="mat-elevation-z8">
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>عنوان تمرین</th>
          <td mat-cell *matCellDef="let question">{{ question.title }}</td>
        </ng-container>
        <ng-container matColumnDef="prompt">
          <th mat-header-cell *matHeaderCellDef>متن تمرین</th>
          <td mat-cell *matCellDef="let question">{{ question.prompt }}</td>
        </ng-container>

        <ng-container matColumnDef="groupName">
          <th mat-header-cell *matHeaderCellDef>گروه تمرین</th>
          <td mat-cell *matCellDef="let question">{{ question.groupName }}</td>
        </ng-container>

        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef>نوع پاسخ</th>
          <td mat-cell *matCellDef="let question">{{ question.type }}</td>
        </ng-container>

        <ng-container matColumnDef="tags">
          <th mat-header-cell *matHeaderCellDef>برچسب ها</th>
          <td mat-cell *matCellDef="let question">
            <mat-chip-set aria-label="Fish selection">
              @for (tag of question.tags; track tag.id){
              <mat-chip color="warn">{{ tag.name }}</mat-chip>
              }
            </mat-chip-set>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>عملیات</th>
          <td mat-cell *matCellDef="let question">
            <button
              mat-icon-button
              color="primary"
              (click)="onEdit(question.id)"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              mat-icon-button
              color="warn"
              (click)="onDelete(question.id)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>
      </table>
      } @else {
      <p>
        هیچ تمرینی وجود ندارد. برای ایجاد یک تمرین جدید، دکمه تمرین جدید را فشار
        دهید.
      </p>
      }
    </mat-card>
  `,
})
export class QuestionsListComponent implements OnInit {
  private router = inject(Router);

  questions: Question[] = []; // TODO: Populate from backend
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
    });
  }

  // Event Handlers
  onCreate() {
    this.router.navigate(['/admin/questions/create']);
  }

  onEdit(id: string) {
    this.router.navigate(['/admin/questions', id, 'edit']);
  }

  onDelete(id: string) {
    // TODO: Call delete API
  }
}
