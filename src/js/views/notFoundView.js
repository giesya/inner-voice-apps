export class NotFoundView {
  render() {
    const mainContent = document.getElementById('maincontent');
    if (!mainContent) return;

    mainContent.innerHTML = `
      <div class="not-found-container">
        <h1>404</h1>
        <h2>Halaman Tidak Ditemukan</h2>
        <p>Maaf, halaman yang Anda cari tidak dapat ditemukan.</p>
        <button onclick="location.hash='#/'" class="btn-primary">
          <i class="fas fa-home"></i> Kembali ke Beranda
        </button>
      </div>
    `;
  }
} 