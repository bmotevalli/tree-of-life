import {
  Component,
  EventEmitter,
  Input,
  TemplateRef,
  ViewChild,
  inject,
  output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import {
  CrudBaseService,
  CrudServiceFactory,
} from '../../../services/crud-base.service';
import { QuestionGroup } from '../../../interfaces/question.interface';

@Component({
  selector: 'app-question-group-dialog-button',
  standalone: true,
  template: `
    <button
      mat-stroked-button
      class="w-full"
      color="primary"
      (click)="openDialog()"
    >
      {{ label }}
    </button>

    <ng-template #dialogTemplate>
      <h2 mat-dialog-title>
        {{ group ? 'ویرایش گروه' : 'ایجاد گروه جدید' }}
      </h2>

      <mat-dialog-content>
        <form [formGroup]="form">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>نام گروه</mat-label>
            <input matInput formControlName="name" required />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>توضیحات (اختیاری)</mat-label>
            <textarea
              matInput
              formControlName="description"
              rows="3"
            ></textarea>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="dialogRef.close()">لغو</button>
        <button
          mat-raised-button
          color="primary"
          (click)="save()"
          [disabled]="form.invalid"
        >
          ذخیره
        </button>
      </mat-dialog-actions>
    </ng-template>
  `,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
})
export class QuestionGroupDialogButtonComponent {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private questionGroupService: CrudBaseService<QuestionGroup>;

  @Input() group?: QuestionGroup;
  @Input() label: string = 'افزودن گروه جدید';

  groupSaved = output<QuestionGroup>();

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  dialogRef: any;
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  constructor(private crudFactory: CrudServiceFactory) {
    this.questionGroupService =
      this.crudFactory.create<QuestionGroup>('question-groups');
  }
  openDialog() {
    // If editing, prepopulate the form
    if (this.group) {
      this.form.patchValue({
        name: this.group.name,
        description: this.group.description,
      });
    } else {
      this.form.reset();
    }

    this.dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '400px',
    });
  }

  save() {
    const groupData = this.form.value;

    if (this.group?.id) {
      // Update
      this.questionGroupService.update(this.group.id, groupData).subscribe({
        next: (updated) => {
          this.dialogRef.close(updated);
          this.groupSaved.emit(updated);
        },
        error: (err) => console.error('Error updating group:', err),
      });
    } else {
      // Create
      this.questionGroupService.create(groupData).subscribe({
        next: (created) => {
          this.dialogRef.close(created);
          this.groupSaved.emit(created);
        },
        error: (err) => console.error('Error creating group:', err),
      });
    }
  }
}
