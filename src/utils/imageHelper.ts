const API_BASE_URL = import.meta.env.VITE_API_BASE;

/**
 * Mengubah path gambar dari backend menjadi Full URL.
 * @param path - Filename atau path gambar dari database (misal: "avatar-123.jpg")
 * @returns Full URL string atau null/undefined
 */
export const getImageUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const cleanBaseUrl = API_BASE_URL.replace(/\/$/, ""); 
  
  return `${cleanBaseUrl}/uploads/${path}`;
};