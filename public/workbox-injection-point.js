// This file will be imported by the generated service worker
self.addEventListener('push', event => {
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: 'Notifikasi Baru',
      options: {
        body: 'Ada pesan baru untukmu!'
      }
    };
  }

  const options = {
    body: data.options?.body || 'Ada pesan baru untukmu!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Notifikasi Baru', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then(clientList => {
      // If there's already an open window, focus it
      for (const client of clientList) {
        if (client.url.includes('/') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});