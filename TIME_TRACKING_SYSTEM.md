# 📊 Système de Tracking du Temps de Connexion

## Vue d'ensemble

Le système de tracking du temps de connexion enregistre automatiquement la durée pendant laquelle les élèves sont connectés à la plateforme Master Maths. Les données sont stockées **côté serveur** dans PostgreSQL pour garantir leur fiabilité et empêcher toute manipulation.

---

## 🏗️ Architecture

### 1. **Table ConnectionLog** (Base de données)

```sql
ConnectionLog {
  id              String    @id
  userId          String
  connectedAt     DateTime  -- Heure de début
  disconnectedAt  DateTime? -- Heure de fin
  durationMinutes Int?      -- Durée calculée
  ipAddress       String?   -- Adresse IP
  userAgent       String?   -- Navigateur/device
}
```

### 2. **Composants**

#### **SessionTracker.tsx**
- Composant invisible qui tourne en arrière-plan
- Envoie un "heartbeat" toutes les 2 minutes
- Gère les événements de fermeture/changement d'onglet

#### **TimeStatsDisplay.tsx**
- Affiche les statistiques de temps
- Graphiques des 7 derniers jours
- Moyennes par session et par jour

### 3. **APIs**

#### `POST /api/engagement/track-connection`
- Crée une nouvelle session de connexion
- Retourne le `sessionId`
- Enregistre IP et User-Agent

#### `POST /api/engagement/heartbeat`
- Met à jour `disconnectedAt` et `durationMinutes`
- Appelé toutes les 2 minutes
- Paramètres: `{ sessionId }`

#### `POST /api/engagement/disconnect`
- Finalise la session quand l'utilisateur quitte
- Utilise `navigator.sendBeacon` pour fiabilité
- Paramètres: `{ sessionId }`

#### `GET /api/engagement/time-stats`
- Récupère les statistiques de temps
- Retourne : aujourd'hui, semaine, mois, total, moyennes, graphiques

---

## 🔄 Flux de fonctionnement

### 1. **Connexion au Dashboard**

```javascript
// SessionTracker démarre automatiquement
sessionStorage.setItem('activeSessionId', 'clx123abc...')
→ POST /api/engagement/track-connection
→ Serveur crée ConnectionLog avec connectedAt
→ Retourne sessionId
```

### 2. **Pendant la navigation** (toutes les 2 minutes)

```javascript
setInterval(() => {
  fetch('/api/engagement/heartbeat', {
    method: 'POST',
    body: JSON.stringify({ sessionId })
  })
}, 120000) // 2 minutes

→ Serveur met à jour disconnectedAt
→ Serveur recalcule durationMinutes
```

### 3. **Fermeture/Changement d'onglet**

```javascript
window.addEventListener('beforeunload', () => {
  navigator.sendBeacon('/api/engagement/disconnect', data)
})

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Finaliser la session
  }
})

→ Serveur finalise la session
→ sessionStorage nettoyé
```

---

## 📊 Statistiques disponibles

### **Temps de connexion**
- ⏰ Aujourd'hui
- 📅 Cette semaine
- 📆 Ce mois
- 🏆 Total historique

### **Moyennes**
- ⚡ Temps moyen par session
- 📈 Temps moyen par jour actif

### **Graphiques**
- 📊 Barres des 7 derniers jours
- 🔥 Nombre de sessions par jour

---

## 💾 Stockage des données

### ✅ **Côté Serveur (PostgreSQL)**
- Sessions de connexion complètes
- Historique complet
- Calculs de durée
- IP et User-Agent (optionnel)

### 📱 **Côté Client (sessionStorage)**
- `activeSessionId` uniquement
- Nettoyé à la déconnexion
- Utilisé pour éviter les doublons

---

## 🎯 Cas d'usage

### **Pour l'élève**
```
Dashboard → TimeStatsDisplay
- Visualiser son temps de connexion
- Comparer jour par jour
- Suivre ses habitudes d'étude
```

### **Pour les parents**
```
DashboardParent → Voir temps de connexion par enfant
- Comparer les enfants
- Vérifier l'assiduité
- Corréler temps vs progression
```

### **Pour l'admin**
```
- Analyser l'engagement global
- Identifier les élèves inactifs
- Statistiques par cohorte
```

---

## ⚙️ Configuration

### **Intervalle de heartbeat**
Par défaut : 2 minutes (120 000 ms)

Modifier dans `SessionTracker.tsx` :
```javascript
setInterval(() => {
  sendHeartbeat()
}, 120000) // Changer ici
```

**Recommandations :**
- 1-2 minutes : Tracking précis, plus de requêtes
- 3-5 minutes : Équilibré
- 10+ minutes : Moins précis

---

## 🔒 Sécurité

### **Impossible de tricher**
✅ Données stockées côté serveur  
✅ APIs authentifiées (NextAuth)  
✅ Vérification du userId  
✅ Timestamps serveur (non modifiables)  

### **Protection de la vie privée**
- IP stockée optionnellement (peut être désactivée)
- User-Agent anonymisé possible
- Données accessibles uniquement par l'élève et ses parents

---

## 📈 Évolutions futures possibles

### **Alertes automatiques**
```javascript
if (weekMinutes < 60) {
  // Envoyer email de motivation
}
```

### **Récompenses basées sur le temps**
```javascript
if (monthMinutes > 1200) { // 20h+
  // Débloquer badge "Assidu"
}
```

### **Analyse avancée**
- Heures de connexion préférées (heatmap)
- Corrélation temps vs scores QCM
- Prédiction de réussite basée sur le temps

---

## 🐛 Dépannage

### **Le temps ne s'enregistre pas**
1. Vérifier la console navigateur (logs `[HEARTBEAT]`)
2. Vérifier que l'API est accessible : `POST /api/engagement/heartbeat`
3. Vérifier le sessionStorage : `activeSessionId`

### **Temps trop court enregistré**
- L'utilisateur ferme l'onglet trop vite
- Les heartbeats ne passent pas (problème réseau)
- Solution : Réduire l'intervalle de heartbeat

### **Sessions multiples créées**
- sessionStorage non nettoyé correctement
- Vérifier les événements `beforeunload` et `visibilitychange`

---

## 📝 Exemple d'utilisation

```typescript
// Dans le Dashboard
import SessionTracker from '@/components/SessionTracker'
import TimeStatsDisplay from '@/components/TimeStatsDisplay'

export default function Dashboard() {
  return (
    <>
      <SessionTracker /> {/* Tracking invisible */}
      <TimeStatsDisplay /> {/* Affichage des stats */}
    </>
  )
}
```

---

## 🎓 Bonnes pratiques

1. **Ne pas bloquer l'interface** : SessionTracker est asynchrone
2. **Gérer les erreurs réseau** : Les heartbeats peuvent échouer
3. **Nettoyer sessionStorage** : Éviter les sessions orphelines
4. **Logger les événements** : Faciliter le debugging

---

**Système opérationnel et prêt à l'emploi !** ✅


