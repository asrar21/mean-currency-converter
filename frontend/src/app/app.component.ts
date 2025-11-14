import { Component,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConverterComponent } from './converter/converter.component';


@Component({
  selector: 'app-root',
  standalone: true,
 imports: [
    RouterOutlet,      // ← Fixes router-outlet error
    ConverterComponent // ← Needed to use <app-converter>
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

   message = '';

  constructor(private http: HttpClient) {}

  // ngOnInit() {
  //   this.http.get<{ text: string }>('http://localhost:3000/api/message')
  //     .subscribe(data => {
    
  //     this.message = data.text
  //   });
  // }
}
