import type { PredictPayload, PredictResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export function getApiBaseUrl(): string {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured. Copy .env.example to .env.local and set the API URL."
    );
  }
  return API_URL;
}

export async function predictHcv(
  payload: PredictPayload
): Promise<PredictResponse> {
  const baseUrl = getApiBaseUrl();

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Could not reach the prediction API. Make sure the backend is running and NEXT_PUBLIC_API_URL is correct."
    );
  }

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const detail =
      typeof data === "object" &&
      data !== null &&
      "detail" in data &&
      (data as { detail: unknown }).detail;

    if (typeof detail === "string") {
      throw new Error(detail);
    }

    if (Array.isArray(detail)) {
      const messages = detail
        .map((item) => {
          if (typeof item === "object" && item !== null && "msg" in item) {
            return String((item as { msg: unknown }).msg);
          }
          return null;
        })
        .filter(Boolean);
      if (messages.length > 0) {
        throw new Error(messages.join(" "));
      }
    }

    throw new Error(`Prediction request failed (${response.status}).`);
  }

  if (
    typeof data !== "object" ||
    data === null ||
    !("predicted_class" in data) ||
    !("predicted_label" in data)
  ) {
    throw new Error("The API returned an unexpected response format.");
  }

  return data as PredictResponse;
}
