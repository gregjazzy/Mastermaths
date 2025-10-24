import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'


/**
 * GET /api/admin/courses
 * Récupère tous les cours
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const courses = await prisma.course.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { chapters: true }
        }
      }
    })

    return NextResponse.json({ courses })
  } catch (error) {
    console.error('[COURSES GET ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * POST /api/admin/courses
 * Crée un nouveau cours
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, order } = body

    const course = await prisma.course.create({
      data: {
        title,
        description: description || null,
        order: order || 1
      }
    })

    return NextResponse.json({ course, success: true })
  } catch (error) {
    console.error('[COURSES POST ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}


