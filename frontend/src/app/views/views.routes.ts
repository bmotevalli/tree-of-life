import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NotebookComponent } from './notebook/notebook.component';
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
