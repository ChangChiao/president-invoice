import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { IconRegistryService } from './shared/domain/service/icon-registry.service';
import { AppService } from './shared/domain/service/app.service';
import { AppComponentStore } from './shared/domain/store/app.state';
import { EMPTY, catchError, map, tap } from 'rxjs';

function initializeAppFactory(service: AppService, store: AppComponentStore) {
  // store.setLoading(true);
  return () =>
    service.initService().pipe(
      map((data) => data),
      tap(([country, town, village]) => {
        store.setMapData({ country, town, village });
        store.setVoteData({ country, town, village });
      }),
      // finalize(() => store.setLoading(false)),
      catchError(() => EMPTY)
    );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withViewTransitions()),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AppService, AppComponentStore],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (iconRegistryService: IconRegistryService) => () =>
        iconRegistryService.init(),
      deps: [IconRegistryService],
      multi: true,
    },
  ],
};
