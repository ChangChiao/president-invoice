import { Route } from '@angular/router';
import { OverviewComponent } from './overview-page';

export const OVERVIEW_PAGE_ROUTES: Route[] = [
  {
    path: '',
    component: OverviewComponent,
    resolve: {},
  },
];
