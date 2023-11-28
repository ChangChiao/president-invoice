import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withViewTransitions } from '@angular/router';
import { EMPTY, catchError, map, tap } from 'rxjs';
import { appRoutes } from './app.routes';
import { AppService } from './shared/domain/service/app.service';
import { IconRegistryService } from './shared/domain/service/icon-registry.service';
import { AppComponentStore } from './shared/domain/store/app.state';

function initializeAppFactory(service: AppService, store: AppComponentStore) {
  // store.setLoading(true);
  return () =>
    service.initService().pipe(
      map((data) => data),
      tap(([county, town, village]) => {
        store.setMapData({ county, town, village });
        store.setVoteData({ county, town, village });
      }),
      // finalize(() => store.setLoading(false)),
      catchError(() => EMPTY)
    );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withViewTransitions()),
    provideAnimations(),
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
