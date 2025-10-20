'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  BarChart3, 
  Search, 
  TrendingUp,
  TrendingDown,
  Award,
  FileText,
  Users,
  CheckCircle
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'

interface Grade {
  id: string
  score: number
  maxScore: number
  feedback: string | null
  gradedAt: string
  student: {
    id: string
    name: string
    email: string
  }
  assignment?: {
    id: string
    title: string
    course: {
      title: string
    }
  } | null
  quiz?: {
    id: string
    title: string
    course: {
      title: string
    }
  } | null
}

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchGrades()
  }, [])

  const fetchGrades = async () => {
    try {
      const response = await fetch('/api/grades')
      const data = await response.json()
      if (data.success) {
        setGrades(Array.isArray(data.data) ? data.data : [])
      }
    } catch (error) {
      console.error('Failed to fetch grades:', error)
      setGrades([])
    } finally {
      setLoading(false)
    }
  }

  const filteredGrades = grades.filter(grade =>
    grade.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    grade.student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (grade.assignment?.title || grade.quiz?.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const averageScore = grades.length > 0
    ? (grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length).toFixed(1)
    : 0

  const passRate = grades.length > 0
    ? ((grades.filter(g => (g.score / g.maxScore) * 100 >= 60).length / grades.length) * 100).toFixed(1)
    : 0

  // Grade distribution data
  const gradeDistribution = [
    { grade: 'A (90-100)', count: grades.filter(g => (g.score / g.maxScore) * 100 >= 90).length },
    { grade: 'B (80-89)', count: grades.filter(g => {
      const percent = (g.score / g.maxScore) * 100
      return percent >= 80 && percent < 90
    }).length },
    { grade: 'C (70-79)', count: grades.filter(g => {
      const percent = (g.score / g.maxScore) * 100
      return percent >= 70 && percent < 80
    }).length },
    { grade: 'D (60-69)', count: grades.filter(g => {
      const percent = (g.score / g.maxScore) * 100
      return percent >= 60 && percent < 70
    }).length },
    { grade: 'F (<60)', count: grades.filter(g => (g.score / g.maxScore) * 100 < 60).length },
  ]

  const getGradeColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 80) return 'text-blue-600'
    if (percentage >= 70) return 'text-yellow-600'
    if (percentage >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const getGradeLetter = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return 'A'
    if (percentage >= 80) return 'B'
    if (percentage >= 70) return 'C'
    if (percentage >= 60) return 'D'
    return 'F'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Grades Management</h1>
          <p className="text-muted-foreground mt-2">Track and analyze student performance</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by student name, email, or assignment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Grades
            </CardTitle>
            <BarChart3 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{grades.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Score
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{averageScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pass Rate
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{passRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              A Grades
            </CardTitle>
            <Award className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {grades.filter(g => (g.score / g.maxScore) * 100 >= 90).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grade Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Grade Distribution
          </CardTitle>
          <CardDescription>Overview of grade performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#1e9df1" name="Number of Students" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Grades</CardTitle>
          <CardDescription>{filteredGrades.length} grades recorded</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : filteredGrades.length === 0 ? (
            <div className="text-center py-20">
              <BarChart3 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No grades found</h3>
              <p className="text-muted-foreground">Try adjusting your search</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Student</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Assignment/Quiz</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Course</th>
                    <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">Score</th>
                    <th className="text-center py-3 px-4 font-semibold text-sm text-muted-foreground">Grade</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">Graded</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrades.map((grade) => {
                    const percentage = ((grade.score / grade.maxScore) * 100).toFixed(1)
                    const letter = getGradeLetter(grade.score, grade.maxScore)
                    const colorClass = getGradeColor(grade.score, grade.maxScore)

                    return (
                      <tr key={grade.id} className="border-b hover:bg-accent/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {grade.student.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-foreground">{grade.student.name}</div>
                              <div className="text-sm text-muted-foreground">{grade.student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">
                              {grade.assignment?.title || grade.quiz?.title || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-muted-foreground">
                            {grade.assignment?.course.title || grade.quiz?.course.title || 'N/A'}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className={`font-bold ${colorClass}`}>
                            {grade.score} / {grade.maxScore}
                          </div>
                          <div className="text-xs text-muted-foreground">{percentage}%</div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className={`inline-flex items-center justify-center h-10 w-10 rounded-full font-bold text-lg ${
                            letter === 'A' ? 'bg-green-100 text-green-700' :
                            letter === 'B' ? 'bg-blue-100 text-blue-700' :
                            letter === 'C' ? 'bg-yellow-100 text-yellow-700' :
                            letter === 'D' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {letter}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-muted-foreground">
                            {new Date(grade.gradedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
