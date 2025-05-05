import { fetchStoryDetail } from '../api.js';
import { initStoryDetailMap } from '../utils/mapUtils.js';
import { showLoading, showError, formatDate, pageTransition } from '../utils/helpers.js';

// Render detail story
function renderStoryDetail(story) {
  console.log('Rendering story detail for:', story.id);
  
  const mainContent = document.getElementById('maincontent');
  if (!mainContent) {
    console.error('Main content element not found');
    return;
  }
  
  mainContent.innerHTML = '';
  pageTransition();
  const detailContainer = document.createElement('div');
  detailContainer.className = 'story-detail-container';

  const backButton = document.createElement('button');
  backButton.className = 'back-button';
  backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Kembali';
  backButton.onclick = () => { location.hash = '#/'; };
  detailContainer.appendChild(backButton);

  const storyTitle = document.createElement('h2');
  storyTitle.textContent = story.name;
  detailContainer.appendChild(storyTitle);

  const storyImage = document.createElement('img');
  storyImage.src = story.photoUrl;
  storyImage.alt = `Foto cerita oleh ${story.name}`;
  storyImage.className = 'detail-image';
  detailContainer.appendChild(storyImage);
  
  // Story info
  const storyInfo = document.createElement('div');
  storyInfo.className = 'story-info-detail';
  
  const storyDesc = document.createElement('p');
  storyDesc.className = 'story-description';
  storyDesc.textContent = story.description;
  storyInfo.appendChild(storyDesc);
  
  const storyMeta = document.createElement('div');
  storyMeta.className = 'story-meta';
  storyMeta.innerHTML = `
    <span><i class="fas fa-user"></i> ${story.name}</span>
    <span><i class="fas fa-calendar-alt"></i> ${formatDate(story.createdAt)}</span>
  `;
  storyInfo.appendChild(storyMeta);
  
  detailContainer.appendChild(storyInfo);
  
  // Map section untuk coordinates exist
  const mapSection = document.createElement('div');
  mapSection.className = 'map-section';
  mapSection.innerHTML = `
    <h3>Lokasi</h3>
    <div id="storyMap"></div>
  `;
  detailContainer.appendChild(mapSection);
  
  mainContent.appendChild(detailContainer);
  
  // inisialisasi map setelah element di added to the DOM
  setTimeout(() => {
    initStoryDetailMap('storyMap', story);
  }, 100);
}

// Fetch and show detail story
async function showDetailView(id) {
  showLoading();
  
  try {
    const token = localStorage.getItem('token');
    const data = await fetchStoryDetail(id, token);
    
    if (!data.error) {
      renderStoryDetail(data.story);
    } else {
      showError('Gagal mengambil detail cerita: ' + data.message);
    }
  } catch (error) {
    console.error('Error in showDetailView:', error);
    showError('Terjadi kesalahan saat mengambil detail cerita');
  }
}

export {
  showDetailView
};