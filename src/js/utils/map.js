import L from 'leaflet';

class MapManager {
  constructor() {
    this.map = null;
    this.markers = [];
    this.currentPosition = null;
    this.layers = {
      default: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }),
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }),
      terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)'
      })
    };
  }

  initMap(elementId) {
    this.map = L.map(elementId).setView([0, 0], 2);
    this.layers.default.addTo(this.map);

    // Add layer control
    const baseMaps = {
      "Default": this.layers.default,
      "Satellite": this.layers.satellite,
      "Terrain": this.layers.terrain
    };

    L.control.layers(baseMaps).addTo(this.map);
  }

  addMarker(lat, lng, popupContent) {
    const marker = L.marker([lat, lng]).addTo(this.map);
    if (popupContent) {
      marker.bindPopup(popupContent);
    }
    this.markers.push(marker);
    return marker;
  }
}

export default MapManager; 