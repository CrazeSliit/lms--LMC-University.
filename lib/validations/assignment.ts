import { z } from 'zod'

export const createAssignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  dueDate: z.string().datetime('Invalid date format'),
  maxScore: z.number().int().positive('Max score must be a positive number').default(100),
  courseId: z.string().cuid('Invalid course ID'),
})

export const updateAssignmentSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).optional(),
  dueDate: z.string().datetime().optional(),
  maxScore: z.number().int().positive().optional(),
})
