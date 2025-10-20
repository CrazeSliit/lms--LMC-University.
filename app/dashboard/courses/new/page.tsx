'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  BookOpen, 
  ArrowLeft,
  Loader2,
  Upload,
  Users,
  Clock,
  DollarSign,
  Star
} from 'lucide-react'
import Link from 'next/link'

interface Teacher {
  id: string
  name: string
  email: string
}

export default function NewCoursePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingTeachers, setLoadingTeachers] = useState(true)
  const [error, setError] = useState('')
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    teacherId: '',
    status: 'DRAFT',
    level: 'BEGINNER',
    duration: '',
    price: '',
    category: 'Web Development'
  })

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/users?role=TEACHER')
      const data = await response.json()
      if (data.success) {
        setTeachers(Array.isArray(data.data) ? data.data : [])
      }
    } catch (err) {
      console.error('Failed to fetch teachers:', err)
    } finally {
      setLoadingTeachers(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.title || !formData.description) {
      setError('Title and description are required')
      return
    }

    if (!formData.teacherId) {
      setError('Please select a teacher for this course')
      return
    }

    if (formData.title.length < 5) {
      setError('Title must be at least 5 characters long')
      return
    }

    if (formData.description.length < 20) {
      setError('Description must be at least 20 characters long')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800',
          teacherId: formData.teacherId,
          status: formData.status,
          level: formData.level,
          duration: formData.duration || null,
          price: formData.price ? parseFloat(formData.price) : null,
          category: formData.category,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create course')
        return
      }

      // Success - redirect to courses list
      router.push('/dashboard/courses')
      router.refresh()
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Cybersecurity',
    'Cloud Computing',
    'DevOps',
    'UI/UX Design',
    'Business',
    'Marketing',
    'Other'
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/courses">
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-foreground">Add New Course</h1>
          <p className="text-muted-foreground mt-2">Create a new course for students to enroll</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Enter the main details about the course
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Course Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-bold text-foreground">
                Course Title *
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Complete Web Development Bootcamp"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
                className="h-12 rounded-xl border-2"
              />
              <p className="text-xs text-muted-foreground">
                Make it clear and descriptive (min. 5 characters)
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-bold text-foreground">
                Course Description *
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what students will learn in this course..."
                value={formData.description}
                onChange={handleChange}
                required
                disabled={loading}
                rows={5}
                className="rounded-xl border-2"
              />
              <p className="text-xs text-muted-foreground">
                Detailed description of course content and learning outcomes (min. 20 characters)
              </p>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-sm font-bold text-foreground">
                Course Image URL
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Upload className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-12 rounded-xl border-2 pl-12"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Optional: URL of course cover image (defaults to placeholder if empty)
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-bold text-foreground">
                Category *
              </Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full h-12 rounded-xl border-2 px-4 bg-background"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Course Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Course Details
            </CardTitle>
            <CardDescription>
              Additional information about the course
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Teacher Selection */}
            <div className="space-y-2">
              <Label htmlFor="teacherId" className="text-sm font-bold text-foreground">
                Instructor *
              </Label>
              {loadingTeachers ? (
                <div className="h-12 rounded-xl border-2 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <select
                  id="teacherId"
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full h-12 rounded-xl border-2 px-4 bg-background"
                >
                  <option value="">Select an instructor</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.email})
                    </option>
                  ))}
                </select>
              )}
              <p className="text-xs text-muted-foreground">
                {teachers.length === 0 && !loadingTeachers
                  ? 'No teachers available. Please create a teacher account first.'
                  : 'Choose the instructor who will teach this course'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Level */}
              <div className="space-y-2">
                <Label htmlFor="level" className="text-sm font-bold text-foreground">
                  <Star className="h-4 w-4 inline mr-1" />
                  Level *
                </Label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full h-12 rounded-xl border-2 px-4 bg-background"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-bold text-foreground">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Duration
                </Label>
                <Input
                  id="duration"
                  name="duration"
                  type="text"
                  placeholder="e.g., 8 weeks"
                  value={formData.duration}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-12 rounded-xl border-2"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-bold text-foreground">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Price
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-12 rounded-xl border-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Publishing Status */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing Status</CardTitle>
            <CardDescription>
              Choose the initial status for this course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'DRAFT' })}
                className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                  formData.status === 'DRAFT'
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50'
                }`}
                disabled={loading}
              >
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  formData.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-foreground">Draft</div>
                  <div className="text-xs text-muted-foreground">Not visible to students</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'PUBLISHED' })}
                className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                  formData.status === 'PUBLISHED'
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50'
                }`}
                disabled={loading}
              >
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  formData.status === 'PUBLISHED' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-foreground">Published</div>
                  <div className="text-xs text-muted-foreground">Visible to all students</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'ARCHIVED' })}
                className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                  formData.status === 'ARCHIVED'
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50'
                }`}
                disabled={loading}
              >
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  formData.status === 'ARCHIVED' ? 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-foreground">Archived</div>
                  <div className="text-xs text-muted-foreground">Hidden from catalog</div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <Link href="/dashboard/courses" className="flex-1">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-full"
              disabled={loading}
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading || teachers.length === 0}
            className="flex-1 h-12 rounded-full text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Course...
              </>
            ) : (
              <>
                <BookOpen className="mr-2 h-5 w-5" />
                Create Course
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Next Steps</h3>
              <p className="text-sm text-muted-foreground">
                After creating the course, you can add lessons, assignments, and other content. 
                Published courses will be visible to students in the course catalog and available for enrollment.
                Draft courses can be edited and published when ready.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
