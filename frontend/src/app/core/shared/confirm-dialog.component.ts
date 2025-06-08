import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule],
  template: `
    <h2 mat-dialog-title>تایید</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <div class="flex gap-2">
        <button
          mat-button
          class="c-info p-1 px-4 rounded "
          (click)="onCancel()"
        >
          لغو
        </button>
        <button
          mat-button
          class="c-error p-1 px-4 rounded "
          (click)="onConfirm()"
        >
          تایید
        </button>
      </div>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }
}
