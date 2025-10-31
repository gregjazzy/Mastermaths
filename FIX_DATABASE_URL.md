# 🔧 FIX URGENT : DATABASE_URL Incorrecte

## ❌ ERREUR ACTUELLE

```
PrismaClientInitializationError: 
Error querying the database: FATAL: Tenant or user not found
```

**Cause :** L'URL de connexion à Supabase est incorrecte ou le mot de passe est faux.

---

## ✅ SOLUTION EN 3 ÉTAPES

### **ÉTAPE 1 : Trouver la bonne URL sur Supabase**

1. Allez sur https://app.supabase.com
2. Connectez-vous et sélectionnez votre projet
3. Cliquez sur **Settings** (⚙️ icône en bas à gauche)
4. Cliquez sur **Database** dans le menu de gauche
5. Scrollez jusqu'à **"Connection string"**
6. **IMPORTANT** : Cliquez sur l'onglet **"Transaction"** (PAS "Session")
7. Vous verrez une URL qui ressemble à :

```
postgres://postgres.[REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

8. **Cliquez sur "Copy"** ou copiez manuellement
9. **Remplacez** `[YOUR-PASSWORD]` par votre vrai mot de passe Supabase

**⚠️ Si vous ne connaissez pas votre mot de passe :**
- Cliquez sur **"Reset database password"** sur la même page
- Copiez le nouveau mot de passe généré
- Utilisez-le dans l'URL

---

### **ÉTAPE 2 : Formater correctement l'URL**

Une fois que vous avez l'URL avec le bon mot de passe, **ajoutez ceci à la fin** :

```
?pgbouncer=true&connection_limit=1
```

**Exemple d'URL finale correcte :**

```
postgres://postgres.zqgjhtafyuivnmgyqcix:VotreMotDePasse123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**Points importants :**
- ✅ `postgres.` suivi de votre ref (avec un POINT)
- ✅ Le mot de passe correct (sans crochets)
- ✅ `pooler.supabase.com` (PAS juste `supabase.co`)
- ✅ Port `6543`
- ✅ `?pgbouncer=true&connection_limit=1` à la fin

---

### **ÉTAPE 3 : Mettre à jour sur Netlify**

1. Allez sur https://app.netlify.com
2. Sélectionnez votre site **master-maths**
3. Allez dans **Site settings** → **Environment variables**
4. Trouvez la variable **DATABASE_URL**
5. Cliquez sur **"Options"** (les 3 points) → **"Edit"**
6. **Remplacez** par la nouvelle URL complète
7. Cliquez sur **"Save"**

**Vérifiez aussi que DIRECT_URL existe :**
- Nom : `DIRECT_URL`
- Valeur : `postgresql://postgres:VotreMotDePasse@db.zqgjhtafyuivnmgyqcix.supabase.co:5432/postgres`

(Même mot de passe, mais port 5432 et `db.` au lieu de `pooler.`)

---

### **ÉTAPE 4 : Redéployer**

1. Sur Netlify, allez dans l'onglet **"Deploys"**
2. Cliquez sur **"Trigger deploy"**
3. Sélectionnez **"Clear cache and deploy site"**
4. Attendez 2-3 minutes

---

## 🔍 VÉRIFICATION

Après le déploiement, testez :
- https://master-maths.com (devrait charger)
- https://master-maths.com/auth/login (devrait fonctionner)

Si ça ne marche toujours pas, vérifiez dans les logs Netlify Functions que l'erreur a changé.

---

## 🆘 SI ÇA NE MARCHE TOUJOURS PAS

**Option A : Réinitialiser le mot de passe**
1. Sur Supabase → Settings → Database
2. Cliquez sur **"Reset database password"**
3. Copiez le nouveau mot de passe
4. Mettez-le dans **DATABASE_URL** et **DIRECT_URL** sur Netlify
5. Redéployez

**Option B : Utiliser la connexion directe temporairement**

Sur Netlify, changez temporairement **DATABASE_URL** pour utiliser la connexion directe :

```
postgresql://postgres:VotreMotDePasse@db.zqgjhtafyuivnmgyqcix.supabase.co:5432/postgres
```

(Sans pgbouncer, port 5432, `db.` au lieu de `pooler.`)

Cela ne sera pas optimal en production mais permettra de confirmer si c'est un problème de pooling ou de mot de passe.

---

**Date :** 31 Octobre 2025
**Status :** Fix en cours

