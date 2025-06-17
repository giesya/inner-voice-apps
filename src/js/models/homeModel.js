export class HomeModel {
  constructor(apiBase = 'https://story-api.dicoding.dev/v1') {
    this.apiBase = apiBase;
  }

  async getStories() {
    // Ambil token dari localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      return { error: true, message: 'Silakan login terlebih dahulu untuk melihat cerita.' };
    }
    const res = await fetch(`${this.apiBase}/stories?page=1&size=20&location=1`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    return data;
  }
} 