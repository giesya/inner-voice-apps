export class StoryModel {
  constructor() {
    this.baseUrl = 'https://story-api.dicoding.dev/v1';
  }

  async getStories() {
    try {
      // Ambil token dari localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        // Jika tidak ada token, tampilkan pesan error ramah
        return { error: true, message: 'Silakan login terlebih dahulu untuk melihat cerita.' };
      }
      const response = await fetch(`${this.baseUrl}/stories?page=1&size=20&location=1`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }
      const responseJson = await response.json();
      return responseJson.listStory; // Return the listStory array from the response
    } catch (error) {
      // Fallback ke offline jika fetch gagal
      if (window.getAllStories) {
        return await window.getAllStories();
      }
      throw new Error(`Error fetching stories: ${error.message}`);
    }
  }

  async addStory(storyData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { error: true, message: 'Silakan login terlebih dahulu untuk menambah cerita.' };
      }
      const response = await fetch(`${this.baseUrl}/stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(storyData),
      });
      if (!response.ok) {
        throw new Error('Failed to add story');
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error adding story: ${error.message}`);
    }
  }
}
