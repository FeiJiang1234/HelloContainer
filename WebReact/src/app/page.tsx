import Link from 'next/link'
import { Button } from '@/components'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="space-x-4">
          <Link href="/containers">
            <Button variant="primary" size="lg">
              Container Management
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
