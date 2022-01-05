import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { BehaviorSubject, filter, finalize, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { DATA_PROVIDER, DataProvider } from '../data-provider/data-provider';
import { SCROLL_PROVIDER } from '../scroll-provider';

const DEFAULT_YEAR = 2022;
const WEEK_COUNT = 53;
const STORAGE_KEY = '__WEEK_SCHEDULE_YEAR_COLLAPSED__';

@Component({
  selector: 'wsch-year',
  templateUrl: './year.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearComponent implements OnChanges, OnDestroy {
  @Input() year: number = DEFAULT_YEAR;

  weeksFormArray = new FormArray([...Array(WEEK_COUNT)].map(() => new FormControl(false)));
  weeksSelected = 0;

  collapsed = false;

  private readonly currentDate = new Date();

  get isCurrentYear(): boolean { return this.currentDate.getFullYear() === this.year; }

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  private get collapsedStorageKey(): string { return `${STORAGE_KEY}${this.year}`; }

  private readonly destroySubject = new Subject<void>();

  constructor(
    @Inject(DATA_PROVIDER) private readonly dataProvider: DataProvider,
    @Inject(SCROLL_PROVIDER) @Optional() private readonly scrollDateProvider: Subject<Date>,
  ) {
    this.weeksFormArray.valueChanges.pipe(
      tap((val: boolean[]) => this.weeksSelected = val?.filter((t: boolean) => t).length ?? 0),
      filter(() => !!this.dataProvider?.saveYearData),
      switchMap(val => this.dataProvider.saveYearData(this.year, val?.reduce((res, curr, index) => {
        if (curr) { res.push(index); }
        return res;
      }, [] as number[]))),
      takeUntil(this.destroySubject),
    ).subscribe();
  }

  ngOnChanges(changes: SimpleChanges & SmartChanges<this>): void {
    if (changes.year) { this.init(); }
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  private init(): void {
    this.collapsed = localStorage.getItem(this.collapsedStorageKey) === 'true';

    this.isLoadingSubject.next(true);
    this.dataProvider?.loadYearData(this.year).pipe(
      take(1),
      filter(yearData => !!yearData),
      tap(yearData => {
        this.weeksSelected = yearData.length;
        this.weeksFormArray.patchValue([...Array(WEEK_COUNT)].map((_, index) => yearData.includes(index)), { emitEvent: false });
      }),
      finalize(() => this.isLoadingSubject.next(false)),
      takeUntil(this.destroySubject),
    ).subscribe();
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
    localStorage.setItem(this.collapsedStorageKey, `${this.collapsed}`);
  }

  scrollToCurrentDay(): void {
    if (this.collapsed) { this.toggleCollapsed(); }
    this.scrollDateProvider?.next(this.currentDate);
  }
}
