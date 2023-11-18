import { Route } from '@angular/router';
import { ChartComponent } from './chart.component';

export const CHART_PAGE_ROUTES: Route[] = [
  {
    path: '',
    component: ChartComponent,
    resolve: {},
  },
];
