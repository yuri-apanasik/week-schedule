import { Component } from '@angular/core';

@Component({
  selector: 'wsch-root',
  templateUrl: 'app.component.html',
  styles: [':host { display: block; }'],
})
export class AppComponent {
  title = 'week-schedule';
  year = 2022;
}
