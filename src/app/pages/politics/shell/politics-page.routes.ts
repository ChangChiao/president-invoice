import { Route } from '@angular/router';
import { PoliticsComponent } from '../features/politics-page';

export const POLITICS_PAGE_ROUTES: Route[] = [
  {
    path: '',
    component: PoliticsComponent,
    resolve: {},
  },
];
