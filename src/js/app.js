import '../style.css';
import { HomeView } from './views/homeView.js';
import { HomePresenter } from './presenters/homePresenter.js';
import { AddView } from './views/addView.js';
import { AddPresenter } from './presenters/addPresenter.js';
import { DetailView } from './views/detailView.js';
import { DetailPresenter } from './presenters/detailPresenter.js';
import { LoginView } from './views/loginView.js';
import { LoginPresenter } from './presenters/loginPresenter.js';
import { OfflineView } from './views/offlineView.js';
import './components/push-notification-button.js';

// Inisialisasi views terlebih dahulu
const homeView = new HomeView();
const addView = new AddView();
const detailView = new DetailView();
const loginView = new LoginView();
const offlineView = new OfflineView();

// Kemudian inisialisasi presenter dengan model dan view masing-masing
const homePresenter = new HomePresenter(homeView.model, homeView);
const addPresenter = new AddPresenter(addView.model, addView);
const detailPresenter = new DetailPresenter(detailView.model, detailView);
const loginPresenter = new LoginPresenter(loginView.model, loginView);

// Set presenter ke view
homeView.presenter = homePresenter;
addView.presenter = addPresenter;
detailView.presenter = detailPresenter;
loginView.presenter = loginPresenter;

let currentView = null;

// Fungsi global untuk menonaktifkan semua kamera di halaman
function stopAllCameraStreams() {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }
  });
}

// Alias global Camera agar sesuai permintaan user
window.Camera = {
  stopAllStreams: stopAllCameraStreams
};

// Event listener hashchange dengan Camera.stopAllStreams
window.addEventListener('hashchange', async () => {
  // Matikan semua kamera sebelum render halaman baru
  window.Camera.stopAllStreams();
  // Jalankan router (render halaman)
  router();
});

function router() {
  const hash = window.location.hash || '#/';
  const path = hash.slice(1);
  
  // Bersihkan current view jika ada
  if (currentView && typeof currentView.destroy === 'function') {
    console.log('Cleaning up current view:', currentView.constructor.name);
    currentView.destroy();
  }
  
  // Tampilkan loading state
  const mainContent = document.getElementById('maincontent');
  if (mainContent) {
    mainContent.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Memuat halaman...</p>
      </div>
    `;
  }
  
  // Penanganan routing
  if (path === '/') {
    currentView = homeView;
    currentView.showHomeView();
  } else if (path === '/add') {
    currentView = addView;
    currentView.render();
  } else if (path === '/login') {
    currentView = loginView;
    if (typeof currentView.showLoginView === 'function') {
      currentView.showLoginView();
    } else {
      currentView.render();
    }
  } else if (path === '/offline') {
    currentView = offlineView;
    currentView.render();
  } else if (path.startsWith('/story/')) {
    const storyId = path.split('/')[2];
    currentView = detailView;
    if (typeof currentView.showDetailView === 'function') {
      currentView.showDetailView(storyId);
    } else {
      currentView.render(storyId);
    }
  } else {
    // Handle 404
    mainContent.innerHTML = `
      <div class="error-container">
        <h2>404 - Halaman Tidak Ditemukan</h2>
        <p>Halaman yang Anda cari tidak ditemukan.</p>
        <button onclick="location.hash='#/'">Kembali ke Beranda</button>
      </div>
    `;
  }
}

// Inisialisasi aplikasi
function initApp() {
  console.log('Initializing app...');
  
  // Tambahkan transisi halaman yang mulus
  const style = document.createElement('style');
  style.textContent = `
    .page-transition {
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }
    .page-transition.active {
      opacity: 1;
    }
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 200px;
    }
    .loading-spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // Tambahkan class transisi ke main content
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.classList.add('page-transition');
    // Trigger reflow
    mainContent.offsetHeight;
    mainContent.classList.add('active');
  }

  // Dengarkan perubahan hash dan visibility
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && currentView && typeof currentView.destroy === 'function') {
      console.log('Page hidden, cleaning up current view:', currentView.constructor.name);
      currentView.destroy();
    }
  });
  
  // Jalankan route awal
  console.log('Running initial route...');
  router();

  // Add push notification button (service worker registration is handled by Vite PWA plugin)
  document.addEventListener('DOMContentLoaded', () => {
    const pushNotificationTools = document.getElementById('push-notification-tools');
    if (pushNotificationTools) {
      console.log('Menambahkan push-notification-button ke navbar');
      const pushNotificationButton = document.createElement('push-notification-button');
      pushNotificationTools.appendChild(pushNotificationButton);
    } else {
      console.error('push-notification-tools element tidak ditemukan di DOM');
    }
  });
}

export { initApp };