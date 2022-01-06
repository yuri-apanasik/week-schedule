import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'wsch-week-comment-dialog',
  templateUrl: './week-comment-dialog.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekCommentDialogComponent {
  value: string = '';

  constructor(
    private readonly dialogRef: MatDialogRef<WeekCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: string,
  ) {
    this.value = data ?? '';
  }

  onConfirm(): void {
    this.dialogRef.close(this.value);
  }
}
