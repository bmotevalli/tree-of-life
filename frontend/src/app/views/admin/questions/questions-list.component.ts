import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { QuestionService } from '../../../services/question.service';
import { Question } from '../../../interfaces/question.interface';

@Component({
  selector: 'app-questions-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  template: `
    <button mat-raised-button class="mb-2" color="primary" (click)="onCreate()">
      تمرین جدید
    </button>

    @if (questions && questions.length > 0) {
    <table mat-table [dataSource]="questions" class="mat-elevation-z8">
      <ng-container matColumnDef="prompt">
        <th mat-header-cell *matHeaderCellDef>متن تمرین</th>
        <td mat-cell *matCellDef="let question">{{ question.prompt }}</td>
      </ng-container>

      <ng-container matColumnDef="type">
        <th mat-header-cell *matHeaderCellDef>نوع پاسخ</th>
        <td mat-cell *matCellDef="let question">{{ question.type }}</td>
      </ng-container>

      <ng-container matColumnDef="tags">
        <th mat-header-cell *matHeaderCellDef>کلید واژه ها</th>
        <td mat-cell *matCellDef="let question">{{ question.tags }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>عملیات</th>
        <td mat-cell *matCellDef="let question">
          <button mat-icon-button color="primary" (click)="onEdit(question.id)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="onDelete(question.id)">
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
  `,
})
export class QuestionsListComponent implements OnInit {
  private router = inject(Router);

  questions: Question[] = []; // TODO: Populate from backend
  columns: string[] = ['prompt', 'type', 'tags', 'actions'];
  questionService = inject(QuestionService);

  ngOnInit() {
    this.loadQuestions();
  }

  // API Calls
  loadQuestions() {
    this.questionService.getQuestions().subscribe((questions) => {
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
