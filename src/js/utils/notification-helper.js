export function isNotificationAvailable() {
  return 'Notification' in window;
}

export function isNotificationGranted() {
  return Notification.permission === 'granted';
}

export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error('Notification API unsupported.');
    return false;
  }

  if (isNotificationGranted()) {
    return true;
  }

  const status = await Notification.requestPermission();

  if (status === 'denied') {
    alert('Izin notifikasi ditolak.');
    return false;
  }

  if (status === 'default') {
    alert('Izin notifikasi ditutup atau diabaikan.');
    return false;
  }

  return true;
}

export async function getPushSubscription() {
  try {
    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;
    
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      console.error('No service worker registration found');
      return null;
    }
    
    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error('Error getting push subscription:', error);
    return null;
  }
}

export async function isCurrentPushSubscriptionAvailable() {
  try {
    return !!(await getPushSubscription());
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
}

export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array('BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk')
  };
}

export async function subscribe() {
  try {
    if (!(await requestNotificationPermission())) {
      return;
    }

    if (await isCurrentPushSubscriptionAvailable()) {
      alert('Sudah berlangganan push notification.');
      return;
    }

    console.log('Mulai berlangganan push notification...');

    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;
    
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      alert('Service worker tidak tersedia.');
      return;
    }

    const pushSubscription = await registration.pushManager.subscribe(generateSubscribeOptions());

    const endpoint = pushSubscription.endpoint;
    const p256dh = btoa(String.fromCharCode.apply(null, new Uint8Array(pushSubscription.getKey('p256dh'))));
    const auth = btoa(String.fromCharCode.apply(null, new Uint8Array(pushSubscription.getKey('auth'))));
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Anda harus login untuk berlangganan notifikasi.');
      await pushSubscription.unsubscribe();
      return;
    }

    const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        endpoint,
        keys: {
          p256dh,
          auth
        }
      })
    });

    const result = await response.json();
    if (!result.error) {
      alert('Langganan push notification berhasil diaktifkan.');
    } else {
      console.error('subscribe: response:', result);
      alert('Langganan push notification gagal diaktifkan.');
      await pushSubscription.unsubscribe();
    }
  } catch (error) {
    console.error('subscribe: error:', error);
    alert('Langganan push notification gagal diaktifkan. Error: ' + error.message);
  }
}

export async function unsubscribe() {
  try {
    const pushSubscription = await getPushSubscription();
    if (!pushSubscription) {
      alert('Tidak bisa memutus langganan push notification karena belum berlangganan sebelumnya.');
      return;
    }

    const { endpoint } = pushSubscription.toJSON();
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Anda harus login untuk berhenti berlangganan notifikasi.');
      return;
    }

    const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ endpoint })
    });

    const result = await response.json();
    if (!result.error) {
      const unsubscribed = await pushSubscription.unsubscribe();
      if (unsubscribed) {
        alert('Langganan push notification berhasil dinonaktifkan.');
      } else {
        alert('Langganan push notification gagal dinonaktifkan.');
      }
    } else {
      alert('Langganan push notification gagal dinonaktifkan.');
    }
  } catch (error) {
    console.error('unsubscribe: error:', error);
    alert('Langganan push notification gagal dinonaktifkan. Error: ' + error.message);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}