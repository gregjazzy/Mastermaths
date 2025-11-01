import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { EmailService } from '@/lib/email-service'

const prisma = new PrismaClient()

/**
 * Cron Job : Envoie les bilans d'orientation qui ont été générés il y a 5 jours
 * À exécuter quotidiennement (ex: tous les jours à 9h)
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier le token de sécurité
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (token !== process.env.CRON_SECRET_TOKEN) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Calculer la date il y a 5 jours
    const fiveDaysAgo = new Date()
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5)
    fiveDaysAgo.setHours(0, 0, 0, 0) // Début de la journée

    const sixDaysAgo = new Date()
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6)
    sixDaysAgo.setHours(0, 0, 0, 0)

    // Récupérer les bilans COMPLETED créés il y a exactement 5 jours
    const bilans = await prisma.orientationBilan.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: sixDaysAgo,   // >= il y a 6 jours
          lt: fiveDaysAgo,   // < il y a 5 jours
        },
      },
      include: {
        user: true,
      },
    })

    console.log(`📧 ${bilans.length} bilan(s) à envoyer (créés il y a 5 jours)`)

    let successCount = 0
    let errorCount = 0

    for (const bilan of bilans) {
      try {
        await EmailService.sendEmail({
          to: [bilan.user.email, ...(bilan.user.emailsNotification || [])],
          subject: '✅ Votre Bilan d\'Orientation est prêt !',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
                .info-box { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #667eea; }
                .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>✅ Votre Bilan d'Orientation est prêt !</h1>
                </div>
                
                <div class="content">
                  <h2>Bonjour ${bilan.user.name || 'cher étudiant'},</h2>
                  
                  <p>Excellente nouvelle ! Votre <strong>Bilan d'Orientation Personnalisé</strong> a été finalisé par notre équipe d'experts. 🎓</p>
                  
                  <p>Nous avons analysé en profondeur votre profil académique, vos aspirations et vos soft skills pour vous proposer un plan d'action concret et personnalisé.</p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXTAUTH_URL || 'https://www.master-maths.com'}/orientation/resultat/${bilan.id}" 
                       class="button">
                      📊 Consulter mon Bilan
                    </a>
                  </div>
                  
                  <div class="info-box">
                    <h3>📋 Ce que vous trouverez dans votre bilan :</h3>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                      <li><strong>Synthèse de votre profil</strong> et trajectoire académique</li>
                      <li><strong>Analyse Performance vs. Ambition</strong> avec recommandations ciblées</li>
                      <li><strong>Diagnostic méthodologique</strong> adapté à votre style d'apprentissage</li>
                      <li><strong>Plan d'action concret</strong> avec objectifs SMART</li>
                      <li><strong>Scénarios d'orientation</strong> (Plans A, B, C) réalistes et personnalisés</li>
                    </ul>
                  </div>
                  
                  <p style="text-align: center; margin: 20px 0; color: #666;">
                    💡 <em>Ce bilan reste accessible pendant 1 an dans votre espace personnel.</em>
                  </p>
                  
                  <p>Bonne lecture et bon succès dans votre parcours ! 🚀</p>
                  
                  <p><strong>L'équipe Master Maths</strong></p>
                </div>
                
                <div class="footer">
                  <p>Master Maths - Excellence en Mathématiques</p>
                  <p>Vous recevez cet email car vous avez demandé un bilan d'orientation.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        })

        successCount++
        console.log(`✅ Email envoyé pour le bilan ${bilan.id} (user: ${bilan.user.email})`)
      } catch (emailError) {
        errorCount++
        console.error(`❌ Erreur envoi email pour bilan ${bilan.id}:`, emailError)
      }
    }

    return NextResponse.json({
      success: true,
      total: bilans.length,
      sent: successCount,
      errors: errorCount,
      message: `${successCount}/${bilans.length} email(s) envoyé(s) avec succès`,
    })
  } catch (error: any) {
    console.error('Erreur cron send-orientation-bilans:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}

