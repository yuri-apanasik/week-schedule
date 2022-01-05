import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { YearModule } from './year/year.module';
import { DATA_PROVIDER } from './data-provider/data-provider';
import { HerokuDataProvider } from './data-provider/heroku.data-provider';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageDataProvider } from './data-provider/local-storage.data-provider';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    YearModule,
  ],
  providers: [
    {
      provide: DATA_PROVIDER,
      useClass: environment.production ? HerokuDataProvider : LocalStorageDataProvider,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
