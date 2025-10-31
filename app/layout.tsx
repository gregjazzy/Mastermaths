import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SessionProvider from '@/components/SessionProvider'

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

  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/images/master-maths-icon.png" type="image/png" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} ${inter.className}`}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
