import { Route } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { LOADING_PAGE_ROUTES } from './pages/loading/loading-page.routes';

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
        path: 'chart',
        loadChildren: () =>
          import('./pages/chart/chart-page.routes').then(
            (m) => m.CHART_PAGE_ROUTES
          ),
      },
    ],
  },
  {
    path: 'loading',
    loadChildren: () => LOADING_PAGE_ROUTES,
  },
];
