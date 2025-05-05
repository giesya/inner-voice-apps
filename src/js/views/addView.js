import { addStory } from '../api.js';
import { initAddStoryMap } from '../utils/mapUtils.js';
import { setupImagePreview, pageTransition } from '../utils/helpers.js';

// inisialisasi variabel maps
let mapInstance = null;

// setup camera untuk take photo
function setupCamera(previewId) {
  console.log('Setting up camera');
  
  const videoElement = document.getElementById('camera');
  const captureButton = document.getElementById('capture');
  const photoPreview = document.getElementById(previewId);
  
  if (!videoElement || !captureButton || !photoPreview) {
    console.error('Camera elements not found');
    return null;
  }
  
  let stream = null;
  
  // inisialisasi camera
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(mediaStream => {
      stream = mediaStream;
      videoElement.srcObject = mediaStream;
      videoElement.play();
      videoElement.style.display = 'block';
      captureButton.style.display = 'block';
      console.log('Camera initialized successfully');
    })
    .catch(err => {
      console.error("Error accessing camera: ", err);
      alert("Tidak dapat mengakses kamera. Silakan gunakan upload file.");
    });
  
  // take photo
  captureButton.onclick = () => {a
    console.log('Capturing image from camera');
    
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.getContext('2d').drawImage(videoElement, 0, 0);
    canvas.toBlob(blob => {
      const file = new File([blob], "camera-capture.png", { type: "image/png" });
      photoPreview.src = URL.createObjectURL(blob);
      photoPreview.style.display = 'block';
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      document.getElementById('photo').files = dataTransfer.files;
      
      // turn off stream camera setelah digunakan
      if (stream) {
        console.log('Stopping camera stream');
        stream.getTracks().forEach(track => track.stop());
        videoElement.style.display = 'none';
        captureButton.style.display = 'none';
      }
    }, 'image/png');
  };
  
  // clean up function
  return function cleanupCamera() {
    if (stream) {
      console.log('Cleaning up camera resources');
      stream.getTracks().forEach(track => track.stop());
    }
  };
}

// Render form add story
function renderAddView() {
  console.log('Rendering add story view');
  
  const mainContent = document.getElementById('maincontent');
  if (!mainContent) {
    console.error('Main content element not found');
    return;
  }
  
  mainContent.innerHTML = '';
  pageTransition();

  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';
  
  formContainer.innerHTML = `
    <h2>Tambah Cerita Baru</h2>
    <form id="formAdd" novalidate>
      <div class="form-group">
        <label for="desc">Deskripsi Cerita</label>
        <textarea id="desc" required placeholder="Ceritakan pengalamanmu..."></textarea>
      </div>

      <div class="form-group">
        <label for="photo">Foto Cerita (maks 1MB)</label>
        <div class="photo-input-container">
          <input type="file" id="photo" accept="image/*" required />
          <button type="button" id="toggleCamera">Gunakan Kamera</button>
        </div>
        
        <div class="camera-container">
          <video id="camera" style="display: none;"></video>
          <button type="button" id="capture" style="display: none;">Ambil Foto</button>
        </div>
        
        <img id="preview" alt="Preview foto cerita" style="display: none;" />
      </div>

      <div class="form-group">
        <label>Pilih Lokasi (opsional)</label>
        <p class="hint">Klik pada peta untuk menandai lokasi cerita</p>
        <div id="map"></div>
        <p>Lokasi terpilih: <span id="locDisplay">Tidak ada</span></p>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary">
          <i class="fas fa-paper-plane"></i> Kirim
        </button>
        <button type="button" class="btn-secondary" onclick="location.hash='#/'">
          <i class="fas fa-times"></i> Batal
        </button>
      </div>
    </form>
  `;
  
  mainContent.appendChild(formContainer);
  setupImagePreview('photo', 'preview');
  
  // inisialisasi peta setelah element diadd ke DOM
  setTimeout(() => {
    console.log('Initializing map for add view');
    mapInstance = initAddStoryMap('map', 'locDisplay');
  }, 100);
  
  // Setup toggle camera
  let cleanupCameraFn = null;
  const toggleCameraBtn = document.getElementById('toggleCamera');
  
  if (toggleCameraBtn) {
    toggleCameraBtn.addEventListener('click', () => {
      const cameraContainer = document.querySelector('.camera-container');
      
      if (cameraContainer) {
        if (cameraContainer.style.display !== 'block') {
          cameraContainer.style.display = 'block';
          cleanupCameraFn = setupCamera('preview');
        } else {
          cameraContainer.style.display = 'none';
          if (cleanupCameraFn) cleanupCameraFn();
        }
      }
    });
  }
  
  // Setup form submission
  const formAdd = document.getElementById('formAdd');
  if (formAdd) {
    formAdd.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleFormSubmit();
    });
  }
}

// Handle form submission
async function handleFormSubmit() {
  console.log('Handling form submission');
  
  const descInput = document.getElementById('desc');
  const fileInput = document.getElementById('photo');
  
  if (!descInput || !fileInput) {
    console.error('Form elements not found');
    return;
  }
  
  const desc = descInput.value.trim();
  const file = fileInput.files[0];
  
  // Validasi form
  if (!desc) {
    alert('Deskripsi cerita harus diisi');
    descInput.focus();
    return;
  }
  
  if (!file) {
    alert('Foto cerita harus dipilih');
    return;
  }
  
  if (file.size > 1024 * 1024) {
    alert('Ukuran foto maksimal 1MB');
    return;
  }
  
  // Buat FormData
  const formData = new FormData();
  formData.append('description', desc);
  formData.append('photo', file);
  
  // Tambahkan lokasi (opsional)
  if (mapInstance && mapInstance.getSelectedLocation) {
    const location = mapInstance.getSelectedLocation();
    if (location.lat && location.lon) {
      console.log('Adding location to form:', location);
      formData.append('lat', location.lat);
      formData.append('lon', location.lon);
    }
  }
  
  // Submit form
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Anda harus login untuk menambah cerita');
    location.hash = '#/login';
    return;
  }
  
  try {
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    }
    
    console.log('Submitting new story');
    const response = await addStory(formData, token);
    
    if (!response.error) {
      alert('Cerita berhasil dikirim');
      location.hash = '#/';
    } else {
      alert('Gagal mengirim cerita: ' + response.message);
    }
  } catch (error) {
    console.error('Error submitting story:', error);
    alert('Terjadi kesalahan saat mengirim cerita');
  } finally {
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim';
    }
  }
}

function showAddView() {
  renderAddView();
}

export {
  showAddView
};