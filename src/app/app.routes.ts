import { Route } from '@angular/router';
import { LOADING_PAGE_ROUTES } from './pages/loading/shell/loading-page.routes';
import { ShellComponent } from './shell/shell.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'overview',
        loadChildren: () =>
          import('./pages/overview/shell/overview-page.routes').then(
            (m) => m.OVERVIEW_PAGE_ROUTES
          ),
      },
      {
        path: 'chart',
        loadChildren: () =>
          import('./pages/chart/shell/chart-page.routes').then(
            (m) => m.CHART_PAGE_ROUTES
          ),
      },
      {
        path: 'politics',
        loadChildren: () =>
          import('./pages/politics/shell/politics-page.routes').then(
            (m) => m.POLITICS_PAGE_ROUTES
          ),
      },
    ],
  },
  {
    path: 'loading',
    loadChildren: () => LOADING_PAGE_ROUTES,
  },
];
