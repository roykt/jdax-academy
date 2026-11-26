const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export async function apiGet(path, signal) {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  const data = await response.json();
  if (data.success === false) throw new Error(data.message || "Request failed");
  return data;
}
