# 🚀 Configuration Supabase pour Master Maths (5 minutes)

## Étape 1 : Créer un compte Supabase

1. Allez sur **https://supabase.com**
2. Cliquez sur **"Start your project"**
3. Connectez-vous avec GitHub ou Email
4. C'est gratuit, pas de carte bancaire requise ✅

---

## Étape 2 : Créer un nouveau projet

1. Cliquez sur **"New Project"**
2. Remplissez les informations :
   - **Name** : `mastermaths` (ou ce que vous voulez)
   - **Database Password** : Générez un mot de passe sécurisé (sauvegardez-le !)
   - **Region** : Choisissez **Europe (Frankfurt)** ou **West EU (London)** pour la France
   - **Pricing Plan** : Laissez **Free** (gratuit)
3. Cliquez sur **"Create new project"**
4. ⏳ Attendez 2 minutes que le projet se crée

---

## Étape 3 : Récupérer l'URL de connexion

Une fois le projet créé :

1. Dans le menu de gauche, cliquez sur **⚙️ Settings**
2. Cliquez sur **Database** dans le sous-menu
3. Scrollez jusqu'à **"Connection string"**
4. Sélectionnez l'onglet **"URI"** (pas Pooling)
5. Copiez l'URL complète qui ressemble à :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. **⚠️ Important** : Remplacez `[YOUR-PASSWORD]` par le mot de passe que vous avez créé à l'étape 2

---

## Étape 4 : Configurer votre projet local

### 4.1 Créer le fichier `.env`

Dans le dossier racine de votre projet Master Maths, créez un fichier nommé `.env` (sans extension) :

```bash
# Base de données Supabase
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="generez-un-secret-aleatoire-de-32-caracteres-minimum-ici"
NEXTAUTH_URL="http://localhost:3002"

# Supabase (optionnel mais recommandé)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="votre-anon-key"

# Vimeo (à remplir plus tard quand vous ajoutez des vidéos)
NEXT_PUBLIC_VIMEO_ACCESS_TOKEN=""

# Stripe (à remplir plus tard pour les paiements)
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
```

**Pour générer un NEXTAUTH_SECRET**, exécutez dans votre terminal :
```bash
openssl rand -base64 32
```

### 4.2 Pour récupérer les clés Supabase (optionnel) :
1. Dans Supabase, allez dans **⚙️ Settings > API**
2. Copiez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Étape 5 : Appliquer les migrations (Créer les tables)

Dans votre terminal, à la racine du projet Master Maths :

```bash
# 1. Générer le client Prisma
npx prisma generate

# 2. Créer les tables dans Supabase
npx prisma db push

# 3. (Optionnel) Ajouter les badges de démarrage
psql "votre-url-supabase" -f prisma/seed-badges.sql
```

Si vous n'avez pas `psql` installé, vous pouvez aussi :
1. Aller dans Supabase > **SQL Editor**
2. Copier-coller le contenu de `prisma/seed-badges.sql`
3. Exécuter la requête

---

## Étape 6 : Vérifier que tout fonctionne

### 6.1 Vérifier les tables dans Supabase

1. Dans Supabase, cliquez sur **Table Editor** dans le menu
2. Vous devriez voir toutes vos tables :
   - ✅ User
   - ✅ Course
   - ✅ Chapter
   - ✅ SubChapter
   - ✅ Lesson
   - ✅ QcmQuestion
   - ✅ Performance
   - ✅ Badge
   - ✅ ConnectionLog
   - etc.

### 6.2 Tester l'application

1. Redémarrez votre serveur Next.js :
   ```bash
   # Arrêtez le serveur (Ctrl+C)
   # Relancez
   npm run dev
   ```

2. Allez sur **http://localhost:3002/auth/register**
3. Créez votre premier compte (ce sera votre compte admin)
4. Une fois inscrit, allez sur **http://localhost:3002/admin**

---

## ✅ Vous êtes prêt !

Votre base de données est configurée et prête à l'emploi. Vous pouvez maintenant :

1. **Créer des cours** via `/admin/courses`
2. **Ajouter des chapitres** via `/admin/chapters`
3. **Créer des leçons** via `/admin/lessons`
4. **Gérer les QCM** via `/admin/qcm/[lessonId]`

---

## 🎯 Avantages de cette configuration

- ✅ **Base de données en production** : Prête pour vos vrais élèves
- ✅ **Accessible partout** : Vous pouvez travailler de n'importe où
- ✅ **Sauvegardes automatiques** : Vos données sont protégées
- ✅ **Interface graphique** : Visualisez vos données dans Supabase
- ✅ **Évolutif** : Quand vous avez 100, 1000 élèves, ça fonctionne pareil

---

## 📊 Visualiser vos données

Dans Supabase :
- **Table Editor** : Voir et modifier les données comme dans Excel
- **SQL Editor** : Exécuter des requêtes SQL personnalisées
- **Database** : Voir les statistiques et performances
- **Authentication** : Gérer les utilisateurs (optionnel)

---

## 🆘 Dépannage

### Erreur "connection refused"
- Vérifiez que vous avez bien remplacé `[YOUR-PASSWORD]` dans l'URL
- Vérifiez que le projet Supabase est bien actif (pas en pause)

### Erreur "authentication failed"
- Le mot de passe dans l'URL doit être celui que vous avez créé lors de la création du projet
- Si vous l'avez oublié, vous pouvez le réinitialiser dans Settings > Database

### Les tables ne se créent pas
- Vérifiez que vous êtes dans le bon dossier (racine du projet)
- Essayez `npx prisma migrate deploy` à la place de `db push`

---

## 💡 Conseil Pro

Dans Supabase, activez le **Row Level Security (RLS)** plus tard quand vous êtes en production pour plus de sécurité. Pour le développement, ce n'est pas nécessaire car Prisma gère déjà la sécurité.

---

## 🚀 Prochaines étapes

Une fois la base configurée, consultez :
1. **ADMIN_GUIDE.md** : Comment utiliser l'interface admin
2. **QUICKSTART.md** : Guide de démarrage complet
3. **DEPLOIEMENT_SUPABASE_NETLIFY.md** : Déployer en production

---

**🎓 Votre plateforme Master Maths est maintenant opérationnelle !**


