# 🚀 Guide de Déploiement Netlify - Master Maths

## 📋 **PROBLÈME : Netlify ne lance pas de build automatiquement**

### 🔍 **Causes possibles**

1. **Auto-deploy désactivé** dans les paramètres Netlify
2. **Branch incorrecte** configurée
3. **Webhooks GitHub** non configurés
4. **Build hook** manquant
5. **Plugin Next.js** non installé

---

## ✅ **SOLUTIONS ÉTAPE PAR ÉTAPE**

### **1️⃣ Vérifier l'Auto-Deploy sur Netlify**

1. Allez sur **[app.netlify.com](https://app.netlify.com)**
2. Sélectionnez votre site **Master Maths**
3. Allez dans **Site settings** → **Build & deploy**
4. Section **Continuous deployment**

**Vérifiez :**
```
Branch to deploy: main ✅
Auto publishing: Enabled ✅
```

Si **Auto publishing** est désactivé :
- Cliquez sur **Edit settings**
- Cochez **Auto publishing**
- Sauvegardez

---

### **2️⃣ Vérifier le Repository GitHub**

Dans **Site settings** → **Build & deploy** → **Link to repository** :

```
Repository: gregjazzy/Mastermaths ✅
Branch: main ✅
```

Si incorrect :
- Cliquez sur **Link to a different repository**
- Reconnectez GitHub
- Sélectionnez le bon repo

---

### **3️⃣ Vérifier les Webhooks GitHub**

GitHub doit notifier Netlify à chaque push :

1. Allez sur **GitHub.com** → Votre repo **Mastermaths**
2. **Settings** → **Webhooks**
3. Vérifiez qu'il y a un webhook vers Netlify :

```
Payload URL: https://api.netlify.com/hooks/github
Content type: application/json
Events: Just the push event
Active: ✅
```

**Si le webhook est manquant ou inactif :**
1. Sur Netlify : **Site settings** → **Build & deploy**
2. Cliquez sur **Edit settings**
3. **Unlink repository** puis **Link repository** à nouveau
4. Cela recréera le webhook

---

### **4️⃣ Déclencher manuellement un build**

Si l'auto-deploy ne fonctionne pas, lancez un build manuel :

**Option A : Via l'interface Netlify**
1. Allez sur votre site Netlify
2. Cliquez sur **Deploys**
3. Cliquez sur **Trigger deploy** → **Deploy site**

**Option B : Via un commit vide**
```bash
cd /Users/gregorymittelette/Documents/MasterMaths
git commit --allow-empty -m "🚀 Force Netlify rebuild"
git push origin main
```

---

### **5️⃣ Vérifier les variables d'environnement**

Dans **Site settings** → **Environment variables** :

**Variables OBLIGATOIRES :**
```
DATABASE_URL = postgresql://...  (Supabase)
NEXTAUTH_SECRET = [votre secret]
NEXTAUTH_URL = https://votre-site.netlify.app
STRIPE_SECRET_KEY = sk_...
STRIPE_PUBLISHABLE_KEY = pk_...
```

**Si une variable manque :**
1. Cliquez sur **Add a variable**
2. Remplissez `Key` et `Value`
3. Cliquez sur **Create variable**
4. **Redéployez** (Trigger deploy)

---

### **6️⃣ Vérifier le plugin Next.js**

Dans **Site settings** → **Plugins** :

Vérifiez que **@netlify/plugin-nextjs** est installé :
```
@netlify/plugin-nextjs ✅ Installed
```

**Si absent :**
1. Allez dans **Plugins**
2. Cherchez `Next.js Runtime`
3. Cliquez sur **Install**

---

### **7️⃣ Vérifier les logs de build**

Si un build a été lancé mais a échoué :

1. Allez sur **Deploys**
2. Cliquez sur le dernier deploy (rouge = échec)
3. Lisez les logs d'erreur

**Erreurs courantes :**

#### Erreur : `Missing environment variables`
```bash
Solution: Ajoutez les variables manquantes dans Environment variables
```

#### Erreur : `Build command failed`
```bash
Solution: Vérifiez que "npm run build" fonctionne en local
```

#### Erreur : `Cannot find module`
```bash
Solution: Ajoutez le module dans package.json
npm install <module> --save
git add package.json package-lock.json
git commit -m "Add missing module"
git push
```

#### Erreur : `Database connection failed`
```bash
Solution: Vérifiez DATABASE_URL dans Environment variables
```

---

## 🔧 **CONFIGURATION NETLIFY.TOML CORRECTE**

Votre fichier `netlify.toml` a été corrigé avec :

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"

# Force redeployment on every push
[build.processing]
  skip_processing = false
```

**Changements importants :**
- ✅ Suppression du redirect `/* → /index.html` (interférait avec Next.js)
- ✅ Ajout `skip_processing = false` (force le traitement)
- ✅ `X-Frame-Options: SAMEORIGIN` (permet iframe Vimeo)
- ✅ `Content-Security-Policy` avec `frame-src` pour Vimeo

---

## 🎯 **COMMANDES UTILES**

### Forcer un nouveau déploiement
```bash
# Commit vide pour trigger build
git commit --allow-empty -m "🚀 Force rebuild"
git push origin main

# Ou directement avec l'API Netlify
curl -X POST -d {} https://api.netlify.com/build_hooks/YOUR_BUILD_HOOK_ID
```

### Créer un Build Hook
1. **Netlify** → **Site settings** → **Build & deploy** → **Build hooks**
2. Cliquez sur **Add build hook**
3. Nommez-le : `Force Deploy`
4. Branch : `main`
5. Sauvegardez → Vous obtenez une URL

**Utilisation :**
```bash
curl -X POST -d {} https://api.netlify.com/build_hooks/[VOTRE_ID]
```

---

## 📊 **CHECKLIST DE VALIDATION**

### Configuration Netlify
- [ ] Site lié au bon repository GitHub
- [ ] Branch `main` configurée
- [ ] Auto publishing activé
- [ ] Webhook GitHub actif
- [ ] Variables d'environnement présentes
- [ ] Plugin Next.js installé

### Fichiers Projet
- [ ] `netlify.toml` correct (pas de redirect SPA)
- [ ] `package.json` avec script `build`
- [ ] `.env` local fonctionne
- [ ] `npm run build` réussit en local

### Test de Déploiement
- [ ] Push sur GitHub → Build Netlify lancé
- [ ] Build réussi (logs verts)
- [ ] Site accessible sur URL Netlify
- [ ] Pas d'erreur 500 ou 404
- [ ] Vidéos Vimeo fonctionnelles
- [ ] Mode sombre fonctionne

---

## 🚨 **SI ÇA NE FONCTIONNE TOUJOURS PAS**

### Solution nucléaire : Supprimer et recréer le site

1. **Netlify** → **Site settings** → **Danger zone**
2. Cliquez sur **Delete this site**
3. Confirmez en tapant le nom du site

4. **Créer un nouveau site :**
   - Netlify Dashboard → **Add new site** → **Import an existing project**
   - Sélectionnez **GitHub**
   - Choisissez **Mastermaths**
   - **Build settings :**
     ```
     Build command: npm run build
     Publish directory: .next
     ```
   - Cliquez sur **Deploy**

5. **Ajouter les variables d'environnement** (section 5️⃣)

6. **Installer le plugin Next.js** (section 6️⃣)

---

## 🎉 **VALIDATION RÉUSSIE**

Si tout fonctionne, vous devriez voir :

### Sur Netlify
```
✅ Production deploys: Published
✅ Last publish: [il y a quelques minutes]
✅ Status: Published
✅ URL: https://your-site.netlify.app
```

### Dans les logs
```
✅ Build script success
✅ Next.js plugin installed
✅ Site is live
```

### Sur le site live
```
✅ Site accessible
✅ Login fonctionne
✅ Vidéos jouent (mobile + desktop)
✅ Mode sombre disponible
✅ Dashboard charge
```

---

## 📞 **SUPPORT**

**Netlify Support :**
- Documentation : https://docs.netlify.com
- Forums : https://answers.netlify.com
- Support : support@netlify.com (si compte payant)

**Problèmes courants Next.js + Netlify :**
- https://docs.netlify.com/integrations/frameworks/next-js/

---

## ✅ **RÉSUMÉ RAPIDE**

1. **Vérifiez Auto-deploy** activé sur Netlify
2. **Vérifiez la branch** = `main`
3. **Vérifiez le webhook** GitHub
4. **Ajoutez les variables** d'environnement
5. **Déclenchez un build** manuel si besoin
6. **Attendez 3-5 min** pour le build
7. **Testez le site** live

**Dernier commit poussé :** `5c1fd8b`  
**Fichier corrigé :** `netlify.toml`  
**Build devrait démarrer automatiquement** 🚀

---

**Date :** 25 Octobre 2025  
**Status :** Configuration corrigée  
**Action :** Vérifier Netlify Dashboard

