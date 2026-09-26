export const BASE_URL = "https://api.themoviedb.org/3";

export const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
  }
};

export async function tmdbFetch(endpoint, signal) {
  const response = await fetch(
    `${BASE_URL}${endpoint}`,
    {
      ...options,
      signal
    }
  );

  if (!response.ok) {
    throw new Error("TMDB request failed");
  }

  const data = await response.json();

  return data;
}