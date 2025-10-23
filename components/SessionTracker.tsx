'use client'

import { useEffect, useRef } from 'react'

interface SessionTrackerProps {
  onSessionStart?: (sessionId: string) => void
}

/**
 * Composant pour tracker automatiquement la durée de connexion
 * Envoie des heartbeats toutes les 2 minutes
 */
export default function SessionTracker({ onSessionStart }: SessionTrackerProps) {
  const sessionIdRef = useRef<string | null>(null)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Démarrer une nouvelle session ou récupérer la session existante
    const initSession = async () => {
      try {
        // Vérifier si une session est déjà en cours (dans le sessionStorage)
        const existingSessionId = sessionStorage.getItem('activeSessionId')
        
        if (existingSessionId) {
          // Utiliser la session existante
          sessionIdRef.current = existingSessionId
          console.log('[SESSION TRACKER] Session existante récupérée:', existingSessionId)
        } else {
          // Créer une nouvelle session via track-connection
          const response = await fetch('/api/engagement/track-connection', {
            method: 'POST'
          })
          
          if (response.ok) {
            const data = await response.json()
            if (data.sessionId) {
              sessionIdRef.current = data.sessionId
              sessionStorage.setItem('activeSessionId', data.sessionId)
              console.log('[SESSION TRACKER] Nouvelle session créée:', data.sessionId)
              
              if (onSessionStart) {
                onSessionStart(data.sessionId)
              }
            }
          }
        }

        // Démarrer le heartbeat (toutes les 2 minutes = 120000ms)
        startHeartbeat()
      } catch (error) {
        console.error('[SESSION TRACKER] Erreur init:', error)
      }
    }

    const startHeartbeat = () => {
      // Envoyer un heartbeat immédiatement
      sendHeartbeat()

      // Puis toutes les 2 minutes
      heartbeatIntervalRef.current = setInterval(() => {
        sendHeartbeat()
      }, 120000) // 2 minutes
    }

    const sendHeartbeat = async () => {
      if (!sessionIdRef.current) return

      try {
        const response = await fetch('/api/engagement/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sessionIdRef.current })
        })

        if (response.ok) {
          const data = await response.json()
          console.log(`[HEARTBEAT] Session mise à jour: ${data.durationMinutes} min`)
        }
      } catch (error) {
        console.error('[HEARTBEAT] Erreur:', error)
      }
    }

    const finalizeSession = async () => {
      if (!sessionIdRef.current) return

      try {
        // Utiliser sendBeacon pour envoyer une requête même si la page se ferme
        const data = JSON.stringify({ sessionId: sessionIdRef.current })
        
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/engagement/disconnect', data)
        } else {
          // Fallback
          await fetch('/api/engagement/disconnect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data,
            keepalive: true
          })
        }

        // Nettoyer le sessionStorage
        sessionStorage.removeItem('activeSessionId')
        console.log('[SESSION TRACKER] Session finalisée')
      } catch (error) {
        console.error('[SESSION TRACKER] Erreur finalisation:', error)
      }
    }

    // Initialiser la session
    initSession()

    // Gérer la fermeture de la page
    const handleBeforeUnload = () => {
      finalizeSession()
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // L'onglet n'est plus visible
        finalizeSession()
      } else {
        // L'onglet redevient visible - redémarrer le heartbeat
        if (!heartbeatIntervalRef.current) {
          startHeartbeat()
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current)
      }
      
      finalizeSession()
    }
  }, [onSessionStart])

  // Ce composant ne rend rien visuellement
  return null
}


