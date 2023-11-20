import { Route } from '@angular/router';
import { LoadingComponent } from '../features/loading-page';

export const LOADING_PAGE_ROUTES: Route[] = [
  {
    path: '',
    component: LoadingComponent,
    resolve: {},
  },
];
