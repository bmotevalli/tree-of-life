import { Component, signal, computed, ViewChild, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
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
  templateUrl: './layout.component.html',
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
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  showMobileMenu = signal(false);
  sidebarOpen = signal(true);
  currentRoute = signal('');
  isMobile = signal(window.innerWidth < 768);

  private router = inject(Router);

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
      label: 'دفترچه',
      route: '/notebook',
      sideNavItems: [
        {
          icon: 'assignment',
          label: 'تمرینات امروز',
          route: '/notebook/daily-tasks',
        },
        {
          icon: 'edit_calendar',
          label: 'برنامه ریزی',
          route: '/notebook/planing',
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
    { icon: 'logout', label: 'خروج', route: '/logout' },
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
}
