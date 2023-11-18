import { Route } from '@angular/router';
import { OverviewComponent } from './overview.component';
import { inject } from '@angular/core';
import { EMPTY, catchError, tap } from 'rxjs';

export const OVERVIEW_PAGE_ROUTES: Route[] = [
  {
    path: '',
    component: OverviewComponent,
    resolve: {},
    // providers: [Service, PageStore],
  },
];
