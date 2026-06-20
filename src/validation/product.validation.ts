import { z } from "zod"

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Product name is too long"),
  price: z
    .preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number({ message: "Price must be a number" })
        .positive("Price must be greater than 0")
    ),
  category: z
    .string()
    .min(1, "Category is required"),
  availability: z
    .boolean()
    .default(true),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description cannot exceed 1000 characters"),
  images: z
    .array(z.string())
    .min(1, "At least one product image is required"),
})

export type ProductInput = z.infer<typeof productSchema>
