self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  console.log('Fetching: ', requestUrl.pathname); 
  console.log(event.request.method);
  // Only handle the custom login POST requests
  if (requestUrl.pathname === '/api/user/login') {
    console.log('Handling POST /api/user/login');
    event.respondWith(
      fetchAndCache(event.request).catch(() => {
        return serveFromCache(event.request);
      })
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});

// Custom fetch and cache logic
async function fetchAndCache(request) {
  console.log('Fetching and caching: ', request.url);
  const response = await fetch(request);

  // Open the IndexedDB database
  const cacheDB = await openDatabase();

  // Cache the response in IndexedDB
  const clonedResponse = response.clone();
  const responseData = await clonedResponse.json();
  console.log('Response data: ', responseData);
  await cacheDB.put('loginResponses', responseData, request.url);
  console.log('Data cached in IndexedDB.');
  return response;
}

async function serveFromCache(request) {
  const cacheDB = await openDatabase();
  const cachedResponse = await cacheDB.get('loginResponses', request.url);

  if (cachedResponse) {
    return new Response(JSON.stringify(cachedResponse), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response('No cached response', { status: 404 });
  }
}

// Utility function to open IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('LoginCacheDB', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      console.log('Upgrading or creating the object store.');
      db.createObjectStore('loginResponses', { keyPath: 'url' });
    };

    request.onsuccess = (event) => {
      console.log('IndexedDB opened successfully.');
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event.target.error);
      reject(event.target.error);
    };
  });
}
