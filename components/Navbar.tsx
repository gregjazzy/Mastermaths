'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, LayoutDashboard, LogOut, Crown, User, Trophy } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const user = session?.user as any

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-3">
              {/* Logo Master Maths */}
              <div className="relative w-10 h-10">
                <Image
                  src="/images/master-maths-logo.jpg"
                  alt="Master Maths Logo"
                  fill
                  className="object-contain"
                  priority
                  onError={(e) => {
                    // Fallback vers l'icône si l'image n'existe pas
                    e.currentTarget.style.display = 'none'
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = 'block'
                  }}
                />
                <BookOpen className="w-10 h-10 text-master-turquoise hidden" />
              </div>
              <span className="text-xl font-bold text-master-dark">Master Maths</span>
            </Link>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/dashboard" className="nav-link">
                <LayoutDashboard className="w-4 h-4 inline mr-2" />
                Dashboard
              </Link>
              <Link href="/cours" className="nav-link">
                <BookOpen className="w-4 h-4 inline mr-2" />
                Mes cours
              </Link>
              <Link href="/hall-of-fame" className="nav-link">
                <Trophy className="w-4 h-4 inline mr-2" />
                Hall of Fame
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user?.status !== 'PREMIUM' && (
              <Link 
                href="/upgrade" 
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-master-turquoise to-master-turquoise-dark text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Crown className="w-4 h-4" />
                Passer à Premium
              </Link>
            )}

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">
                  {user?.status === 'PREMIUM' && '👑 Premium'}
                  {user?.status === 'DEMO' && '⚡ Démo'}
                  {user?.status === 'FREE' && '🆓 Gratuit'}
                </p>
              </div>
              <button
                onClick={async () => {
                  // Finaliser la session de tracking avant de se déconnecter
                  const sessionId = sessionStorage.getItem('activeSessionId')
                  if (sessionId) {
                    try {
                      await fetch('/api/engagement/disconnect', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ sessionId }),
                        keepalive: true
                      })
                      sessionStorage.removeItem('activeSessionId')
                    } catch (error) {
                      console.error('Erreur finalisation session:', error)
                    }
                  }
                  // Déconnexion NextAuth
                  await signOut({ callbackUrl: '/' })
                }}
                className="p-2 text-gray-600 hover:text-master-turquoise hover:bg-gray-100 rounded-lg transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

