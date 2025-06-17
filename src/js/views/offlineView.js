import { getAllStories, deleteStory } from '../db.js';
import { formatDate } from '../utils/helpers.js';

export class OfflineView {
  constructor() {
    this.presenter = null;
  }

  async render() {
    const mainContent = document.getElementById('maincontent');
    if (!mainContent) return;
    mainContent.innerHTML = '<div class="loading">Memuat cerita offline...</div>';
    const stories = await getAllStories();
    if (stories.length === 0) {
      mainContent.innerHTML = '<p class="no-stories">Tidak ada cerita offline.</p>';
      return;
    }
    mainContent.innerHTML = `
      <div class="stories-container home-content">
        <div class="stories-header">
          <h2><i class="fas fa-database"></i> Cerita Offline</h2>
        </div>
        <div class="story-list">
          ${stories.map(story => `
            <div class="story-card">
              <button class="deleteOfflineBtn icon-btn" data-id="${story.id}" title="Hapus" aria-label="Hapus cerita" tabindex="0">
                <i class="fas fa-trash"></i>
              </button>
              <div class="story-image">
                <img src="${story.photoUrl}" alt="${story.name}" loading="lazy">
              </div>
              <div class="story-content">
                <h3>${story.name}</h3>
                <p>${story.description}</p>
                <div class="story-meta">
                  <span><i class="fas fa-calendar"></i> ${story.createdAt ? formatDate(story.createdAt) : ''}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    // Event listener hapus offline
    mainContent.querySelectorAll('.deleteOfflineBtn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        await deleteStory(id);
        btn.closest('.story-card').remove();
      });
    });
    // Event listener klik story-card offline (tampilkan detail modal)
    mainContent.querySelectorAll('.story-card').forEach((card, idx) => {
      card.addEventListener('click', (e) => {
        // Jangan buka modal jika klik tombol hapus
        if (e.target.closest('.deleteOfflineBtn')) return;
        const story = stories[idx];
        this.showOfflineStoryDetail(story);
      });
    });
  }

  showOfflineStoryDetail(story) {
    // Buat modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
      <div class="modal-container">
        <button class="modal-close" aria-label="Tutup">&times;</button>
        <div class="modal-header">
          <h2>${story.name}</h2>
        </div>
        <div class="modal-body">
          <img src="${story.photoUrl}" alt="${story.name}">
          <p>${story.description}</p>
          <div class="story-meta">
            <span><i class="fas fa-calendar"></i> ${story.createdAt ? formatDate(story.createdAt) : ''}</span>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);
    // Tampilkan modal dengan animasi
    requestAnimationFrame(() => {
      modalOverlay.classList.add('active');
    });
    // Event listener untuk tombol close
    modalOverlay.querySelector('.modal-close').addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      setTimeout(() => {
        document.body.removeChild(modalOverlay);
      }, 300);
    });
    // Tutup modal jika klik di luar konten
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        setTimeout(() => {
          document.body.removeChild(modalOverlay);
        }, 300);
      }
    });
  }
} 