import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NotebookComponent } from './notebook/notebook.component';
import { AdminComponent } from './admin/admin.component';
import { QuestionsComponent } from './admin/questions/questions.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { AdminGuard } from '../core/guards/admin.guard';

export const viewRoutes: Routes = [
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/settings.component').then((m) => m.SettingsComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      {
        path: 'questions',
        canActivate: [AuthGuard, AdminGuard],
        component: QuestionsComponent,
        children: [
          {
            path: '',
            canActivate: [AuthGuard, AdminGuard],
            loadComponent: () =>
              import('./admin/questions/questions-list.component').then(
                (m) => m.QuestionsListComponent
              ),
          },
          {
            path: 'create',
            canActivate: [AuthGuard, AdminGuard],
            loadComponent: () =>
              import('./admin/questions/question-form.component').then(
                (m) => m.QuestionFormComponent
              ),
          },
          {
            path: ':id/edit',
            canActivate: [AuthGuard, AdminGuard],
            loadComponent: () =>
              import('./admin/questions/question-form.component').then(
                (m) => m.QuestionFormComponent
              ),
          },
        ],
      },
      {
        path: 'users',
        canActivate: [AuthGuard, AdminGuard],
        loadComponent: () =>
          import('./admin/users/users.component').then((m) => m.UsersComponent),
      },
    ],
  },
  {
    path: 'notebook',
    component: NotebookComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'daily-tasks',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./notebook/tasks/tasks.component').then(
            (m) => m.TasksComponent
          ),
      },
      {
        path: 'planing',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./notebook/planing/planing.component').then(
            (m) => m.PlaningComponent
          ),
      },
      {
        path: 'reporting',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./notebook/reporting/reporting.component').then(
            (m) => m.ReportingComponent
          ),
      },
      {
        path: 'history',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./notebook/history/history.component').then(
            (m) => m.HistoryComponent
          ),
      },
    ],
  },
];
