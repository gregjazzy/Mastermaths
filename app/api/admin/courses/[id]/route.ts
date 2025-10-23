import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * PUT /api/admin/courses/[id]
 * Modifie un cours
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, accessLevel, order } = body

    const course = await prisma.course.update({
      where: { id: params.id },
      data: {
        title,
        description: description || null,
        accessLevel,
        order
      }
    })

    return NextResponse.json({ course, success: true })
  } catch (error) {
    console.error('[COURSE PUT ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/courses/[id]
 * Supprime un cours et tout son contenu
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Supprimer le cours (CASCADE supprimera chapitres, sous-chapitres, leçons)
    await prisma.course.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[COURSE DELETE ERROR]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}


