# 📊 Tracking Multiple de Connexions - Documentation

## 🎯 Réponse à votre question

### ❌ Ancien système (1 connexion/jour)
- Comptait uniquement les **jours uniques**
- Stocké en base de données (pas dans le navigateur)
- Limité à 1 incrémentation par jour

### ✅ Nouveau système (connexions illimitées)
- Track **CHAQUE connexion** (pas de limite)
- Stocké en **base de données PostgreSQL** (pas dans le navigateur)
- Historique complet avec détails (IP, navigateur, heure exacte)
- Statistiques en temps réel

---

## 🗄️ Nouveau modèle : ConnectionLog

```typescript
model ConnectionLog {
  id              String   // ID unique
  userId          String   // Utilisateur concerné
  connectedAt     DateTime // Heure exacte de connexion
  disconnectedAt  DateTime // Heure de déconnexion (optionnel)
  durationMinutes Int      // Durée de la session
  ipAddress       String   // Adresse IP
  userAgent       String   // Navigateur/device
}
```

---

## 📍 Où c'est stocké ?

### ❌ PAS dans le navigateur
- Pas de cookies
- Pas de localStorage
- Pas de sessionStorage

### ✅ En base de données PostgreSQL
```
Table: connection_logs
- Chaque connexion = 1 ligne
- Persistant et sécurisé
- Accessible depuis n'importe quel appareil
```

---

## 🔄 Fonctionnement

### 1. À chaque chargement du Dashboard

```typescript
// DashboardStudent.tsx
useEffect(() => {
  trackConnection()  // Appelé automatiquement
}, [])
```

### 2. Création d'un log de connexion

```typescript
POST /api/engagement/track-connection

// Créé TOUJOURS un nouveau log (pas de limite)
const connectionLog = await prisma.connectionLog.create({
  data: {
    userId: user.id,
    connectedAt: new Date(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...'
  }
})
```

### 3. Mise à jour du compteur de jours

```typescript
// Le compteur de JOURS reste limité à 1x/jour (pour les badges)
// Mais les CONNEXIONS sont toutes enregistrées
```

---

## 📊 Statistiques disponibles

### Nouveau composant : ConnectionStats

Affiche 3 cartes avec :

1. **Aujourd'hui** 
   - Nombre de connexions aujourd'hui
   - Exemple : "5 connexions"

2. **Cette semaine**
   - Nombre de connexions sur 7 jours
   - Exemple : "23 connexions"

3. **Total**
   - Nombre total depuis l'inscription
   - Exemple : "147 connexions"

### API : GET /api/engagement/connection-history

Retourne :
```json
{
  "connections": [
    {
      "id": "...",
      "connectedAt": "2024-01-15T14:30:00Z",
      "ipAddress": "192.168.1.1",
      "userAgent": "Chrome/120..."
    }
  ],
  "stats": {
    "today": 5,
    "thisWeek": 23,
    "total": 147,
    "last7Days": [
      { "date": "2024-01-15", "count": 5 },
      { "date": "2024-01-14", "count": 3 }
    ]
  }
}
```

---

## 🚀 Installation de la mise à jour

### Étape 1 : Mettre à jour la base de données

```bash
# Générer le nouveau modèle ConnectionLog
npx prisma generate

# Appliquer les changements
npx prisma db push
```

### Étape 2 : Vérifier la table

```sql
-- Vérifier que la table existe
SELECT * FROM connection_logs LIMIT 1;

-- Structure attendue :
-- id, userId, connectedAt, disconnectedAt, durationMinutes, ipAddress, userAgent
```

### Étape 3 : Tester

```bash
# Lancer le serveur
npm run dev

# Se connecter au Dashboard
# → Chaque chargement crée un nouveau log
```

---

## 📈 Exemples d'utilisation

### Voir toutes les connexions d'un élève

```sql
SELECT 
  "connectedAt",
  "ipAddress",
  "userAgent"
FROM connection_logs
WHERE "userId" = 'user-id'
ORDER BY "connectedAt" DESC
LIMIT 10;
```

### Compter les connexions par jour

```sql
SELECT 
  DATE("connectedAt") as date,
  COUNT(*) as connexions
FROM connection_logs
WHERE "userId" = 'user-id'
  AND "connectedAt" >= NOW() - INTERVAL '7 days'
GROUP BY DATE("connectedAt")
ORDER BY date DESC;
```

### Identifier les heures de pointe

```sql
SELECT 
  EXTRACT(HOUR FROM "connectedAt") as heure,
  COUNT(*) as connexions
FROM connection_logs
WHERE "userId" = 'user-id'
GROUP BY EXTRACT(HOUR FROM "connectedAt")
ORDER BY connexions DESC;
```

### Détecter les connexions multiples suspectes

```sql
-- Plus de 10 connexions en 1 heure = suspect
SELECT 
  "userId",
  DATE_TRUNC('hour', "connectedAt") as heure,
  COUNT(*) as connexions
FROM connection_logs
GROUP BY "userId", DATE_TRUNC('hour', "connectedAt")
HAVING COUNT(*) > 10
ORDER BY connexions DESC;
```

---

## 🎨 Affichage dans le Dashboard

### Avant
```
┌────────────────────────────────┐
│ Progression globale : 75%      │
│ Cours en cours : 3             │
│ Activités complétées : 42      │
└────────────────────────────────┘
```

### Après (avec ConnectionStats)
```
┌────────────────────────────────────────────────────────┐
│ Progression globale : 75%                              │
│ Cours en cours : 3                                     │
│ Activités complétées : 42                              │
└────────────────────────────────────────────────────────┘

┌─────────────┬─────────────────┬──────────────────────┐
│ Aujourd'hui │ Cette semaine   │ Total                │
│ 5 connexions│ 23 connexions   │ 147 connexions       │
│ 📅          │ 📈              │ ⚡                   │
└─────────────┴─────────────────┴──────────────────────┘
```

---

## 🔐 Sécurité et confidentialité

### Données collectées
- ✅ Heure de connexion (besoin légitime)
- ✅ Adresse IP (pour détecter abus)
- ✅ User Agent (pour statistiques device)

### RGPD
- Les données sont **pseudonymisées** (liées à userId)
- L'élève peut demander l'**accès** à ses logs
- L'élève peut demander la **suppression** de ses logs

### Requête de suppression
```sql
-- Supprimer tous les logs d'un utilisateur
DELETE FROM connection_logs WHERE "userId" = 'user-id';
```

---

## 📊 Avantages du tracking multiple

### 1. Analytics détaillées
- Identifier les pics d'activité
- Optimiser les heures de cours en ligne
- Détecter les patterns d'apprentissage

### 2. Détection d'anomalies
- Trop de connexions = possible partage de compte
- Connexions inhabituelles = sécurité compromise

### 3. Motivation élève
- "Tu t'es connecté 5 fois aujourd'hui !" = encouragement
- Streaks de connexions quotidiennes
- Comparaisons avec soi-même

### 4. Insights pour parents
- "Votre enfant s'est connecté 3 fois cette semaine"
- Notifications si baisse d'activité

---

## 🎯 Différence clé

| Métrique | Ancien système | Nouveau système |
|----------|---------------|-----------------|
| **connectionDaysCount** | Jours uniques (1/jour) | Toujours jours uniques |
| **Connexions totales** | ❌ Non trackées | ✅ Toutes enregistrées |
| **Historique** | ❌ Aucun | ✅ Complet avec détails |
| **Stats temps réel** | ❌ Non | ✅ Aujourd'hui/Semaine/Total |
| **Stockage** | Base de données | Base de données |
| **Limite** | 1 par jour | ❌ Aucune limite |

---

## 🚀 Prochaines étapes possibles

### 1. Dashboard avancé
- Graphique des connexions sur 30 jours
- Heatmap des heures de connexion
- Comparaison avec la moyenne

### 2. Badges liés aux connexions
- "🔥 Actif" : 5+ connexions par jour pendant 7 jours
- "⚡ Super Actif" : 10+ connexions par jour pendant 30 jours

### 3. Notifications intelligentes
- "Tu ne t'es pas connecté depuis 3 jours"
- "Record personnel : 8 connexions aujourd'hui !"

### 4. Export des données
- Télécharger l'historique en CSV
- Rapport mensuel par email

---

## ✅ Résumé

### Question : "C'est enregistré dans le navigateur ?"
**Réponse : Non, tout est en base de données PostgreSQL**

### Ce qui a changé :
1. ✅ Nouveau modèle `ConnectionLog`
2. ✅ Chaque connexion est enregistrée (pas de limite)
3. ✅ Nouveau composant `ConnectionStats` dans le Dashboard
4. ✅ API pour récupérer l'historique complet
5. ✅ Stockage sécurisé en BDD (pas dans le navigateur)

### Ce qui reste pareil :
- `connectionDaysCount` = toujours limité à 1/jour (pour badges)
- Stockage en PostgreSQL (jamais dans le navigateur)
- Tracking automatique au chargement du Dashboard

**Maintenant vous pouvez voir combien de fois par jour un élève se connecte ! 🎉📊**


