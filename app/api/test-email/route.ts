import { NextRequest, NextResponse } from 'next/server'
import { EmailService } from '@/lib/email-service'

/**
 * Endpoint de test pour vérifier la configuration email
 * GET /api/test-email
 */
export async function GET(request: NextRequest) {
  try {
    // Test d'envoi d'email
    const result = await EmailService.sendEmail({
      to: 'gregjazzy@gmail.com',
      subject: '✅ Test Email Master Maths',
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
            .success { background: #10b981; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Test Email Réussi !</h1>
            </div>
            
            <div class="content">
              <h2>Bonjour Greg,</h2>
              
              <div class="success">
                <strong>🎉 Félicitations !</strong><br>
                Votre configuration email fonctionne parfaitement !
              </div>
              
              <p>Cet email de test confirme que :</p>
              <ul>
                <li>✅ Les variables SMTP sont correctement configurées</li>
                <li>✅ L'adresse <strong>notifications@master-maths.com</strong> est opérationnelle</li>
                <li>✅ Le serveur peut envoyer des emails</li>
                <li>✅ Le système d'email Master Maths est prêt</li>
              </ul>
              
              <p><strong>Prochaines étapes :</strong></p>
              <ol>
                <li>Vérifiez que cet email n'est pas dans vos spams</li>
                <li>Ajoutez <code>notifications@master-maths.com</code> à vos contacts</li>
                <li>Le système d'orientation est maintenant opérationnel !</li>
              </ol>
              
              <p>Date et heure du test : <strong>${new Date().toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'long' })}</strong></p>
              
              <p>Cordialement,</p>
              
              <p><strong>L'équipe Master Maths</strong> 🎓</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({
      success: result.success,
      message: 'Email de test envoyé avec succès à gregjazzy@gmail.com',
      messageId: result.messageId,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Erreur test email:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Erreur lors de l\'envoi',
        details: error.toString(),
      },
      { status: 500 }
    )
  }
}

