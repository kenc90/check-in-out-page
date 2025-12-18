var cacheName = 'v15';
var cacheFiles = [
	'./fonts/Framework7Icons-Regular.eot',
    './fonts/Framework7Icons-Regular.ttf',
    './fonts/Framework7Icons-Regular.woff',
    './fonts/Framework7Icons-Regular.woff2',
    
    './fonts/MaterialIcons-Regular.eot',
    './fonts/MaterialIcons-Regular.ttf',
    './fonts/MaterialIcons-Regular.woff',
    './fonts/MaterialIcons-Regular.woff2',
    
    
    './index.html',
    './',
    './css/app.css',
    './js/app.js',
];

self.addEventListener('install', function(e) {
    e.waitUntil(
    	// Open the cache
	    caches.open(cacheName).then(function(cache) {

	    	// Add all the default files to the cache
			console.log('[ServiceWorker] Caching cacheFiles');
			return cache.addAll(cacheFiles);
	    })
	);
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
    	// Get all the cache keys (cacheName)
		caches.keys().then(function(cacheNames) {
			return Promise.all(cacheNames.map(function(thisCacheName) {

				// If a cached item is saved under a previous cacheName
				if (thisCacheName !== cacheName) {

					// Delete that cached file
					console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
					return caches.delete(thisCacheName);
				}
			}));
		})
	);
});


self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request).then((response) => {
        return caches.open(cacheName).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

