const BASE_URL = 'https://story-api.dicoding.dev/v1';

export async function getStories() {
    const response = await fetch(`${BASE_URL}/stories`);
    const data = await response.json();
    return data.listStory;
}

export async function postStory(formData, token) {
    const response = await fetch(`${BASE_URL}/stories`, {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`,
    },
    body: formData,
    });
    return response.json();
}
