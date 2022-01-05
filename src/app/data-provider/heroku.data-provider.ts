import { AppData, DataProvider, YearData } from './data-provider';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface YearDataRow {
  year: number;
  data: string;
}

@Injectable()
export class HerokuDataProvider implements DataProvider {
  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  loadAllData(): Observable<AppData> {
    return this.httpClient.get<YearDataRow[]>('/api/years').pipe(
      map(yearDataRows => yearDataRows.reduce((res, curr) => {
        res[curr.year] = JSON.parse(curr.data);
        return res;
      }, {} as AppData)),
    );
  }

  loadYearData(year: number): Observable<YearData> {
    return this.httpClient.get<YearDataRow[]>(`/api/years/${year}`).pipe(
      map(yearDataRows => yearDataRows?.length === 1 ? JSON.parse(yearDataRows[0].data) : []),
    );
  }

  saveYearData(year: number, data: YearData): Observable<void> {
    return this.httpClient.post<void>(`/api/years`, { year, data: JSON.stringify(data) });
  }
}
