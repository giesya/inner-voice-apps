// Variabel untuk peta dan marker
let map = null;
let marker = null;
let selectedLat = null;
let selectedLon = null;

// Inisialisasi peta untuk daftar cerita
function initStoryListMap(containerId, stories) {
  console.log('Initializing story list map with', stories.length, 'stories');
  
  // Hapus peta yang sudah ada jika ada
  if (map) {
    console.log('Removing existing map');
    map.remove();
    map = null;
  }
  
  const mapContainer = document.getElementById(containerId);
  if (!mapContainer) {
    console.error('Map container not found:', containerId);
    return null;
  }
  
  // Buat peta baru
  try {
    map = L.map(containerId).setView([0, 0], 2);
    
    // Tambahkan tile layer default
    const defaultLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // Tambahkan layer control dan tile alternatif (kriteria opsional 4)
    const satellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '© Google'
    });
    
    const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenTopoMap contributors'
    });
    
    const baseMaps = {
      "Streets": defaultLayer,
      "Satellite": satellite,
      "Topographic": topo
    };
    
    L.control.layers(baseMaps).addTo(map);

    // Tambahkan marker untuk setiap cerita
    for (const story of stories) {
      if (story.lat && story.lon) {
        console.log('Adding marker for story:', story.id, story.lat, story.lon);
        L.marker([story.lat, story.lon])
          .addTo(map)
          .bindPopup(`<b>${story.name}</b><br/>${story.description}`);
      }
    }
    
    // Jika ada cerita dengan lokasi, set view ke cerita pertama
    const storiesWithLocation = stories.filter(story => story.lat && story.lon);
    if (storiesWithLocation.length > 0) {
      const firstStory = storiesWithLocation[0];
      map.setView([firstStory.lat, firstStory.lon], 7);
    }
    
    return map;
  } catch (error) {
    console.error('Error initializing map:', error);
    return null;
  }
}

// Inisialisasi peta untuk detail cerita
function initStoryDetailMap(containerId, story) {
  console.log('Initializing story detail map for:', story.id);
  
  // Hapus peta yang sudah ada jika ada
  if (map) {
    console.log('Removing existing map');
    map.remove();
    map = null;
  }
  
  const mapContainer = document.getElementById(containerId);
  if (!mapContainer) {
    console.error('Map container not found:', containerId);
    return null;
  }
  
  // Tentukan lokasi default jika story tidak memiliki koordinat
  const lat = story.lat || -2.548;
  const lon = story.lon || 118.014;
  
  // Buat peta baru
  try {
    map = L.map(containerId).setView([lat, lon], 10);
    
    // Tambahkan tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);
    
    // Tambahkan marker jika ada koordinat
    if (story.lat && story.lon) {
      console.log('Adding marker for location:', story.lat, story.lon);
      marker = L.marker([story.lat, story.lon]).addTo(map).bindPopup(story.name);
    } else {
      console.log('Story has no location data');
    }
    
    return map;
  } catch (error) {
    console.error('Error initializing detail map:', error);
    return null;
  }
}

// Inisialisasi peta untuk menambah cerita
function initAddStoryMap(containerId, locationDisplayId) {
  console.log('Initializing map for adding story');
  
  // Hapus peta yang sudah ada jika ada
  if (map) {
    console.log('Removing existing map');
    map.remove();
    map = null;
  }
  
  const mapContainer = document.getElementById(containerId);
  if (!mapContainer) {
    console.error('Map container not found:', containerId);
    return { map: null, getSelectedLocation: () => ({ lat: null, lon: null }) };
  }
  
  // Reset koordinat
  selectedLat = null;
  selectedLon = null;
  
  // Buat peta baru
  try {
    map = L.map(containerId).setView([-2.548926, 118.0148634], 5);
    
    // Tambahkan tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);
    
    // Tambahkan event listener untuk klik
    map.on('click', (e) => {
      selectedLat = e.latlng.lat;
      selectedLon = e.latlng.lng;
      
      console.log('Selected location:', selectedLat, selectedLon);
      
      // Hapus marker lama jika ada
      if (marker) map.removeLayer(marker);
      
      // Tambahkan marker baru
      marker = L.marker([selectedLat, selectedLon]).addTo(map);
      
      // Update display koordinat
      const locDisplay = document.getElementById(locationDisplayId);
      if (locDisplay) {
        locDisplay.innerText = `${selectedLat.toFixed(4)}, ${selectedLon.toFixed(4)}`;
      } else {
        console.error('Location display element not found:', locationDisplayId);
      }
    });
    
    return {
      map,
      getSelectedLocation: () => ({ lat: selectedLat, lon: selectedLon })
    };
  } catch (error) {
    console.error('Error initializing add story map:', error);
    return { map: null, getSelectedLocation: () => ({ lat: null, lon: null }) };
  }
}

export {
  initStoryListMap,
  initStoryDetailMap,
  initAddStoryMap
};