import { Route } from '@angular/router';
import { ChartComponent } from './chart-page';

export const CHART_PAGE_ROUTES: Route[] = [
  {
    path: '',
    component: ChartComponent,
    resolve: {},
  },
];
