import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Question } from '../../../interfaces/question.interface';

@Component({
  selector: 'app-questions-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatIconModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  template: `
    <div class="flex flex-wrap items-center mb-4 gap-4">
      <div class="flex items-center gap-4 flex-wrap">
        <mat-button-toggle-group
          [value]="displayMode"
          (change)="displayModeChange.emit($event.value)"
          name="viewMode"
          aria-label="View mode"
        >
          <mat-button-toggle value="table" matTooltip="نمایش جدول">
            <mat-icon>table_chart</mat-icon>
          </mat-button-toggle>
          <mat-button-toggle value="cards" matTooltip="نمایش کارت">
            <mat-icon>view_module</mat-icon>
          </mat-button-toggle>
          <mat-button-toggle value="compact" matTooltip="نمایش فشرده">
            <mat-icon>view_list</mat-icon>
          </mat-button-toggle>
        </mat-button-toggle-group>

        <mat-slide-toggle
          [checked]="grouping"
          (change)="groupingChange.emit($event.checked)"
        >
          نمایش گروهی
        </mat-slide-toggle>
      </div>
      <button
        mat-raised-button
        class="c-info text-black"
        (click)="toggleFilter.set(!toggleFilter())"
      >
        نمایش فیلتر
      </button>
    </div>
    @if (toggleFilter()) {
    <div
      class="flex flex-col md:flex-row gap-4 items-start md:items-center mb-2"
    >
      <!-- Search -->
      <mat-form-field appearance="outline" class="w-full md:max-w-xs">
        <mat-label>جستجو</mat-label>
        <input
          matInput
          [formControl]="searchCtrl"
          placeholder="عبارت مورد نظر را وارد کنید..."
        />
      </mat-form-field>

      <!-- Group Filter -->
      <mat-form-field appearance="outline" class="w-full md:max-w-xs">
        <mat-label>گروه‌ها</mat-label>
        <mat-select
          [value]="selectedGroups()"
          multiple
          [formControl]="groupCtrl"
          (selectionChange)="toggleGroup($event.value)"
        >
          @for (group of groupOptions(); track group) {
          <mat-option [value]="group">{{ group }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <!-- Tag Filter -->
      <mat-form-field appearance="outline" class="w-full md:max-w-xs">
        <mat-label>برچسب‌ها</mat-label>
        <mat-select
          [value]="selectedTags()"
          multiple
          [formControl]="tagCtrl"
          (selectionChange)="toggleTag($event.value)"
        >
          @for (tag of tagOptions(); track tag) {
          <mat-option [value]="tag">{{ tag }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </div>
    }

    <!-- Chips for selected filters -->
    <div class="flex flex-wrap gap-2 mb-4">
      @for (group of selectedGroups(); track group) {
      <mat-chip color="primary" selected (removed)="removeGroup(group)">
        {{ group }}
        <mat-icon matChipRemove>cancel</mat-icon>
      </mat-chip>
      } @for (tag of selectedTags(); track tag) {
      <mat-chip color="accent" selected (removed)="removeTag(tag)">
        {{ tag }}
        <mat-icon matChipRemove>cancel</mat-icon>
      </mat-chip>
      }
    </div>
  `,
  styles: [
    `
      ::ng-deep .mat-expansion-panel-header .mat-expansion-panel-header-title {
        font-size: 12px;

        @media (min-width: 640px) {
          font-size: 16px;
        }

        @media (min-width: 768px) {
          font-size: 18px;
        }
      }
    `,
  ],
})
export class QuestionsToolbarComponent {
  displayMode = input<'table' | 'cards' | 'compact'>('table');
  grouping = input<boolean>(false);
  allQuestions = input<Question[]>([]);

  displayModeChange = output<'table' | 'cards' | 'compact'>();
  groupingChange = output<boolean>();
  filtered = output<Question[]>();

  toggleFilter = signal<boolean>(false);

  searchCtrl = new FormControl('');
  groupCtrl = new FormControl<string[]>([]);
  tagCtrl = new FormControl<string[]>([]);

  selectedGroups = signal<string[]>([]);
  selectedTags = signal<string[]>([]);

  groupOptions = computed(() => {
    return [
      ...new Set(this.allQuestions().map((q) => q.groupName || 'بدون گروه')),
    ];
  });

  tagOptions = computed(() => {
    const tags = this.allQuestions().flatMap(
      (q) => q.tags?.map((t) => t.name) ?? []
    );
    return [...new Set(tags)];
  });

  ngOnInit() {
    this.searchCtrl.valueChanges.subscribe(() => this.filterQuestions());
  }

  toggleGroup(group: string[]) {
    this.selectedGroups.set(group);
    this.filterQuestions();
  }

  toggleTag(tag: string[]) {
    this.selectedTags.set(tag);
    this.filterQuestions();
  }

  removeGroup(group: string) {
    this.selectedGroups.set(this.selectedGroups().filter((g) => g !== group));
    this.filterQuestions();
  }

  removeTag(tag: string) {
    this.selectedTags.set(this.selectedTags().filter((t) => t !== tag));
    this.filterQuestions();
  }

  private filterQuestions() {
    const search = (this.searchCtrl.value || '').toLowerCase();
    const groups = this.selectedGroups();
    const tags = this.selectedTags();

    const filtered = this.allQuestions().filter((q) => {
      const matchesSearch =
        q.title?.toLowerCase().includes(search) ||
        q.prompt?.toLowerCase().includes(search) ||
        q.groupName?.toLowerCase().includes(search) ||
        q.type?.toLowerCase().includes(search) ||
        (q.tags?.some((t) => t.name.toLowerCase().includes(search)) ?? false);

      const normalizedGroup = q.groupName || 'بدون گروه';
      const matchesGroup =
        groups.length === 0 || groups.includes(normalizedGroup);
      const matchesTag =
        tags.length === 0 ||
        (q.tags?.some((t) => tags.includes(t.name)) ?? false);

      return matchesSearch && matchesGroup && matchesTag;
    });

    this.filtered.emit(filtered);
  }
}
