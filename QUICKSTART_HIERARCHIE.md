# ⚡ Quick Start : Architecture Hiérarchique

## 🎯 En 5 minutes

### Ce qui a changé :
Les exercices sont maintenant **rattachés visuellement** à la vidéo de cours avec une indentation claire.

---

## 🌳 Structure visuelle

```
─ Vidéo de cours
  ├─ Exercice 1
  │  ├─ QCM Exercice 1
  │  └─ Correction Exercice 1
  ├─ Exercice 2
  │  ├─ QCM Exercice 2
  │  └─ Correction Exercice 2
  ...
  └─ Exercice 15
```

**3 niveaux d'indentation !**

---

## 🚀 Comment créer

### Option 1 : Manuelle (pour 1-5 exercices)

```bash
1. Créez la vidéo de cours
   → Leçon Parente : Aucune (Niveau 1)

2. Créez Exercice 1
   → Leçon Parente : [Vidéo de cours]
   → Prérequis : [Vidéo de cours]

3. Créez QCM Exercice 1
   → Leçon Parente : [Exercice 1]
   → Prérequis : [Exercice 1]

4. Créez Correction Exercice 1
   → Leçon Parente : [Exercice 1]
   → Prérequis : [QCM Exercice 1]

5. Créez Exercice 2
   → Leçon Parente : [Vidéo de cours]
   → Prérequis : [Correction Exercice 1]

Répétez 3-5 pour chaque exercice !
```

### Option 2 : API automatique (pour 15 exercices)

```bash
POST /api/admin/lessons/create-sequence

{
  "videoLessonId": "[ID vidéo]",
  "subChapterId": "[ID sous-chapitre]",
  "count": 15
}

→ Crée 45 leçons (15 ex + 15 QCM + 15 corrections)
→ Configure toute la hiérarchie + prérequis
→ En 1 clic ! ✨
```

Puis ajoutez les contenus (PDFs, questions QCM).

---

## 🎓 Parcours élève

```
1. Regarde la vidéo → Exercice 1 se débloque
2. Fait Exercice 1 → QCM 1 se débloque
3. Fait QCM 1 → Correction 1 se débloque
4. Voit Correction 1 → Exercice 2 se débloque
... et ainsi de suite !
```

**Progression guidée et claire** 🎯

---

## 🔧 Migration DB

**IMPORTANT** : Avant de commencer :

```sql
-- Dans Supabase SQL Editor
-- Exécutez : prisma/migrations/add_parent_hierarchy.sql
```

---

## 📚 2 champs clés

| Champ | Rôle |
|-------|------|
| **parentLessonId** | Créé la hiérarchie visuelle (indentation) |
| **prerequisiteLessonId** | Contrôle le déblocage (🔒) |

**Les deux travaillent ensemble !**

---

**C'est prêt ! Consultez [ARCHITECTURE_HIERARCHIQUE.md](./ARCHITECTURE_HIERARCHIQUE.md) pour plus de détails.**


