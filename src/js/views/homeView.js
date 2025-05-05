import { fetchStories } from '../api.js';
import { initStoryListMap } from '../utils/mapUtils.js';
import { showLoading, showError, formatDate, pageTransition } from '../utils/helpers.js';

// State nyimpan data stories
let stories = [];

// Render tampilan beranda
function renderHomeView() {
  console.log('Rendering home view with', stories.length, 'stories');
  
  const mainContent = document.getElementById('maincontent');
  if (!mainContent) {
    console.error('Main content element not found');
    return;
  }
  
  mainContent.innerHTML = '';
  pageTransition();
  
  // Tombol Logout / Login
  const actionDiv = document.createElement('div');
  actionDiv.className = 'action-buttons';
  
  if (localStorage.getItem('token')) {
    const btnLogout = document.createElement('button');
    btnLogout.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
    btnLogout.onclick = logout;
    actionDiv.appendChild(btnLogout);
  } else {
    const btnLogin = document.createElement('button');
    btnLogin.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login / Daftar';
    btnLogin.onclick = () => { location.hash = '#/login'; };
    actionDiv.appendChild(btnLogin);
  }

  // Tombol tambah
  const btnAdd = document.createElement('button');
  btnAdd.innerHTML = '<i class="fas fa-plus"></i> Tambah Cerita';
  btnAdd.onclick = () => { location.hash = '#/add'; };
  actionDiv.appendChild(btnAdd);
  
  mainContent.appendChild(actionDiv);
  
  // Title section
  const titleSection = document.createElement('div');
  titleSection.className = 'section-title';
  titleSection.innerHTML = '<h2>Cerita Terbaru</h2>';
  mainContent.appendChild(titleSection);

  // Data list dari story
  const listDiv = document.createElement('div');
  listDiv.className = 'story-list';

  if (!stories.length) {
    listDiv.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-book-open"></i>
        <p>Tidak ada cerita.</p>
      </div>
    `;
  } else {
    stories.forEach(story => {
      const card = document.createElement('div');
      card.className = 'story-card';
      card.setAttribute('aria-label', `Cerita oleh ${story.name}`);
      card.onclick = () => { location.hash = `#/story/${story.id}`; };
      
      // background untuk card list
      const gradients = [
        'linear-gradient(135deg, #E3FDFD, #A6E3E9)',
        'linear-gradient(135deg, #DCD6F7, #BBE1FA)',
        'linear-gradient(135deg, #F8E2CF, #F5C6AA)',
        'linear-gradient(135deg, #DDFFBC, #AACB73)'
      ];
      const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
      card.style.background = randomGradient;
      
      card.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto cerita ${story.name}" />
        <div class="story-info">
          <h3>${story.name}</h3>
          <p>${story.description.length > 100 ? story.description.substring(0, 100) + '...' : story.description}</p>
          <div class="story-meta">
            <span><i class="fas fa-calendar-alt"></i> ${formatDate(story.createdAt)}</span>
          </div>
        </div>
      `;
      listDiv.appendChild(card);
    });
  }
  mainContent.appendChild(listDiv);

  // Map section
  const mapSection = document.createElement('div');
  mapSection.className = 'map-section';
  mapSection.innerHTML = `
    <h3>Lokasi Cerita</h3>
    <div id="map"></div>
  `;
  mainContent.appendChild(mapSection);
  
  // inisialisasi map setelah di added to the DOM
  setTimeout(() => {
    initStoryListMap('map', stories);
  }, 100);
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  alert('Berhasil keluar');
  location.hash = '#/';
}

// Fetch stories from API and render home view
async function showHomeView() {
  showLoading();
  
  try {
    const token = localStorage.getItem('token');
    const data = await fetchStories(token);
    
    if (!data.error) {
      stories = data.listStory;
      renderHomeView();
    } else {
      showError('Gagal mengambil data: ' + data.message);
    }
  } catch (error) {
    console.error('Error in showHomeView:', error);
    showError('Terjadi kesalahan saat mengambil data');
  }
}

export {
  showHomeView
};