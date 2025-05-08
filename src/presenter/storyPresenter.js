import { getStories } from '../model/storyModel.js';
import { renderStories } from '../view/storyView.js';

export async function loadStoryList() {
  try {
    const stories = await getStories();
    renderStories(stories);
  } catch (error) {
    console.error('Gagal memuat cerita:', error);
  }
}
