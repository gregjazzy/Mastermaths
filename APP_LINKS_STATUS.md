## ✅ **Fonctionnalité : Liens vers Apps Externes**

### 📋 **Ce qui a été fait :**

1. **Migration SQL créée** : `MIGRATION_APP_LINKS.sql`
2. **Schéma Prisma mis à jour**
3. **Formulaire Sous-chapitres modifié**

---

### 🚀 **Étapes d'installation :**

#### **1. Exécuter la migration SQL**
Allez dans **Supabase SQL Editor** et exécutez :

```sql
-- Ajouter les champs pour les liens d'applications
ALTER TABLE subchapters 
ADD COLUMN IF NOT EXISTS "appUrl" TEXT,
ADD COLUMN IF NOT EXISTS "appTitle" TEXT,
ADD COLUMN IF NOT EXISTS "appDescription" TEXT;

ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS "appTitle" TEXT,
ADD COLUMN IF NOT EXISTS "appDescription" TEXT;
```

#### **2. Synchroniser Prisma**
Dans le terminal :

```bash
cd /Users/gregorymittelette/Documents/MasterMaths
npx prisma db pull
npx prisma generate
```

#### **3. Build et Push**
```bash
npm run build
git add -A
git commit -m "✨ Ajout liens vers apps externes (sous-chapitres + leçons)"
git push origin main
```

---

### 📱 **Comment l'utiliser :**

1. Allez dans **Admin → Sous-chapitres**
2. Créez ou éditez un sous-chapitre
3. Remplissez la section **"🔗 Lien vers une application externe"** :
   - **URL** : `https://www.geogebra.org/calculator`
   - **Titre** : `GeoGebra Calculator`
   - **Description** : `Outil interactif pour visualiser les fonctions`

---

### 📝 **TODO Next :**
- [ ] Mettre à jour les APIs (POST/PUT) pour accepter les nouveaux champs
- [ ] Afficher les liens dans l'interface élève
- [ ] Ajouter la même fonctionnalité pour les Leçons
- [ ] Styling du bouton vers l'app externe

---

**Voulez-vous que je continue avec les APIs et l'affichage côté élève ?** 🚀

