import React from 'react'
import AuthenticatedNavbar from './AuthenticatedNavbar'

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      <AuthenticatedNavbar />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
    </div>
  )
}
