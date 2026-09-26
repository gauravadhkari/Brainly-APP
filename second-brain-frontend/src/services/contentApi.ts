import { API_URL } from "./api";
import type { Content } from "../types/content";

export interface ContentQuery {
  search?: string;
  type?: string;
  tag?: string;
  sort?: "newest" | "oldest";
  page?: number;
  limit?: number;
}

interface GetContentResponse {
  success: boolean;
  message: string;
  content: Content[];

  pagination?: {
    currentPage: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface UpdateContentInput {
  title?: string;
  description?: string;
  link?: string;
  type?: string;
  tags?: string[];
}

export const getContents = async (
  token: string,
  query: ContentQuery = {}
): Promise<GetContentResponse> => {
  const params = new URLSearchParams();

  if (query.search) {
    params.set("search", query.search);
  }

  if (query.type) {
    params.set("type", query.type);
  }

  if (query.tag) {
    params.set("tag", query.tag);
  }

  if (query.sort) {
    params.set("sort", query.sort);
  }

  if (query.page) {
    params.set("page", query.page.toString());
  }

  if (query.limit) {
    params.set("limit", query.limit.toString());
  }

  const response = await fetch(
    `${API_URL}/content?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch content"
    );
  }

  return data;
};

export const updateContent = async (
  token: string,
  id: string,
  payload: UpdateContentInput
) => {
  const response = await fetch(
    `${API_URL}/content/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update content"
    );
  }

  return data;
};

export const deleteContent = async (
  token: string,
  id: string
) => {
  const response = await fetch(
    `${API_URL}/content/${id}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete content"
    );
  }

  return data;
};

export const enableSharing = async (
  token: string
) => {
  const response = await fetch(
    `${API_URL}/contents/share`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        sharingEnabled: true,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to enable sharing"
    );
  }

  return data;
};
export const disableSharing = async (
  token: string
) => {
  const response = await fetch(
    `${API_URL}/contents/share`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sharingEnabled: false,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to disable sharing"
    );
  }

  return data;
};
export const getSharedContent = async (
  shareId: string
) => {
  const response = await fetch(
    `${API_URL}/contents/share/${shareId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Shared brain not found"
    );
  }

  return data;
};