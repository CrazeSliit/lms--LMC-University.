'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  User, 
  Mail,
  Shield,
  GraduationCap,
  UserCog,
  Loader2,
  Save,
  Edit,
  X,
  Camera,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Award
} from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'TEACHER' | 'STUDENT'
  bio?: string
  phone?: string
  address?: string
  avatar?: string
  department?: string
  expertise?: string
  enrollmentYear?: string
  studentId?: string
  createdAt: string
  _count?: {
    enrollments?: number
    taughtCourses?: number
    submissions?: number
  }
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    address: '',
    avatar: '',
    department: '',
    expertise: '',
    enrollmentYear: '',
    studentId: ''
  })

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      const data = await response.json()
      if (data.success) {
        setProfile(data.data)
        setFormData({
          name: data.data.name || '',
          bio: data.data.bio || '',
          phone: data.data.phone || '',
          address: data.data.address || '',
          avatar: data.data.avatar || '',
          department: data.data.department || '',
          expertise: data.data.expertise || '',
          enrollmentYear: data.data.enrollmentYear || '',
          studentId: data.data.studentId || ''
        })
      }
    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to update profile')
        return
      }

      setProfile(data.data)
      setSuccess('Profile updated successfully!')
      setEditing(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        address: profile.address || '',
        avatar: profile.avatar || '',
        department: profile.department || '',
        expertise: profile.expertise || '',
        enrollmentYear: profile.enrollmentYear || '',
        studentId: profile.studentId || ''
      })
    }
    setEditing(false)
    setError('')
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Shield className="h-5 w-5" />
      case 'TEACHER': return <UserCog className="h-5 w-5" />
      case 'STUDENT': return <GraduationCap className="h-5 w-5" />
      default: return <User className="h-5 w-5" />
    }
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-700 border-red-200'
      case 'TEACHER': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'STUDENT': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load profile</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-2">View and manage your account information</p>
        </div>
        {!editing && (
          <Button 
            onClick={() => setEditing(true)}
            className="rounded-full"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Header Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                {editing && (
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getRoleBadgeClass(profile.role)}`}>
                    {getRoleIcon(profile.role)}
                    {profile.role}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Mail className="h-4 w-4" />
                  <span>{profile.email}</span>
                </div>
                {profile.bio && !editing && (
                  <p className="text-muted-foreground">{profile.bio}</p>
                )}
                
                {/* Stats */}
                <div className="flex gap-6 mt-4">
                  {profile.role === 'STUDENT' && profile._count && (
                    <>
                      <div>
                        <div className="text-2xl font-bold text-foreground">{profile._count.enrollments || 0}</div>
                        <div className="text-xs text-muted-foreground">Enrolled Courses</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">{profile._count.submissions || 0}</div>
                        <div className="text-xs text-muted-foreground">Submissions</div>
                      </div>
                    </>
                  )}
                  {profile.role === 'TEACHER' && profile._count && (
                    <div>
                      <div className="text-2xl font-bold text-foreground">{profile._count.taughtCourses || 0}</div>
                      <div className="text-xs text-muted-foreground">Courses Teaching</div>
                    </div>
                  )}
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric' })}
                    </div>
                    <div className="text-xs text-muted-foreground">Member Since</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>
              {editing ? 'Update your personal details' : 'Your personal details'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold text-foreground">
                Full Name
              </Label>
              {editing ? (
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={saving}
                  className="h-12 rounded-xl border-2"
                />
              ) : (
                <p className="text-foreground py-2">{profile.name}</p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-bold text-foreground">
                Bio
              </Label>
              {editing ? (
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={saving}
                  rows={3}
                  placeholder="Tell us about yourself..."
                  className="rounded-xl border-2"
                />
              ) : (
                <p className="text-muted-foreground py-2">{profile.bio || 'No bio provided'}</p>
              )}
            </div>

            {/* Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-bold text-foreground">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone Number
                </Label>
                {editing ? (
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={saving}
                    placeholder="+1 (555) 123-4567"
                    className="h-12 rounded-xl border-2"
                  />
                ) : (
                  <p className="text-foreground py-2">{profile.phone || 'Not provided'}</p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-bold text-foreground">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Address
                </Label>
                {editing ? (
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={saving}
                    placeholder="City, Country"
                    className="h-12 rounded-xl border-2"
                  />
                ) : (
                  <p className="text-foreground py-2">{profile.address || 'Not provided'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role-Specific Information */}
        {profile.role === 'TEACHER' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Teaching Information
              </CardTitle>
              <CardDescription>
                {editing ? 'Update your teaching credentials' : 'Your teaching credentials'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department */}
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-bold text-foreground">
                    Department
                  </Label>
                  {editing ? (
                    <Input
                      id="department"
                      name="department"
                      type="text"
                      value={formData.department}
                      onChange={handleChange}
                      disabled={saving}
                      placeholder="e.g., Computer Science"
                      className="h-12 rounded-xl border-2"
                    />
                  ) : (
                    <p className="text-foreground py-2">{profile.department || 'Not specified'}</p>
                  )}
                </div>

                {/* Expertise */}
                <div className="space-y-2">
                  <Label htmlFor="expertise" className="text-sm font-bold text-foreground">
                    <Award className="h-4 w-4 inline mr-1" />
                    Area of Expertise
                  </Label>
                  {editing ? (
                    <Input
                      id="expertise"
                      name="expertise"
                      type="text"
                      value={formData.expertise}
                      onChange={handleChange}
                      disabled={saving}
                      placeholder="e.g., Web Development, AI"
                      className="h-12 rounded-xl border-2"
                    />
                  ) : (
                    <p className="text-foreground py-2">{profile.expertise || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {profile.role === 'STUDENT' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Student Information
              </CardTitle>
              <CardDescription>
                {editing ? 'Update your student details' : 'Your student details'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student ID */}
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="text-sm font-bold text-foreground">
                    Student ID
                  </Label>
                  {editing ? (
                    <Input
                      id="studentId"
                      name="studentId"
                      type="text"
                      value={formData.studentId}
                      onChange={handleChange}
                      disabled={saving}
                      placeholder="e.g., STU2025001"
                      className="h-12 rounded-xl border-2"
                    />
                  ) : (
                    <p className="text-foreground py-2">{profile.studentId || 'Not assigned'}</p>
                  )}
                </div>

                {/* Enrollment Year */}
                <div className="space-y-2">
                  <Label htmlFor="enrollmentYear" className="text-sm font-bold text-foreground">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Enrollment Year
                  </Label>
                  {editing ? (
                    <Input
                      id="enrollmentYear"
                      name="enrollmentYear"
                      type="text"
                      value={formData.enrollmentYear}
                      onChange={handleChange}
                      disabled={saving}
                      placeholder="e.g., 2025"
                      className="h-12 rounded-xl border-2"
                    />
                  ) : (
                    <p className="text-foreground py-2">{profile.enrollmentYear || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {editing && (
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 h-12 rounded-full"
            >
              <X className="mr-2 h-5 w-5" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 h-12 rounded-full text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
