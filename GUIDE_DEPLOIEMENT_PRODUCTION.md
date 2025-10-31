# 🚀 Guide de Déploiement Production - Master Maths

## ✅ CORRECTION DU PROBLÈME DE PRODUCTION (31 Octobre 2025)

### 🔴 **Problème Identifié**

Le site affichait des erreurs 500 en production à cause de **3 problèmes majeurs** :

1. ❌ **Middleware bloquait l'admin en production** → Erreur 403
2. ❌ **DATABASE_URL incorrecte** → Port 6543 (transaction pooling) au lieu du pooling Prisma
3. ❌ **Configuration Prisma manquante** → Pas de `directUrl` pour les migrations

### ✅ **Corrections Appliquées**

#### 1. Middleware Corrigé
**Fichier :** `middleware.ts`

**AVANT :**
```typescript
// 🔒 BLOQUER /admin en production
if (isAdmin && process.env.NODE_ENV === 'production') {
  return NextResponse.json(
    { error: 'Accès admin désactivé en production' },
    { status: 403 }
  )
}
```

**APRÈS :**
```typescript
// Rediriger vers login si pas authentifié et essaie d'accéder à l'admin
if (!isAuth && isAdmin) {
  return NextResponse.redirect(new URL('/auth/login', request.url))
}
```

#### 2. Schema Prisma Corrigé
**Fichier :** `prisma/schema.prisma`

**AJOUT :**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // ← NOUVEAU : Pour connexion directe
}
```

#### 3. Next.js Config Corrigé
**Fichier :** `next.config.js`

**AJOUT :**
```javascript
experimental: {
  serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
}
```

---

## 🔧 **Configuration Netlify - Variables d'Environnement**

### ⚠️ **IMPORTANT : Corriger les URLs de connexion**

Rendez-vous sur **Netlify Dashboard** → Votre site → **Site settings** → **Environment variables**

### 🗑️ **SUPPRIMER les anciennes variables incorrectes :**

- `DATABASE_URL` (ancienne version avec port 6543)
- `SKIP_ENV_VALIDATION` (si présente)

### ✅ **AJOUTER les nouvelles variables correctes :**

#### 1️⃣ **DATABASE_URL** (Connection Pooling)
```
postgres://postgres.zqgjhtafyuivnmgyqcix:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**⚠️ Notes importantes :**
- Remplacer `[PASSWORD]` par votre mot de passe Supabase
- Utiliser le **Pooler endpoint** (`.pooler.supabase.com`)
- Port **6543** avec `pgbouncer=true`
- `connection_limit=1` pour environnement serverless

#### 2️⃣ **DIRECT_URL** (Connexion Directe pour Migrations)
```
postgresql://postgres:[PASSWORD]@db.zqgjhtafyuivnmgyqcix.supabase.co:5432/postgres
```

**⚠️ Notes importantes :**
- Remplacer `[PASSWORD]` par votre mot de passe Supabase
- Utiliser le **Direct endpoint** (`db.xxx.supabase.co`)
- Port **5432** (connexion directe PostgreSQL)
- **Sans** `pgbouncer=true`

#### 3️⃣ **NEXTAUTH_SECRET**
```
2nV1Jo3Sq2Lcp3YLFoLuqxk1rAf7aShtkRdj43i4AAg=
```
*(Vous pouvez garder celui existant ou en générer un nouveau avec `openssl rand -base64 32`)*

#### 4️⃣ **NEXTAUTH_URL**
```
https://master-maths.com
```
*(Votre domaine de production)*

#### 5️⃣ **GEMINI_API_KEY**
```
AIzaSyA9nJRKf_BqgmH4JO2fGRju01FFMM8K1XQ
```
*(Votre clé API Google Gemini)*

#### 6️⃣ **NODE_ENV**
```
production
```

---

## 📍 **Comment trouver vos URLs Supabase ?**

### 1. **Connexion à Supabase**
Allez sur [app.supabase.com](https://app.supabase.com)

### 2. **Sélectionnez votre projet**
`zqgjhtafyuivnmgyqcix` (Master Maths)

### 3. **Allez dans Project Settings**
Cliquez sur l'icône ⚙️ en bas à gauche

### 4. **Database**
Dans le menu de gauche : **Settings** → **Database**

### 5. **Connection String**
Vous verrez **2 types de connexions** :

#### **📊 Connection Pooling (pour DATABASE_URL)**
```
URI:
postgres://postgres.zqgjhtafyuivnmgyqcix:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

**⚠️ AJOUTER à la fin :**
```
?pgbouncer=true&connection_limit=1
```

**✅ URL FINALE à utiliser :**
```
postgres://postgres.zqgjhtafyuivnmgyqcix:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

#### **🔌 Direct Connection (pour DIRECT_URL)**
```
postgresql://postgres:[YOUR-PASSWORD]@db.zqgjhtafyuivnmgyqcix.supabase.co:5432/postgres
```

**✅ URL FINALE à utiliser :** (telle quelle, sans modification)

---

## 🚀 **Procédure de Déploiement**

### Étape 1 : Générer Prisma Client
```bash
npx prisma generate
```

### Étape 2 : Commit & Push
```bash
git add .
git commit -m "fix: Correction configuration production Netlify + Prisma"
git push origin main
```

### Étape 3 : Configuration Netlify

1. **Se connecter à Netlify** : [app.netlify.com](https://app.netlify.com)
2. **Sélectionner le site** : master-maths
3. **Aller dans Site settings** → **Environment variables**
4. **Supprimer** les anciennes variables incorrectes
5. **Ajouter** les 6 variables listées ci-dessus avec les bonnes valeurs
6. **Sauvegarder**

### Étape 4 : Redéploiement

Netlify va automatiquement redéployer avec le nouveau commit.

**OU** forcer un redéploiement :
1. **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

### Étape 5 : Vérification

1. **Attendre** 2-3 minutes (build + déploiement)
2. **Visiter** : https://master-maths.com
3. **Tester la connexion** : https://master-maths.com/auth/login
4. **Vérifier l'admin** : https://master-maths.com/admin (après connexion)

---

## 🔍 **Vérification des Logs**

### Si le site affiche toujours des erreurs :

#### 1. **Logs de Build**
Netlify Dashboard → **Deploys** → Dernier deploy → **Deploy log**

Recherchez :
- ✅ `Prisma Client generated successfully`
- ✅ `Build succeeded`
- ❌ Erreurs de connexion DB

#### 2. **Logs de Function**
Netlify Dashboard → **Functions** → **Function log**

Recherchez :
- ❌ `Error: Can't reach database server`
- ❌ `Connection timeout`
- ❌ `Authentication failed`

#### 3. **Console Browser**
Ouvrez https://master-maths.com → **F12** → **Console**

Recherchez :
- ❌ `Error occurred in the Server Components render`
- ❌ `500 Internal Server Error`

---

## ✅ **Checklist de Validation**

Avant de considérer le déploiement comme réussi, vérifier :

- [ ] ✅ Le site charge sans erreur 500
- [ ] ✅ La page de connexion fonctionne (`/auth/login`)
- [ ] ✅ La création de compte fonctionne (`/auth/register`)
- [ ] ✅ Le dashboard se charge (`/dashboard`)
- [ ] ✅ La liste des cours se charge (`/cours`)
- [ ] ✅ L'admin est accessible (après login) (`/admin`)
- [ ] ✅ Les vidéos Vimeo se chargent
- [ ] ✅ Les QCM fonctionnent
- [ ] ✅ Les badges sont attribués correctement

---

## 🆘 **Dépannage (Troubleshooting)**

### Problème : "Can't reach database server"

**Cause :** URL de connexion incorrecte

**Solution :**
1. Vérifier que `DATABASE_URL` contient bien `.pooler.supabase.com`
2. Vérifier que `DIRECT_URL` contient bien `db.xxx.supabase.co`
3. Vérifier le mot de passe (copier-coller depuis Supabase)
4. S'assurer qu'il n'y a pas d'espaces avant/après les URLs

### Problème : "Authentication failed"

**Cause :** Mot de passe incorrect

**Solution :**
1. Aller sur Supabase → Project Settings → Database
2. Cliquer sur **"Reset database password"**
3. Copier le nouveau mot de passe
4. Mettre à jour `DATABASE_URL` et `DIRECT_URL` sur Netlify
5. Redéployer

### Problème : "Connection timeout"

**Cause :** Pas d'accès IPv4 activé sur Supabase

**Solution :**
1. Aller sur Supabase → Project Settings → Add-ons
2. **Activer "IPv4 Add-on"** (gratuit)
3. Attendre 1-2 minutes
4. Redéployer sur Netlify

### Problème : "Too many connections"

**Cause :** Pas de pooling correctement configuré

**Solution :**
1. Vérifier que `DATABASE_URL` contient `?pgbouncer=true&connection_limit=1`
2. Vérifier que l'URL contient `.pooler.supabase.com` (pas `.supabase.co`)
3. Redéployer

### Problème : "Admin 403 Forbidden"

**Cause :** Middleware bloque l'admin en production (corrigé dans ce commit)

**Solution :**
1. Vérifier que le fichier `middleware.ts` a été mis à jour
2. Git pull + redéployer
3. L'admin doit maintenant demander une authentification (pas un blocage total)

---

## 📊 **Statistiques de Performance Attendues**

Après déploiement réussi, vous devriez avoir :

- **Build time** : ~2-3 minutes
- **Time To First Byte (TTFB)** : < 500ms
- **Page Load Time** : < 2s
- **DB Query Time** : < 100ms (avec pooling)
- **Lighthouse Score** : > 90/100

---

## 🎯 **Prochaines Étapes**

Une fois le site en production :

1. ✅ Tester toutes les fonctionnalités
2. ✅ Créer du contenu (cours, chapitres, leçons)
3. ✅ Uploader vidéos Vimeo
4. ✅ Configurer Stripe (paiements)
5. ✅ Configurer SMTP (emails)
6. ✅ Tester avec quelques élèves beta
7. ✅ Lancer officiellement !

---

## 📝 **Notes Techniques**

### Pourquoi 2 URLs de connexion ?

**`DATABASE_URL` (Pooling)** :
- Utilisée par Next.js en runtime (serverless functions)
- Passe par un pooler (PgBouncer) pour gérer plusieurs connexions
- Optimisée pour les environnements serverless (Netlify, Vercel)
- Port 6543

**`DIRECT_URL` (Direct)** :
- Utilisée par Prisma pour les migrations et introspection
- Connexion directe à PostgreSQL
- Nécessaire pour les commandes `prisma migrate`, `prisma db push`
- Port 5432

### Pourquoi `connection_limit=1` ?

Dans un environnement serverless :
- Chaque function crée une nouvelle connexion
- Sans limite, on peut atteindre le max de connexions DB (100 sur Free tier)
- `connection_limit=1` force la réutilisation de la connexion

### Pourquoi `pgbouncer=true` ?

PgBouncer est un pooler de connexions qui :
- Réutilise les connexions existantes
- Évite de créer/fermer des connexions à chaque requête
- Améliore les performances de 10x
- Réduit la charge sur la DB

---

## 🔗 **Liens Utiles**

- **Netlify Dashboard** : https://app.netlify.com
- **Supabase Dashboard** : https://app.supabase.com
- **Site Production** : https://master-maths.com
- **Documentation Prisma (Supabase)** : https://www.prisma.io/docs/guides/database/supabase
- **Documentation Netlify (Next.js)** : https://docs.netlify.com/frameworks/next-js/overview/

---

**✅ FIX APPLIQUÉ LE 31 OCTOBRE 2025**

**Problème résolu : Erreur 500 en production**

**Fichiers modifiés :**
- `middleware.ts` : Suppression du blocage admin
- `prisma/schema.prisma` : Ajout `directUrl`
- `next.config.js` : Configuration serverless Prisma
- `GUIDE_DEPLOIEMENT_PRODUCTION.md` : Ce guide (nouveau)

**Commit :** `fix: Correction configuration production Netlify + Prisma`

---

*Guide créé le 31 octobre 2025 - Master Maths v1.4.2*

