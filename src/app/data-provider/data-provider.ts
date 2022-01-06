import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface WeekData {
  state: number;
  comment: string;
}

export interface YearData {
  [week: number]: WeekData;
}

export interface AppData {
  [year: number]: YearData;
}

export interface DataProvider {
  loadAllData(): Observable<AppData>;
  loadYearData(year: number): Observable<YearData>;
  saveYearData(year: number, data: YearData): Observable<void>;
}

export const DATA_PROVIDER = new InjectionToken<DataProvider>('App data provider');
