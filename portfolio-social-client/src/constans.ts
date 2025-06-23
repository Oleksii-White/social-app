export const BASE_URL =
  import.meta.env.VITE_BASE_URL === "production"
    ? "none"
    : "http://localhost:3000";
