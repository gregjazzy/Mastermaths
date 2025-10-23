import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // Gérer les différents événements
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      
      // Mettre à jour l'utilisateur à PREMIUM
      if (session.metadata?.userId) {
        await prisma.user.update({
          where: { id: session.metadata.userId },
          data: {
            status: 'PREMIUM',
            isSubscribed: true,
            subscriptionId: session.subscription as string,
          }
        })
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      
      // Mettre à jour le statut de l'abonnement
      const user = await prisma.user.findFirst({
        where: { subscriptionId: subscription.id }
      })

      if (user) {
        const isActive = subscription.status === 'active' || subscription.status === 'trialing'
        await prisma.user.update({
          where: { id: user.id },
          data: {
            isSubscribed: isActive,
            status: isActive ? 'PREMIUM' : 'FREE',
          }
        })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      
      // Révoquer l'accès premium
      const user = await prisma.user.findFirst({
        where: { subscriptionId: subscription.id }
      })

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            isSubscribed: false,
            status: 'FREE',
            subscriptionId: null,
          }
        })
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      
      // Gérer l'échec de paiement
      if (invoice.customer) {
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: invoice.customer as string }
        })

        if (user) {
          // Optionnel : envoyer un email de notification
          console.log(`Paiement échoué pour l'utilisateur ${user.email}`)
        }
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}


