# 🏆 Système de Badges - Mise à Jour Complète

## ✅ **Ce qui a été fait**

### **1. Migration de la Base de Données**
**Fichier créé** : `MIGRATION_BADGES_EXERCICES.sql`

Cette migration permet de :
- ✅ Ajouter `exerciseId` dans la table `Performance`
- ✅ Rendre `lessonId` optionnel (nullable)
- ✅ Ajouter une contrainte CHECK pour s'assurer qu'on a **soit** `lessonId` **soit** `exerciseId`
- ✅ Créer des index conditionnels uniques pour éviter les doublons
- ✅ Support du type `EXERCISE` dans les badges de maîtrise

**Commandes à exécuter** :
```bash
# 1. Exécuter la migration SQL dans Supabase SQL Editor
# Copiez-collez le contenu de MIGRATION_BADGES_EXERCICES.sql

# 2. Synchroniser Prisma avec la base de données
npx prisma db pull

# 3. Régénérer le client Prisma
npx prisma generate
```

---

### **2. Schéma Prisma Mis à Jour**
**Fichier modifié** : `prisma/schema.prisma`

#### **Model Performance**
```prisma
model Performance {
  id                   String    @id @default(cuid())
  userId               String
  lessonId             String?    // Optionnel maintenant
  exerciseId           String?    // Nouveau champ
  videoProgressPercent Float     @default(0)
  quizScorePercent     Float?
  isCompleted          Boolean   @default(false)
  hasViewedCorrection  Boolean   @default(false)
  lastAccessedAt       DateTime  @default(now())
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  lesson               Lesson?   @relation(...)
  exercise             Exercise? @relation(...) // Nouveau
  user                 User      @relation(...)

  @@index([exerciseId])
  @@map("performances")
}
```

#### **Model Exercise**
Ajout de la relation `performances` :
```prisma
model Exercise {
  // ... autres champs ...
  performances          Performance[]
}
```

---

### **3. Service de Badges Adapté**
**Fichier modifié** : `lib/mastery-badge-service.ts`

#### **Nouvelle fonction** : `awardExerciseBadge`
Attribue un badge de maîtrise (Bronze/Silver/Gold) pour un exercice selon le score QCM :
- **100% → Gold (60 PMU)**
- **90-99% → Silver (40 PMU)**
- **80-89% → Bronze (20 PMU)**

```typescript
static async awardExerciseBadge(
  userId: string,
  exerciseId: string,
  score: number
): Promise<MasteryBadge | null>
```

#### **Interface MasteryBadge mise à jour**
```typescript
export interface MasteryBadge {
  type: 'LESSON' | 'EXERCISE' | 'CHAPTER' | 'COURSE' // EXERCISE ajouté
  level: MasteryLevel | 'COMPLETED' | 'MASTERED' | 'GRADUATE' | 'EXCELLENCE'
  entityId: string
  entityName: string
  score?: number
  earnedAt: Date
}
```

---

### **4. API pour Compléter un Exercice**
**Fichier créé** : `app/api/exercises/[exerciseId]/complete/route.ts`

Cette API :
- ✅ Enregistre la performance de l'utilisateur pour l'exercice
- ✅ Attribue automatiquement un badge si score ≥ 80%
- ✅ Ajoute les PMU à l'utilisateur

**Endpoint** : `POST /api/exercises/[exerciseId]/complete`

**Body** :
```json
{
  "score": 95
}
```

**Réponse** :
```json
{
  "success": true,
  "performance": { ... },
  "masteryBadge": {
    "type": "EXERCISE",
    "level": "SILVER",
    "entityName": "Exercice 1 : Équations du second degré",
    "score": 95,
    "earnedAt": "2025-01-24T..."
  }
}
```

---

### **5. API pour Récupérer les QCM d'Exercices**
**Fichier créé** : `app/api/exercises/[exerciseId]/qcm/route.ts`

Cette API récupère toutes les questions QCM associées à un exercice.

**Endpoint** : `GET /api/exercises/[exerciseId]/qcm`

**Réponse** :
```json
{
  "questions": [
    {
      "id": "...",
      "question": "Quelle est la solution de x² - 4 = 0 ?",
      "options": ["x = 2", "x = ±2", "x = 4", "x = ±4"],
      "correctAnswer": 1,
      "isMultipleChoice": false,
      "explanation": "...",
      "order": 1
    }
  ]
}
```

---

### **6. Composant QCM Adapté**
**Fichier modifié** : `components/QcmComponent.tsx`

Le composant QCM supporte maintenant **deux modes** :
- **Mode Leçon** : `<QcmComponent lessonId="..." />`
- **Mode Exercice** : `<QcmComponent exerciseId="..." />`

#### **Props mises à jour** :
```typescript
interface QcmComponentProps {
  lessonId?: string    // Optionnel
  exerciseId?: string  // Optionnel
  onComplete?: (score: number) => void
}
```

#### **Comportement** :
- Appelle automatiquement la bonne API (`/api/lessons/[id]/qcm` ou `/api/exercises/[id]/qcm`)
- Soumet le score à la bonne API (`/api/lessons/[id]/complete` ou `/api/exercises/[id]/complete`)
- Affiche le badge gagné (si applicable) via `BadgePopup`

---

## 🎯 **Comment Utiliser**

### **1. Dans LessonViewer (pour exercices)**
```tsx
import QcmComponent from '@/components/QcmComponent'

// Pour un QCM de leçon
<QcmComponent 
  lessonId={lesson.id} 
  onComplete={(score) => setQcmCompleted(true)} 
/>

// Pour un QCM d'exercice
<QcmComponent 
  exerciseId={exercise.id} 
  onComplete={(score) => handleExerciseComplete(score)} 
/>
```

### **2. Dans l'Admin**
Les routes de gestion QCM sont déjà créées :
- `/admin/qcm/[lessonId]` → Gérer QCM de leçon
- `/admin/qcm-exercise/[exerciseId]` → Gérer QCM d'exercice

---

## 📊 **Récapitulatif des Types de Badges**

| Type | Quand décerné | PMU Gagnés |
|------|---------------|------------|
| **LESSON (Bronze)** | Score QCM leçon ≥ 80% | 20 PMU |
| **LESSON (Silver)** | Score QCM leçon ≥ 90% | 40 PMU |
| **LESSON (Gold)** | Score QCM leçon = 100% | 60 PMU |
| **EXERCISE (Bronze)** | Score QCM exercice ≥ 80% | 20 PMU |
| **EXERCISE (Silver)** | Score QCM exercice ≥ 90% | 40 PMU |
| **EXERCISE (Gold)** | Score QCM exercice = 100% | 60 PMU |
| **CHAPTER (Completed)** | Toutes leçons complétées | 100 PMU |
| **CHAPTER (Mastered)** | Toutes leçons à 100% | 200 PMU |
| **COURSE (Graduate)** | Tous chapitres complétés | 500 PMU |
| **COURSE (Excellence)** | Tous chapitres maîtrisés | 1000 PMU |

---

## 🚀 **Prochaines Étapes**

1. **Exécuter la migration SQL** dans Supabase
2. **Synchroniser Prisma** avec `npx prisma db pull && npx prisma generate`
3. **Tester localement** :
   - Créer un cours → chapitre → sous-chapitre → leçon
   - Créer un exercice pour cette leçon
   - Ajouter un QCM à l'exercice
   - Tester la soumission et vérifier le badge
4. **Déployer sur Netlify**

---

## ⚠️ **Notes Importantes**

### **Contrainte CHECK en SQL**
La base de données empêche maintenant de créer une performance sans `lessonId` **ET** sans `exerciseId`. Il **faut** l'un ou l'autre.

### **Index Conditionnels**
Les index uniques `performances_userId_lessonId_unique` et `performances_userId_exerciseId_unique` sont **conditionnels** (avec `WHERE`). Prisma ne les représente pas dans le schéma, mais ils existent bien en base de données et empêchent les doublons.

### **Upsert Custom**
À cause des index conditionnels, on ne peut pas utiliser `upsert` avec une contrainte composite classique. Les API utilisent donc un pattern `findFirst → update OR create`.

---

## 🎉 **Résultat Final**

Votre plateforme supporte maintenant **deux niveaux de badges de maîtrise** :
- 🏅 **Badges de Leçon** (vidéo de cours + QCM leçon)
- 🏅 **Badges d'Exercice** (énoncé + correction + QCM exercice)

Les badges sont automatiquement décernés, les PMU sont ajoutés, et un popup s'affiche pour féliciter l'élève ! 🎊

