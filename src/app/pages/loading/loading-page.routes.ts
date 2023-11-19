import { Route } from '@angular/router';
import { LoadingComponent } from './loading-page';

export const LOADING_PAGE_ROUTES: Route[] = [
  {
    path: '',
    component: LoadingComponent,
    resolve: {},
  },
];
