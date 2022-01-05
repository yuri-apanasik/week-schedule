import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { addDays, firstWeekdayOfYear } from '../utils';
import { FormControl } from '@angular/forms';

const DEFAULT_YEAR = 2022;
const DEFAULT_WEEK = 1;
const WEEK_LENGTH = 7;

@Component({
  selector: 'wsch-week',
  templateUrl: './week.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekComponent implements OnChanges {
  @Input() year: number = DEFAULT_YEAR;
  @Input() week: number = DEFAULT_WEEK;
  @Input() checkedFormControl: FormControl | undefined;

  weekdays: { date: Date, monthDate: (number | null) }[] = [];

  private readonly currentDate = new Date();

  ngOnChanges(changes: SimpleChanges & SmartChanges<this>): void {
    if (changes.year || changes.week) { this.init(); }
  }

  isCurrentDate(date: Date): boolean {
    return date.getFullYear() === this.currentDate.getFullYear() && date.getMonth() === this.currentDate.getMonth() && date.getDate() === this.currentDate.getDate();
  }

  private init(): void {
    const yearFirstWeekday = firstWeekdayOfYear(this.year);
    this.weekdays = Array.from({ length: WEEK_LENGTH }, (_, i) => i + 1)
      .map(weekday => addDays(new Date(this.year, 0, 1), this.week * WEEK_LENGTH + weekday - yearFirstWeekday))
      .map(date => ({
        date,
        monthDate: date.getFullYear() === this.year ? date.getDate() : null,
      }));
  }
}
