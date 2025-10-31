'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, LayoutDashboard, LogOut, Crown, User, Trophy, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const user = session?.user as any
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
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
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/cours" className="flex items-center gap-3">
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

              {/* Menu Desktop */}
              <div className="hidden md:flex items-center gap-4">
                <Link href="/cours" className="nav-link">
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Mes cours
                </Link>
                <Link href="/dashboard" className="nav-link">
                  <LayoutDashboard className="w-4 h-4 inline mr-2" />
                  Statistiques
                </Link>
                <Link href="/hall-of-fame" className="nav-link">
                  <Trophy className="w-4 h-4 inline mr-2" />
                  Hall of Fame
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Bouton Premium */}
              {user?.status !== 'PREMIUM' && (
                <Link 
                  href="/upgrade" 
                  className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-master-turquoise to-master-turquoise-dark text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  <Crown className="w-4 h-4" />
                  Passer à Premium
                </Link>
              )}

              {/* Info utilisateur (desktop) */}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">
                  {user?.status === 'PREMIUM' && '👑 Premium'}
                  {user?.status === 'DEMO' && '⚡ Démo'}
                  {user?.status === 'FREE' && '🆓 Gratuit'}
                </p>
              </div>
              
              {/* Bouton déconnexion (desktop) */}
              <button
                onClick={handleSignOut}
                className="hidden sm:block p-2 text-gray-600 hover:text-master-turquoise hover:bg-gray-100 rounded-lg transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="w-5 h-5" />
              </button>

              {/* Bouton menu hamburger (mobile) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-master-turquoise hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Mobile Slide-in */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-16 right-0 bottom-0 w-80 bg-white shadow-2xl z-40 md:hidden overflow-y-auto">
            <div className="p-6">
              {/* Info utilisateur */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-master-turquoise/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-master-turquoise" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">
                      {user?.status === 'PREMIUM' && '👑 Premium'}
                      {user?.status === 'DEMO' && '⚡ Démo'}
                      {user?.status === 'FREE' && '🆓 Gratuit'}
                    </p>
                  </div>
                </div>
                {user?.status !== 'PREMIUM' && (
                  <Link 
                    href="/upgrade"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-master-turquoise to-master-turquoise-dark text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all w-full"
                  >
                    <Crown className="w-4 h-4" />
                    Passer à Premium
                  </Link>
                )}
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <Link 
                  href="/cours"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-master-turquoise/10 hover:text-master-turquoise rounded-lg transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">Mes cours</span>
                </Link>

                <Link 
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-master-turquoise/10 hover:text-master-turquoise rounded-lg transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="font-medium">Statistiques</span>
                </Link>

                <Link 
                  href="/hall-of-fame"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-master-turquoise/10 hover:text-master-turquoise rounded-lg transition-colors"
                >
                  <Trophy className="w-5 h-5" />
                  <span className="font-medium">Hall of Fame</span>
                </Link>
              </nav>

              {/* Déconnexion */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleSignOut()
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Se déconnecter</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

