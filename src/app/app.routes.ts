import { Route } from '@angular/router';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { ShellComponent } from './shell/shell.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
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
      {
        path: '404',
        component: NotFoundPageComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];
