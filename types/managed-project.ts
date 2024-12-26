import * as z from "zod"

export const projectTypeOptions = [
  "Residential",
  "Commercial",
  "Industrial",
  "Infrastructure",
  "Renovation",
] as const

export const projectStatusOptions = [
  "Planning",
  "In Progress",
  "Completed",
  "Archived",
] as const

export const layoutTypeOptions = [
  "Open Plan",
  "Closed Rooms",
  "Mixed",
  "Flexible",
] as const

export const materialTypeOptions = [
  "Concrete",
  "Wood",
  "Steel",
  "Glass",
  "Brick",
  "Stone",
] as const

export const unitOptions = ["meters", "feet"] as const

export const architecturalStyleOptions = [
  "Modern",
  "Classical",
  "Minimalist",
  "Contemporary",
  "Traditional",
  "Art Deco",
] as const

export const structuralFeatureOptions = [
  "Beam",
  "Column",
  "Foundation",
  "Wall",
  "Roof",
  "Floor",
] as const

export const managedProjectSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  projectType: z.enum(projectTypeOptions),
  clientName: z.string().min(1, "Client name is required"),
  startDate: z.date(),
  endDate: z.date(),
  budget: z.number().positive("Budget must be a positive number"),
  projectStatus: z.enum(projectStatusOptions),
  description: z.string().optional(),
  length: z.number().positive("Length must be a positive number"),
  lengthUnit: z.enum(unitOptions),
  width: z.number().positive("Width must be a positive number"),
  widthUnit: z.enum(unitOptions),
  height: z.number().positive("Height must be a positive number").optional(),
  heightUnit: z.enum(unitOptions).optional(),
  preferredLayoutType: z.enum(layoutTypeOptions),
  layoutDescription: z.string().optional(),
  materials: z.array(
    z.object({
      type: z.enum(materialTypeOptions),
      properties: z.string().optional(),
    })
  ),
  architecturalStyle: z.enum(architecturalStyleOptions),
  structuralFeatures: z.array(
    z.object({
      type: z.enum(structuralFeatureOptions),
      description: z.string().optional(),
      quantity: z.number().int().positive("Quantity must be a positive integer"),
    })
  ),
  projectManager: z.string().min(1, "Project manager is required"),
})

export type ManagedProject = z.infer<typeof managedProjectSchema>

