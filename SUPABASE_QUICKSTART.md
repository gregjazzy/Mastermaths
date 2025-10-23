# 🚀 Quick Start - Supabase Setup

## Étape 1 : Créer le projet Supabase (5 minutes)

1. **Aller sur** : https://supabase.com
2. **Se connecter** avec GitHub
3. **New Project** :
   - Name: `master-maths`
   - Password: Générer un mot de passe fort
   - Region: `Europe West (Frankfurt)`
   - Plan: `Free`

4. **Attendre 2-3 minutes** ⏳

---

## Étape 2 : Récupérer la Connection String

1. Dans votre projet → **Settings** ⚙️
2. **Database** (menu gauche)
3. Chercher **Connection String** → **URI**
4. Cliquer sur "Copy" 📋

Ça ressemble à :
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
```

5. **⚠️ IMPORTANT** : Remplacer `[YOUR-PASSWORD]` par votre vrai mot de passe !

---

## Étape 3 : Mettre à jour .env

```bash
# Ouvrir .env
nano .env

# Remplacer DATABASE_URL par la connection string Supabase
DATABASE_URL="postgresql://postgres.xxxxx:VOTRE_MOT_DE_PASSE@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"
```

---

## Étape 4 : Créer les tables

```bash
# Générer le client Prisma
npx prisma generate

# Créer toutes les tables
npx prisma db push

# ✅ Vous devriez voir : "Your database is now in sync with your schema"
```

---

## Étape 5 : Charger les badges

```bash
# Charger les 11 badges de base
npx prisma db execute --file prisma/seed-badges.sql --schema prisma/schema.prisma
```

---

## Étape 6 : Vérifier dans Supabase

1. Retourner sur Supabase
2. Cliquer sur **Table Editor** 🗂️
3. Vous devriez voir toutes les tables :
   - ✅ users
   - ✅ courses
   - ✅ chapters
   - ✅ subChapters
   - ✅ lessons
   - ✅ performances
   - ✅ badges (avec 11 entrées !)
   - ✅ connectionLogs
   - ✅ qcmQuestions
   - etc.

---

## Étape 7 : Tester localement

```bash
npm run dev
```

Aller sur http://localhost:3000 et :
1. Créer un compte
2. Vérifier que ça se connecte
3. Dashboard s'affiche ✅

---

## Étape 8 : (Optionnel) Charger des données de test

```bash
# Si vous voulez des cours de test
npx prisma db execute --file prisma/seed.sql --schema prisma/schema.prisma
```

---

## 🎉 C'est prêt !

Votre base de données Supabase est configurée et prête !

**Prochaine étape** : Déployer sur Netlify (voir `DEPLOIEMENT_SUPABASE_NETLIFY.md`)

---

## 🐛 Dépannage

### Erreur : "Can't reach database server"

1. Vérifier que le mot de passe dans DATABASE_URL est correct
2. Vérifier qu'il n'y a pas d'espaces dans l'URL
3. Essayer de se connecter via psql :
   ```bash
   psql "postgresql://postgres.xxxxx:PASSWORD@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"
   ```

### Erreur : "SSL connection required"

Ajouter `?sslmode=require` à la fin de DATABASE_URL :
```
DATABASE_URL="postgresql://...?sslmode=require"
```

### Erreur : "Too many connections"

Plan Free limité à 60 connexions simultanées.
Solution : Utiliser le Pooler (déjà inclus dans l'URL avec `.pooler.`)

---

## 📊 Quotas Plan Free Supabase

- **Database** : 500 MB
- **Bandwidth** : 2 GB / mois
- **API Requests** : 50,000 / mois
- **Storage** : 1 GB
- **Connections** : 60 simultanées

💡 Largement suffisant pour commencer !


