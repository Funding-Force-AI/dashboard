const API_BASE_URL = "http://localhost:3000";

export async function createDisbursement(payload) {
  const res = await fetch(`${API_BASE_URL}/api/disbursements`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to create disbursement");
  }

  return data;
}
