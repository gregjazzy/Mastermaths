import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { EmailService } from '@/lib/email-service'

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name } = registerSchema.parse(body)

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Créer l'utilisateur avec le statut DEMO par défaut
    // (permet d'accéder au contenu de démonstration)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        status: 'DEMO', // Changé de FREE à DEMO
        isSubscribed: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
      }
    })

    // Envoyer un email de bienvenue
    try {
      await EmailService.sendWelcomeEmail(email, name)
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', emailError)
      // Ne pas bloquer l'inscription si l'email échoue
    }

    return NextResponse.json(
      { 
        message: 'Compte créé avec succès',
        user 
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Erreur lors de l\'inscription:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    )
  }
}

