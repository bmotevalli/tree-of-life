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
import { UserTimetable } from '../../../interfaces/user-question.interface';
import { parseLocalDate } from '../../../utils/utils';
import { ConfirmDialogComponent } from '../../../core/shared/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-timetables-list',
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
        برنامه جدید
      </button>

      @if (timetables && timetables.length > 0) {
      <table mat-table [dataSource]="timetables" class="mat-elevation-z8">
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>عنوان برنامه</th>
          <td mat-cell *matCellDef="let timetable">{{ timetable.title }}</td>
        </ng-container>
        <ng-container matColumnDef="startDate">
          <th mat-header-cell *matHeaderCellDef>تاریخ شروع</th>
          <td mat-cell *matCellDef="let timetable">
            {{
              parseLocalDate(timetable.startDate) | date : 'EEE, d MMMM, yyyy'
            }}
          </td>
        </ng-container>

        <ng-container matColumnDef="endDate">
          <th mat-header-cell *matHeaderCellDef>تاریخ پایان</th>
          <td mat-cell *matCellDef="let timetable">
            {{ parseLocalDate(timetable.endDate) | date : 'EEE, d MMMM, yyyy' }}
          </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>وضعیت</th>
          <td mat-cell *matCellDef="let timetable">
            {{ getStatus(timetable) }}
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>عملیات</th>
          <td mat-cell *matCellDef="let timetable">
            <button
              mat-icon-button
              color="primary"
              (click)="onEdit(timetable.id)"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              mat-icon-button
              color="warn"
              (click)="onDelete(timetable.id)"
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
        هیچ برنامه تمرینی وجود ندارد. برای ایجاد یک برنامه جدید، دکمه برنامه
        جدید را فشار دهید.
      </p>
      }
    </mat-card>
  `,
})
export class PlanningListComponent implements OnInit {
  private router = inject(Router);

  //   startDate: Date;
  // endDate: Date;
  // notes?: string;
  // title?: string;
  // isSubmitted?: boolean; // Indicates if the timetable is currently submitted
  // timetables?: any[];

  parseLocalDate = parseLocalDate;

  timetables: UserTimetable[] = []; // TODO: Populate from backend
  columns: string[] = ['title', 'startDate', 'endDate', 'status', 'actions'];
  timetableService: CrudBaseService<UserTimetable>;

  constructor(
    private crudFactory: CrudServiceFactory,
    private dialog: MatDialog
  ) {
    this.timetableService =
      this.crudFactory.create<UserTimetable>('user-timetables');
  }

  ngOnInit() {
    this.loadTimetables();
  }

  getStatus(timetable: UserTimetable): string {
    const now = new Date();
    const startDate = parseLocalDate(timetable.startDate);
    const endDate = parseLocalDate(timetable.endDate);

    if (!timetable.isSubmitted) {
      return 'ثبت نشده، در حال تنظیم';
    } else if (startDate > now) {
      return 'ثبت شده، هنوز آغاز نشده';
    } else if (startDate <= now && endDate >= now) {
      return 'در حال تمرین';
    } else if (endDate < now) {
      return 'پایان یافته';
    } else {
      return 'وضعیت نامشخص';
    }
  }

  // API Calls
  loadTimetables() {
    this.timetableService.getAll(100).subscribe((timetables) => {
      this.timetables = timetables;
    });
  }

  // Event Handlers
  onCreate() {
    this.router.navigate(['/notebook/planning/create']);
  }

  onEdit(id: string) {
    this.router.navigate(['/notebook/planning', id, 'edit']);
  }

  onDelete(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'آیا مطمئن هستید که می‌خواهید این برنامه را حذف کنید؟' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.timetableService.delete(id).subscribe({
          next: () => {
            console.log('Timetable deleted successfully');
            window.location.reload(); // or navigate away instead
          },
          error: (err) => {
            console.error('Error deleting timetable:', err);
          },
        });
      }
    });
  }
}
