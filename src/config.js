// API Configuration
// Uses VITE_API_URL from environment variables, falls back to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
