import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { NotebookComponent } from './views/notebook/notebook.component';
import { LayoutComponent } from './views/layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { viewRoutes } from './views/views.routes';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: viewRoutes,
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
