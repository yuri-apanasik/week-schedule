import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeekComponent } from './week.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LongPressModule } from '../long-press/long-press.module';
import { WeekCommentDialogComponent } from './week-comment-dialog/week-comment-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    WeekComponent,
    WeekCommentDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LongPressModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [
    WeekComponent,
  ],
})
export class WeekModule { }
