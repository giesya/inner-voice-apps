import { DetailModel } from '../models/detailModel.js';
import { initStoryDetailMap } from '../utils/mapUtils.js';
import { formatDate } from '../utils/helpers.js';
import { saveStory, getAllStories } from '../db.js';

export class DetailView {
  constructor() {
    this.model = new DetailModel();
    this.presenter = null;
  }

  showLoading() {
    const mainContent = document.getElementById('maincontent');
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Memuat detail cerita...</p>
        </div>
      `;
    }
  }

  showError(message) {
    alert(message);
  }

  async renderStoryDetail(story) {
    const mainContent = document.getElementById('maincontent');
    if (!mainContent) return;

    // Cek apakah cerita sudah ada di offline
    const offlineStories = await getAllStories();
    const alreadySaved = offlineStories.some(s => s.id === story.id);

    mainContent.innerHTML = `
      <div class="story-detail-container">
        <button class="back-button" onclick="location.hash='#/'">
          <i class="fas fa-arrow-left"></i> Kembali
        </button>

        <div class="story-detail-content">
          <div class="story-detail-header">
            <h2>${story.name}</h2>
            <div class="story-meta">
              <span><i class="fas fa-user"></i> ${story.name}</span>
              <span><i class="fas fa-calendar-alt"></i> ${formatDate(story.createdAt)}</span>
            </div>
          </div>

          <div class="story-detail-body">
            <div class="story-image-container">
              <img src="${story.photoUrl}" alt="Foto cerita ${story.name}" class="detail-image" loading="lazy">
            </div>
            
            <div class="story-description">
              <p>${story.description}</p>
            </div>
          </div>

          <button id="saveOfflineBtn" class="btn-primary" style="margin-bottom:1rem;" ${alreadySaved ? 'disabled' : ''}>
            <i class="fas ${alreadySaved ? 'fa-check' : 'fa-download'}"></i> ${alreadySaved ? 'Tersimpan Offline' : 'Simpan ke Offline'}
          </button>

          <div class="story-location-section">
            <h3><i class="fas fa-map-marker-alt"></i> Lokasi Cerita</h3>
            <div id="map" class="story-map"></div>
          </div>
        </div>
      </div>
    `;

    // Initialize map after story detail is rendered
    if (story.lat && story.lon) {
      initStoryDetailMap('map', story);
    }

    // Tombol simpan offline
    const saveBtn = document.getElementById('saveOfflineBtn');
    if (saveBtn && !alreadySaved) {
      saveBtn.addEventListener('click', async () => {
        await saveStory(story);
        saveBtn.innerHTML = '<i class="fas fa-check"></i> Tersimpan Offline';
        saveBtn.disabled = true;
      });
    }
  }

  showDetailView(id) {
    this.showLoading();
    this.presenter.loadStoryDetail(id);
  }
}