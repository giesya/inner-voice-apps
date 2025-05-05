import { router } from './routes.js';

function initApp() {
  console.log('Initializing application');
  
  // Cek View Transition API support
  if (document.startViewTransition) {
    console.log('View Transition API supported');
    // Custom transisi halaman dengan Animation API
    window.addEventListener('hashchange', () => {
      document.startViewTransition(() => {
        // jalankan setelah snapshot DOM diambil
        document.documentElement.classList.add('transitioning');
        
        // return promise yang akan selesai setelah DOM diupdate
        return new Promise(resolve => {
          requestAnimationFrame(() => {
            // Mengembalikan ke keadaan normal setelah transisi
            requestAnimationFrame(() => {
              document.documentElement.classList.remove('transitioning');
              resolve();
            });
          });
        });
      });
    });
  } else {
    console.log('View Transition API not supported');
  }
  
  // Inisialisasi router
  initRouter();
  
  // Inisialisasi aksesibilitas
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.getElementById('maincontent');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // Update login/logout menu
  updateLoginMenu();
  
  // perangkat mobile untuk UI yang sesuai
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    document.body.classList.add('mobile-device');
  }
}

// Update login menu berdasarkan status login
function updateLoginMenu() {
  const loginMenu = document.getElementById('loginMenu');
  if (loginMenu) {
    const isLoggedIn = localStorage.getItem('token');
    if (isLoggedIn) {
      loginMenu.innerHTML = '<i class="fas fa-sign-out-alt"></i> <span>Logout</span>';
      loginMenu.href = '#/';
      loginMenu.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        alert('Berhasil logout');
        location.hash = '#/';
        updateLoginMenu();
      };
    } else {
      loginMenu.innerHTML = '<i class="fas fa-user"></i> <span>Login</span>';
      loginMenu.href = '#/login';
      loginMenu.onclick = null;
    }
  }
}

// Inisialisasi router
function initRouter() {
  console.log('Initializing router');
  
  // kalo ada perubahan hash
  window.addEventListener('hashchange', () => {
    console.log('Hash changed to:', location.hash);
    
    // Animasi transisi halaman
    document.documentElement.animate(
      [
        { opacity: 0 },
        { opacity: 1 }
      ],
      { 
        duration: 300,
        easing: 'ease-out'
      }
    );
    
    router();
    updateLoginMenu();
  });
  
  // Jalankan router saat halaman dimuat
  window.addEventListener('load', () => {
    console.log('Page loaded, running router');
    router();
  });
}

export { initApp };