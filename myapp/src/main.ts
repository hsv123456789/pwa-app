import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
          // Register Angular's default service worker first
    navigator.serviceWorker.register('/ngsw-worker.js')
    .then(registration => {
      console.log('Angular Service Worker registered with scope:', registration.scope);
    })
    .catch(err => {
      console.error('Angular Service Worker registration failed:', err);
    });
      navigator.serviceWorker.register('/custom-sw.js')
        .then(registration => {
          console.log('Custom Service Worker registered with scope:', registration.scope);
        })
        .catch(err => {
          console.error('Service Worker registration failed:', err);
        });
    });
  }