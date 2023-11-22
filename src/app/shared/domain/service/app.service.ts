import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, EMPTY, catchError, forkJoin, map } from 'rxjs';
import { CountyData, TownData, VillageData } from '../models';
import { AppComponentStore } from '../store/';

@Injectable({ providedIn: 'root' })
export class AppService {
  #api = inject(HttpClient);
  #store = inject(AppComponentStore);
  #API_PATH = '/assets/data';

  countyVoteData$ = new BehaviorSubject(null);
  townVoteData$ = new BehaviorSubject(null);
  villageVoteData$ = new BehaviorSubject(null);

  getcounty() {
    return this.countyVoteData$;
  }

  getTown() {
    return this.townVoteData$;
  }

  getVillage() {
    return this.villageVoteData$;
  }

  initService() {
    return forkJoin([
      this.fetchcounty$,
      this.fetchTownData$,
      this.fetchVillageData$,
    ]);
  }

  fetchcounty$ = this.#api
    .get<CountyData>(`${this.#API_PATH}/county-data.json`)
    .pipe(
      map((res) => res),
      catchError(() => EMPTY)
    );

  fetchTownData$ = this.#api
    .get<TownData>(`${this.#API_PATH}/town-data.json`)
    .pipe(
      map((res) => res),
      catchError(() => EMPTY)
    );

  fetchVillageData$ = this.#api
    .get<VillageData>(`${this.#API_PATH}/village-data.json`)
    .pipe(
      map((res) => res),
      catchError(() => EMPTY)
    );
}
