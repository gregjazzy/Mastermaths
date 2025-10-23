# 🚀 Configuration Supabase - Guide Pas à Pas (10 minutes)

## ⚠️ IMPORTANT

**Supabase est LA SEULE étape nécessaire pour lancer Master Maths.**

Sans Supabase configuré, l'application ne peut pas fonctionner car elle n'a pas de base de données.

---

## 📋 CE DONT VOUS AVEZ BESOIN

- [ ] Un compte email (Gmail, etc.)
- [ ] 10 minutes de temps
- [ ] Une connexion internet
- [ ] **Aucune carte bancaire** (plan gratuit suffisant)

---

## ÉTAPE 1 : Créer un Compte Supabase (2 minutes)

### 1.1 Aller sur Supabase

🔗 **Ouvrir dans votre navigateur** : https://supabase.com

### 1.2 S'inscrire

1. Cliquer sur **"Start your project"** (bouton en haut à droite)

2. **Choisir une méthode de connexion** :
   - **Option A : GitHub** (Recommandé ⭐) → 1 clic, plus rapide
   - **Option B : Email** → Remplir email + mot de passe

3. **Confirmer l'email** si vous utilisez la méthode Email

✅ **Vous êtes maintenant sur le dashboard Supabase !**

---

## ÉTAPE 2 : Créer un Projet (3 minutes)

### 2.1 Cliquer sur "New Project"

Le bouton vert **"New Project"** (ou "+ New project")

### 2.2 Remplir le Formulaire

```
┌────────────────────────────────────────┐
│ Create a new project                   │
├────────────────────────────────────────┤
│                                        │
│ Name: mastermaths                      │  ← Ou ce que vous voulez
│                                        │
│ Database Password: ****************    │  ← CLIQUEZ SUR "Generate"
│                    [Generate]          │     puis SAUVEGARDEZ !
│                                        │
│ Region: Europe (Frankfurt)             │  ← Ou West EU (London)
│         ▼                              │     pour la France
│                                        │
│ Pricing Plan: Free ✓                   │  ← Laisser "Free"
│                                        │
└────────────────────────────────────────┘
```

### 2.3 ⚠️ SAUVEGARDER LE MOT DE PASSE (TRÈS IMPORTANT)

1. **Cliquer sur "Generate"** à côté de "Database Password"
2. **Un mot de passe est généré** (ex: `Xy9$mK2pLq4nR7wT`)
3. **⚠️ COPIER CE MOT DE PASSE** et le sauvegarder dans :
   - Un fichier texte sur votre ordinateur
   - Un gestionnaire de mots de passe (1Password, LastPass, etc.)
   - Un note sur votre téléphone
   
**VOUS EN AUREZ BESOIN PLUS TARD ! Ne fermez pas cette fenêtre tant que vous ne l'avez pas sauvegardé.**

### 2.4 Créer le Projet

1. Cliquer sur **"Create new project"** (en bas)
2. ⏳ **Attendre 2 minutes** (barre de progression visible)
3. ☕ Le projet se crée automatiquement

✅ **Projet créé !** Vous êtes maintenant sur le dashboard du projet.

---

## ÉTAPE 3 : Récupérer l'URL de Connexion (2 minutes)

### 3.1 Aller dans les Settings

1. **Dans le menu de gauche**, tout en bas, cliquer sur l'icône **⚙️ Settings**
2. **Dans le sous-menu Settings**, cliquer sur **"Database"**

### 3.2 Trouver la Connection String

1. **Scroller vers le bas** jusqu'à voir "Connection string"
2. **Vous verrez plusieurs onglets** : URI, Pooling, Direct, etc.
3. **⚠️ IMPORTANT : Sélectionner l'onglet "URI"** (le premier)

### 3.3 Copier l'URL

Vous verrez une URL qui ressemble à :

```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

**⚠️ IMPORTANT** : Cette URL contient `[YOUR-PASSWORD]` qui est un placeholder.

### 3.4 Remplacer le Mot de Passe

1. **Copier toute l'URL** dans un éditeur de texte (Notepad, TextEdit, etc.)

2. **Remplacer `[YOUR-PASSWORD]`** par le mot de passe que vous avez sauvegardé à l'étape 2.3

**Exemple** :

```
❌ AVANT (ne fonctionnera pas) :
postgresql://postgres.abc123xyz:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres

✅ APRÈS (avec votre vrai mot de passe) :
postgresql://postgres.abc123xyz:Xy9$mK2pLq4nR7wT@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

3. **Garder cette URL complète** pour l'étape suivante

---

## ÉTAPE 4 : Créer le Fichier .env (2 minutes)

### 4.1 Ouvrir le Projet Master Maths

1. Ouvrir votre **éditeur de code** (VS Code, Cursor, etc.)
2. Ouvrir le dossier **MasterMaths** (le projet)

### 4.2 Créer le Fichier .env

**À la racine du projet** (même niveau que `package.json`), créer un fichier nommé `.env`

#### Sur VS Code / Cursor :
1. Clic droit sur le dossier racine
2. "New File"
3. Nommer : `.env` (avec le point devant)

#### Sur Mac/Linux (Terminal) :
```bash
cd /Users/gregorymittelette/Documents/MasterMaths
touch .env
```

#### Sur Windows (PowerShell) :
```powershell
cd C:\Users\VotreNom\Documents\MasterMaths
New-Item .env -ItemType File
```

### 4.3 Remplir le Fichier .env

**Copier-coller ce contenu** dans le fichier `.env` :

```env
# ========================================
# CONFIGURATION MASTER MATHS
# ========================================

# --- BASE DE DONNÉES (Supabase) ---
DATABASE_URL="COLLEZ_ICI_VOTRE_URL_SUPABASE_DE_L_ETAPE_3"

# --- NEXTAUTH (Authentification) ---
NEXTAUTH_SECRET="GENERER_UN_SECRET_ICI"
NEXTAUTH_URL="http://localhost:3002"

# --- SUPABASE (Optionnel) ---
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""

# --- VIMEO (Optionnel - pour plus tard) ---
NEXT_PUBLIC_VIMEO_ACCESS_TOKEN=""

# --- STRIPE (Optionnel - pour plus tard) ---
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""

# --- EMAIL (Optionnel - voir GUIDE_EMAILS.md) ---
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASSWORD=""
SMTP_FROM=""
CRON_SECRET_TOKEN=""
```

### 4.4 Remplacer DATABASE_URL

1. **Supprimer** : `COLLEZ_ICI_VOTRE_URL_SUPABASE_DE_L_ETAPE_3`
2. **Coller** votre URL complète de l'étape 3.4 (avec le vrai mot de passe)

**Exemple** :
```env
DATABASE_URL="postgresql://postgres.abc123xyz:Xy9$mK2pLq4nR7wT@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

### 4.5 Générer NEXTAUTH_SECRET

#### Sur Mac/Linux :
```bash
openssl rand -base64 32
```

#### Sur Windows (PowerShell) :
```powershell
$random = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
$random
```

#### Ou en ligne :
🔗 https://generate-secret.vercel.app/32

**Copier le résultat** et le coller dans `NEXTAUTH_SECRET`

### 4.6 Vérifier le Fichier .env

Votre fichier `.env` devrait ressembler à :

```env
DATABASE_URL="postgresql://postgres.abc123xyz:Xy9$mK2pLq4nR7wT@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
NEXTAUTH_SECRET="a3K9mP2xL7qR5nW8tY6uH4vG1bN0cM9dF8eS7rT6yU5i"
NEXTAUTH_URL="http://localhost:3002"
```

### 4.7 Sauvegarder

**Sauvegarder le fichier** (Cmd+S ou Ctrl+S)

---

## ÉTAPE 5 : Créer les Tables dans Supabase (2 minutes)

### 5.1 Ouvrir le Terminal

Dans votre éditeur de code ou terminal :

```bash
cd /Users/gregorymittelette/Documents/MasterMaths
```

### 5.2 Générer le Client Prisma

```bash
npx prisma generate
```

**Attendre** ~5-10 secondes. Vous verrez :
```
✔ Generated Prisma Client
```

### 5.3 Créer les Tables

```bash
npx prisma db push
```

**Attendre** ~15-30 secondes. Vous verrez :
```
🚀 Your database is now in sync with your Prisma schema.
```

✅ **Les tables sont créées dans Supabase !**

### 5.4 (Optionnel) Ajouter les Badges

#### Si vous avez `psql` installé :
```bash
psql "votre-url-supabase-complete" -f prisma/seed-badges.sql
```

#### Sinon, via l'Interface Supabase :
1. **Retourner sur Supabase** (dans votre navigateur)
2. **Cliquer sur "SQL Editor"** (menu de gauche)
3. **Cliquer sur "New query"**
4. **Ouvrir le fichier** `prisma/seed-badges.sql` dans votre éditeur
5. **Copier tout le contenu** du fichier
6. **Coller dans SQL Editor** de Supabase
7. **Cliquer sur "Run"** (ou Ctrl+Enter)

✅ **11 badges créés !**

---

## ÉTAPE 6 : Vérifier que Tout Fonctionne (1 minute)

### 6.1 Vérifier les Tables dans Supabase

1. **Retourner sur Supabase**
2. **Cliquer sur "Table Editor"** (menu de gauche)
3. **Vérifier que vous voyez ces tables** :
   - ✅ User
   - ✅ Course
   - ✅ Chapter
   - ✅ SubChapter
   - ✅ Lesson
   - ✅ Performance
   - ✅ QcmQuestion
   - ✅ Badge
   - ✅ ConnectionLog
   - ✅ Account
   - ✅ Session
   - ✅ VerificationToken

**Si vous voyez toutes ces tables → C'EST BON !** 🎉

### 6.2 Lancer l'Application

```bash
npm run dev
```

**Attendre** ~5 secondes. Vous verrez :
```
  ▲ Next.js 14.0.4
  - Local:        http://localhost:3002
```

### 6.3 Tester l'Inscription

1. **Ouvrir** : http://localhost:3002
2. **Cliquer sur "S'inscrire"**
3. **Remplir le formulaire** :
   - Nom : Votre nom
   - Email : Votre email
   - Mot de passe : Au moins 8 caractères
4. **Cliquer sur "S'inscrire"**

**Si vous êtes redirigé vers le dashboard → SUCCÈS !** ✅🎉

### 6.4 Accéder à l'Admin

1. **Aller sur** : http://localhost:3002/admin
2. **Vous voyez le dashboard admin** avec :
   - Statistiques (0 cours, 1 étudiant, etc.)
   - Boutons pour gérer les cours, chapitres, leçons

**FÉLICITATIONS ! Supabase est configuré et l'application fonctionne !** 🚀

---

## ❌ DÉPANNAGE - Si Ça Ne Marche Pas

### Erreur : "Invalid `prisma.user.findUnique()` invocation"

**Cause** : La connexion à Supabase ne fonctionne pas.

**Solutions** :

1. **Vérifier le fichier `.env`** :
   - Existe-t-il à la racine du projet ?
   - Contient-il `DATABASE_URL` ?
   - L'URL est-elle complète (avec le vrai mot de passe) ?

2. **Vérifier l'URL** :
   - Pas d'espaces avant/après
   - Le mot de passe est bien celui généré par Supabase
   - L'URL commence bien par `postgresql://`

3. **Vérifier Supabase** :
   - Le projet est bien actif (pas en pause)
   - Aller dans Supabase > Project Settings
   - Si "Paused", cliquer sur "Resume"

4. **Relancer** :
   ```bash
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

---

### Erreur : "Can't reach database server"

**Cause** : L'URL est incorrecte ou le serveur Supabase est inaccessible.

**Solutions** :

1. **Re-copier l'URL depuis Supabase** :
   - Settings > Database > Connection string > URI
   - Bien remplacer `[YOUR-PASSWORD]`

2. **Tester la connexion** :
   ```bash
   ping aws-0-eu-central-1.pooler.supabase.com
   ```
   Si ça ne répond pas → Problème de connexion internet ou firewall

3. **Vérifier le firewall** :
   - Désactiver temporairement votre firewall/antivirus
   - Essayer avec/sans VPN

---

### Erreur : "Environment variable not found: DATABASE_URL"

**Cause** : Le fichier `.env` n'est pas au bon endroit ou n'est pas lu.

**Solutions** :

1. **Vérifier l'emplacement** :
   ```
   MasterMaths/
   ├── .env          ← Doit être ICI (à la racine)
   ├── package.json
   ├── app/
   └── ...
   ```

2. **Vérifier le nom** :
   - Doit s'appeler exactement `.env` (avec le point)
   - Pas `.env.txt` ou `env` ou `.env.local`

3. **Redémarrer le serveur** :
   - Arrêter avec Ctrl+C
   - Relancer : `npm run dev`

---

### Les tables ne se créent pas

**Cause** : Problème avec Prisma.

**Solutions** :

1. **Reset Prisma** :
   ```bash
   rm -rf node_modules/.prisma
   npx prisma generate
   npx prisma db push
   ```

2. **Vérifier les logs** :
   - Lire attentivement les messages d'erreur
   - Ils indiquent souvent le problème exact

3. **Vérifier le schéma Prisma** :
   - Le fichier `prisma/schema.prisma` existe
   - Il contient bien tous les modèles

---

### Mon mot de passe contient des caractères spéciaux (@, #, $, etc.)

**Problème** : Ces caractères peuvent causer des problèmes dans l'URL.

**Solution** : Encoder les caractères spéciaux

| Caractère | À remplacer par |
|-----------|----------------|
| @ | %40 |
| # | %23 |
| $ | %24 |
| % | %25 |
| & | %26 |
| : | %3A |

**Exemple** :
```
Mot de passe : My@Pass#2024
Dans l'URL : My%40Pass%232024
```

**Ou** : Générer un nouveau mot de passe sans caractères spéciaux dans Supabase.

---

## ✅ CHECKLIST COMPLÈTE

Cochez au fur et à mesure :

- [ ] Compte Supabase créé
- [ ] Projet Supabase créé
- [ ] Mot de passe sauvegardé (⚠️ Important !)
- [ ] URL de connexion copiée
- [ ] Mot de passe remplacé dans l'URL
- [ ] Fichier `.env` créé à la racine
- [ ] `DATABASE_URL` configurée
- [ ] `NEXTAUTH_SECRET` généré
- [ ] `npx prisma generate` ✅
- [ ] `npx prisma db push` ✅
- [ ] Tables visibles dans Supabase Table Editor
- [ ] Badges seedés (optionnel)
- [ ] Serveur lancé avec `npm run dev`
- [ ] Inscription testée avec succès
- [ ] Dashboard accessible
- [ ] Admin accessible (/admin)

**Si tous les checks sont ✅ → VOUS AVEZ RÉUSSI !** 🎉🚀

---

## 🎯 PROCHAINES ÉTAPES

Maintenant que Supabase est configuré, vous pouvez :

1. **Créer votre premier cours** :
   - Aller sur http://localhost:3002/admin/courses
   - Cliquer sur "Créer un cours"

2. **Ajouter des chapitres** :
   - http://localhost:3002/admin/chapters

3. **Créer des leçons** :
   - http://localhost:3002/admin/lessons

4. **(Optionnel) Configurer les emails** :
   - Voir `GUIDE_EMAILS.md`

5. **(Optionnel) Ajouter des vidéos Vimeo** :
   - Récupérer votre token Vimeo
   - L'ajouter dans `.env`

---

## 💡 ASTUCES

### Voir les Données dans Supabase

**Table Editor** : Interface graphique pour voir/modifier les données
- Pratique pour vérifier les utilisateurs créés
- Voir les cours, leçons, badges

### Prisma Studio (Alternative Locale)

```bash
npx prisma studio
```

Ouvre une interface graphique sur http://localhost:5555
- Même fonctionnalité que Table Editor mais en local
- Pratique pour le développement

### Sauvegarder Votre Configuration

**Créez un fichier `CONFIG.txt`** avec :
```
Supabase Project: mastermaths
Database Password: [votre-mot-de-passe]
DATABASE_URL: [votre-url-complete]
NEXTAUTH_SECRET: [votre-secret]
```

**Sauvegardez-le dans un endroit sûr** (pas dans Git !)

---

## 🆘 BESOIN D'AIDE ?

### Consulter la Documentation

- `HANDOVER.md` → Vue d'ensemble complète
- `SETUP_SUPABASE.md` → Ce fichier (guide détaillé)
- `PROJET_FINAL_COMPLET.md` → Récapitulatif du projet
- `README.md` → Introduction générale

### Problème Persistant ?

1. **Vérifier les logs** dans le terminal
2. **Lire attentivement les messages d'erreur**
3. **Consulter la section Dépannage** ci-dessus
4. **Vérifier que toutes les étapes ont été suivies**

---

**🎉 Félicitations ! Vous avez configuré Supabase avec succès !**

**Master Maths est maintenant opérationnel et prêt à recevoir vos cours !** 🚀📚

---

*Guide créé le 23 octobre 2025 - Master Maths v1.0*


