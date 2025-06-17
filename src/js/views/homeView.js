import { HomeModel } from '../models/homeModel.js';
import { HomePresenter } from '../presenters/homePresenter.js';
import { initStoryListMap } from '../utils/mapUtils.js';
import { formatDate } from '../utils/helpers.js';
import { getAllStories, deleteStory, saveStory, isStorySaved } from '../db.js';

export class HomeView {
  constructor() {
    this.model = new HomeModel();
    this.presenter = new HomePresenter(this.model, this);
  }

  showLoading() {
    const mainContent = document.getElementById('maincontent');
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Memuat cerita...</p>
        </div>
      `;
    }
  }

  showError(message) {
    alert(message);
  }

  showSuccess(message) {
    alert(message);
  }

  redirectToHome() {
    location.hash = '#/';
  }

  async renderStories(stories) {
    const mainContent = document.getElementById('maincontent');
    if (!mainContent) return;

    mainContent.innerHTML = `
      <div class="stories-container home-content">
        <div class="stories-header">
          <h2>Daftar Cerita</h2>
          <div class="user-actions">
            ${localStorage.getItem('token') 
              ? `<button id="addBtn" class="btn-primary">
                  <i class="fas fa-plus"></i> Tambah Cerita
                </button>
                <button id="logoutBtn" class="btn-secondary">
                  <i class="fas fa-sign-out-alt"></i> Logout
                </button>`
              : `<button onclick="location.hash='#/login'" class="btn-primary">
                  <i class="fas fa-sign-in-alt"></i> Login
                </button>`
            }
            <button id="showOfflineBtn" class="btn-secondary">
              <i class="fas fa-database"></i> Cerita Offline
            </button>
          </div>
        </div>
        <div class="story-list">
          ${stories.length === 0 
            ? '<p class="no-stories">Belum ada cerita yang ditambahkan.</p>'
            : stories.map(story => `
                <div class="story-card" data-id="${story.id}">
                  <div class="story-image" onclick="location.hash='#/story/${story.id}'">
                    <img src="${story.photoUrl}" alt="${story.name}" loading="lazy">
                  </div>
                  <div class="story-content">
                    <h3>${story.name}</h3>
                    <p>${story.description}</p>
                    <div class="story-meta">
                      <span><i class="fas fa-calendar"></i> ${formatDate(story.createdAt)}</span>
                    </div>
                    <button class="offline-toggle-btn btn-secondary" data-id="${story.id}">
                      <i class="fas fa-download"></i> Simpan Offline
                    </button>
                  </div>
                </div>
              `).join('')
          }
        </div>
        <div id="storyMap" class="story-map"></div>
        <div id="offlineStoriesSection" style="margin-top:2rem;"></div>
      </div>
    `;

    // Initialize map after stories are rendered
    if (stories.length > 0) {
      initStoryListMap('storyMap', stories);
    }

    // Event listener untuk tombol tambah dan logout
    const addBtn = document.getElementById('addBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        location.hash = '#/add';
      });
    }
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (this.presenter && typeof this.presenter.logout === 'function') {
          this.presenter.logout();
        }
      });
    }

    // Event listener untuk tombol Cerita Offline
    const showOfflineBtn = document.getElementById('showOfflineBtn');
    if (showOfflineBtn) {
      showOfflineBtn.addEventListener('click', () => {
        location.hash = '#/offline';
      });
    }

    // Tambahkan event listener dan update tombol offline pada setiap card
    const storyCards = mainContent.querySelectorAll('.story-card');
    for (const card of storyCards) {
      const storyId = card.getAttribute('data-id');
      const toggleBtn = card.querySelector('.offline-toggle-btn');
      if (!toggleBtn) continue;
      // Cek status offline dan update UI tombol
      isStorySaved(storyId).then(isSaved => {
        if (isSaved) {
          toggleBtn.innerHTML = '<i class="fas fa-trash"></i> Hapus dari Offline';
          toggleBtn.classList.add('saved');
        } else {
          toggleBtn.innerHTML = '<i class="fas fa-download"></i> Simpan Offline';
          toggleBtn.classList.remove('saved');
        }
      });
      // Event handler toggle
      toggleBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const isSaved = await isStorySaved(storyId);
        if (isSaved) {
          await deleteStory(storyId);
          toggleBtn.innerHTML = '<i class="fas fa-download"></i> Simpan Offline';
          toggleBtn.classList.remove('saved');
        } else {
          const story = stories.find(s => s.id == storyId);
          await saveStory(story);
          toggleBtn.innerHTML = '<i class="fas fa-trash"></i> Hapus dari Offline';
          toggleBtn.classList.add('saved');
        }
      });
    }
  }

  showHomeView() {
    this.showLoading();
    this.presenter.loadStories();
  }

  showOfflineStoryDetail(story) {
    console.log('showOfflineStoryDetail dipanggil untuk:', story);
    // Buat modal sederhana
    let modal = document.getElementById('offlineDetailModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'offlineDetailModal';
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100vw';
      modal.style.height = '100vh';
      modal.style.background = 'rgba(0,0,0,0.5)';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.zIndex = '9999';
      document.body.appendChild(modal);
    }
    modal.innerHTML = `
      <div style="background:#fff;max-width:400px;width:90vw;padding:2rem;border-radius:12px;position:relative;box-shadow:0 4px 24px rgba(0,0,0,0.2);">
        <button id="closeOfflineDetailModal" style="position:absolute;top:1rem;right:1rem;font-size:1.2rem;background:none;border:none;cursor:pointer;">&times;</button>
        <h2>${story.name}</h2>
        <img src="${story.photoUrl}" alt="${story.name}" style="width:100%;border-radius:8px;margin-bottom:1rem;"/>
        <p>${story.description}</p>
        <div style="color:#888;font-size:0.95rem;margin-top:1rem;">
          <i class="fas fa-calendar"></i> ${story.createdAt ? formatDate(story.createdAt) : ''}
        </div>
      </div>
    `;
    modal.style.display = 'flex';
    document.getElementById('closeOfflineDetailModal').onclick = () => {
      modal.style.display = 'none';
    };
    // Tutup modal jika klik di luar konten
    modal.onclick = (e) => {
      if (e.target === modal) modal.style.display = 'none';
    };
  }
}