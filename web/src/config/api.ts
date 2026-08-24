// Centralized configuration for the Next.js API Base URL.
// By default, NEXT_PUBLIC_API_URL is empty, which resolves relative paths 
// based on the client's current origin (e.g. localhost, local IP, or deployed URL).
// When switching between laptops, mobile devices, or ngrok tunnels during development,
// you can define NEXT_PUBLIC_API_URL in .env.local to route requests globally.

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
