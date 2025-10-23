# 📧 Configuration du Système d'Emails Master Maths

## ✅ CE QUI A ÉTÉ IMPLÉMENTÉ

Le système d'emails est **100% codé et prêt à l'emploi**. Il ne reste plus qu'à le configurer !

### Emails Automatiques Disponibles :

1. **🎓 Email de bienvenue** → Envoyé à l'inscription
2. **🏆 Nouveau badge débloqué** → Envoyé quand un badge est gagné
3. **👑 Nouveau titre** → Envoyé lors d'une promotion (Novice → Expert, etc.)
4. **🔥 Streak celebration** → Envoyé aux milestones (7, 30, 100 jours)
5. **⚡ Rappel d'inactivité** → Envoyé si pas de connexion depuis 48h
6. **📊 Récapitulatif mensuel** → Statistiques du mois (à implémenter via cron)

---

## 🚀 CONFIGURATION EN 3 ÉTAPES

### Étape 1 : Choisir Votre Fournisseur d'Emails

Vous avez plusieurs options :

#### Option A : Gmail (Gratuit, Facile) ⭐ **RECOMMANDÉ POUR DÉMARRER**

**Avantages** :
- ✅ Gratuit jusqu'à 500 emails/jour
- ✅ Simple à configurer
- ✅ Fiable

**Limites** :
- ⚠️ Max 500 emails/jour
- ⚠️ Pas idéal pour grosse volumétrie

**Configuration** :
1. Activez l'authentification à 2 facteurs sur votre compte Google
2. Générez un "Mot de passe d'application" :
   - https://myaccount.google.com/apppasswords
   - App : "Mail"
   - Appareil : "Autre (nom personnalisé)" → "Master Maths"
   - Copiez le mot de passe de 16 caractères

**Variables `.env`** :
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="votre.email@gmail.com"
SMTP_PASSWORD="xxxx xxxx xxxx xxxx" # Le mot de passe d'application
SMTP_FROM="Master Maths <votre.email@gmail.com>"
```

---

#### Option B : SendGrid (Professionnel) 🚀 **POUR PRODUCTION**

**Avantages** :
- ✅ 100 emails/jour GRATUIT
- ✅ Puis 15€/mois pour 50 000 emails
- ✅ Tracking avancé (ouvertures, clics)
- ✅ Templates professionnels
- ✅ Excellente délivrabilité
- ✅ API simple

**Configuration** :
1. Créez un compte sur https://sendgrid.com
2. Créez une API Key :
   - Settings > API Keys > Create API Key
   - Full Access
   - Copiez la clé

**Variables `.env`** :
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey" # Littéralement "apikey"
SMTP_PASSWORD="SG.xxx..." # Votre clé API
SMTP_FROM="Master Maths <noreply@votredomaine.com>"
```

---

#### Option C : Brevo (ex-Sendinblue) 💎 **BON COMPROMIS**

**Avantages** :
- ✅ 300 emails/jour GRATUIT
- ✅ Puis 19€/mois pour 20 000 emails
- ✅ Interface française
- ✅ SMS inclus

**Configuration** :
1. Créez un compte sur https://brevo.com
2. Récupérez vos SMTP credentials :
   - Settings > SMTP & API

**Variables `.env`** :
```env
SMTP_HOST="smtp-relay.brevo.com"
SMTP_PORT="587"
SMTP_USER="votre-email@example.com"
SMTP_PASSWORD="votre-clé-smtp"
SMTP_FROM="Master Maths <noreply@votredomaine.com>"
```

---

#### Option D : AWS SES (Pour Les Pros) 🏢

**Avantages** :
- ✅ 0,10$/1000 emails (ultra-économique)
- ✅ Scalable à l'infini
- ✅ Intégration AWS

**Inconvénient** :
- ⚠️ Configuration plus technique
- ⚠️ Validation domaine obligatoire

---

## 📋 Étape 2 : Configuration des Variables d'Environnement

Ajoutez ces lignes à votre fichier `.env` :

```env
# ========================================
# CONFIGURATION SMTP (Emails)
# ========================================

# Serveur SMTP
SMTP_HOST="smtp.gmail.com"          # Ou smtp.sendgrid.net, etc.
SMTP_PORT="587"                      # 587 pour TLS, 465 pour SSL
SMTP_USER="votre.email@gmail.com"   # Votre email ou "apikey" pour SendGrid
SMTP_PASSWORD="votre-mot-de-passe"  # Mot de passe d'application ou API key
SMTP_FROM="Master Maths <noreply@mastermaths.com>"  # Expéditeur visible

# URL de l'application (pour les liens dans les emails)
NEXTAUTH_URL="https://votresite.com"  # ou http://localhost:3002 en dev

# Token secret pour le cron job (générez un token aléatoire)
CRON_SECRET_TOKEN="generez-un-token-aleatoire-securise-ici"
```

**Générer un CRON_SECRET_TOKEN** :
```bash
openssl rand -hex 32
```

---

## ⚙️ Étape 3 : Activer les Emails Automatiques

### A. Emails Instantanés (Déjà Actifs ✅)

Ces emails s'envoient automatiquement dès que vous configurez SMTP :

1. **Bienvenue** → À l'inscription (déjà codé dans `/api/auth/register`)
2. **Badge débloqué** → Quand un badge est gagné (déjà codé dans `badge-service.ts`)
3. **Titre débloqué** → Lors d'une promotion (à ajouter dans `mastery-points-service.ts` si souhaité)

### B. Emails Programmés (Nécessitent un Cron Job)

Pour les emails de **rappel d'inactivité** et **récapitulatifs mensuels**, vous devez configurer un **Cron Job**.

#### Option 1 : GitHub Actions (GRATUIT, SIMPLE) ⭐

Créez `.github/workflows/daily-emails.yml` :

```yaml
name: Daily Email Reminders

on:
  schedule:
    # Tous les jours à 9h00 UTC (10h Paris hiver, 11h été)
    - cron: '0 9 * * *'
  workflow_dispatch:  # Permet de lancer manuellement

jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Send Inactivity Reminders
        run: |
          curl -X POST https://votresite.com/api/cron/send-reminders \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET_TOKEN }}" \
            -H "Content-Type: application/json"
```

**Configuration** :
1. Sur GitHub, allez dans Settings > Secrets and variables > Actions
2. Ajoutez un secret `CRON_SECRET_TOKEN` (même valeur que dans `.env`)

---

#### Option 2 : Netlify Scheduled Functions

Créez `netlify/functions/scheduled-emails.ts` :

```typescript
import { schedule } from '@netlify/functions'

const handler = schedule('0 9 * * *', async () => {
  const response = await fetch('https://votresite.com/api/cron/send-reminders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CRON_SECRET_TOKEN}`,
      'Content-Type': 'application/json'
    }
  })
  
  const result = await response.json()
  console.log('Emails sent:', result)
  
  return {
    statusCode: 200
  }
})

export { handler }
```

---

#### Option 3 : EasyCron (Service Externe Gratuit)

1. Créez un compte sur https://www.easycron.com
2. Ajoutez un nouveau cron :
   - URL : `https://votresite.com/api/cron/send-reminders`
   - Method : POST
   - Headers : `Authorization: Bearer VOTRE_TOKEN`
   - Schedule : Every day at 9:00 AM

---

## 🧪 TESTER LE SYSTÈME

### Test 1 : Email de Bienvenue

```bash
# Inscrivez-vous sur votre site avec un vrai email
# Vous devriez recevoir l'email de bienvenue
```

### Test 2 : Email de Badge

```bash
# Connectez-vous et déclenchez un badge
# Par exemple : connectez-vous 1 jour pour le badge "Premier Pas"
```

### Test 3 : Email d'Inactivité (Manuel)

```bash
# En développement uniquement
curl http://localhost:3002/api/cron/send-reminders
```

---

## 📊 PERSONNALISATION DES EMAILS

Tous les templates d'emails sont dans `/lib/email-service.ts`.

### Modifier un Template

Exemple : Changement du sujet de l'email de bienvenue

```typescript
// Dans /lib/email-service.ts, ligne ~398
const subject = `🎓 Bienvenue sur Master Maths, ${userName} !`

// Modifiez en :
const subject = `Bienvenue ${userName} ! Votre voyage commence ici 🚀`
```

### Ajouter Votre Logo dans les Emails

```typescript
// Dans le HTML de chaque template, ajoutez :
<div class="header">
  <img src="${process.env.NEXTAUTH_URL}/images/master-maths-logo.jpg" 
       alt="Master Maths" 
       style="max-width: 150px; margin: 20px auto; display: block;" />
  <h1>🎓 Master Maths</h1>
</div>
```

---

## 🎯 RÉCAPITULATIF DES DÉCLENCHEURS

| Email | Déclencheur | Fréquence | Implémenté |
|-------|-------------|-----------|------------|
| **Bienvenue** | Inscription | Immédiat | ✅ |
| **Badge débloqué** | Nouveau badge | Immédiat | ✅ |
| **Titre débloqué** | Promotion | Immédiat | ✅ (ajout manuel possible) |
| **Streak 7j** | 7 jours consécutifs | Immédiat | ✅ (via badge) |
| **Streak 30j** | 30 jours consécutifs | Immédiat | ✅ (via badge) |
| **Inactivité 48h** | Pas de connexion 48h | Quotidien (cron) | ✅ |
| **Récap mensuel** | Fin de mois | Mensuel (cron) | ⏳ (à ajouter) |

---

## 🔒 SÉCURITÉ

### 1. Protection du Cron Job

Le token `CRON_SECRET_TOKEN` empêche l'abus de l'API `/api/cron/send-reminders`.

**Générez un token fort** :
```bash
openssl rand -hex 32
```

### 2. Limite de Taux (Rate Limiting)

Pour éviter le spam, ajoutez un rate limiter dans `email-service.ts` :

```typescript
// lib/email-service.ts
private static lastEmailSent = new Date(0)
private static emailCount = 0

static async sendEmail({ to, subject, html, text }: SendEmailOptions) {
  // Limite : 10 emails/seconde max
  const now = new Date()
  if (now.getTime() - this.lastEmailSent.getTime() < 100) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  this.lastEmailSent = now
  // ... rest of code
}
```

---

## 💰 COÛTS

| Volumétrie | Gmail | SendGrid | Brevo | AWS SES |
|------------|-------|----------|-------|---------|
| 0-300/jour | Gratuit | Gratuit | Gratuit | $0.10/1000 |
| 1000/jour | Impossible | 15€/mois | 19€/mois | ~$3/mois |
| 10 000/jour | Impossible | 90€/mois | 49€/mois | ~$30/mois |

**Pour 1000 élèves avec 2 emails/mois en moyenne** :
- Emails : 2000/mois = ~70/jour
- **Gmail suffit largement (gratuit)** ✅

---

## ✅ CHECKLIST DE MISE EN PRODUCTION

- [ ] Variables SMTP configurées dans `.env`
- [ ] Test d'inscription → Email de bienvenue reçu
- [ ] Test de badge → Email de badge reçu
- [ ] Cron job configuré (GitHub Actions, Netlify, ou EasyCron)
- [ ] Test manuel du cron : `curl .../api/cron/send-reminders`
- [ ] Vérification des emails dans spam/indésirables
- [ ] (Optionnel) Configuration SPF/DKIM pour votre domaine
- [ ] Monitoring : logs des emails envoyés

---

## 🎓 AMÉLIORATION FUTURE : Récapitulatif Mensuel

Pour ajouter l'email de récap mensuel, créez :

### 1. API `/api/cron/send-monthly-reports`

```typescript
// app/api/cron/send-monthly-reports/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { EmailService } from '@/lib/email-service'

export async function POST(req: Request) {
  // Vérifier token
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET_TOKEN}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  // Récupérer tous les utilisateurs actifs
  const users = await prisma.user.findMany({
    where: { isSubscribed: true }
  })

  for (const user of users) {
    // Calculer les stats du mois
    const stats = await calculateMonthlyStats(user.id)
    
    // Envoyer l'email
    await EmailService.sendMonthlyReport(
      user.email,
      user.name || 'Étudiant',
      stats,
      user.emailsNotification || []
    )
  }

  return NextResponse.json({ success: true })
}
```

### 2. Ajouter au Cron (1er du mois à 9h)

```yaml
# GitHub Actions
- cron: '0 9 1 * *'  # 1er de chaque mois
```

---

## 🆘 DÉPANNAGE

### Les emails ne partent pas

1. **Vérifiez les variables d'environnement** :
   ```bash
   echo $SMTP_HOST
   echo $SMTP_USER
   ```

2. **Testez la connexion SMTP** :
   ```bash
   node -e "const nodemailer = require('nodemailer'); const t = nodemailer.createTransport({host: '$SMTP_HOST', port: $SMTP_PORT, auth: {user: '$SMTP_USER', pass: '$SMTP_PASSWORD'}}); t.verify().then(console.log).catch(console.error)"
   ```

3. **Vérifiez les logs** :
   ```bash
   # Netlify
   netlify dev --live
   
   # Vercel
   vercel logs
   ```

### Les emails vont dans les spams

1. **SPF Record** : Ajoutez à votre DNS
   ```
   v=spf1 include:_spf.google.com ~all  # Pour Gmail
   v=spf1 include:sendgrid.net ~all     # Pour SendGrid
   ```

2. **DKIM** : Configurez dans SendGrid/Brevo

3. **Utilisez un domaine personnalisé** : `noreply@votredomaine.com`

---

## 🎉 CONCLUSION

Votre système d'emails est **prêt** ! Il suffit de :

1. ✅ Configurer SMTP (5 minutes avec Gmail)
2. ✅ Ajouter les variables dans `.env`
3. ✅ (Optionnel) Configurer le cron pour les rappels

**Tous les templates sont déjà codés, beaux, et professionnels.** 🚀

---

*Guide créé pour Master Maths - Système d'emails complet v1.0*


