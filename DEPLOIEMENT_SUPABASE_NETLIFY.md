# 🚀 Déploiement Master Maths - Supabase + Netlify

## 📋 Stack de déploiement

- **Base de données** : Supabase (PostgreSQL)
- **Hosting** : Netlify
- **Paiements** : Stripe
- **Emails** : SendGrid / Resend

---

## 🗄️ ÉTAPE 1 : Configuration Supabase

### 1.1 Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un compte / Se connecter
3. Cliquer sur "New Project"
4. Remplir :
   - **Name** : `master-maths`
   - **Database Password** : Générer un mot de passe fort (le sauvegarder !)
   - **Region** : Europe West (Frankfurt) ou le plus proche
   - **Pricing Plan** : Free (ou Pro si besoin)
5. Attendre 2-3 minutes que le projet soit créé

### 1.2 Récupérer la Connection String

1. Dans le projet Supabase, aller dans **Settings** → **Database**
2. Chercher **Connection String** → **URI**
3. Copier la chaîne qui ressemble à :
   ```
   postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
   ```
4. **IMPORTANT** : Remplacer `[YOUR-PASSWORD]` par votre vrai mot de passe

### 1.3 Configurer la base de données

#### Option A : Via Terminal (Recommandé)

```bash
# 1. Mettre à jour .env avec la connection string Supabase
nano .env

# Remplacer DATABASE_URL par :
DATABASE_URL="postgresql://postgres.xxx:password@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"

# 2. Créer les tables
npx prisma db push

# 3. Charger les badges
npx prisma db execute --file prisma/seed-badges.sql --schema prisma/schema.prisma
```

#### Option B : Via Supabase SQL Editor

1. Dans Supabase, aller dans **SQL Editor**
2. Cliquer sur "New Query"
3. Copier-coller le contenu de `prisma/migrations/0_init/migration.sql`
4. Exécuter
5. Copier-coller le contenu de `prisma/seed-badges.sql`
6. Exécuter

### 1.4 Vérifier les tables

Dans Supabase :
1. Aller dans **Table Editor**
2. Vous devriez voir toutes les tables :
   - users
   - courses
   - chapters
   - subChapters
   - lessons
   - performances
   - badges
   - connectionLogs
   - qcmQuestions
   - etc.

---

## 🌐 ÉTAPE 2 : Configuration Netlify

### 2.1 Préparer le projet pour Netlify

#### Installer le plugin Netlify pour Next.js

```bash
npm install --save @netlify/plugin-nextjs
```

#### Créer `netlify.toml`

```bash
cat > netlify.toml << 'EOF'
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF
```

### 2.2 Connecter GitHub (Recommandé)

#### Créer un repo GitHub

```bash
# Initialiser git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit - Master Maths LMS"

# Créer un repo sur GitHub et le lier
git remote add origin https://github.com/votre-username/master-maths.git
git branch -M main
git push -u origin main
```

### 2.3 Déployer sur Netlify

1. Aller sur [netlify.com](https://netlify.com)
2. Se connecter / Créer un compte
3. Cliquer sur **"Add new site"** → **"Import an existing project"**
4. Choisir **GitHub** et autoriser l'accès
5. Sélectionner le repo **master-maths**
6. Configuration du build :
   - **Build command** : `npm run build`
   - **Publish directory** : `.next`
   - ✅ Cliquer sur "Deploy"

### 2.4 Configurer les variables d'environnement

Dans Netlify :
1. Aller dans **Site configuration** → **Environment variables**
2. Ajouter toutes les variables :

```env
DATABASE_URL="postgresql://postgres.xxx:password@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"

NEXTAUTH_URL="https://votre-site.netlify.app"
NEXTAUTH_SECRET="générer-avec-openssl-rand-base64-32"

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="votre-api-key-sendgrid"
SMTP_FROM="Master Maths <noreply@mastermaths.com>"
```

**Générer NEXTAUTH_SECRET :**
```bash
openssl rand -base64 32
```

### 2.5 Redéployer

1. Dans Netlify, aller dans **Deploys**
2. Cliquer sur **"Trigger deploy"** → **"Deploy site"**
3. Attendre 2-3 minutes

---

## 💳 ÉTAPE 3 : Configuration Stripe

### 3.1 Créer un compte Stripe

1. Aller sur [stripe.com](https://stripe.com)
2. Créer un compte / Se connecter
3. Activer le **mode test** (toggle en haut à droite)

### 3.2 Créer les produits

Dans Stripe Dashboard :

#### Produit 1 : DEMO
1. **Products** → **Add product**
2. Name : `Master Maths DEMO`
3. Pricing : `29 EUR / mois` (récurrent)
4. Metadata : `plan: DEMO`

#### Produit 2 : PREMIUM
1. **Products** → **Add product**
2. Name : `Master Maths PREMIUM`
3. Pricing : `79 EUR / mois` (récurrent)
4. Metadata : `plan: PREMIUM`

### 3.3 Récupérer les clés API

Dans Stripe Dashboard :
1. **Developers** → **API keys**
2. Copier :
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)

### 3.4 Configurer le Webhook

1. **Developers** → **Webhooks**
2. Cliquer sur **"Add endpoint"**
3. Endpoint URL : `https://votre-site.netlify.app/api/stripe/webhook`
4. Events à écouter :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copier le **Signing secret** (whsec_...)

### 3.5 Mettre à jour les variables Netlify

Ajouter les clés Stripe dans Netlify Environment Variables.

---

## 📧 ÉTAPE 4 : Configuration SendGrid (Emails)

### 4.1 Créer un compte SendGrid

1. Aller sur [sendgrid.com](https://sendgrid.com)
2. Créer un compte gratuit (100 emails/jour)
3. Vérifier votre email

### 4.2 Créer une API Key

1. **Settings** → **API Keys**
2. Cliquer sur **"Create API Key"**
3. Name : `master-maths-production`
4. Permissions : **Full Access**
5. Copier la clé (commence par SG....)

### 4.3 Vérifier un expéditeur

1. **Settings** → **Sender Authentication**
2. Cliquer sur **"Verify a Single Sender"**
3. Remplir avec votre email professionnel
4. Vérifier via l'email reçu

### 4.4 Mettre à jour les variables Netlify

```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="votre-api-key-sendgrid"
SMTP_FROM="Master Maths <votre-email-verifie@domain.com>"
```

---

## 🔧 ÉTAPE 5 : Configuration du domaine (Optionnel)

### Si vous avez un domaine personnalisé

1. Dans Netlify : **Domain management** → **Add domain**
2. Entrer votre domaine : `www.mastermaths.com`
3. Suivre les instructions pour configurer les DNS
4. Mettre à jour `NEXTAUTH_URL` avec votre vrai domaine

---

## ✅ ÉTAPE 6 : Vérification finale

### 6.1 Tester le site

1. Aller sur `https://votre-site.netlify.app`
2. Tester :
   - ✅ Page d'accueil s'affiche
   - ✅ Inscription fonctionne
   - ✅ Connexion fonctionne
   - ✅ Dashboard s'affiche
   - ✅ Pas d'erreurs dans la console

### 6.2 Tester Stripe

1. Aller sur `/upgrade`
2. Cliquer sur "Passer à DEMO"
3. Utiliser une carte de test :
   - **Numéro** : `4242 4242 4242 4242`
   - **Date** : N'importe quelle date future
   - **CVC** : N'importe quel 3 chiffres
4. Valider le paiement
5. Vérifier que le status passe à DEMO

### 6.3 Tester les emails

1. Se déconnecter pendant 3 jours
2. Vérifier qu'un email de rappel est envoyé
3. Se connecter 7 jours d'affilée
4. Vérifier l'email de célébration

---

## 📊 ÉTAPE 7 : Monitoring & Analytics

### 7.1 Netlify Analytics (Optionnel, Payant)

1. Dans Netlify : **Analytics** → **Enable**
2. Voir les visiteurs, pages vues, etc.

### 7.2 Sentry (Erreurs, Gratuit)

```bash
npm install @sentry/nextjs

npx @sentry/wizard@latest -i nextjs
```

### 7.3 Plausible Analytics (Privacy-friendly)

1. Créer un compte sur [plausible.io](https://plausible.io)
2. Ajouter le script dans `app/layout.tsx`

---

## 🔄 ÉTAPE 8 : Workflow de développement

### Développement local

```bash
# Travailler en local
npm run dev

# Tester en local avec la DB Supabase
# (Utiliser l'URL de développement dans .env)
```

### Déploiement

```bash
# Commit et push
git add .
git commit -m "Ajout de fonctionnalité X"
git push origin main

# Netlify déploie automatiquement ! 🎉
```

### Preview Deployments

Netlify crée automatiquement des previews pour chaque Pull Request !

---

## 🚨 Dépannage

### Erreur : "Database connection failed"

1. Vérifier que DATABASE_URL est correct dans Netlify
2. Vérifier que le mot de passe est le bon
3. Vérifier que Supabase autorise les connexions externes

### Erreur : "NextAuth session is null"

1. Vérifier NEXTAUTH_URL (doit être l'URL Netlify)
2. Vérifier NEXTAUTH_SECRET est défini
3. Vider les cookies du navigateur

### Build failed sur Netlify

1. Vérifier les logs dans Netlify Deploys
2. Vérifier que toutes les variables d'environnement sont définies
3. Vérifier que `@netlify/plugin-nextjs` est installé

### Webhooks Stripe ne fonctionnent pas

1. Vérifier l'URL du webhook dans Stripe Dashboard
2. Vérifier que STRIPE_WEBHOOK_SECRET est correct
3. Tester avec Stripe CLI :
   ```bash
   stripe listen --forward-to https://votre-site.netlify.app/api/stripe/webhook
   ```

---

## 📈 Coûts mensuels (Estimés)

| Service | Plan | Coût |
|---------|------|------|
| **Supabase** | Free | 0€ (500 MB, 2GB transfert) |
| **Netlify** | Free | 0€ (100 GB bande passante) |
| **Stripe** | Pay-as-you-go | 1.4% + 0.25€ par transaction |
| **SendGrid** | Free | 0€ (100 emails/jour) |
| **Total** | | **~0€** pour commencer ! |

### Upgrades recommandés quand vous grandissez :

- **Supabase Pro** : 25$/mois (8GB DB, 250GB transfert)
- **Netlify Pro** : 19$/mois (1TB bande passante)
- **SendGrid Essentials** : 15$/mois (40k emails)

---

## 🎉 C'est prêt !

Votre plateforme Master Maths est maintenant déployée et accessible au monde entier !

**URL de production** : `https://votre-site.netlify.app`

---

## 🔒 Checklist de sécurité

Avant de passer en production :

- [ ] NEXTAUTH_SECRET généré avec openssl (32+ caractères)
- [ ] Stripe en mode LIVE (pas test)
- [ ] Variables d'environnement sécurisées
- [ ] HTTPS activé (automatique avec Netlify)
- [ ] Emails de vérification activés
- [ ] Rate limiting configuré
- [ ] Backup automatique Supabase activé
- [ ] Monitoring des erreurs (Sentry)
- [ ] Plan de sauvegarde

---

**Félicitations ! Votre plateforme est en ligne ! 🚀**


