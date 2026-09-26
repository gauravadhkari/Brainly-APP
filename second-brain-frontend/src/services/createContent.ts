import { API_URL } from "./api";

export interface CreateContentInput {
  title: string;
  description?: string;
  link?: string;
  type: string;
  tags: string[];
}

export const createContent = async (
  token: string,
  payload: CreateContentInput
) => {
  const response = await fetch(`${API_URL}/content`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create content");
  }

  return data;
};