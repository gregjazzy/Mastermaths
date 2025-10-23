# 🔥 Système de Streak et Emails Automatiques - Master Maths

## 🎯 Fonctionnalités implémentées

### 1. ✅ Suivi des jours consécutifs (Streak)
- Calcul automatique du nombre de jours consécutifs de connexion
- Réinitialisation si pas de connexion pendant 1 jour
- Sauvegarde du meilleur streak personnel
- Affichage en temps réel dans le Dashboard

### 2. ✅ Emails automatiques
- **Email de rappel** : Envoyé après 3 jours d'inactivité
- **Email de célébration** : Envoyé aux milestones (7, 30, 100 jours consécutifs)
- Support multi-destinataires (élève + parents/tuteurs)

### 3. ✅ Détection d'inactivité
- Identification automatique des utilisateurs inactifs
- Système de cron job pour vérifications quotidiennes
- Protection contre le spam (max 1 email par jour)

---

## 🗄️ Nouveaux champs dans User

```typescript
model User {
  connectionStreak    Int       // Jours consécutifs actuels
  bestStreak          Int       // Record personnel
  lastReminderSentAt  DateTime  // Dernière date d'envoi de rappel
}
```

---

## 📊 Logique du Streak

### Calcul automatique

```typescript
// À chaque connexion :
1. Si connexion hier → streak + 1
2. Si connexion aujourd'hui → streak inchangé  
3. Si pas de connexion depuis 2+ jours → reset à 1

// Le meilleur streak est toujours conservé
```

### Exemples

| Dernière connexion | Streak actuel | Connexion aujourd'hui | Nouveau streak |
|-------------------|---------------|----------------------|----------------|
| Hier              | 5 jours       | ✅ Oui                | **6 jours**    |
| Aujourd'hui       | 5 jours       | ✅ Oui (2ème fois)    | **5 jours**    |
| Il y a 2 jours    | 5 jours       | ✅ Oui                | **1 jour**     |

---

## 📧 Configuration des emails

### 1. Choisir un service SMTP

**Option A : Gmail** (le plus simple)
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="votre-email@gmail.com"
SMTP_PASSWORD="mot-de-passe-app"  ← Générer dans Gmail
```

**Option B : SendGrid** (professionnel)
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="votre-api-key-sendgrid"
```

**Option C : Mailgun, Postmark, Amazon SES, etc.**

### 2. Générer un mot de passe d'application Gmail

1. Aller sur https://myaccount.google.com/security
2. Activer la validation en 2 étapes
3. Aller dans "Mots de passe des applications"
4. Créer un mot de passe pour "Mail"
5. Copier le mot de passe généré dans `SMTP_PASSWORD`

---

## 🤖 Configuration du Cron Job

### Option A : Vercel Cron (recommandé pour Vercel)

Créez `vercel.json` :
```json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 10 * * *"
    }
  ]
}
```

### Option B : Cron-job.org (service gratuit)

1. Aller sur https://cron-job.org
2. Créer un compte
3. Ajouter un job :
   - **URL** : `https://votre-domaine.com/api/cron/send-reminders`
   - **Schedule** : `0 10 * * *` (tous les jours à 10h)
   - **Headers** : `Authorization: Bearer votre-token-secret`

### Option C : GitHub Actions

Créez `.github/workflows/daily-reminders.yml` :
```yaml
name: Send Daily Reminders
on:
  schedule:
    - cron: '0 10 * * *'  # 10h UTC tous les jours
jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Call API
        run: |
          curl -X POST https://votre-domaine.com/api/cron/send-reminders \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET_TOKEN }}"
```

---

## 📱 Composant StreakDisplay

Affiche dans le Dashboard :

### Carte "Série actuelle"
- Nombre de jours consécutifs
- Couleur dynamique selon le streak :
  - Gris : 0 jour
  - Orange : 1-6 jours
  - Rouge : 7-29 jours
  - Violet : 30+ jours

### Carte "Record personnel"
- Meilleur streak de tous les temps
- Couleur dorée

### Avertissement d'inactivité
- Si pas de connexion depuis X jours
- Message d'alerte orange

---

## 📧 Templates d'emails

### Email de rappel (inactivité)

**Sujet** : ⚡ {Nom}, on ne vous oublie pas !

**Contenu** :
- Message personnalisé avec nombre de jours d'inactivité
- Bouton "Se reconnecter maintenant"
- Liste des raisons de revenir (badges, progression, etc.)
- Design HTML avec gradient Master Maths

**Envoyé à** :
- Email principal de l'élève
- Tous les emails dans `emailsNotification`

### Email de célébration (milestone)

**Sujet** : 🔥 {Nom}, {X} jours consécutifs !

**Contenu** :
- Grande célébration avec emoji
- Nombre de jours en gros
- Message de félicitations
- Prochaine étape à atteindre

**Envoyé aux milestones** : 7, 30, 100 jours

---

## 🔒 Sécurité

### Protection de l'API cron

```typescript
// L'API vérifie un token secret
const authHeader = req.headers.get('authorization')
if (authHeader !== `Bearer ${process.env.CRON_SECRET_TOKEN}`) {
  return 401 Unauthorized
}
```

### Limite d'envoi

- Maximum 1 email de rappel par jour et par utilisateur
- `lastReminderSentAt` empêche le spam

---

## 🚀 Installation

### 1. Mettre à jour la base de données

```bash
npx prisma generate
npx prisma db push
```

### 2. Configurer les variables d'environnement

Ajouter dans `.env` :
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="votre-email@gmail.com"
SMTP_PASSWORD="votre-mot-de-passe-app"
SMTP_FROM="Master Maths <noreply@mastermaths.com>"
CRON_SECRET_TOKEN="un-token-secret-aleatoire"
```

### 3. Installer Nodemailer

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### 4. Tester l'envoi d'emails

```bash
# En mode dev, tester manuellement
curl http://localhost:3000/api/cron/send-reminders

# Ou via le navigateur
http://localhost:3000/api/cron/send-reminders
```

---

## 📊 API Endpoints

### `POST /api/engagement/track-connection`
- Track la connexion
- Calcule le streak
- Envoie email de célébration si milestone

**Réponse** :
```json
{
  "success": true,
  "stats": {
    "connectionsToday": 2,
    "totalConnections": 45,
    "currentStreak": 7,
    "bestStreak": 12
  },
  "message": "🔥 7 jours consécutifs ! 2 connexion(s) aujourd'hui."
}
```

### `GET /api/engagement/streak-stats`
- Récupère les statistiques de streak

**Réponse** :
```json
{
  "totalDays": 45,
  "currentStreak": 7,
  "bestStreak": 12,
  "lastConnection": "2024-01-15T10:30:00Z",
  "daysInactive": 0
}
```

### `POST /api/cron/send-reminders`
- Envoie les emails de rappel aux inactifs
- **Authentification requise** (Bearer token)

**Réponse** :
```json
{
  "success": true,
  "remindersSent": 5,
  "totalInactive": 12,
  "results": [...]
}
```

---

## 🎨 Affichage dans le Dashboard

### Ordre d'affichage

```
┌─────────────────────────────────────────┐
│ Statistiques globales (3 cartes)       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Série de connexions (StreakDisplay)    │
│ - Streak actuel (avec couleur)         │
│ - Record personnel (doré)              │
│ - Avertissement si inactif             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Statistiques de connexion               │
│ - Aujourd'hui / Semaine / Total        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Mes Badges                              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Performances par cours                  │
└─────────────────────────────────────────┘
```

---

## 🔍 Requêtes SQL utiles

### Utilisateurs avec le meilleur streak

```sql
SELECT 
  name,
  email,
  "connectionStreak",
  "bestStreak"
FROM users
ORDER BY "bestStreak" DESC
LIMIT 10;
```

### Utilisateurs inactifs

```sql
SELECT 
  name,
  email,
  "lastConnectionDate",
  NOW() - "lastConnectionDate" as days_inactive
FROM users
WHERE "lastConnectionDate" < NOW() - INTERVAL '3 days'
  AND status IN ('DEMO', 'PREMIUM')
ORDER BY "lastConnectionDate" ASC;
```

### Emails envoyés aujourd'hui

```sql
SELECT 
  COUNT(*) as reminders_sent_today
FROM users
WHERE DATE("lastReminderSentAt") = CURRENT_DATE;
```

---

## ✅ Checklist de vérification

- [ ] Variables SMTP configurées dans `.env`
- [ ] Nodemailer installé
- [ ] Base de données mise à jour (streak, bestStreak, lastReminderSentAt)
- [ ] Cron job configuré (Vercel/cron-job.org/GitHub Actions)
- [ ] `CRON_SECRET_TOKEN` défini
- [ ] Test d'envoi d'email réussi
- [ ] StreakDisplay visible dans le Dashboard
- [ ] Emails reçus par l'élève ET les parents

---

## 🎉 Résumé

Vous avez maintenant un **système complet de motivation** qui :

✅ Track les jours consécutifs de connexion  
✅ Affiche le streak en temps réel dans le Dashboard  
✅ Envoie automatiquement des emails de rappel après 3 jours d'inactivité  
✅ Célèbre les milestones (7, 30, 100 jours) par email  
✅ Support multi-destinataires (élève + parents)  
✅ Protection contre le spam  
✅ Design moderne et motivant  

**Les élèves sont maintenant encouragés à se connecter chaque jour ! 🔥📧**


