import { z } from "zod";

export const contentSchema = z.object({
   title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title is too long"),

  description: z
    .string()
    .max(5000, "Description is too long")
    .optional(),

  link: z
    .url({
      error : "Invalid URL"
    })
    .optional(),

  type: z.enum([
    "note",
    "youtube",
    "twitter",
    "article",
    "document",
    "link"
  ]),

  tags: z
    .array(z.string())
})

export const updateContentSchema = contentSchema.partial();