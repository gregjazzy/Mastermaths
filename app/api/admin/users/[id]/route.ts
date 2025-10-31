import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT : Mettre à jour un utilisateur
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        status: data.status
      }
    })
    
    return NextResponse.json({ user })
  } catch (error) {
    console.error('Erreur PUT user:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE : Supprimer un utilisateur
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur DELETE user:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

