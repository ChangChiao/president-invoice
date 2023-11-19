import { Route } from '@angular/router';
import { ShellComponent } from './shell/shell.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/overview/overview-page.routes').then(
            (m) => m.OVERVIEW_PAGE_ROUTES
          ),
      },
      {
        path: 'chart',
        loadChildren: () =>
          import('./pages/chart/chart-page.routes').then(
            (m) => m.CHART_PAGE_ROUTES
          ),
      },
    ],
  },
];
