import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuth = !!token
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  const isCourse = request.nextUrl.pathname.startsWith('/cours')
  const isAdmin = request.nextUrl.pathname.startsWith('/admin')

  // 🔒 BLOQUER /admin en production
  if (isAdmin && process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Accès admin désactivé en production. Utilisez votre environnement local.' },
      { status: 403 }
    )
  }

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
    console.log('🔍 MIDDLEWARE:', {
      pathname: request.nextUrl.pathname,
      userStatus: userStatus,
      tokenEmail: (token as any).email
    })
    
    // Les utilisateurs PREMIUM ont accès à tout
    if (userStatus === 'PREMIUM') {
      console.log('✅ MIDDLEWARE: PREMIUM user, allowing access')
      return NextResponse.next()
    }
    
    // Les utilisateurs FREE ne peuvent accéder qu'à la page /cours (liste)
    if (userStatus === 'FREE') {
      if (request.nextUrl.pathname === '/cours') {
        console.log('✅ MIDDLEWARE: FREE user accessing /cours list')
        return NextResponse.next()
      }
      console.log('❌ MIDDLEWARE: FREE user blocked, redirecting to /upgrade')
      return NextResponse.redirect(new URL('/upgrade', request.url))
    }
    
    // Les utilisateurs DEMO ont accès à /cours ET aux cours démo
    if (userStatus === 'DEMO') {
      // Autoriser l'accès à la liste des cours
      if (request.nextUrl.pathname === '/cours') {
        console.log('✅ MIDDLEWARE: DEMO user accessing /cours list')
        return NextResponse.next()
      }
      
      console.log('✅ MIDDLEWARE: DEMO user accessing course page, allowing (check will be done in page)')
      // Pour les cours individuels, la vérification isDemoContent 
      // se fait au niveau de la page (pas dans le middleware pour éviter 
      // des requêtes DB à chaque navigation)
      // On autorise l'accès et la page redirigera si nécessaire
      return NextResponse.next()
    }
    
    console.log('⚠️ MIDDLEWARE: Unknown status or no status, redirecting to /upgrade')
    return NextResponse.redirect(new URL('/upgrade', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/cours/:path*', '/auth/:path*', '/admin/:path*']
}


