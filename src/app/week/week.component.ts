import {
  ChangeDetectionStrategy, ChangeDetectorRef,
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
import { FormGroup } from '@angular/forms';
import { SCROLL_PROVIDER } from '../scroll-provider';
import { filter, Observable, Subject, Subscription, takeUntil, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { WeekCommentDialogComponent } from './week-comment-dialog/week-comment-dialog.component';
import { weekStateClass, weekStatePipeline } from '../data-provider/week-state';
import { animate, state, style, transition, trigger } from '@angular/animations';

const DEFAULT_YEAR = 2022;
const DEFAULT_WEEK = 1;
const WEEK_LENGTH = 7;

@Component({
  selector: 'wsch-week',
  templateUrl: './week.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fullWidth', [
      state('yes', style({ width: '*' })),
      state('no', style({ width: '0px' })),
      transition('no <=> yes', animate(500)),
      transition('yes <=> no', animate(500)),
    ]),
  ],
})
export class WeekComponent implements OnChanges, OnDestroy {
  @Input() year: number = DEFAULT_YEAR;
  @Input() week: number = DEFAULT_WEEK;
  @Input() formGroup: FormGroup | undefined;

  weekdays: { date: Date, monthDate: (number | null) }[] = [];
  statePipeline = weekStatePipeline();
  optionsVisible = false;

  readonly currentDate = new Date();

  private formGroupSubscription: Subscription | undefined;
  private readonly destroySubject = new Subject<void>();

  constructor(
    @Inject(SCROLL_PROVIDER) @Optional() scrollDateProvider: Observable<Date>,
    hostElement: ElementRef,
    private readonly dialog: MatDialog,
    private readonly changeDetector: ChangeDetectorRef,
  ) {
    scrollDateProvider?.pipe(
      filter(date => this.weekdays.some(t => this.dateEquals(t.date, date))),
      tap(date => hostElement.nativeElement.scrollIntoView()),
      takeUntil(this.destroySubject),
    ).subscribe();
  }

  ngOnChanges(changes: SimpleChanges & SmartChanges<this>): void {
    if (changes.year || changes.week) { this.init(); }
    if (changes.formGroup) {
      this.formGroupSubscription?.unsubscribe();
      this.formGroupSubscription = this.formGroup?.valueChanges.pipe(
        tap(() => this.changeDetector.markForCheck()),
      ).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.formGroupSubscription?.unsubscribe();
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  stateClass(state: number): string {
    return weekStateClass(state);
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

  onStateClick(): void {
    const stateIndex = this.statePipeline.indexOf(this.formGroup?.get('state')?.value ?? 0);
    this.formGroup?.get('state')?.setValue(this.statePipeline[(stateIndex + 1) % this.statePipeline.length]);
  }

  showCommentDialog(): void {
    this.hideOptions();
    const dialogRef = this.dialog.open(WeekCommentDialogComponent, {
      data: this.formGroup?.get('comment')?.value ?? '',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.formGroup?.get('comment')?.setValue(result);
      this.changeDetector.markForCheck();
    });
  }

  showOptions(): void {
    this.optionsVisible = true;
  }

  hideOptions(): void {
    this.optionsVisible = false;
  }
}
