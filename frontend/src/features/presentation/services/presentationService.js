const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function generatePresentationPrepSummary() {
  const response = await fetch(`${API_BASE_URL}/presentation/ai-prep-summary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to generate presentation outline");
  }

  return data;
}
