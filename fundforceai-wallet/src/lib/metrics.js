const API_BASE_URL = "http://localhost:3000";

export async function getMetrics() {
  const response = await fetch(`${API_BASE_URL}/api/metrics`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch metrics");
  }

  return data;
}
