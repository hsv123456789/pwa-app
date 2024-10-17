import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

if ('serviceWorker' in navigator && 'PushManager' in window) {
  window.addEventListener('load', () => {
    // Register Angular's default service worker first
    navigator.serviceWorker.register('/ngsw-worker.js')
      .then(registration => {
        console.log('Angular Service Worker registered with scope:', registration.scope);
      })
      .catch(err => {
        console.error('Angular Service Worker registration failed:', err);
      });

    // Register custom service worker
    navigator.serviceWorker.register('/custom-sw.js')
      .then(registration => {
        console.log('Custom Service Worker registered with scope:', registration.scope);

        // Request notification permission after successful service worker registration
        askNotificationPermission();
        sendWelcomeNotification();
      })
      .catch(err => {
        console.error('Custom Service Worker registration failed:', err);
      });
  });
}

// Function to request notification permission from the user
function askNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications.');
    return;
  }

  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    } else if (permission === 'denied') {
      console.log('Notification permission denied.');
    } else {
      console.log('Notification permission dismissed.');
    }
  }).catch(err => {
    console.error('Error requesting notification permission:', err);
  });
}
function sendWelcomeNotification() {
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification('Welcome to Our Store!', {
        body: 'Explore our latest offers, including a 30% discount if you choose 3 products or spend over $30!',
      });
    });
  } else {
    console.log('Notification permission is not granted.');
  }
}