const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Dynamically strip any trailing slash to prevent double-slash 404 connection errors
export const API_URL = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
