import { InjectionToken } from '@angular/core';
import { Subject } from 'rxjs';

export const SCROLL_PROVIDER = new InjectionToken<Subject<Date>>('Scroll date provider');
