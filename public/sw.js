// Service Worker for Progressive Web App
const CACHE_NAME = 'dentalcare-v1';
const STATIC_CACHE = 'dentalcare-static-v1';
const DYNAMIC_CACHE = 'dentalcare-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
  // Add other static assets here
];

// Files to cache on first visit
const CACHE_ON_NAVIGATE = [
  '/services',
  '/about',
  '/contact',
  '/booking',
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip external requests
  if (!request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // For navigation requests, try cache first, then network
        if (request.mode === 'navigate') {
          return fetch(request)
            .then((response) => {
              // Cache successful responses
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => cache.put(request, responseClone));
              }
              return response;
            })
            .catch(() => {
              // Return offline page if available
              return caches.match('/offline.html');
            });
        }

        // For other requests, network first
        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => cache.put(request, responseClone));
            }
            return response;
          })
          .catch(() => {
            // For images, return a placeholder
            if (request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9a9a9a" text-anchor="middle" dy=".3em">Image unavailable</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
            throw error;
          });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline form submissions here
  console.log('Background sync triggered');
}

// Push notification handler
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/android-chrome-192x192.png',
    badge: '/android-chrome-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
    },
    actions: [
      {
        action: 'open',
        title: 'Open App',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise, open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Handle skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
/*
I'll explain this code in simple, everyday terms!

## What is this code for?

This code is like a **helpful assistant that lives in your web browser**. It's called a "Service Worker" and 
it helps a dental care website work better, especially when your internet connection is slow or gone.

## Think of it like a smart librarian

Imagine a librarian who:
- **Keeps copies of important books** (your favorite web pages) so you can read them even if the library closes
- **Remembers what you like to read** and keeps those books handy
- **Has backup plans** when something goes wrong

That's what this code does for a website!

## What does it actually do?

**1. Saves things for offline use**
- Like downloading Netflix shows to watch on a plane, this saves parts of the dental website so you can view them without internet

**2. Makes the website faster**
- Instead of loading everything from the internet each time, it uses saved copies 
(like keeping a pizza menu in your drawer instead of calling for one every time)

**3. Shows backup content when offline**
- If the internet is down and it can't load a picture, it shows a gray placeholder that says "Image unavailable"
- If it can't load a page, it shows a special "you're offline" page

**4. Handles notifications**
- Like your phone reminding you about a dentist appointment, this can show pop-up reminders from the dental website

**5. Saves form information**
- If you try to book an appointment but your internet cuts out, it remembers what you typed and tries to send it later when you're back online

## The Bottom Line

This code makes the dental website work more like a phone app - faster, works offline sometimes,
and sends you reminders. It's all about making the website more reliable and user-friendly!
*/
