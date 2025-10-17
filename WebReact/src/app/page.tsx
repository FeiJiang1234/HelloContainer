import Link from 'next/link'
import { Button } from '@/components'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Hello WebReact
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Next.js + React + TypeScript + Tailwind CSS
        </p>
        <div className="space-x-4">
          <Link href="/containers">
            <Button variant="primary" size="lg">
              Container Management
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  )
}
