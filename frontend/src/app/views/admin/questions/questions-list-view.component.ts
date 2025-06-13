/*
@usage

<app-questions-list-view
        [questions]="questions"
        [displayMode]="'cards'"
        [showActions]="true"
        (questionSelected)="onQuestionSelect($event)"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
      ></app-questions-list-view>
*/

import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

import { BadgeComponent } from '../../../core/shared/badge.component';
import { Question } from '../../../interfaces/question.interface';

@Component({
  selector: 'app-questions-list-view',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatExpansionModule,
    BadgeComponent,
  ],
  template: `
    <!-- Table View -->
    <ng-template #tableView let-data>
      <table mat-table [dataSource]="data" class="mat-elevation-z4 w-full mb-4">
        @for (column of displayedColumns(); track column) { @if (column ===
        'title') {
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>عنوان تمرین</th>
          <td mat-cell *matCellDef="let q">{{ q.title }}</td>
        </ng-container>
        } @if (column === 'prompt') {
        <ng-container matColumnDef="prompt">
          <th mat-header-cell *matHeaderCellDef>متن تمرین</th>
          <td mat-cell *matCellDef="let q">{{ q.prompt }}</td>
        </ng-container>
        } @if (column === 'groupName') {
        <ng-container matColumnDef="groupName">
          <th mat-header-cell *matHeaderCellDef>گروه تمرین</th>
          <td mat-cell *matCellDef="let q">{{ q.groupName }}</td>
        </ng-container>
        } @if (column === 'type') {
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef>نوع پاسخ</th>
          <td mat-cell *matCellDef="let q">{{ q.type }}</td>
        </ng-container>
        } @if (column === 'tags') {
        <ng-container matColumnDef="tags">
          <th mat-header-cell *matHeaderCellDef>برچسب‌ها</th>
          <td mat-cell *matCellDef="let q">
            @for (tag of q.tags; track tag.id) {
            <app-badge color="blue" [label]="tag.name"></app-badge>
            }
          </td>
        </ng-container>
        } @if (column === 'actions') {
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>عملیات</th>
          <td mat-cell *matCellDef="let q">
            @if (qActions().length > 0) { @for (action of qActions(); track
            action) { @if (action === 'add') {
            <button mat-icon-button color="primary" (click)="addQ.emit(q.id)">
              <mat-icon>add</mat-icon>
            </button>
            } @if (action === 'edit') {
            <button mat-icon-button color="primary" (click)="editQ.emit(q.id)">
              <mat-icon>edit</mat-icon>
            </button>
            } @if (action === 'delete') {
            <button mat-icon-button color="warn" (click)="deleteQ.emit(q.id)">
              <mat-icon>delete</mat-icon>
            </button>
            } } }
          </td>
        </ng-container>
        } }

        <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
        <tr
          mat-row
          *matRowDef="let q; columns: displayedColumns()"
          (click)="questionSelected.emit(q)"
        ></tr>
      </table>
    </ng-template>

    <!-- Card View -->
    <ng-template #cardView let-data>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (q of data; track q.id) {
        <div
          class="border border-gray-300 p-4 flex flex-col gap-2 cursor-pointer"
          (click)="questionSelected.emit(q)"
        >
          <div>
            <h3 class="font-semibold">{{ q.title || 'بدون عنوان' }}</h3>
            <p class="text-gray-700">{{ q.prompt }}</p>
            @if (q.groupName) {
            <p class="text-sm text-gray-500">گروه: {{ q.groupName }}</p>
            }
          </div>

          <div class="flex flex-wrap gap-2">
            <span
              class="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded"
            >
              {{ q.type }}
            </span>
            @for (tag of q.tags; track tag.id) {
            <app-badge [label]="tag.name" color="green"></app-badge>
            }
          </div>

          @if (qActions().length > 0) {
          <div class="mt-2 flex gap-2">
            @for (action of qActions(); track action) { @if (action === 'add') {
            <button
              mat-stroked-button
              color="primary"
              (click)="addQ.emit(q.id); $event.stopPropagation()"
            >
              اضافه کن
            </button>
            } @if (action === 'edit') {
            <button
              mat-stroked-button
              color="primary"
              (click)="editQ.emit(q.id); $event.stopPropagation()"
            >
              ویرایش
            </button>
            } @if (action === 'delete') {
            <button
              mat-stroked-button
              color="warn"
              (click)="deleteQ.emit(q.id); $event.stopPropagation()"
            >
              حذف
            </button>
            } }
          </div>
          }
        </div>
        }
      </div>
    </ng-template>

    <!-- Compact View -->
    <ng-template #compactView let-data>
      <ul class="divide-y">
        @for (q of data; track q.id) {
        <li
          class="py-2 px-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
          (click)="questionSelected.emit(q)"
        >
          <div>
            <div class="font-medium">{{ q.title }}</div>
            @if (q.groupName) {
            <app-badge [label]="q.groupName" color="green"></app-badge>
            }
            <div class="text-sm text-gray-500">{{ q.prompt }}</div>
          </div>

          <div class="flex gap-2">
            @for (action of qActions(); track action) { @if (action === 'add') {
            <button mat-icon-button color="primary" (click)="addQ.emit(q)">
              <mat-icon>add</mat-icon>
            </button>
            } @if (action === 'edit') {
            <button mat-icon-button color="primary" (click)="editQ.emit(q)">
              <mat-icon>edit</mat-icon>
            </button>
            } @if (action === 'delete') {
            <button mat-icon-button color="warn" (click)="deleteQ.emit(q)">
              <mat-icon>delete</mat-icon>
            </button>
            } }
          </div>
        </li>
        }
      </ul>
    </ng-template>

    @if (grouping() && groupedQuestions()) {
    <mat-accordion multi>
      @for (group of groupNames(); track group) {
      <mat-expansion-panel expanded="false">
        <mat-expansion-panel-header>
          <mat-panel-title class="text-base">{{ group }}</mat-panel-title>
          <mat-panel-description class="!justify-end">
            @if (gActions().length > 0) {
            <div class="mt-2 flex gap-2">
              @for (action of qActions(); track action) { @if (action === 'add')
              {
              <button
                mat-stroked-button
                color="primary"
                (click)="addG.emit(group); $event.stopPropagation()"
              >
                اضافه کن
              </button>
              } @if (action === 'edit') {
              <button
                mat-stroked-button
                color="primary"
                (click)="editG.emit(group); $event.stopPropagation()"
              >
                ویرایش
              </button>
              } @if (action === 'delete') {
              <button
                mat-stroked-button
                color="warn"
                (click)="deleteG.emit(group); $event.stopPropagation()"
              >
                حذف
              </button>
              } }
            </div>
            }
          </mat-panel-description>
        </mat-expansion-panel-header>

        <div class="px-2 pb-4">
          @if (displayMode() === 'table') {
          <ng-container
            *ngTemplateOutlet="
              tableView;
              context: { $implicit: groupedQuestions()![group] }
            "
          ></ng-container>
          } @else if (displayMode() === 'cards') {
          <ng-container
            *ngTemplateOutlet="
              cardView;
              context: { $implicit: groupedQuestions()![group] }
            "
          ></ng-container>
          } @else if (displayMode() === 'compact') {
          <ng-container
            *ngTemplateOutlet="
              compactView;
              context: { $implicit: groupedQuestions()![group] }
            "
          ></ng-container>
          }
        </div>
      </mat-expansion-panel>
      }
    </mat-accordion>
    }

    <!-- Ungrouped Display -->
    @else { @if (displayMode() === 'table') {
    <ng-container
      *ngTemplateOutlet="tableView; context: { $implicit: questions() }"
    ></ng-container>
    } @else if (displayMode() === 'cards') {
    <ng-container
      *ngTemplateOutlet="cardView; context: { $implicit: questions() }"
    ></ng-container>
    } @else if (displayMode() === 'compact') {
    <ng-container
      *ngTemplateOutlet="compactView; context: { $implicit: questions() }"
    ></ng-container>
    } }
  `,
})
export class QuestionsListViewComponent {
  questions = input<Question[]>([]);
  displayMode = input<'table' | 'cards' | 'compact'>('table');
  qActions = input<('add' | 'edit' | 'delete')[]>([]);
  gActions = input<('add' | 'edit' | 'delete')[]>([]);

  questionSelected = output<Question>();
  editQ = output<Question | undefined>();
  deleteQ = output<Question | undefined>();
  addQ = output<Question>();

  editG = output<string | undefined>();
  deleteG = output<string | undefined>();
  addG = output<string>();

  grouping = input<boolean>(false);

  groupedQuestions = computed(() => {
    if (!this.grouping()) return null;

    const groups: Record<string, Question[]> = {};
    for (const q of this.questions()) {
      const group = q.groupName || 'بدون گروه';
      groups[group] ??= [];
      groups[group].push(q);
    }
    return groups;
  });

  groupNames = computed(() => {
    const grouped = this.groupedQuestions();
    return grouped ? Object.keys(grouped) : [];
  });

  readonly displayedColumns = computed(() => {
    const baseCols = ['title', 'prompt', 'groupName', 'type', 'tags'];
    return this.qActions().length > 0 ? [...baseCols, 'actions'] : baseCols;
  });
}
