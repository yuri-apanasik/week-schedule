import { AppData, YearData, DataProvider } from './data-provider';
import { map, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

const STORAGE_KEY = '__WEEK_SCHEDULE_DATA__';

@Injectable()
export class LocalStorageDataProvider implements DataProvider {
  loadAllData(): Observable<AppData> {
    const currentDataStr = localStorage.getItem(STORAGE_KEY);
    return of(currentDataStr?.length ? JSON.parse(currentDataStr) : {});
  }

  loadYearData(year: number): Observable<YearData> {
    return this.loadAllData().pipe(
      map(allData => allData?.[year] ?? []),
    );
  }

  saveYearData(year: number, data: YearData): Observable<void> {
    const currentData = this.loadAllData();
    // noinspection JSVoidFunctionReturnValueUsed
    return of(localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...currentData,
      ...{ [year]: data },
    })));
  }
}
