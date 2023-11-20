import { Route } from '@angular/router';
import { ChartComponent } from '../features/chart-page';

export const CHART_PAGE_ROUTES: Route[] = [
  {
    path: '',
    component: ChartComponent,
    resolve: {},
  },
];
