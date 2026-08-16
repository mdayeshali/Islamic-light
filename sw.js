/* =======================================================
   🌙 Islamic Light - Service Worker (sw.js)
========================================================= */

const CACHE_NAME = 'islamic-light-v2'; // ১. ছোট হাতের const নিশ্চিত করা হলো

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Event
self.addEventListener('install', (event) => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event (পুরানো ক্যাশ মুছে ফেলা)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event (Network-First: অনলাইনে থাকলে লেটেস্ট ডাটা দেখাবে, অফলাইনে ক্যাশ থেকে লোড করবে)
self.addEventListener('fetch', (event) => {
  // শুধুমাত্র GET রিকোয়েস্ট ক্যাশ হ্যান্ডেল করবে
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => {
        // ইন্টারনেট না থাকলে ক্যাশ করা ফাইল রিটার্ন করবে
        return caches.match(event.request);
      })
  );
});
