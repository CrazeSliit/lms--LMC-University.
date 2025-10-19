import { z } from 'zod'

export const createLessonSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  order: z.number().int().positive('Order must be a positive number'),
  courseId: z.string().cuid('Invalid course ID'),
})

export const updateLessonSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  content: z.string().min(10).optional(),
  order: z.number().int().positive().optional(),
})
