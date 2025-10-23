import nodemailer from 'nodemailer'

/**
 * Service d'envoi d'emails
 * Utilise Nodemailer pour envoyer des emails via SMTP
 */

// Configuration du transporteur SMTP (lazy loading)
let transporter: any = null

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      } : undefined,
    })
  }
  return transporter
}

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

export class EmailService {
  /**
   * Envoie un email générique
   */
  static async sendEmail({ to, subject, html, text }: SendEmailOptions) {
    try {
      // Si SMTP n'est pas configuré, on skip silencieusement  
      if (!process.env.SMTP_USER) {
        console.log('SMTP non configuré, email non envoyé')
        return { success: true, messageId: 'skipped' }
      }
      
      const recipients = Array.isArray(to) ? to : [to]
      
      const info = await getTransporter().sendMail({
        from: `"Master Maths" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: recipients.join(', '),
        subject,
        text: text || html.replace(/<[^>]*>/g, ''), // Fallback texte
        html,
      })

      console.log('Email envoyé:', info.messageId)
      return { success: true, messageId: info.messageId }
    } catch (error) {
      console.error('Erreur lors de l\'envoi d\'email:', error)
      return { success: false, error }
    }
  }

  /**
   * Envoie un email de rappel de connexion
   */
  static async sendInactivityReminder(
    userEmail: string,
    userName: string,
    daysInactive: number,
    additionalEmails: string[] = []
  ) {
    const allEmails = [userEmail, ...additionalEmails.filter(e => e && e !== userEmail)]

    const subject = `⚡ ${userName}, on ne vous oublie pas !`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1E3A5F 0%, #00BCD4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #00BCD4; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .stats { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Master Maths</h1>
            <p>Votre plateforme de mathématiques</p>
          </div>
          
          <div class="content">
            <h2>Bonjour ${userName} ! 👋</h2>
            
            <p>Nous avons remarqué que vous ne vous êtes pas connecté depuis <strong>${daysInactive} jour${daysInactive > 1 ? 's' : ''}</strong>.</p>
            
            <p>Votre progression est importante pour nous ! Vos cours et exercices vous attendent. 📚</p>
            
            <div class="stats">
              <h3>💪 Continuez votre apprentissage</h3>
              <p>Reconnectez-vous maintenant pour :</p>
              <ul>
                <li>✅ Maintenir votre série de connexions</li>
                <li>🎯 Continuer vos cours en cours</li>
                <li>🏆 Débloquer de nouveaux badges</li>
                <li>📈 Améliorer vos résultats</li>
              </ul>
            </div>
            
            <center>
              <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">
                Se reconnecter maintenant
              </a>
            </center>
            
            <p>Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter.</p>
            
            <p>À très bientôt ! 🚀</p>
            
            <p><em>L'équipe Master Maths</em></p>
          </div>
          
          <div class="footer">
            <p>Master Maths - Plateforme d'apprentissage des mathématiques</p>
            <p>Vous recevez cet email car vous êtes inscrit sur Master Maths.</p>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendEmail({
      to: allEmails,
      subject,
      html
    })
  }

  /**
   * Envoie un email de félicitations pour un streak
   */
  static async sendStreakCelebration(
    userEmail: string,
    userName: string,
    streak: number,
    additionalEmails: string[] = []
  ) {
    const allEmails = [userEmail, ...additionalEmails.filter(e => e && e !== userEmail)]

    const subject = `🔥 ${userName}, ${streak} jours consécutifs !`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .streak { font-size: 72px; font-weight: bold; text-align: center; margin: 20px 0; color: #FF6B6B; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔥 INCROYABLE !</h1>
          </div>
          
          <div class="content">
            <h2>Félicitations ${userName} ! 🎉</h2>
            
            <div class="streak">
              ${streak} jours
            </div>
            
            <p style="text-align: center; font-size: 18px;">
              <strong>Vous vous êtes connecté ${streak} jours consécutifs !</strong>
            </p>
            
            <p>Cette régularité est la clé du succès en mathématiques. Continuez comme ça ! 💪</p>
            
            <p style="text-align: center; margin: 30px 0;">
              <strong>Votre prochaine étape :</strong><br>
              ${streak < 7 ? '7 jours consécutifs 🎯' : streak < 30 ? '30 jours consécutifs 🏆' : '100 jours consécutifs 👑'}
            </p>
            
            <p>Continuez à vous connecter chaque jour pour maintenir votre série !</p>
            
            <p><em>L'équipe Master Maths</em></p>
          </div>
          
          <div class="footer">
            <p>Master Maths - Plateforme d'apprentissage des mathématiques</p>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendEmail({
      to: allEmails,
      subject,
      html
    })
  }

  /**
   * Envoie un email de félicitations pour un nouveau badge
   */
  static async sendBadgeUnlocked(
    userEmail: string,
    userName: string,
    badgeName: string,
    badgeDescription: string,
    badgeIcon: string,
    badgeRarity: string,
    masteryPoints: number,
    additionalEmails: string[] = []
  ) {
    const allEmails = [userEmail, ...additionalEmails.filter(e => e && e !== userEmail)]

    const rarityColors: Record<string, string> = {
      common: '#95A5A6',
      rare: '#3498DB',
      epic: '#9B59B6',
      legendary: '#F39C12'
    }

    const rarityLabels: Record<string, string> = {
      common: 'Commun',
      rare: 'Rare',
      epic: 'Épique',
      legendary: 'Légendaire'
    }

    const color = rarityColors[badgeRarity] || rarityColors.common
    const rarityLabel = rarityLabels[badgeRarity] || 'Commun'

    const subject = `🏆 ${userName}, vous avez débloqué un badge ${rarityLabel} !`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1E3A5F 0%, ${color} 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .badge { background: white; padding: 30px; border-radius: 15px; margin: 20px 0; text-align: center; border: 3px solid ${color}; }
          .badge-icon { font-size: 80px; margin: 20px 0; }
          .badge-name { font-size: 28px; font-weight: bold; color: ${color}; margin: 10px 0; }
          .badge-rarity { display: inline-block; background: ${color}; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
          .points { background: #00BCD4; color: white; padding: 15px; border-radius: 10px; margin: 20px 0; text-align: center; font-size: 18px; font-weight: bold; }
          .button { display: inline-block; background: #00BCD4; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 NOUVEAU BADGE DÉBLOQUÉ !</h1>
          </div>
          
          <div class="content">
            <h2>Bravo ${userName} ! 🎊</h2>
            
            <p>Vous venez de débloquer un nouveau badge grâce à vos efforts !</p>
            
            <div class="badge">
              <div class="badge-icon">${badgeIcon}</div>
              <div class="badge-name">${badgeName}</div>
              <div style="margin: 15px 0;">
                <span class="badge-rarity">${rarityLabel}</span>
              </div>
              <p style="color: #666; margin-top: 15px;">${badgeDescription}</p>
            </div>
            
            <div class="points">
              ✨ +${masteryPoints} Points de Maîtrise (PMU)
            </div>
            
            <p>Continuez à vous investir pour débloquer encore plus de badges et progresser dans les rangs de Master Maths !</p>
            
            <center>
              <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">
                Voir mes badges
              </a>
            </center>
            
            <p><em>L'équipe Master Maths</em></p>
          </div>
          
          <div class="footer">
            <p>Master Maths - Plateforme d'apprentissage des mathématiques</p>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendEmail({
      to: allEmails,
      subject,
      html
    })
  }

  /**
   * Envoie un email de félicitations pour un nouveau titre
   */
  static async sendTitleUnlocked(
    userEmail: string,
    userName: string,
    newTitle: string,
    totalPMU: number,
    additionalEmails: string[] = []
  ) {
    const allEmails = [userEmail, ...additionalEmails.filter(e => e && e !== userEmail)]

    const titleEmojis: Record<string, string> = {
      'Novice': '🌱',
      'Initié': '📚',
      'Apprenti': '🎓',
      'Expert': '⭐',
      'Maître': '🏆',
      'Grand Maître': '👑',
      'Légende': '💎'
    }

    const emoji = titleEmojis[newTitle] || '🎯'
    const subject = `${emoji} ${userName}, vous êtes maintenant ${newTitle} !`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .title-card { background: white; padding: 40px; border-radius: 15px; margin: 20px 0; text-align: center; border: 3px solid #FFD700; box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3); }
          .title-emoji { font-size: 100px; margin: 20px 0; }
          .title-name { font-size: 36px; font-weight: bold; color: #FFA500; margin: 10px 0; }
          .pmu { font-size: 24px; color: #666; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎊 PROMOTION !</h1>
          </div>
          
          <div class="content">
            <h2>Félicitations ${userName} ! 🎉</h2>
            
            <p>Votre travail acharné a payé ! Vous avez atteint un nouveau niveau de maîtrise.</p>
            
            <div class="title-card">
              <div class="title-emoji">${emoji}</div>
              <div class="title-name">${newTitle}</div>
              <div class="pmu">
                ${totalPMU} Points de Maîtrise Unifiés
              </div>
            </div>
            
            <p style="text-align: center; font-size: 18px; margin: 30px 0;">
              <strong>Vous faites maintenant partie de l'élite de Master Maths !</strong>
            </p>
            
            <p>Continuez à progresser pour atteindre les plus hauts sommets et devenir une véritable Légende des mathématiques ! 💎</p>
            
            <p><em>L'équipe Master Maths</em></p>
          </div>
          
          <div class="footer">
            <p>Master Maths - Plateforme d'apprentissage des mathématiques</p>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendEmail({
      to: allEmails,
      subject,
      html
    })
  }

  /**
   * Envoie un email de bienvenue
   */
  static async sendWelcomeEmail(
    userEmail: string,
    userName: string
  ) {
    const subject = `🎓 Bienvenue sur Master Maths, ${userName} !`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1E3A5F 0%, #00BCD4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .feature { background: white; padding: 20px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #00BCD4; }
          .button { display: inline-block; background: #00BCD4; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Bienvenue sur Master Maths !</h1>
          </div>
          
          <div class="content">
            <h2>Bonjour ${userName} ! 👋</h2>
            
            <p>Félicitations pour votre inscription ! Vous venez de rejoindre une plateforme conçue pour vous faire exceller en mathématiques.</p>
            
            <h3>🚀 Voici ce qui vous attend :</h3>
            
            <div class="feature">
              <strong>📚 Des cours structurés</strong>
              <p>Accédez à des vidéos de cours, exercices et QCM organisés par chapitres.</p>
            </div>
            
            <div class="feature">
              <strong>🏆 Gamification motivante</strong>
              <p>Débloquez des badges, montez en niveau et comparez-vous dans le Hall of Fame !</p>
            </div>
            
            <div class="feature">
              <strong>📊 Suivi de progression</strong>
              <p>Suivez vos progrès en temps réel et identifiez vos points forts.</p>
            </div>
            
            <div class="feature">
              <strong>🎯 Corrections détaillées</strong>
              <p>Comprenez vos erreurs avec des vidéos de correction personnalisées.</p>
            </div>
            
            <center>
              <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">
                Commencer maintenant
              </a>
            </center>
            
            <p style="margin-top: 30px;">Si vous avez la moindre question, n'hésitez pas à nous contacter. Nous sommes là pour vous aider ! 💪</p>
            
            <p>Bon apprentissage !</p>
            
            <p><em>L'équipe Master Maths</em></p>
          </div>
          
          <div class="footer">
            <p>Master Maths - Plateforme d'apprentissage des mathématiques</p>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendEmail({
      to: userEmail,
      subject,
      html
    })
  }

  /**
   * Envoie un récapitulatif mensuel
   */
  static async sendMonthlyReport(
    userEmail: string,
    userName: string,
    stats: {
      lessonsCompleted: number
      qcmsTaken: number
      averageScore: number
      timeSpent: number
      badgesUnlocked: number
      currentStreak: number
      pmuEarned: number
    },
    additionalEmails: string[] = []
  ) {
    const allEmails = [userEmail, ...additionalEmails.filter(e => e && e !== userEmail)]

    const subject = `📊 ${userName}, votre récapitulatif mensuel Master Maths`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1E3A5F 0%, #00BCD4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
          .stat-card { background: white; padding: 20px; border-radius: 10px; text-align: center; }
          .stat-value { font-size: 36px; font-weight: bold; color: #00BCD4; }
          .stat-label { font-size: 14px; color: #666; margin-top: 5px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Votre récapitulatif mensuel</h1>
          </div>
          
          <div class="content">
            <h2>Bonjour ${userName} ! 👋</h2>
            
            <p>Voici un résumé de votre activité du mois dernier :</p>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">${stats.lessonsCompleted}</div>
                <div class="stat-label">Leçons complétées</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-value">${stats.qcmsTaken}</div>
                <div class="stat-label">QCM réalisés</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-value">${stats.averageScore}%</div>
                <div class="stat-label">Score moyen</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-value">${Math.round(stats.timeSpent / 60)}h</div>
                <div class="stat-label">Temps d'apprentissage</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-value">${stats.badgesUnlocked}</div>
                <div class="stat-label">Badges débloqués</div>
              </div>
              
              <div class="stat-card">
                <div class="stat-value">${stats.currentStreak}</div>
                <div class="stat-label">Jours consécutifs</div>
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
              <div style="font-size: 18px; font-weight: bold;">Points de Maîtrise gagnés</div>
              <div style="font-size: 48px; font-weight: bold; margin: 10px 0;">+${stats.pmuEarned}</div>
              <div style="font-size: 14px;">Ce mois-ci</div>
            </div>
            
            <p style="text-align: center; font-size: 18px; margin: 30px 0;">
              ${stats.lessonsCompleted > 10 ? '🔥 Excellent mois ! Continuez comme ça !' : '💪 Le mois prochain sera encore meilleur !'}
            </p>
            
            <p>Continuez à progresser et à viser l'excellence ! 🚀</p>
            
            <p><em>L'équipe Master Maths</em></p>
          </div>
          
          <div class="footer">
            <p>Master Maths - Plateforme d'apprentissage des mathématiques</p>
          </div>
        </div>
      </body>
      </html>
    `

    return this.sendEmail({
      to: allEmails,
      subject,
      html
    })
  }
}

