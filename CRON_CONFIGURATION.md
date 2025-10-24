# 🕐 Configuration des CRON Jobs - Master Maths

## ✅ **CRON Jobs Activés avec Netlify Pro**

Votre abonnement Netlify Pro inclut les **Scheduled Functions** (fonctions planifiées), qui permettent d'exécuter automatiquement des tâches à des heures précises.

---

## 📋 **CRON Jobs Configurés**

### 1. **Rappels d'Inactivité** ⚡

**Fichier** : `netlify/functions/send-reminders.ts`  
**Fréquence** : Tous les jours à 10h00 (heure de Paris)  
**Expression CRON** : `0 8 * * *` (8h UTC = 10h Paris)

**Action** :
- Identifie les utilisateurs inactifs depuis 3+ jours
- Envoie un email de rappel motivant
- Copie également les parents (via `emailsNotification`)

**Email envoyé** :
- Sujet : "⚡ [Prénom], on ne vous oublie pas !"
- Contenu : Rappel du nombre de jours d'inactivité + encouragements

---

### 2. **Récapitulatif Mensuel** 📊

**Fichier** : `netlify/functions/monthly-report.ts`  
**Fréquence** : Le 1er de chaque mois à 9h00 (heure de Paris)  
**Expression CRON** : `0 7 1 * *` (7h UTC = 9h Paris)

**Action** :
- Génère les statistiques du mois écoulé pour chaque utilisateur
- Envoie un bilan complet par email
- Ignore les utilisateurs sans activité

**Email envoyé** :
- Sujet : "📊 [Prénom], votre récapitulatif mensuel Master Maths"
- Contenu :
  - Nombre de leçons complétées
  - QCM réalisés et score moyen
  - Temps d'apprentissage
  - Badges débloqués
  - Streak actuel
  - Points de Maîtrise (PMU) gagnés

---

## 🔧 **Configuration Technique**

### Fichiers modifiés :

1. **`netlify.toml`** : Configuration des planifications
```toml
[functions."send-reminders"]
  schedule = "0 8 * * *"

[functions."monthly-report"]
  schedule = "0 7 1 * *"
```

2. **Routes API créées** :
   - `/api/cron/send-reminders` : Logique des rappels
   - `/api/cron/monthly-report` : Génération des rapports

3. **Fonctions Netlify** :
   - `netlify/functions/send-reminders.ts` : Appelle l'API interne
   - `netlify/functions/monthly-report.ts` : Appelle l'API interne

---

## 🎯 **Comment ça fonctionne ?**

```
┌─────────────────────────────────────────────┐
│   Netlify Scheduled Functions (CRON)       │
│   - Exécution automatique selon planning   │
└─────────────────┬───────────────────────────┘
                  │
                  │ Appelle URL interne
                  ▼
┌─────────────────────────────────────────────┐
│   API Routes Next.js                        │
│   - /api/cron/send-reminders                │
│   - /api/cron/monthly-report                │
└─────────────────┬───────────────────────────┘
                  │
                  │ Récupère données
                  ▼
┌─────────────────────────────────────────────┐
│   Supabase (PostgreSQL)                     │
│   - Utilisateurs inactifs                   │
│   - Statistiques mensuelles                 │
└─────────────────┬───────────────────────────┘
                  │
                  │ Envoie emails
                  ▼
┌─────────────────────────────────────────────┐
│   SMTP (via EmailService)                   │
│   - Nodemailer + Gmail/SMTP                 │
└─────────────────────────────────────────────┘
```

---

## ⚙️ **Configuration SMTP Requise**

Pour que les emails soient envoyés, configurez ces variables d'environnement dans **Netlify** :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-application-gmail
SMTP_FROM=Master Maths <votre-email@gmail.com>
```

### 📧 **Créer un mot de passe d'application Gmail** :

1. Allez sur https://myaccount.google.com/security
2. Activez la **validation en deux étapes**
3. Créez un **mot de passe d'application** (section "Mots de passe des applications")
4. Utilisez ce mot de passe (16 caractères) dans `SMTP_PASSWORD`

---

## 🔐 **Sécurité (Optionnel)**

Vous pouvez ajouter un token de sécurité pour empêcher l'exécution non autorisée des CRON via URL publique :

1. **Ajoutez une variable d'environnement Netlify** :
```env
CRON_SECRET=votre-token-secret-aleatoire-123456
```

2. **Les routes API vérifient déjà ce token** :
```typescript
if (process.env.CRON_SECRET && token !== process.env.CRON_SECRET) {
  return NextResponse.json({ error: 'Token CRON invalide' }, { status: 401 })
}
```

3. **Netlify Scheduled Functions n'ont PAS besoin de passer ce token** (appel interne sécurisé)

---

## 📊 **Monitoring des CRON**

### Dans Netlify Dashboard :

1. Allez sur **Functions** dans votre projet Netlify
2. Cliquez sur **Scheduled** pour voir vos fonctions planifiées
3. Consultez les logs d'exécution

### Logs disponibles :
- Heure d'exécution
- Durée d'exécution
- Succès/Échec
- Nombre d'emails envoyés

---

## 🧪 **Tester les CRON manuellement**

Vous pouvez tester les routes API directement :

```bash
# Tester les rappels d'inactivité
curl https://mastermathsfr.netlify.app/api/cron/send-reminders

# Tester le récap mensuel
curl https://mastermathsfr.netlify.app/api/cron/monthly-report
```

**Note** : Si `CRON_SECRET` est configuré, ajoutez `?token=votre-token`

---

## ⏰ **Expressions CRON**

Format : `minute heure jour_du_mois mois jour_de_la_semaine`

**Exemples** :
- `0 8 * * *` : Tous les jours à 8h UTC
- `0 7 1 * *` : Le 1er de chaque mois à 7h UTC
- `0 12 * * 1` : Tous les lundis à 12h UTC
- `0 */6 * * *` : Toutes les 6 heures
- `@hourly` : Toutes les heures
- `@daily` : Tous les jours à minuit
- `@weekly` : Tous les dimanches à minuit
- `@monthly` : Le 1er de chaque mois à minuit

**Convertisseur** : https://crontab.guru/

---

## 🎉 **C'est terminé !**

Les CRON sont maintenant **100% configurés et automatiques** grâce à Netlify Pro ! 🚀

Après le prochain déploiement, vos fonctions planifiées s'exécuteront automatiquement selon le planning défini.

