'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  ClipboardList, 
  ArrowLeft,
  Loader2,
  BookOpen,
  Calendar,
  Target,
  FileText
} from 'lucide-react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  teacher: {
    name: string
  }
}

export default function NewAssignmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [error, setError] = useState('')
  const [courses, setCourses] = useState<Course[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
    maxScore: '100',
    type: 'ASSIGNMENT'
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses?status=PUBLISHED')
      const data = await response.json()
      if (data.success) {
        setCourses(Array.isArray(data.data) ? data.data : [])
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err)
    } finally {
      setLoadingCourses(false)
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

    if (!formData.courseId) {
      setError('Please select a course for this assignment')
      return
    }

    if (!formData.dueDate) {
      setError('Please set a due date for this assignment')
      return
    }

    if (formData.title.length < 5) {
      setError('Title must be at least 5 characters long')
      return
    }

    if (formData.description.length < 10) {
      setError('Description must be at least 10 characters long')
      return
    }

    const maxScore = parseInt(formData.maxScore)
    if (isNaN(maxScore) || maxScore < 1 || maxScore > 1000) {
      setError('Max score must be between 1 and 1000')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          courseId: formData.courseId,
          dueDate: new Date(formData.dueDate).toISOString(),
          maxScore: maxScore,
          type: formData.type,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create assignment')
        return
      }

      // Success - redirect to assignments list
      router.push('/dashboard/assignments')
      router.refresh()
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/assignments">
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-foreground">Create Assignment</h1>
          <p className="text-muted-foreground mt-2">Add a new assignment to a course</p>
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
              <ClipboardList className="h-5 w-5 text-primary" />
              Assignment Information
            </CardTitle>
            <CardDescription>
              Enter the main details about the assignment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Assignment Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-bold text-foreground">
                Assignment Title *
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Week 1 - Introduction to React"
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
                Assignment Description *
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the assignment requirements and objectives..."
                value={formData.description}
                onChange={handleChange}
                required
                disabled={loading}
                rows={6}
                className="rounded-xl border-2"
              />
              <p className="text-xs text-muted-foreground">
                Detailed instructions for students (min. 10 characters)
              </p>
            </div>

            {/* Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-bold text-foreground">
                Type *
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'ASSIGNMENT' })}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    formData.type === 'ASSIGNMENT'
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/50'
                  }`}
                  disabled={loading}
                >
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    formData.type === 'ASSIGNMENT' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground">Assignment</div>
                    <div className="text-xs text-muted-foreground">Project or homework</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'QUIZ' })}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    formData.type === 'QUIZ'
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/50'
                  }`}
                  disabled={loading}
                >
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    formData.type === 'QUIZ' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground">Quiz</div>
                    <div className="text-xs text-muted-foreground">Test or exam</div>
                  </div>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course & Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Course & Settings
            </CardTitle>
            <CardDescription>
              Associate the assignment with a course and set parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Course Selection */}
            <div className="space-y-2">
              <Label htmlFor="courseId" className="text-sm font-bold text-foreground">
                Course *
              </Label>
              {loadingCourses ? (
                <div className="h-12 rounded-xl border-2 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <select
                  id="courseId"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full h-12 rounded-xl border-2 px-4 bg-background"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} - {course.teacher.name}
                    </option>
                  ))}
                </select>
              )}
              <p className="text-xs text-muted-foreground">
                {courses.length === 0 && !loadingCourses
                  ? 'No published courses available. Please publish a course first.'
                  : 'Choose the course this assignment belongs to'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Due Date */}
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-sm font-bold text-foreground">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Due Date *
                </Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  min={getMinDate()}
                  disabled={loading}
                  className="h-12 rounded-xl border-2"
                />
                <p className="text-xs text-muted-foreground">
                  Deadline for student submissions
                </p>
              </div>

              {/* Max Score */}
              <div className="space-y-2">
                <Label htmlFor="maxScore" className="text-sm font-bold text-foreground">
                  <Target className="h-4 w-4 inline mr-1" />
                  Maximum Score *
                </Label>
                <Input
                  id="maxScore"
                  name="maxScore"
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.maxScore}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="h-12 rounded-xl border-2"
                />
                <p className="text-xs text-muted-foreground">
                  Total points possible (1-1000)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <Link href="/dashboard/assignments" className="flex-1">
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
            disabled={loading || courses.length === 0}
            className="flex-1 h-12 rounded-full text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Assignment...
              </>
            ) : (
              <>
                <ClipboardList className="mr-2 h-5 w-5" />
                Create Assignment
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
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">After Creating</h3>
              <p className="text-sm text-muted-foreground">
                Once the assignment is created, students enrolled in the selected course will be able to view and submit their work. 
                You can track submissions and grade them in the Grades section. Students will receive notifications about new assignments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
