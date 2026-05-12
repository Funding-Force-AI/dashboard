const API_BASE_URL = "http://localhost:3000";

export async function getClients() {
  const res = await fetch(`${API_BASE_URL}/api/clients`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch clients");
  }

  return data;
}

export async function getClient(clientId) {
  const res = await fetch(
    `${API_BASE_URL}/api/clients/${encodeURIComponent(clientId)}`,
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch client");
  }

  return data;
}

export async function createClient(payload) {
  const res = await fetch(`${API_BASE_URL}/api/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to create client");
  }

  return data;
}

export async function updateClient(clientId, patch) {
  const res = await fetch(
    `${API_BASE_URL}/api/clients/${encodeURIComponent(clientId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patch),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update client");
  }

  return data;
}

export async function deleteClient(clientId) {
  const res = await fetch(
    `${API_BASE_URL}/api/clients/${encodeURIComponent(clientId)}`,
    {
      method: "DELETE",
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to delete client");
  }

  return data;
}
