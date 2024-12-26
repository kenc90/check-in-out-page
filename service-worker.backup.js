var VERSION = 'v4';

var cacheFirstFiles = [
  // ADDME: Add paths and URLs to pull from cache first if it has been loaded before. Else fetch from network.
  // If loading from cache, fetch from network in the background to update the resource. Examples:
  // 'assets/img/logo.png',
  // 'assets/models/controller.gltf',
  './fonts/Framework7Icons-Regular.eot',
  './fonts/Framework7Icons-Regular.ttf',
  './fonts/Framework7Icons-Regular.woff',
  './fonts/Framework7Icons-Regular.woff2',
  
  './fonts/MaterialIcons-Regular.eot',
  './fonts/MaterialIcons-Regular.ttf',
  './fonts/MaterialIcons-Regular.woff',
  './fonts/MaterialIcons-Regular.woff2',
  
  
  'index.html',
  './',
  './css/app.css',
  './js/app.js',
];

var networkFirstFiles = [
  // ADDME: Add paths and URLs to pull from network first. Else fall back to cache if offline. Examples:
  // 'index.html',
  // 'build/build.js',
  // 'css/index.css'
];

// Below is the service worker code.

var cacheFiles = cacheFirstFiles.concat(networkFirstFiles);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION).then(cache => {
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') { return; }
  if (networkFirstFiles.indexOf(event.request.url) !== -1) {
    event.respondWith(networkElseCache(event));
  } else if (cacheFirstFiles.indexOf(event.request.url) !== -1) {
    event.respondWith(cacheElseNetwork(event));
  } else {
    event.respondWith(fetch(event.request));
  }
});

// If cache else network.
// For images and assets that are not critical to be fully up-to-date.
// developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/
// #cache-falling-back-to-network
function cacheElseNetwork (event) {
  return caches.match(event.request).then(response => {
    function fetchAndCache () {
		try{
			return fetch(event.request).then(response => {
				// Update cache.
				caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
				return response;
			  });
		}
		catch(e){
		}       
    }

    // If not exist in cache, fetch.
    if (!response) { return fetchAndCache(); }

    // If exists in cache, return from cache while updating cache in background.
    fetchAndCache();
    return response;
  });
}

// If network else cache.
// For assets we prefer to be up-to-date (i.e., JavaScript file).
function networkElseCache (event) {
  return caches.match(event.request).then(match => {
	  try{
		  if (!match) { return fetch(event.request); }
		return fetch(event.request).then(response => {
		  // Update cache.
		  caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
		  return response;
		}) || response;
	  }
	  catch(e){
	  }
    
  });
}
