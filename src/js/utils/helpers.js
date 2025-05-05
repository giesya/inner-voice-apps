function showLoading(containerId = 'maincontent') {
  console.log('Showing loading indicator');
  document.getElementById(containerId).innerHTML = '<div class="loading">Memuat...</div>';
}

// Menampilkan pesan error
function showError(message, containerId = 'maincontent') {
  console.error('Error displayed to user:', message);
  document.getElementById(containerId).innerHTML = `
    <div class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      <p>${message}</p>
      <button onclick="location.hash='#/'">Kembali</button>
    </div>
  `;
}

// Fungsi untuk preview gambar
function setupImagePreview(fileInputId, previewImageId) {
  const fileInput = document.getElementById(fileInputId);
  const preview = document.getElementById(previewImageId);
  
  if (!fileInput || !preview) {
    console.error('Image preview elements not found:', fileInputId, previewImageId);
    return;
  }
  
  console.log('Setting up image preview for:', fileInputId);
  
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    
    if (file && file.size <= 1024 * 1024) { // Max 1MB
      const reader = new FileReader();
      
      reader.onload = () => {
        preview.src = reader.result;
        preview.style.display = 'block';
      };
      
      reader.readAsDataURL(file);
    } else if (file) {
      alert('File harus kurang dari 1MB');
      fileInput.value = '';
      preview.style.display = 'none';
    }
  });
}

// Format tanggal
function formatDate(dateString) {
  return new Date(dateString).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Animasi transisi halaman
function pageTransition() {
  console.log('Applying page transition effect');
  document.documentElement.animate(
    [
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    { 
      duration: 300,
      easing: 'ease-out'
    }
  );
}

export {
  showLoading,
  showError,
  setupImagePreview,
  formatDate,
  pageTransition
};