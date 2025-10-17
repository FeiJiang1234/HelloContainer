import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { ErrorBoundary } from '@/components'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WebReact - Container Management',
  description: 'A modern Next.js React application for container management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-blue-600 text-white p-4 shadow-md">
          <div className="container-custom flex justify-between items-center">
            <Link href="/" className="text-xl font-bold hover:text-blue-200 transition-colors">
              WebReact
            </Link>
            <div className="space-x-6">
              <Link href="/" className="hover:text-blue-200 transition-colors">
                Home
              </Link>
              <Link href="/containers" className="hover:text-blue-200 transition-colors">
                Containers
              </Link>
            </div>
          </div>
        </nav>
        <main>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
        <footer className="bg-gray-800 text-white p-4 mt-8">
          <div className="container-custom text-center">
            <p>&copy; 2024 WebReact. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
