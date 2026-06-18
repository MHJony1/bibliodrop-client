const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const text = await res.text();
  if (!text || text.trim() === '') {
    return null;
  }

  return JSON.parse(text);
};