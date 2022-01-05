import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  SimpleChanges,
} from '@angular/core';
import { addDays, firstWeekdayOfYear } from '../utils';
import { FormControl } from '@angular/forms';
import { SCROLL_PROVIDER } from '../scroll-provider';
import { filter, Observable, Subject, takeUntil, tap } from 'rxjs';

const DEFAULT_YEAR = 2022;
const DEFAULT_WEEK = 1;
const WEEK_LENGTH = 7;

@Component({
  selector: 'wsch-week',
  templateUrl: './week.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekComponent implements OnChanges, OnDestroy {
  @Input() year: number = DEFAULT_YEAR;
  @Input() week: number = DEFAULT_WEEK;
  @Input() checkedFormControl: FormControl | undefined;

  weekdays: { date: Date, monthDate: (number | null) }[] = [];

  readonly currentDate = new Date();

  private readonly destroySubject = new Subject<void>();

  constructor(
    @Inject(SCROLL_PROVIDER) @Optional() scrollDateProvider: Observable<Date>,
    hostElement: ElementRef,
  ) {
    scrollDateProvider?.pipe(
      filter(date => this.weekdays.some(t => this.dateEquals(t.date, date))),
      tap(date => {
        console.log(date);
        hostElement.nativeElement.scrollIntoView();
        // setTimeout(() => window.scrollBy(0, SCROLL_SHIFT));
      }),
      takeUntil(this.destroySubject),
    ).subscribe();
  }

  ngOnChanges(changes: SimpleChanges & SmartChanges<this>): void {
    if (changes.year || changes.week) { this.init(); }
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  dateEquals(dateA: Date, dateB: Date | undefined): boolean {
    return dateA.getFullYear() === dateB?.getFullYear() && dateA.getMonth() === dateB?.getMonth() && dateA.getDate() === dateB?.getDate();
  }

  dateMonthName(date: Date): string {
    return date.toLocaleString('en', { month: 'short' });
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
