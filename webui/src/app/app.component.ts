import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DCS Web UI';

  constructor(httpClient: HttpClient) {
    httpClient.get('/api').subscribe((d: any) => console.log(d));
  }
}
