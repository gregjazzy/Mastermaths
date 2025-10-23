import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuth = !!token
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  const isCourse = request.nextUrl.pathname.startsWith('/cours')

  // Rediriger vers login si pas authentifié et essaie d'accéder à une page protégée
  if (!isAuth && (isDashboard || isCourse)) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Rediriger vers dashboard si déjà authentifié et sur page auth
  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Vérifier l'accès au contenu basé sur le statut
  if (isAuth && isCourse) {
    const userStatus = (token as any).status as string
    
    // Les utilisateurs FREE ne peuvent accéder qu'aux pages marketing
    if (userStatus === 'FREE' && !request.nextUrl.pathname.startsWith('/cours/demo')) {
      return NextResponse.redirect(new URL('/upgrade', request.url))
    }
    
    // Les utilisateurs DEMO ne peuvent accéder qu'au contenu de démo + contenu FREE
    if (userStatus === 'DEMO' && !request.nextUrl.pathname.includes('/demo/')) {
      // Vérifier si c'est un cours de démo (à implémenter avec la logique métier)
      // Pour l'instant, on autorise l'accès
    }
    
    // Les utilisateurs PREMIUM ont accès à tout
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/cours/:path*', '/auth/:path*']
}


