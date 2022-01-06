import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';

import 'hammerjs';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { YearModule } from './year/year.module';
import { DATA_PROVIDER } from './data-provider/data-provider';
import { HerokuDataProvider } from './data-provider/heroku.data-provider';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageDataProvider } from './data-provider/local-storage.data-provider';
import { environment } from '../environments/environment';
import { SCROLL_PROVIDER } from './scroll-provider';
import { Subject } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';

export class MyHammerConfig extends HammerGestureConfig  {
  override overrides = {
    'swipe': { direction: Hammer.DIRECTION_HORIZONTAL },
    'pinch': { enable: false },
    'rotate': { enable: false },
  };
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HammerModule,
    HttpClientModule,
    MatDialogModule,
    YearModule,
  ],
  providers: [
    {
      provide: DATA_PROVIDER,
      useClass: environment.production ? HerokuDataProvider : LocalStorageDataProvider,
    },
    {
      provide: SCROLL_PROVIDER,
      useValue: new Subject<Date>(),
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
