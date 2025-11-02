# 🎨 Guide d'Intégration des Badges Pokémon

## 📋 **Checklist d'implémentation**

### **Étape 1 : Migration Base de Données** ✅
**Fichier** : `MIGRATION_BADGES_CSS.sql`

**Action** :
1. Ouvrir Supabase Dashboard → SQL Editor
2. Copier-coller le contenu de `MIGRATION_BADGES_CSS.sql`
3. Exécuter la migration
4. Vérifier que les colonnes `customCSS` et `useCustomCSS` sont ajoutées

**Commandes ensuite** :
```bash
cd /Users/gregorymittelette/Documents/MasterMaths
npx prisma db pull
npx prisma generate
```

---

### **Étape 2 : Créer le générateur CSS** ✅ DÉJÀ FAIT
**Fichier** : `lib/badge-css-generator.ts`

✅ Ce fichier existe déjà et contient :
```typescript
export function generateAllBadgesCSS(badges: Badge[]): string
```

---

### **Étape 3 : Créer le composant d'affichage de badge**
**Fichier à créer** : `components/BadgeCard.tsx`

**Ce composant doit** :
- Afficher un badge avec son animation
- Utiliser `customCSS` si `useCustomCSS = true`
- Sinon, utiliser le style par défaut (icône + texte)
- Gérer le hover, le clic, etc.

---

### **Étape 4 : Injecter le CSS global**
**Fichier à modifier** : `app/layout.tsx`

**Ajouter** :
```tsx
import { generateAllBadgesCSS } from '@/lib/badge-css-generator'
import { prisma } from '@/lib/prisma'

// Dans le composant RootLayout
const badges = await prisma.badge.findMany({
  where: { useCustomCSS: true }
})

const badgesCSS = generateAllBadgesCSS(badges)

// Ajouter dans le <head>
<style dangerouslySetInnerHTML={{ __html: badgesCSS }} />
```

---

### **Étape 5 : Créer les 5 badges dans l'admin**
**Interface** : `/admin/badges`

**Pour chaque badge** (APPRENTI, CONFIRMÉ, EXPERT, MAÎTRE, VIRTUOSE) :
1. Nom : "Second Degré - APPRENTI"
2. Description : "Première leçon du chapitre Second Degré terminée"
3. Icon : "🎴" ou URL de l'image
4. Rarity : Progressif (COMMON → LEGENDARY)
5. Mastery Points : Progressif (20 → 100)
6. **useCustomCSS** : ✅ true
7. **customCSS** : Copier le CSS depuis `badge-test.html`, `badge-test-niveau2.html`, etc.
8. **Criteria** (JSON) :
```json
{
  "chapterId": "ID_DU_CHAPITRE_SECOND_DEGRE",
  "lessonsCompleted": 1
}
```

---

### **Étape 6 : Modifier le service de badges**
**Fichier à modifier** : `lib/badge-service.ts`

**Ajouter la logique pour badges de chapitre** :
```typescript
// Vérifier si l'utilisateur a terminé X leçons d'un chapitre
if (criteria.chapterId && criteria.lessonsCompleted) {
  const completedLessonsInChapter = await prisma.performance.count({
    where: {
      userId,
      isCompleted: true,
      lesson: {
        subChapter: {
          chapterId: criteria.chapterId
        }
      }
    }
  })
  
  if (completedLessonsInChapter < criteria.lessonsCompleted) {
    return false
  }
}
```

---

### **Étape 7 : Afficher les badges dans le profil**
**Fichier à créer/modifier** : `app/profile/page.tsx` ou `components/UserBadges.tsx`

**Afficher** :
```tsx
import BadgeCard from '@/components/BadgeCard'

const userBadges = await BadgeService.getUserBadges(userId)

return (
  <div className="grid grid-cols-3 gap-4">
    {userBadges.map(badge => (
      <BadgeCard key={badge.id} badge={badge} />
    ))}
  </div>
)
```

---

## 📊 **Performance & Optimisations**

### **Poids des badges** :
- **1 badge HTML** : ~15 KB (avec CSS inclus)
- **5 badges** : ~75 KB
- **100 badges** : ~1.5 MB

### **Solution CSS Consolidé** :
Au lieu d'avoir 100 x 15 KB = 1.5 MB, on génère **UN SEUL fichier CSS** :
- **Extraction du CSS** : Tous les `@keyframes`, `.badge`, etc. sont mutualisés
- **Poids final** : ~200 KB pour 100 badges (au lieu de 1.5 MB)
- **Chargement** : Une seule fois au chargement de l'app (mise en cache)

### **Optimisation supplémentaire (optionnelle)** :
```typescript
// Générer le CSS au build time (Next.js)
// app/badges-styles.css (statique)
export async function generateStaticCSS() {
  const badges = await prisma.badge.findMany({
    where: { useCustomCSS: true }
  })
  
  const css = generateAllBadgesCSS(badges)
  fs.writeFileSync('public/badges-styles.css', css)
}
```

Puis dans `app/layout.tsx` :
```tsx
<link rel="stylesheet" href="/badges-styles.css" />
```

---

## 🎯 **Résumé : Ce que VOUS devez faire**

### **Actions requises** :
1. ✅ **Exécuter la migration SQL** : `MIGRATION_BADGES_CSS.sql`
2. ❌ **Créer `components/BadgeCard.tsx`** (composant d'affichage)
3. ❌ **Modifier `app/layout.tsx`** (injecter le CSS global)
4. ❌ **Créer les 5 badges dans l'admin** `/admin/badges`
5. ❌ **Modifier `lib/badge-service.ts`** (ajouter critères chapitre)
6. ❌ **Créer la page profil** avec affichage badges

### **Estimation** :
- ⏱️ **Temps** : 2-3 heures
- 🔧 **Difficulté** : Moyenne
- 📦 **Impact performance** : Minimal (200 KB CSS global)

---

## ❓ **Questions ?**

Voulez-vous que je :
1. **Crée tous ces fichiers maintenant** ?
2. **Commence par le composant BadgeCard** ?
3. **Fasse toute l'intégration d'un coup** ?

Dites-moi et je m'en occupe ! 🚀

