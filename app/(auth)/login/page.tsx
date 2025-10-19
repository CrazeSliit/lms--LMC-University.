import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { LoginForm } from '@/components/forms/login-form'
import { BookOpen, Star, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Login - LMS',
  description: 'Login to your account',
}

export default async function LoginPage() {
  const session = await auth()
  
  // If already logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-12">
        {/* Decorative Stars */}
        <div className="absolute top-20 left-20 text-blue-200/40">
          <Star className="h-16 w-16" fill="currentColor" />
        </div>
        <div className="absolute top-40 right-32 text-purple-300/40">
          <Sparkles className="h-12 w-12" fill="currentColor" />
        </div>
        <div className="absolute bottom-32 left-1/4 text-blue-300/30">
          <Star className="h-10 w-10" fill="currentColor" />
        </div>
        <div className="absolute bottom-20 right-20 text-purple-200/40">
          <Sparkles className="h-8 w-8" fill="currentColor" />
        </div>
        <div className="absolute top-1/4 right-20 text-blue-100/50">
          <Star className="h-12 w-12" fill="currentColor" />
        </div>
        <div className="absolute bottom-1/3 left-16 text-purple-100/40">
          <Sparkles className="h-10 w-10" fill="currentColor" />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center max-w-2xl mx-auto">
          {/* Student Image with Badge */}
          <div className="relative mb-8">
            {/* Background Circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-br from-purple-200/60 to-purple-300/40" />
            </div>

            {/* Student Image */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="relative h-[800px] w-[10000px] flex items-center justify-center">
              <img 
                src="/home/Untitled design (2).png" 
                alt="Learning Platform Student" 
                className="h-full w-full object-contain"
              />
              </div>
            </div>

            {/* Enrollment Badge - Bottom Right */}
            
          </div>

          {/* Carousel Dots */}
         
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md space-y-5">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">LMS Platform</span>
          </div>

          {/* Header */}
          <div className="space-y-1.5">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Sign In
            </h2>
            <p className="text-base text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Login Form */}
          <div className="mt-6">
            <LoginForm />
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-muted-foreground">
                Quick Access
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Home
            </Link>
            <Link 
              href="#courses"
              className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
