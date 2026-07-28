const CACHE_NAME = 'islamic-light-v2'; // ১. ভার্সন v2 করা হলো
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Event
self.addEventListener('install', (event) => {
  // নতুন সার্ভিস ওয়ার্কার যেন দ্রুত সক্রিয় হয়
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event (পুরানো ক্যাশ মুছে ফেলার জন্য)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          // বর্তমান CACHE_NAME ছাড়া বাকি সব পুরানো ক্যাশ ডিলিট করে দেবে
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // নতুন সার্ভিস ওয়ার্কার সাথে সাথে পেজে প্রভাব ফেলবে
  );
});

// Fetch Event (Offline support)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
      
