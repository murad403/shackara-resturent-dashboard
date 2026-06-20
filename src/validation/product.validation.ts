import { z } from "zod"

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Product name is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(5000, "Description cannot exceed 5000 characters"),
  images: z
    .array(z.string())
    .min(1, "At least one product image is required"),
  price: z
    .preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number({ message: "Price must be a number" })
        .min(0, "Price must be at least 0")
    ),
  oldPrice: z
    .preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
      z.number({ message: "Old price must be a number" })
        .min(0, "Price must be at least 0")
    )
    .optional(),
  availability: z
    .boolean()
    .default(true),
  quantity: z
    .preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number({ message: "Quantity must be a number" })
        .int("Quantity must be an integer")
        .min(0, "Quantity must be at least 0")
    ),
  calories: z
    .preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
      z.number({ message: "Calories must be a number" })
        .min(0, "Calories must be at least 0")
    )
    .optional(),
  prepTime: z
    .preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
      z.number({ message: "Preparation time must be a number" })
        .min(0, "Prep time must be at least 0")
    )
    .optional(),
  category: z
    .string()
    .min(1, "Category is required"),
  subCategory: z
    .string()
    .optional(),
  sizeVariants: z
    .array(
      z.object({
        id: z.string().optional(),
        size: z.enum(["SMALL", "MEDIUM", "LARGE"]),
        price: z.preprocess(
          (val) => (val === "" ? undefined : Number(val)),
          z.number({ message: "Variant price must be a number" })
            .min(0, "Price must be at least 0")
        )
      })
    )
    .default([]),
  sideOptions: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1, "Side name is required"),
        price: z.preprocess(
          (val) => (val === "" ? undefined : Number(val)),
          z.number({ message: "Side price must be a number" })
            .min(0, "Price must be at least 0")
        ),
        isDefault: z.boolean().default(false)
      })
    )
    .default([]),
  itemExtras: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1, "Extra name is required"),
        price: z.preprocess(
          (val) => (val === "" ? undefined : Number(val)),
          z.number({ message: "Extra price must be a number" })
            .min(0, "Price must be at least 0")
        )
      })
    )
    .default([])
})

export type ProductInput = z.infer<typeof productSchema>
