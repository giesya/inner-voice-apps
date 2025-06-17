import { isNotificationAvailable, isCurrentPushSubscriptionAvailable, subscribe, unsubscribe, requestNotificationPermission } from '../utils/notification-helper.js';

class PushNotificationButton extends HTMLElement {
  constructor() {
    super();
    console.log('PushNotificationButton constructor dipanggil');
    this._isSubscribed = false;
  }

  async connectedCallback() {
    console.log('PushNotificationButton connectedCallback dipanggil');
    if (!isNotificationAvailable()) {
      console.log('Notification API not available');
      this.innerHTML = '';
      return;
    }

    try {
      this._isSubscribed = await isCurrentPushSubscriptionAvailable();
      console.log('Current subscription status:', this._isSubscribed);
      this.render();
    } catch (error) {
      console.error('Error checking subscription status:', error);
      this.innerHTML = '';
    }
  }

  render() {
    console.log('Rendering push notification button');
    this.innerHTML = `
      <button class="push-notification-button" aria-label="${this._isSubscribed ? 'Unsubscribe' : 'Subscribe'} Push Notification">
        <i class="fas fa-bell"></i> ${this._isSubscribed ? 'Unsubscribe' : 'Subscribe'} Push Notification
      </button>
    `;

    const button = this.querySelector('button');
    if (button) {
      button.addEventListener('click', async () => {
        // Jika permission belum granted, minta izin dulu
        if (Notification.permission !== 'granted') {
          const granted = await requestNotificationPermission();
          if (!granted) return;
        }
        console.log('Button clicked, current status:', this._isSubscribed);
        if (this._isSubscribed) {
          await unsubscribe();
        } else {
          await subscribe();
        }
        this._isSubscribed = await isCurrentPushSubscriptionAvailable();
        this.render();
      });
    }
  }
}

customElements.define('push-notification-button', PushNotificationButton); 