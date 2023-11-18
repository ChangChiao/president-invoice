import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, EMPTY, catchError, forkJoin, map } from 'rxjs';
import { CountryData, TownData, VillageData } from '../models';
import { AppComponentStore } from '../store/app.state';

@Injectable({ providedIn: 'root' })
export class AppService {
  #api = inject(HttpClient);
  #store = inject(AppComponentStore);
  #API_PATH = '/assets/data';

  countryVoteData$ = new BehaviorSubject(null);
  townVoteData$ = new BehaviorSubject(null);
  villageVoteData$ = new BehaviorSubject(null);

  getCountry() {
    return this.countryVoteData$;
  }

  getTown() {
    return this.townVoteData$;
  }

  getVillage() {
    return this.villageVoteData$;
  }

  initService() {
    return forkJoin([
      this.fetchCountry$,
      this.fetchTownData$,
      this.fetchVillageData$,
    ]);
  }

  fetchCountry$ = this.#api
    .get<CountryData>(`${this.#API_PATH}/country-vote-data.json`)
    .pipe(
      map((res) => res),
      catchError((err: unknown) => EMPTY)
    );

  fetchTownData$ = this.#api
    .get<TownData>(`${this.#API_PATH}/town-vote-data.json`)
    .pipe(
      map((res) => res),
      catchError((err: unknown) => EMPTY)
    );

  fetchVillageData$ = this.#api
    .get<VillageData>(`${this.#API_PATH}/village-vote-data.json`)
    .pipe(
      map((res) => res),
      catchError((err: unknown) => EMPTY)
    );
}
