import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import DashboardStudent from '@/components/DashboardStudent'
import Navbar from '@/components/Navbar'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <DashboardStudent />
    </div>
  )
}


