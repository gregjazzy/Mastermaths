import { schedule } from '@netlify/functions'

/**
 * Fonction planifiée : Envoyer le récapitulatif mensuel
 * S'exécute le 1er de chaque mois à 9h00 (heure de Paris = 7h UTC)
 */
const handler = schedule('0 7 1 * *', async () => {
  try {
    // Appeler notre API interne
    const baseUrl = process.env.URL || process.env.NEXTAUTH_URL || 'https://mastermathsfr.netlify.app'
    
    const response = await fetch(`${baseUrl}/api/cron/monthly-report`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    console.log('[CRON] Rapports mensuels envoyés:', data)

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Rapports mensuels envoyés avec succès',
        data
      })
    }
  } catch (error) {
    console.error('[CRON] Erreur lors de l\'envoi des rapports mensuels:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erreur lors de l\'envoi des rapports mensuels',
        details: String(error)
      })
    }
  }
})

export { handler }

