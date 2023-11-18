import { Route } from '@angular/router';
import { ShellComponent } from './shell/shell.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'overview',
        loadChildren: () =>
          import('./pages/overview/overview-page.routes').then(
            (m) => m.OVERVIEW_PAGE_ROUTES
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('./pages/chart/chart-page.routes').then(
            (m) => m.CHART_PAGE_ROUTES
          ),
      },
    ],
  },
];
