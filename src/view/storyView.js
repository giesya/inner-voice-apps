export function renderStories(stories) {
  const container = document.querySelector('#storyList');
  container.innerHTML = '';

  stories.forEach((story) => {
    const card = document.createElement('div');
    card.classList.add('story-card');
    card.innerHTML = `
      <img src="${story.photoUrl}" alt="${story.name}" />
      <h3>${story.name}</h3>
      <p>${story.description}</p>
    `;
    container.appendChild(card);
  });
}
