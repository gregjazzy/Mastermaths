# 🚀 Guide de démarrage rapide - Master Maths

## ⚡ Installation en 5 minutes

### 1️⃣ Prérequis
- Node.js 18+ installé
- PostgreSQL installé et en cours d'exécution
- Un compte Stripe (mode test)
- Un compte Vimeo avec des vidéos (optionnel pour les tests)

### 2️⃣ Installation

```bash
# Cloner ou naviguer dans le projet
cd MasterMaths

# Installer les dépendances
npm install
```

### 3️⃣ Configuration de la base de données

```bash
# Créer une base de données PostgreSQL
createdb mastermaths

# Ou avec psql
psql -U postgres
CREATE DATABASE mastermaths;
\q
```

### 4️⃣ Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Base de données
DATABASE_URL="postgresql://postgres:password@localhost:5432/mastermaths?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-super-securise-genere-aleatoirement"

# Stripe (clés de test)
STRIPE_SECRET_KEY="sk_test_votre_cle_secrete"
STRIPE_WEBHOOK_SECRET="whsec_votre_secret_webhook"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_votre_cle_publique"

# Vimeo (optionnel)
VIMEO_ACCESS_TOKEN="votre_token_vimeo"
```

**💡 Générer NEXTAUTH_SECRET :**
```bash
openssl rand -base64 32
```

### 5️⃣ Initialiser la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Créer les tables
npx prisma db push

# (Optionnel) Insérer des données de test
psql -U postgres -d mastermaths -f prisma/seed.sql
```

### 6️⃣ Lancer le serveur

```bash
npm run dev
```

🎉 Votre application est maintenant accessible sur **http://localhost:3000**

---

## 🧪 Tester l'application

### Créer un compte utilisateur

1. Allez sur http://localhost:3000
2. Cliquez sur "S'inscrire"
3. Créez un compte avec :
   - Nom : Test User
   - Email : test@example.com
   - Mot de passe : password123

### Tester les différents statuts

**Compte FREE (par défaut) :**
- Connectez-vous
- Vous n'avez accès qu'aux pages marketing

**Compte DEMO :**
```sql
-- Dans psql ou un client SQL
UPDATE users SET status = 'DEMO' WHERE email = 'test@example.com';
```
- Reconnectez-vous
- Vous avez maintenant accès au cours de démo

**Compte PREMIUM :**
```sql
UPDATE users SET status = 'PREMIUM', "isSubscribed" = true WHERE email = 'test@example.com';
```
- Reconnectez-vous
- Vous avez accès à tout le contenu

### Tester Stripe (mode test)

1. Allez sur https://dashboard.stripe.com/test/dashboard
2. Créez un produit avec un prix
3. Copiez l'ID du prix (ex: `price_1ABC...`)
4. Dans `app/upgrade/page.tsx`, remplacez `'price_premium_monthly'` par votre ID de prix
5. Utilisez une carte de test Stripe : `4242 4242 4242 4242`

---

## 📝 Créer du contenu de test

### Ajouter un cours

```sql
INSERT INTO courses (id, title, description, "order", "isDemoContent", "createdAt", "updatedAt")
VALUES ('cours-test', 'Mon cours de test', 'Description du cours', 0, true, NOW(), NOW());
```

### Ajouter un chapitre

```sql
INSERT INTO chapters (id, title, "order", "courseId", "createdAt", "updatedAt")
VALUES ('chapitre-1', 'Chapitre 1', 0, 'cours-test', NOW(), NOW());
```

### Ajouter un sous-chapitre

```sql
INSERT INTO subchapters (id, title, "order", "chapterId", "createdAt", "updatedAt")
VALUES ('sous-chapitre-1', 'Sous-chapitre 1', 0, 'chapitre-1', NOW(), NOW());
```

### Ajouter une vidéo de cours

```sql
INSERT INTO lessons (id, title, "subChapterId", type, "contentUrl", "order", "createdAt", "updatedAt")
VALUES ('lecon-video', 'Ma vidéo de cours', 'sous-chapitre-1', 'VIDEO_COURS', 'https://vimeo.com/76979871', 0, NOW(), NOW());
```

### Ajouter un QCM avec questions

```sql
-- Créer la leçon QCM
INSERT INTO lessons (id, title, "subChapterId", type, "order", "createdAt", "updatedAt")
VALUES ('lecon-qcm', 'Mon QCM', 'sous-chapitre-1', 'QCM', 1, NOW(), NOW());

-- Ajouter des questions
INSERT INTO qcm_questions (id, "lessonId", question, options, "correctAnswer", explanation, "order", "createdAt", "updatedAt")
VALUES 
  ('q1', 'lecon-qcm', 'Combien font 2 + 2 ?', ARRAY['3', '4', '5', '6'], 1, '2 + 2 = 4', 0, NOW(), NOW()),
  ('q2', 'lecon-qcm', 'Quelle est la capitale de la France ?', ARRAY['Lyon', 'Marseille', 'Paris', 'Nice'], 2, 'La capitale de la France est Paris', 1, NOW(), NOW());
```

### Ajouter une vidéo de correction

```sql
INSERT INTO lessons (id, title, "subChapterId", type, "contentUrl", "isCorrectionVideo", "linkedQcmId", "order", "createdAt", "updatedAt")
VALUES ('lecon-correction', 'Correction du QCM', 'sous-chapitre-1', 'CORRECTION_VIDEO', 'https://vimeo.com/76979871', true, 'lecon-qcm', 2, NOW(), NOW());
```

---

## 🐛 Dépannage courant

### Erreur : "Can't reach database server"
- Vérifiez que PostgreSQL est démarré
- Vérifiez les identifiants dans `DATABASE_URL`

### Erreur : "Module not found: Can't resolve '@/...' "
```bash
# Reconstruire le projet
rm -rf .next
npm run dev
```

### Erreur Prisma : "Migration failed"
```bash
# Réinitialiser complètement la base
npx prisma migrate reset --force
npx prisma db push
```

### Les vidéos Vimeo ne se chargent pas
- Vérifiez que l'URL est publique
- Vérifiez que le domaine est autorisé dans les paramètres Vimeo
- Utilisez l'ID Vimeo directement (ex: "76979871" au lieu de l'URL complète)

### Erreur Stripe : "No such price"
- Vérifiez que vous utilisez les clés de test (`sk_test_...`)
- Créez un produit et un prix dans le dashboard Stripe
- Utilisez l'ID du prix dans le code

---

## 📚 Prochaines étapes

1. **Explorez le code** :
   - Lisez `ARCHITECTURE.md` pour comprendre la structure
   - Consultez `README.md` pour la documentation complète

2. **Personnalisez** :
   - Modifiez les couleurs dans `tailwind.config.js`
   - Ajoutez votre logo dans `components/Navbar.tsx`
   - Changez les textes marketing dans `app/page.tsx`

3. **Ajoutez du contenu** :
   - Uploadez vos vidéos sur Vimeo
   - Créez vos cours, chapitres et leçons
   - Rédigez vos QCM

4. **Configurez Stripe** :
   - Créez vos plans tarifaires
   - Configurez les webhooks
   - Testez le flux de paiement complet

5. **Déployez** :
   - Vercel (recommandé pour Next.js)
   - Railway ou Render pour PostgreSQL
   - Configurez les variables d'environnement de production

---

## 🆘 Besoin d'aide ?

- Documentation Next.js : https://nextjs.org/docs
- Documentation Prisma : https://www.prisma.io/docs
- Documentation Stripe : https://stripe.com/docs
- Documentation Vimeo Player : https://developer.vimeo.com/player

**Bon développement avec Master Maths ! 🚀📐**


