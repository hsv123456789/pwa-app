// custom-sw.js

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    console.log(`Fetching ${url}`);
  
    // Handle "submitOrder" API call
    if (url.pathname === '/submitOrder') {
      event.respondWith(
        fetch(event.request.clone())
          .then((networkResponse) => {
            return networkResponse;
          })
          .catch((error) => {
            console.error('Error submitting order:', error);
          })
      );
    } 
    // Default fetch behavior for other requests
    else {
      event.respondWith(fetch(event.request));
    }
  });
  
  // Add push notification functionality
  self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : {};
    console.log('Push notification received: ', data);
  
    const title = data.title || 'New Notification';
    const options = {
      body: data.body || 'You have a new update!',

    };
  
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  });
  
  // Optional: Handle notification click (e.g., navigate to a specific page)
  self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Close the notification
    event.waitUntil(
      clients.openWindow('/orders') // Navigate to the orders page
    );
  });
  