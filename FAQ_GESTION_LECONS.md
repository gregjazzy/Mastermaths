# ❓ FAQ : Gestion des Leçons, Exercices, QCM

## 🎯 Réponses à vos questions

---

## 1️⃣ **Prérequis : Optionnel ou obligatoire ?**

### ✅ **OUI, le prérequis est 100% OPTIONNEL !**

Quand vous créez une leçon dans `/admin/lessons`, vous avez :

```
┌────────────────────────────────────────────┐
│ 🔒 Prérequis - Optionnel                  │
│                                            │
│ [-- Aucun prérequis --]  ▼                │
│  Option 1                                  │
│  Option 2                                  │
│  ...                                       │
└────────────────────────────────────────────┘
```

**Par défaut** : "Aucun prérequis" = La leçon est accessible immédiatement ✅

**Si vous sélectionnez un prérequis** : L'élève doit terminer cette leçon avant d'accéder à la nouvelle 🔒

### Exemples :

#### Sans prérequis :
```
Vidéo 1 → Aucun prérequis ✅ (accessible)
Vidéo 2 → Aucun prérequis ✅ (accessible)
Vidéo 3 → Aucun prérequis ✅ (accessible)

→ L'élève peut faire dans n'importe quel ordre !
```

#### Avec prérequis :
```
Vidéo cours → Aucun prérequis ✅
Exercice 1 → Prérequis: Vidéo cours 🔒
QCM 1 → Prérequis: Exercice 1 🔒

→ L'élève DOIT suivre cet ordre !
```

---

## 2️⃣ **Comptabiliser dans l'évaluation / reporting ?**

### ❌ **NON, actuellement ce n'est PAS paramétrable**

**Situation actuelle** :
- ✅ **TOUTES les leçons sont comptabilisées** dans les performances
- ✅ Chaque leçon terminée crée un enregistrement dans `Performance`
- ✅ Les statistiques incluent TOUT (vidéos, exercices, QCM, DS, etc.)

**Ce qui est tracké** :
| Type de leçon | Ce qui est enregistré |
|--------------|----------------------|
| VIDEO_COURS | `videoProgressPercent` (0-100%) |
| EXO_ECRIT | `isCompleted` (true/false) |
| QCM | `quizScorePercent` (0-100%) |
| DS | `isCompleted` (true/false) |
| CORRECTION_VIDEO/DOCUMENT | `isCompleted` (true/false) |

### 💡 **Si vous voulez exclure du reporting** :

**Option 1** : Ne pas créer de leçon (mettre le contenu ailleurs)
**Option 2** : J'ajoute un champ `countForReporting` (Boolean) ?

---

## 3️⃣ **Supprimer un cours, exercice, QCM ?**

### ✅ **OUI, suppression possible partout !**

### 🗑️ Interface Admin :

#### Supprimer un COURS :
```
/admin/courses
→ Liste des cours
→ Bouton "🗑️ Supprimer" sur chaque cours
→ Confirmation demandée
→ ⚠️ ATTENTION : Supprime TOUT en cascade !
   (Chapitres → Sous-chapitres → Leçons → Performances)
```

#### Supprimer un CHAPITRE :
```
/admin/chapters
→ Liste des chapitres
→ Bouton "🗑️ Supprimer"
→ ⚠️ Supprime en cascade :
   (Sous-chapitres → Leçons → Performances)
```

#### Supprimer une LEÇON (Exercice, QCM, etc.) :
```
/admin/lessons
→ Liste des leçons
→ Bouton "🗑️" sur chaque leçon
→ Confirmation : "Supprimer cette leçon ?"
→ Suppression en cascade :
   - Si c'est une leçon de niveau 1 (ex: Vidéo)
     → Supprime TOUS ses enfants (Exercices, QCM, Corrections)
   - Si c'est un exercice (niveau 2)
     → Supprime ses enfants (QCM, Correction)
   - Si c'est un QCM (niveau 3)
     → Supprime seulement le QCM
```

### ⚠️ **Conséquences de la suppression** :

```sql
-- Cascade automatique grâce à : ON DELETE CASCADE

Supprimer Vidéo de cours
  ↓
Supprime automatiquement :
  - Exercice 1
    - QCM Ex 1
    - Correction Ex 1
  - Exercice 2
    - QCM Ex 2
    - Correction Ex 2
  - ... tous les enfants !
  - Toutes les performances associées
```

### 🔒 **Protection** :

Le système demande **TOUJOURS confirmation** avant suppression :

```javascript
if (!confirm('Supprimer cette leçon ?')) return
```

**Pas de suppression accidentelle** ! ✅

---

## 4️⃣ **QCM : Comment ça fonctionne ?**

### 📝 **Format actuel des QCM**

#### Structure d'une question :

```typescript
{
  id: "abc123",
  question: "Quelle est la dérivée de x² ?",
  options: [
    "x",      // Option 0
    "2x",     // Option 1 ← BONNE RÉPONSE
    "x³",     // Option 2
    "2"       // Option 3
  ],
  correctAnswer: 1,  // Index de la bonne réponse
  explanation: "La dérivée de x² est 2x selon la règle nx^(n-1)",
  order: 1
}
```

#### Comment ça s'affiche :

```
┌────────────────────────────────────────────┐
│ Question 1/10                              │
│                                            │
│ Quelle est la dérivée de x² ?             │
│                                            │
│ ○ x                                        │
│ ○ 2x                                       │
│ ○ x³                                       │
│ ○ 2                                        │
│                                            │
│ [Valider] [Question suivante]              │
└────────────────────────────────────────────┘
```

### 🎯 **Type de réponses**

#### ✅ **Actuellement : QCM à choix unique (Radio buttons)**
- 1 seule réponse possible
- Boutons radio (○)
- L'élève clique sur UNE option

#### ❌ **PAS ENCORE implémenté : Cases à cocher multiples**
- Plusieurs réponses possibles
- Checkboxes (☐)
- Plus complexe à gérer

### 💻 **Code actuel** :

```tsx
// Dans QcmComponent.tsx
<div key={i} className="space-y-2">
  {question.options.map((option, optionIndex) => {
    const isSelected = answers[question.id] === optionIndex
    const isCorrect = optionIndex === question.correctAnswer
    
    return (
      <button
        onClick={() => handleAnswerSelect(question.id, optionIndex)}
        className={`
          w-full text-left p-4 rounded-lg border-2 transition-all
          ${isSelected ? 'border-master-turquoise bg-master-turquoise/10' : 'border-gray-200'}
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center
            ${isSelected ? 'border-master-turquoise bg-master-turquoise' : 'border-gray-300'}
          `}>
            {isSelected && <div className="w-3 h-3 rounded-full bg-white" />}
          </div>
          <span>{option}</span>
        </div>
      </button>
    )
  })}
</div>
```

### 📊 **Après soumission** :

```
┌────────────────────────────────────────────┐
│ Résultat : 8/10 (80%)                      │
│                                            │
│ Question 1                                 │
│ Quelle est la dérivée de x² ?             │
│                                            │
│ ✅ 2x  ← Votre réponse (Correct!)         │
│ ○ x                                        │
│ ○ x³                                       │
│ ○ 2                                        │
│                                            │
│ 💡 Explication :                           │
│ La dérivée de x² est 2x selon la règle... │
└────────────────────────────────────────────┘
```

### 🎨 **Couleurs** :
- ✅ **Vert** : Réponse correcte
- ❌ **Rouge** : Réponse incorrecte
- 💡 **Bleu** : Explication

---

## 5️⃣ **Comment créer un QCM dans l'admin ?**

### 🚧 **LIMITATION ACTUELLE** :

**Il n'y a PAS d'interface admin pour créer les questions QCM !**

Vous devez les ajouter **directement dans la base de données** ou via l'API.

### Option 1 : SQL Direct (Supabase)

```sql
-- Insérer une question QCM
INSERT INTO "qcm_questions" (
  id, 
  "lessonId", 
  question, 
  options, 
  "correctAnswer", 
  explanation, 
  "order"
) VALUES (
  gen_random_uuid(),
  '[ID_DE_LA_LECON_QCM]',
  'Quelle est la dérivée de x² ?',
  ARRAY['x', '2x', 'x³', '2'],
  1,  -- Index de la bonne réponse (2x = option[1])
  'La dérivée de x² est 2x',
  1   -- Ordre d'affichage
);
```

### Option 2 : API (À implémenter)

Actuellement il n'y a **PAS** d'API pour créer des questions QCM.

---

## 📊 **Récapitulatif complet**

| Question | Réponse | Statut actuel |
|----------|---------|---------------|
| **Prérequis optionnel ?** | ✅ OUI | Champ dropdown dans admin |
| **Exclure du reporting ?** | ❌ NON | Tout est compté |
| **Supprimer cours/leçon ?** | ✅ OUI | Bouton dans chaque page admin |
| **QCM avec cases multiples ?** | ❌ NON | Seulement choix unique |
| **Interface pour créer QCM ?** | ❌ NON | SQL direct ou API à faire |

---

## 🚀 **Ce qui manque encore**

### 1. **Champ "Compter dans le reporting"**
```typescript
// À ajouter dans schema.prisma
model Lesson {
  ...
  countForReporting  Boolean  @default(true)
  isOptional         Boolean  @default(false)
}
```

### 2. **Interface admin pour les questions QCM**
```
/admin/qcm/[lessonId]
→ Liste des questions
→ ➕ Ajouter une question
→ Formulaire :
   - Question
   - Option 1, 2, 3, 4
   - Bonne réponse
   - Explication
   - Ordre
```

### 3. **QCM à réponses multiples**
```typescript
// À ajouter
correctAnswers: number[]  // Au lieu de correctAnswer: number
// Ex: [1, 3] = options 1 et 3 sont correctes
```

---

## ❓ **Autres questions ?**

Voulez-vous que j'implémente :
- **A)** Le champ "Compter dans le reporting" ?
- **B)** L'interface admin pour créer des questions QCM ?
- **C)** Les QCM à choix multiples ?
- **D)** Tout ce qui précède ?

Dites-moi ce que vous voulez en priorité ! 😊


