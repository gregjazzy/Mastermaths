# 🚀 Configuration requise pour lancer l'application

## Étape 1 : Créer le fichier .env

Créez un fichier `.env` à la racine du projet avec ce contenu minimum :

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/mastermaths"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Optionnel (peut être vide pour tester)
NEXT_PUBLIC_VIMEO_ACCESS_TOKEN=""
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
```

## Étape 2 : Options pour la base de données

### Option A : Utiliser Supabase (Recommandé - Gratuit)
1. Créez un compte sur https://supabase.com
2. Créez un nouveau projet
3. Récupérez l'URL de connexion PostgreSQL dans Settings > Database
4. Remplacez `DATABASE_URL` dans le fichier .env

### Option B : PostgreSQL local
1. Installez PostgreSQL localement
2. Créez une base de données : `createdb mastermaths`
3. Utilisez : `DATABASE_URL="postgresql://localhost:5432/mastermaths"`

### Option C : Mode développement sans base de données
Pour tester l'interface seulement, on peut lancer en mode développement.

## Étape 3 : Appliquer les migrations

Si vous avez une base de données :
```bash
npx prisma migrate deploy
npx prisma db push
```

## Étape 4 : Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

---

**Note** : Sans base de données configurée, l'application affichera des erreurs de connexion, mais l'interface sera visible.


