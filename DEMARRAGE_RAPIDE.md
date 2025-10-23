# 🚀 Guide de Démarrage Rapide - Master Maths

## 📋 Prérequis

- Node.js 18+ 
- PostgreSQL 14+
- npm ou yarn
- Compte Stripe (test mode)
- Compte Vimeo (optionnel)

---

## ⚡ Installation Rapide

### 1. **Installer les dépendances**

```bash
npm install
```

### 2. **Configurer la base de données**

#### Option A : PostgreSQL Local

```bash
# Installer PostgreSQL (macOS)
brew install postgresql@14
brew services start postgresql@14

# Créer la base de données
createdb mastermaths
```

#### Option B : PostgreSQL Cloud (Supabase)

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Copier la "Connection string" (mode Pooling)

### 3. **Configurer les variables d'environnement**

Créer un fichier `.env` à la racine :

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/mastermaths"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-aleatoire-très-long-et-complexe"

# Stripe (Test mode)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Email (Optionnel - pour l'instant utilise console.log)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="Master Maths <noreply@mastermaths.com>"
```

**Générer NEXTAUTH_SECRET :**
```bash
openssl rand -base64 32
```

### 4. **Initialiser la base de données**

```bash
# Créer les tables
npx prisma db push

# Visualiser la base de données (optionnel)
npx prisma studio
```

### 5. **Charger les données initiales**

```bash
# Charger les badges
npx prisma db execute --file prisma/seed-badges.sql --schema prisma/schema.prisma

# Charger les données de test (optionnel)
npx prisma db execute --file prisma/seed.sql --schema prisma/schema.prisma
```

### 6. **Lancer le serveur de développement**

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 🎯 Premiers pas

### 1. **Créer un compte**

1. Aller sur `/auth/register`
2. Créer un compte (email + mot de passe)
3. Vous serez redirigé vers le dashboard

### 2. **Tester les fonctionnalités**

Sans données de cours, vous verrez :
- ✅ Dashboard vide
- ✅ Stats de gamification (0 PMU)
- ✅ Hall of Fame (vide)
- ✅ Tracking de connexion actif

### 3. **Ajouter du contenu de test**

Exécuter le script de seed complet :

```bash
# Créer un cours de test avec chapitres, leçons, QCM
npm run seed:full  # À créer
```

Ou utiliser Prisma Studio :
```bash
npx prisma studio
# Ouvrir http://localhost:5555
# Créer manuellement des courses, chapters, lessons
```

---

## 🏗️ Structure du projet

```
MasterMaths/
├── app/
│   ├── api/               # APIs REST
│   │   ├── auth/          # Authentification
│   │   ├── courses/       # Cours
│   │   ├── lessons/       # Leçons
│   │   ├── engagement/    # Gamification
│   │   ├── dashboard/     # Stats
│   │   └── stripe/        # Paiements
│   ├── auth/              # Pages login/register
│   ├── dashboard/         # Dashboards
│   ├── hall-of-fame/      # Classements
│   └── cours/             # Pages de cours
├── components/            # Composants React
├── lib/                   # Services
│   ├── prisma.ts         # Client DB
│   ├── auth.ts           # NextAuth config
│   ├── badge-service.ts  # Badges
│   ├── connection-service.ts
│   ├── email-service.ts
│   └── mastery-points-service.ts
├── prisma/
│   ├── schema.prisma     # Modèles de données
│   ├── seed.sql          # Données de test
│   └── seed-badges.sql   # Badges initiaux
└── public/               # Assets statiques
```

---

## 🎮 Fonctionnalités disponibles

### ✅ **Authentification**
- Inscription / Connexion
- Session persistante
- Protection des routes

### ✅ **Système de cours**
- Hiérarchie : Course → Chapter → SubChapter → Lesson
- 6 types de leçons (VIDEO, QCM, CORRECTION_VIDEO, etc.)
- Contrôle d'accès (FREE, DEMO, PREMIUM)

### ✅ **Gamification**
- Points de Maîtrise (PMU)
- 13 titres évolutifs
- Badges avec rareté
- Hall of Fame (3 classements)

### ✅ **Tracking**
- Progression vidéo
- Scores QCM
- Streak de connexion
- Temps de connexion

### ✅ **Dashboards**
- Dashboard étudiant
- Dashboard parent
- Stats détaillées

### ✅ **Paiements**
- Intégration Stripe
- 3 formules (FREE, DEMO, PREMIUM)
- Webhooks

---

## 🔧 Configuration avancée

### **Vimeo**

Si vous utilisez Vimeo pour l'hébergement vidéo :

1. Créer un compte sur [vimeo.com](https://vimeo.com)
2. Uploader vos vidéos
3. Récupérer l'ID de la vidéo (ex: `123456789`)
4. Stocker dans la DB : `vimeoVideoId` dans la table `Lesson`

### **Stripe**

1. Créer un compte sur [stripe.com](https://stripe.com)
2. Activer le mode test
3. Créer 2 produits :
   - DEMO : 29€/mois
   - PREMIUM : 79€/mois
4. Copier les clés API dans `.env`

Configuration webhook :
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### **Emails**

Pour activer les emails de notification :

1. Configurer SMTP dans `.env`
2. Pour Gmail : activer "Mots de passe d'application"
3. Tester avec :
```bash
npm run test:email
```

---

## 📊 Données de test

### **Créer un utilisateur admin**

```sql
UPDATE users 
SET status = 'PREMIUM'
WHERE email = 'your-email@example.com';
```

### **Créer un cours de test**

```sql
INSERT INTO courses (id, title, description, "accessLevel") 
VALUES ('test-course', 'Cours de Test', 'Description', 'FREE');

INSERT INTO chapters (id, "courseId", title, "order") 
VALUES ('test-chapter', 'test-course', 'Chapitre 1', 1);

INSERT INTO "subChapters" (id, "chapterId", title, "order") 
VALUES ('test-subchapter', 'test-chapter', 'Sous-chapitre 1', 1);

INSERT INTO lessons (id, "subChapterId", title, type, "order", "vimeoVideoId") 
VALUES ('test-lesson', 'test-subchapter', 'Leçon 1', 'VIDEO_COURS', 1, '123456789');
```

---

## 🐛 Dépannage

### **Erreur : Cannot find module 'prisma'**

```bash
npm install @prisma/client
npx prisma generate
```

### **Erreur : Database connection failed**

Vérifier :
1. PostgreSQL est démarré
2. DATABASE_URL est correct dans `.env`
3. La base de données existe

```bash
# Tester la connexion
psql -U user -d mastermaths
```

### **Erreur : NextAuth session null**

Vérifier :
1. NEXTAUTH_URL est correct
2. NEXTAUTH_SECRET est défini
3. Cookies autorisés dans le navigateur

### **Erreur : Stripe webhook failed**

En développement :
```bash
# Utiliser Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## 🚀 Déploiement

### **Vercel (recommandé)**

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les variables d'environnement dans Vercel Dashboard
```

### **Variables d'environnement en production**

```env
DATABASE_URL="postgresql://..."  # Supabase/Railway
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="production-secret-très-long"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

---

## 📚 Documentation

- [Architecture complète](./ARCHITECTURE.md)
- [Système d'engagement](./ENGAGEMENT_SYSTEM.md)
- [Tracking du temps](./TIME_TRACKING_SYSTEM.md)
- [Système de badges](./prisma/seed-badges.sql)

---

## 🆘 Support

- **Issues** : Créer une issue sur GitHub
- **Email** : support@mastermaths.com
- **Discord** : [Rejoindre la communauté](https://discord.gg/mastermaths)

---

## ✅ Checklist de lancement

- [ ] PostgreSQL configuré
- [ ] Variables d'environnement (.env)
- [ ] Base de données initialisée (`prisma db push`)
- [ ] Badges chargés (`seed-badges.sql`)
- [ ] Stripe configuré (mode test)
- [ ] Compte test créé
- [ ] Cours de test créé
- [ ] Emails testés
- [ ] Déploiement Vercel
- [ ] DNS configuré
- [ ] Monitoring activé

---

**Projet prêt à l'emploi ! 🎉**


