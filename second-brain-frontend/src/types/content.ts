export interface Content {
  _id: string;
  title: string;
  description?: string;
  link?: string;
  type: string;
  tags: string[];

  sharingEnabled?: boolean;
  shareId?: string;

  createdAt: string;
  updatedAt: string;
}