# ⚡ Quick Start : Système de Prérequis

## 🎯 En 2 minutes

### Ce que c'est :
Les élèves **doivent terminer une leçon** avant d'accéder à la suivante.

---

## 🚀 Comment l'utiliser

### Étape 1 : Créez vos leçons dans l'ordre

```bash
1. /admin/lessons
2. Créez "Leçon 1 : Vidéo de cours"
3. Créez "Leçon 2 : Exercices"
   → Dans le champ "🔒 Prérequis", sélectionnez "Leçon 1"
4. Créez "Leçon 3 : QCM"
   → Dans le champ "🔒 Prérequis", sélectionnez "Leçon 2"
```

### Étape 2 : C'est tout ! 🎉

Les leçons se débloquent automatiquement quand l'élève termine les prérequis.

---

## 🎓 Exemple concret

```
Sous-chapitre : Les limites

Leçon 1 : Vidéo - Introduction 
  → Aucun prérequis ✅ (accessible immédiatement)

Leçon 2 : Exercices niveau 1
  → Prérequis : Leçon 1 🔒

Leçon 3 : QCM de validation
  → Prérequis : Leçon 2 🔒

Leçon 4 : Correction
  → Prérequis : Leçon 3 🔒
```

**Résultat** : L'élève fait les leçons dans l'ordre, pas de confusion ! 🎯

---

## 💡 Quand débloquer ?

| Type | Se débloque quand |
|------|-------------------|
| Vidéo | Regardée à 100% |
| Exercice | Marqué "Complété" |
| QCM | Soumis (peu importe le score) |
| DS | Marqué "Complété" |

---

## 🔧 Migration DB

**IMPORTANT** : Avant d'utiliser les prérequis, exécutez :

```sql
-- Copiez prisma/migrations/add_prerequisite_system.sql
-- Exécutez dans Supabase SQL Editor
```

---

## 🎨 Affichage pour l'élève

### Leçon verrouillée :
```
🔒 Exercices sur les limites

Cette leçon est verrouillée

Vous devez d'abord terminer :
"Vidéo de cours - Les limites"
```

**Simple et clair** ! 😊

---

**C'est tout ! Consultez [GUIDE_PREREQUIS.md](./GUIDE_PREREQUIS.md) pour plus de détails.**


