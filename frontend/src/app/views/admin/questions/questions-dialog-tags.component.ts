import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  inject,
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

import { QuestionTag } from '../../../interfaces/question.interface';

@Component({
  selector: 'app-question-tags-dialog-button',
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
        {{ tag ? 'ویرایش کلید واژه' : 'ایجاد برچسب جدید' }}
      </h2>

      <mat-dialog-content>
        <form [formGroup]="form">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>برچسب</mat-label>
            <input matInput formControlName="name" required />
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
export class QuestionTagsDialogButtonComponent {
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private questionTagsService: CrudBaseService<QuestionTag>;

  @Input() tag?: QuestionTag;
  @Input() label: string = 'افزودن برچسب جدید';

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  dialogRef: any;
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  constructor(private crudFactory: CrudServiceFactory) {
    this.questionTagsService =
      this.crudFactory.create<QuestionTag>('question-tags');
  }

  openDialog() {
    // If editing, prepopulate the form
    if (this.tag) {
      this.form.patchValue({
        name: this.tag.name,
      });
    } else {
      this.form.reset();
    }

    this.dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '400px',
    });
  }

  save() {
    const data = this.form.value;

    if (this.tag?.id) {
      // Update
      this.questionTagsService.update(this.tag.id, data).subscribe({
        next: (updated) => {
          this.dialogRef.close(updated);
        },
        error: (err) => console.error('Error updating tag:', err),
      });
    } else {
      // Create
      this.questionTagsService.create(data).subscribe({
        next: (created) => {
          this.dialogRef.close(created);
        },
        error: (err) => console.error('Error creating tag:', err),
      });
    }
  }
}
