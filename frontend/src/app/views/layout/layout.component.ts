import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatNavList } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { NavItem } from '../../interfaces/layout.interface';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [
    MatIconModule,
    RouterModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatNavList,
    MatSidenavModule,
    MatCardModule,
  ],
  template: `
    <!-- Wrap everything in a full-height flex column layout -->
    <div class="h-screen flex flex-col">
      <!-- Fixed height toolbar at the top -->
      <mat-toolbar color="primary">
        <button
          [disabled]="activeNavItem()?.sideNavItems?.length === 0"
          mat-icon-button
          (click)="sidebarOpen.set(!sidebarOpen())"
        >
          <mat-icon>menu</mat-icon>
        </button>

        <!-- Desktop Nav Items -->
        <div class="hidden md:flex gap-6 items-center justify-center w-full">
          @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="active-link"
            class="hover:text-yellow-500 text-md transition flex items-center gap-1"
            (click)="onNavItemClick(item)"
            mat-button
          >
            <span>{{ item.label }}</span>
          </a>
          }
        </div>

        <!-- Mobile Dropdown -->
        <div class="md:hidden relative">
          <button mat-button (click)="showMobileMenu.set(!showMobileMenu())">
            <mat-icon>arrow_drop_down</mat-icon>
            <span>صفحات</span>
          </button>
          @if (showMobileMenu()) {
          <div
            class="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-md z-50 flex flex-col"
          >
            @for (item of navItems; track item.route) {
            <a
              [routerLink]="item.route"
              class="px-4 py-2 hover:bg-gray-100 text-sm items-center gap-1 flex"
              (click)="onNavItemClick(item)"
            >
              <mat-icon>{{ item.icon }}</mat-icon>
              <span>{{ item.label }}</span>
            </a>
            }
          </div>
          }
        </div>

        <div>
          <button mat-button (click)="onLogout()">
            <mat-icon class="order-end">logout</mat-icon>
            <span>خروج</span>
          </button>
        </div>
      </mat-toolbar>

      <!-- Fill remaining height with sidenav container -->
      <mat-sidenav-container class="flex-1 min-h-0 border">
        <!-- Sidebar -->
        <mat-sidenav
          #drawer
          [mode]="isMobile() ? 'over' : 'side'"
          [opened]="
            isMobile()
              ? sidebarOpen() && !!activeNavItem()?.sideNavItems?.length
              : !!activeNavItem()?.sideNavItems?.length
          "
          class="custom-sidenav"
        >
          @if (activeNavItem()?.sideNavItems?.length) {
          <mat-nav-list class="bg-white h-full rounded-none!">
            @for (item of activeNavItem()?.sideNavItems; track item.route) {
            <a mat-list-item [routerLink]="item.route">
              <div class="flex items-center gap-1 w-full">
                <mat-icon>{{ item.icon }}</mat-icon>
                <span>{{ item.label }}</span>
              </div>
            </a>
            }
          </mat-nav-list>
          }
        </mat-sidenav>

        <!-- Main content -->
        <mat-sidenav-content class="bg-gray-100">
          <section
            [class.p-4]="!isMobile()"
            [class.p-0]="isMobile()"
            class="h-full overflow-auto"
          >
            <router-outlet></router-outlet>
          </section>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  showMobileMenu = signal(false);
  sidebarOpen = signal(true);
  currentRoute = signal('');
  isMobile = signal(window.innerWidth < 768);

  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);

  constructor() {
    // Watch for route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const nav = event as NavigationEnd;
        this.currentRoute.set(nav.urlAfterRedirects);
        this.showMobileMenu.set(false);
        this.sidebarOpen.set(false);
      });

    // Optional: track screen resize for `isMobile`
    window.addEventListener('resize', () => {
      this.isMobile.set(window.innerWidth < 768);
    });
  }

  navItems: NavItem[] = [
    {
      icon: 'book',
      label: 'دفترچه تمرینات',
      route: '/notebook',
      sideNavItems: [
        {
          icon: 'assignment',
          label: 'تمرینات فعلی',
          route: '/notebook/daily-tasks',
        },
        {
          icon: 'edit_calendar',
          label: 'برنامه ریزی',
          route: '/notebook/planning',
        },
        {
          icon: 'archive',
          label: 'تاریخچه تمرینات',
          route: '/notebook/history',
        },
        {
          icon: 'monitoring',
          label: 'شرح حال من',
          route: '/notebook/reporting',
        },
      ],
    },
    {
      icon: 'settings',
      label: 'تنظیمات',
      route: '/settings',
    },
    {
      icon: 'person',
      label: 'پروفایل',
      route: '/profile',
    },
    {
      icon: 'admin_panel_settings',
      label: 'مدیریت',
      route: '/admin',
      sideNavItems: [
        {
          icon: 'question_answer',
          label: 'تمرینات',
          route: '/admin/questions',
        },
        {
          icon: 'manage_accounts',
          label: 'مدیریت کاربران',
          route: '/admin/users',
        },
      ],
    },
    // { icon: 'logout', label: 'خروج', route: '/logout' },
  ];

  activeNavItem = computed(() =>
    this.navItems.find((item) => this.currentRoute().startsWith(item.route))
  );

  onNavItemClick(item: NavItem) {
    if (item.sideNavItems?.length) {
      const firstChildRoute = item.sideNavItems[0].route;
      this.router.navigate([firstChildRoute]);
    } else {
      this.router.navigate([item.route]);
    }
  }

  onLogout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}
