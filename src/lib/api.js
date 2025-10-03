const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function fetchStyles() {
  const response = await fetch(`${API_BASE_URL}/api/converter/styles/`);
  if (!response.ok) {
    throw new Error('Failed to fetch styles');
  }
  return response.json();
}

export async function convertImage(file, style, params) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('style', style);
  formData.append('params', JSON.stringify(params));

  const response = await fetch(`${API_BASE_URL}/api/converter/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to convert image');
  }

  return response.json();
}