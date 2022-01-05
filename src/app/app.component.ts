import { Component } from '@angular/core';

@Component({
  selector: 'wsch-root',
  templateUrl: 'app.component.html',
  styles: [':host { display: block; }'],
})
export class AppComponent {
  title = 'week-schedule';
  years = [2021, 2022];
}
