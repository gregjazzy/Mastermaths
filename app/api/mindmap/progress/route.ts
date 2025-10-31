import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET: Récupérer la progression pour un chapitre
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const chapterId = searchParams.get('chapterId')

    if (!chapterId) {
      return NextResponse.json({ error: 'chapterId requis' }, { status: 400 })
    }

    // Récupérer tous les concepts cochés pour ce chapitre
    const progress = await prisma.mentalMapProgress.findMany({
      where: {
        userId: user.id,
        chapterId,
        isChecked: true
      },
      select: {
        conceptKey: true
      }
    })

    const checkedConcepts = progress.map(p => p.conceptKey)

    return NextResponse.json({ checkedConcepts })
  } catch (error) {
    console.error('Erreur récupération progression Mind Map:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST: Sauvegarder/Mettre à jour un concept
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const { chapterId, conceptKey, isChecked } = await request.json()

    if (!chapterId || !conceptKey || typeof isChecked !== 'boolean') {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      )
    }

    // Upsert (créer ou mettre à jour)
    const progress = await prisma.mentalMapProgress.upsert({
      where: {
        userId_chapterId_conceptKey: {
          userId: user.id,
          chapterId,
          conceptKey
        }
      },
      create: {
        userId: user.id,
        chapterId,
        conceptKey,
        isChecked,
        checkedAt: isChecked ? new Date() : null
      },
      update: {
        isChecked,
        checkedAt: isChecked ? new Date() : null
      }
    })

    return NextResponse.json({ success: true, progress })
  } catch (error) {
    console.error('Erreur sauvegarde progression Mind Map:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

