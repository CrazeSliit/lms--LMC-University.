'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, GraduationCap, Award, Facebook, Twitter, Instagram, Linkedin, Star, Sparkles } from 'lucide-react'

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const benefitImages = [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&h=600&fit=crop',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % benefitImages.length)
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [])
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto flex h-20 items-center justify-between px-8">
          <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden">
          <img src="/Logo/LOG.png" alt="LMC University Logo" className="h-full w-full object-contain" />
        </div>
        <span className="text-2xl font-bold text-foreground">LMC University</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
        <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
          Home
        </Link>
        <Link href="/courses" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Courses
        </Link>
        <Link href="#instructors" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Instructors
        </Link>
        <Link href="#contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Contact
        </Link>
          </nav>
          <div className="flex items-center gap-3">
        <Link href="/login">
          <Button variant="ghost" className="font-medium">Login</Button>
        </Link>
        <Link href="/register">
          <Button className="rounded-full px-6 font-medium">Sign Up</Button>
        </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 relative overflow-hidden">
        <div className="container mx-auto px-8 py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div className="relative z-10 space-y-8">
              {/* Decorative Stars */}
              <div className="absolute -left-8 -top-8 text-primary/20">
                <Star className="h-12 w-12" fill="currentColor" />
              </div>
              <div className="absolute -top-4 left-20 text-purple-300/40">
                <Sparkles className="h-8 w-8" fill="currentColor" />
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl font-bold leading-tight text-foreground lg:text-6xl">
                  Enhance Your Skills<br />
                  With <span className="text-primary">Our Online</span><br />
                  <span className="text-primary">Courses</span>
                </h1>
                <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
                  Dive into a World of Knowledge with Our Comprehensive and Engaging
                  Online Courses Designed for Skill Enhancement
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="rounded-full px-8 font-medium shadow-lg shadow-primary/25">
                    Apply Now
                  </Button>
                </Link>
                <Link href="#courses">
                  <Button size="lg" variant="outline" className="rounded-full px-8 font-medium">
                    Know More
                  </Button>
                </Link>
              </div>

              {/* Social Links & Contact */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Call Us : 000 0000 0000</p>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -right-4 top-0 text-blue-200/30">
                <Star className="h-16 w-16" fill="currentColor" />
              </div>
              <div className="absolute right-1/4 top-12 text-purple-300/40">
                <Sparkles className="h-10 w-10" fill="currentColor" />
              </div>
              <div className="absolute bottom-20 left-8 text-blue-300/30">
                <Star className="h-10 w-10" fill="currentColor" />
              </div>

              {/* Main Image Container */}
              <div className="relative">
                {/* Background Circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/20 to-purple-400/20" />
                </div>

                {/* Student Image Placeholder */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="relative h-[650px] w-[550px] rounded-3xl overflow-hidden">
                  <img 
                  src="/home/pack01.png" 
                  alt="Student with Books" 
                  className="h-full w-full object-cover"
                  />
                  </div>
                </div>

                {/* Stats Badge */}
                <div className="absolute bottom-8 right-8 z-20 rounded-full bg-white p-6 shadow-2xl border border-border">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <div className="h-10 w-10 rounded-full bg-primary border-2 border-white flex items-center justify-center text-white text-xs font-bold">A</div>
                      <div className="h-10 w-10 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">B</div>
                      <div className="h-10 w-10 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">C</div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">30K</p>
                      <p className="text-sm text-muted-foreground">Enrolled Students</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carousel Dots */}
              <div className="mt-8 flex items-center justify-center gap-2">
                <div className="h-3 w-3 rounded-full bg-foreground" />
                <div className="h-3 w-3 rounded-full bg-primary" />
                <div className="h-3 w-3 rounded-full bg-foreground" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-8">
          <h2 className="mb-4 text-center text-4xl font-bold text-foreground">
            Everything You Need to Manage Learning
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-muted-foreground">
            Comprehensive tools and features designed to enhance your educational experience
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="group text-center space-y-4 rounded-2xl p-6 transition-all hover:bg-primary/5">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-100 group-hover:bg-primary group-hover:scale-110 transition-all">
                <BookOpen className="h-10 w-10 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Course Management</h3>
              <p className="text-muted-foreground leading-relaxed">
                Create and organize courses with lessons, assignments, and quizzes
              </p>
            </div>

            <div className="group text-center space-y-4 rounded-2xl p-6 transition-all hover:bg-primary/5">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-green-100 group-hover:bg-green-500 group-hover:scale-110 transition-all">
                <Users className="h-10 w-10 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Student Enrollment</h3>
              <p className="text-muted-foreground leading-relaxed">
                Easily enroll students and manage class rosters
              </p>
            </div>

            <div className="group text-center space-y-4 rounded-2xl p-6 transition-all hover:bg-primary/5">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-100 group-hover:bg-purple-500 group-hover:scale-110 transition-all">
                <GraduationCap className="h-10 w-10 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Grade Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track student progress with comprehensive grade reports
              </p>
            </div>

            <div className="group text-center space-y-4 rounded-2xl p-6 transition-all hover:bg-primary/5">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-100 group-hover:bg-orange-500 group-hover:scale-110 transition-all">
                <Award className="h-10 w-10 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Assessments</h3>
              <p className="text-muted-foreground leading-relaxed">
                Create assignments and quizzes with automatic grading
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 py-20">
        <div className="container mx-auto px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-primary">30K+</div>
              <div className="text-lg font-medium text-foreground">Active Students</div>
              <div className="text-sm text-muted-foreground">Learning and growing daily</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-primary">500+</div>
              <div className="text-lg font-medium text-foreground">Expert Instructors</div>
              <div className="text-sm text-muted-foreground">Industry professionals</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-primary">1000+</div>
              <div className="text-lg font-medium text-foreground">Online Courses</div>
              <div className="text-sm text-muted-foreground">Diverse learning topics</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-primary">95%</div>
              <div className="text-lg font-medium text-foreground">Success Rate</div>
              <div className="text-sm text-muted-foreground">Student satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-8">
          <h2 className="mb-4 text-center text-4xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-muted-foreground">
            Get started with our simple three-step process
          </p>
          <div className="grid gap-12 md:grid-cols-3">
            <div className="space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold text-foreground">Create Account</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sign up for free and choose your learning path. Set up your profile and preferences in minutes.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold text-foreground">Choose Courses</h3>
              <p className="text-muted-foreground leading-relaxed">
                Browse our extensive catalog and enroll in courses that match your goals and interests.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold text-foreground">Start Learning</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access course materials anytime, complete assignments, and track your progress towards certification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 py-20">
        <div className="container mx-auto px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-foreground">
                Why Choose Our Platform
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our learning management system offers unique advantages that set us apart from traditional education platforms.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 mt-1">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Flexible Learning Schedule</h3>
                    <p className="text-muted-foreground">Learn at your own pace, anytime and anywhere. Access course materials 24/7.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 mt-1">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Expert Instructors</h3>
                    <p className="text-muted-foreground">Learn from industry professionals with years of real-world experience.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 mt-1">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Interactive Learning</h3>
                    <p className="text-muted-foreground">Engage with multimedia content, quizzes, and hands-on assignments.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 mt-1">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Certification & Recognition</h3>
                    <p className="text-muted-foreground">Earn certificates upon completion to showcase your achievements.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              {benefitImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Learning Platform ${index + 1}`}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-2xl font-bold">Transform Your Future</p>
                <p className="text-sm mt-2">Join thousands of successful learners</p>
              </div>
              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {benefitImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-8">
          <h2 className="mb-4 text-center text-4xl font-bold text-foreground">
            Popular Courses
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-muted-foreground">
            Explore our most sought-after courses
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop" 
                  alt="Web Development Course"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>2,500 Students</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">Web Development Fundamentals</h3>
                <p className="text-muted-foreground">Master HTML, CSS, and JavaScript from scratch with hands-on projects.</p>
                <div className="flex items-center justify-between pt-4">
                  <span className="text-2xl font-bold text-primary">$99</span>
                  <Link href="/login">
                    <Button className="rounded-full">Enroll Now</Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop" 
                  alt="Data Science Course"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>1,800 Students</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">Data Science & Analytics</h3>
                <p className="text-muted-foreground">Learn data analysis, visualization, and machine learning techniques.</p>
                <div className="flex items-center justify-between pt-4">
                  <span className="text-2xl font-bold text-primary">$149</span>
                  <Link href="/login">
                    <Button className="rounded-full">Enroll Now</Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop" 
                  alt="Digital Marketing Course"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>3,200 Students</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">Digital Marketing Mastery</h3>
                <p className="text-muted-foreground">Comprehensive guide to SEO, social media, and content marketing.</p>
                <div className="flex items-center justify-between pt-4">
                  <span className="text-2xl font-bold text-primary">$79</span>
                  <Link href="/login">
                    <Button className="rounded-full">Enroll Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/login">
              <Button size="lg" variant="outline" className="rounded-full px-8">
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 py-20">
        <div className="container mx-auto px-8">
          <h2 className="mb-4 text-center text-4xl font-bold text-foreground">
            What Our Students Say
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-muted-foreground">
            Real feedback from our learning community
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-2xl p-8 space-y-4">
              <div className="flex gap-1 text-yellow-400">
                ★★★★★
              </div>
              <p className="text-muted-foreground leading-relaxed">
                &ldquo;This platform transformed my career. The courses are well-structured and the instructors are incredibly knowledgeable.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div>
                  <div className="font-bold text-foreground">John Doe</div>
                  <div className="text-sm text-muted-foreground">Software Engineer</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 space-y-4">
              <div className="flex gap-1 text-yellow-400">
                ★★★★★
              </div>
              <p className="text-muted-foreground leading-relaxed">
                &ldquo;The flexibility to learn at my own pace while working full-time was exactly what I needed. Highly recommend!&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4">
                <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                  SM
                </div>
                <div>
                  <div className="font-bold text-foreground">Sarah Miller</div>
                  <div className="text-sm text-muted-foreground">Marketing Manager</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 space-y-4">
              <div className="flex gap-1 text-yellow-400">
                ★★★★★
              </div>
              <p className="text-muted-foreground leading-relaxed">
                &ldquo;Excellent course content and great support from the community. I&apos;ve gained practical skills I use every day.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  MC
                </div>
                <div>
                  <div className="font-bold text-foreground">Michael Chen</div>
                  <div className="text-sm text-muted-foreground">Data Analyst</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-8 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            Join thousands of students already learning with us. Create your account today and get access to our entire course library.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="rounded-full px-8 font-semibold">
                Get Started Free
              </Button>
            </Link>
            <Link href="#courses">
              <Button size="lg" variant="outline" className="rounded-full px-8 font-semibold bg-white/10 text-white border-white/20 hover:bg-white/20">
                Explore Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">LMS Platform</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2025 LMS Platform. Built with Next.js and Prisma.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <span className="text-muted-foreground">•</span>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
