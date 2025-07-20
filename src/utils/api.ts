const BASE_URL = 'http://localhost:3001/api'; // Or your actual API URL

// Define a generic type for API responses for better type safety.
interface ApiResponse<T> {
  data: T;
  error?: string;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // FIX: Replaced 'any' by having the response parsed as the generic type 'T'.
    return await response.json() as T;
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error;
  }
}

export const api = {
  // FIX: Updated the 'get' method to use the generic 'request' function.
  get: <T>(endpoint: string): Promise<T> => {
    return request<T>(endpoint);
  },

  // FIX: Updated the 'post' method to accept a body and use generics.
  post: <T, U>(endpoint: string, body: U): Promise<T> => {
    return request<T>(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  },
};
