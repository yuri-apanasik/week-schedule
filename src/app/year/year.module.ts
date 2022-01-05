import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YearComponent } from './year.component';
import { WeekModule } from '../week/week.module';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    YearComponent
  ],
  imports: [
    CommonModule,
    WeekModule,
    MatIconModule,
    MatRippleModule,
  ],
  exports: [
    YearComponent,
  ],
})
export class YearModule { }
