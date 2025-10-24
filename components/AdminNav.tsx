'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, FileText, List, Home } from 'lucide-react'

export default function AdminNav() {
  const pathname = usePathname()

  const links = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/courses', label: 'Cours', icon: BookOpen },
    { href: '/admin/chapters', label: 'Chapitres', icon: FileText },
    { href: '/admin/lessons', label: 'Leçons', icon: List },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2 font-bold text-master-dark">
            <span className="text-2xl">⚙️</span>
            <span className="hidden sm:block">Admin Master Maths</span>
          </Link>

          {/* Navigation links */}
          <div className="flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                    ${isActive 
                      ? 'bg-master-turquoise text-white font-semibold' 
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:block">{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Lien retour au site */}
          <Link
            href="/dashboard"
            className="btn-outline text-sm py-2 px-3"
          >
            Retour site
          </Link>
        </div>
      </div>
    </nav>
  )
}

