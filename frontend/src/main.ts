import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient() // ✅ This provides HttpClient globally
  ],
});
// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));


