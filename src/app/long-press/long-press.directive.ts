import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

const LONG_PRESS_TIMEOUT = 500;

@Directive({
  selector: '[wschLongPress]',
})
export class LongPressDirective {
  @Output('wschLongPress') longPressed = new EventEmitter();

  timeout: ReturnType<typeof setTimeout> | undefined;

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  startPress(event: Event) {
    this.timeout = setTimeout(() => {
      this.longPressed.emit(event);
      event.preventDefault();
    }, LONG_PRESS_TIMEOUT);
  }

  @HostListener('touchend')
  @HostListener('mouseup')
  @HostListener('mouseleave')
  endPress() {
    if (this.timeout != null) {
      clearTimeout(this.timeout);
    }
  }
}
