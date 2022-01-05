import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { tap } from 'rxjs';

const DEFAULT_YEAR = 2022;
const WEEK_COUNT = 53;
const STORAGE_KEY = '__WEEK_SCHEDULE_DATA__';

@Component({
  selector: 'wsch-year',
  templateUrl: './year.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearComponent implements OnChanges {
  @Input() year: number = DEFAULT_YEAR;

  weeksFormArray = new FormArray([...Array(WEEK_COUNT)].map(() => new FormControl(false)));
  weeksSelected = 0;

  constructor() {
    this.weeksFormArray.valueChanges.pipe(
      tap((val: boolean[]) => {
        this.weeksSelected = val?.filter((t: boolean) => t).length ?? 0;
        this.saveData({
          [this.year]: val?.reduce((res, curr, index) => {
            if (curr) { res.push(index); }
            return res;
          }, [] as number[]),
        })
      }),
    ).subscribe();
  }

  ngOnChanges(changes: SimpleChanges & SmartChanges<this>): void {
    if (changes.year) { this.init(); }
  }

  private init(): void {
    const currentData = this.loadData();
    if (currentData[this.year]) {
      this.weeksFormArray.patchValue([...Array(WEEK_COUNT)].map((_, index) => currentData[this.year].includes(index)), { emitEvent: false });
    }
  }

  private loadData(): Record<number, number[]> {
    const currentDataStr = localStorage.getItem(STORAGE_KEY);
    return currentDataStr?.length ? JSON.parse(currentDataStr) : {};
  }

  private saveData(patchObj: Record<number, number[]>): void {
    const currentData = this.loadData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...currentData,
      ...patchObj,
    }));
  }
}
