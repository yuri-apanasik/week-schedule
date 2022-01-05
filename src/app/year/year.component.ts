import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { tap } from 'rxjs';

const DEFAULT_YEAR = 2022;
const WEEK_COUNT = 53;

@Component({
  selector: 'wsch-year',
  templateUrl: './year.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearComponent {
  @Input() year: number = DEFAULT_YEAR;

  weeksFormArray = new FormArray([...Array(WEEK_COUNT)].map(() => new FormControl(false)));
  weeksSelected = 0;

  constructor() {
    this.weeksFormArray.valueChanges.pipe(
      tap(val => this.weeksSelected = val?.filter((t: boolean) => t).length ?? 0),
    ).subscribe();
  }
}
