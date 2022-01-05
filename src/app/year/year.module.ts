import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YearComponent } from './year.component';
import { WeekModule } from '../week/week.module';

@NgModule({
  declarations: [
    YearComponent
  ],
    imports: [
        CommonModule,
        WeekModule,
    ],
  exports: [
    YearComponent,
  ],
})
export class YearModule { }
