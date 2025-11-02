import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import 'nprogress/nprogress.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SessionProvider from '@/components/SessionProvider'
import { Toaster } from 'react-hot-toast'
import ProgressBar from '@/components/ProgressBar'
import { generateAllBadgesCSS } from '@/lib/badge-css-generator'
import { prisma } from '@/lib/prisma'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  weight: ['600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Master Maths - École de Mathématiques en Ligne',
  description: 'Plateforme d\'apprentissage des mathématiques avec vidéos, QCM et suivi de performance',
  icons: {
    icon: '/images/master-maths-icon.png',
    apple: '/images/master-maths-icon.png',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Récupérer les badges Premium avec CSS personnalisé
  let badgesCSS = ''
  try {
    const premiumBadges = await prisma.badge.findMany({
      where: { useCustomCSS: true },
      select: { 
        id: true, 
        name: true, 
        customCSS: true, 
        useCustomCSS: true 
      }
    })
    badgesCSS = generateAllBadgesCSS(premiumBadges)
  } catch (error) {
    console.error('Erreur lors du chargement des badges Premium:', error)
  }

  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/images/master-maths-icon.png" type="image/png" />
        {/* CSS des badges Premium */}
        {badgesCSS && (
          <style dangerouslySetInnerHTML={{ __html: badgesCSS }} />
        )}
      </head>
      <body className={`${inter.variable} ${poppins.variable} ${inter.className}`}>
        <SessionProvider session={session}>
          <ProgressBar />
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#1E3A5F',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                fontFamily: 'Inter, sans-serif',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
                style: {
                  background: '#10b981',
                  color: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
                style: {
                  background: '#ef4444',
                  color: '#fff',
                },
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}
