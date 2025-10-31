import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const dsList = await prisma.dSBanque.findMany({
      where: { isPublic: true },
      orderBy: [
        { viewCount: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(dsList)
  } catch (error) {
    console.error('Erreur lors de la récupération des DS:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

