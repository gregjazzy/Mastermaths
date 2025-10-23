# 🌳 Architecture Hiérarchique - Guide Complet

## 🎯 Vue d'ensemble

La plateforme Master Maths utilise maintenant une **architecture hiérarchique à 3 niveaux** pour organiser les leçons de manière intuitive et pédagogique.

---

## 📊 Structure hiérarchique

```
Cours (ex: Première)
 └─ Chapitre (ex: Second degré)
     ├─ Carte mentale (optionnelle)
     ├─ Répertoire lycées (optionnel)
     └─ Sous-chapitre (ex: Introduction au second degré)
         └─ 🎥 Vidéo de cours (NIVEAU 1)
             ├─ 📋 Exercice 1 (NIVEAU 2)
             │   ├─ 📝 QCM Exercice 1 (NIVEAU 3)
             │   └─ ✅ Correction Exercice 1 (NIVEAU 3)
             ├─ 📋 Exercice 2 (NIVEAU 2)
             │   ├─ 📝 QCM Exercice 2 (NIVEAU 3)
             │   └─ ✅ Correction Exercice 2 (NIVEAU 3)
             ...
             └─ 📋 Exercice 15 (NIVEAU 2)
                 ├─ 📝 QCM Exercice 15 (NIVEAU 3)
                 └─ ✅ Correction Exercice 15 (NIVEAU 3)
```

---

## 🎓 Les 3 niveaux expliqués

### Niveau 1 : Leçon principale (Racine)
- **Type** : Généralement VIDEO_COURS
- **Parent** : Aucun (`parentLessonId = null`)
- **Exemple** : "Vidéo de cours - Introduction aux équations"
- **Rôle** : Point d'entrée du sous-chapitre

### Niveau 2 : Exercices
- **Type** : EXO_ECRIT, DS, ou autres contenus
- **Parent** : La vidéo de cours (niveau 1)
- **Exemple** : "Exercice 1", "Exercice 2", "Exercice 3"
- **Rôle** : Application pratique du cours

### Niveau 3 : QCM et Corrections
- **Type** : QCM, CORRECTION_VIDEO, CORRECTION_DOCUMENT
- **Parent** : Un exercice (niveau 2)
- **Exemple** : "QCM Exercice 1", "Correction Exercice 1"
- **Rôle** : Validation et feedback

---

## 🔗 Système de prérequis en cascade

### Logique automatique :

```
1. Vidéo de cours (Niveau 1)
   └─ Prérequis : Aucun ✅

2. Exercice 1 (Niveau 2)
   └─ Prérequis : Vidéo de cours 🔒

3. QCM Exercice 1 (Niveau 3)
   └─ Prérequis : Exercice 1 🔒

4. Correction Exercice 1 (Niveau 3)
   └─ Prérequis : QCM Exercice 1 🔒

5. Exercice 2 (Niveau 2)
   └─ Prérequis : Correction Exercice 1 🔒

6. QCM Exercice 2 (Niveau 3)
   └─ Prérequis : Exercice 2 🔒

7. Correction Exercice 2 (Niveau 3)
   └─ Prérequis : QCM Exercice 2 🔒

... et ainsi de suite
```

---

## 🎨 Affichage visuel pour l'élève

### Navigation avec indentation :

```
📚 Première > Second degré > Introduction

─ 🎥 Vidéo de cours - Les bases ✅
  ├─ 📋 Exercice 1 ✅
  │  ├─ 📝 QCM Exercice 1 ✅
  │  └─ ✅ Correction Exercice 1 ✅
  ├─ 📋 Exercice 2 (en cours... 60%)
  │  ├─ 📝 QCM Exercice 2 🔒
  │  └─ ✅ Correction Exercice 2 🔒
  └─ 📋 Exercice 3 🔒
     ├─ 📝 QCM Exercice 3 🔒
     └─ ✅ Correction Exercice 3 🔒
```

**Légende** :
- ✅ = Complété
- 🔒 = Verrouillé (prérequis non terminé)
- (60%) = En cours

---

## 🛠️ Comment créer cette structure dans l'admin

### Méthode 1 : Manuelle (Granulaire)

#### Étape 1 : Créer la vidéo de cours (Niveau 1)
```
/admin/lessons → ➕ Nouvelle leçon

Type : 🎥 Vidéo de cours
Titre : Vidéo - Introduction aux équations
ID Vimeo : 123456789
Leçon Parente : -- Aucune (Niveau 1 - Racine) --
Prérequis : -- Aucun --
Ordre : 1
```

#### Étape 2 : Créer le premier exercice (Niveau 2)
```
Type : 📋 Exercice écrit
Titre : Exercice 1 - Équations simples
URL du document : [Lien PDF]
Leçon Parente : "Vidéo - Introduction aux équations"
Prérequis : "Vidéo - Introduction aux équations"
Ordre : 2
```

#### Étape 3 : Créer le QCM (Niveau 3)
```
Type : 📝 QCM
Titre : QCM Exercice 1
Leçon Parente : "Exercice 1 - Équations simples"
Prérequis : "Exercice 1 - Équations simples"
Ordre : 3
```

#### Étape 4 : Créer la correction (Niveau 3)
```
Type : ✅ Correction PDF (ou Vidéo)
Titre : Correction Exercice 1
URL PDF : [Lien corrigé]
Leçon Parente : "Exercice 1 - Équations simples"
Prérequis : "QCM Exercice 1"
Ordre : 4
```

#### Étape 5 : Créer le deuxième exercice (Niveau 2)
```
Type : 📋 Exercice écrit
Titre : Exercice 2 - Équations avec fractions
URL du document : [Lien PDF]
Leçon Parente : "Vidéo - Introduction aux équations"
Prérequis : "Correction Exercice 1"
Ordre : 5
```

... et répétez pour chaque exercice !

---

### Méthode 2 : API de séquence automatique (Plus rapide pour 15 exercices)

#### Via API :
```bash
POST /api/admin/lessons/create-sequence

Body:
{
  "videoLessonId": "[ID de la vidéo de cours]",
  "subChapterId": "[ID du sous-chapitre]",
  "count": 15
}

Résultat:
→ Crée 15 exercices
→ Crée 15 QCM
→ Crée 15 corrections
→ Configure automatiquement tous les prérequis en cascade
→ Total: 45 leçons créées !
```

**Important** : Cette API crée des squelettes. Vous devez ensuite :
1. Ajouter les URLs des PDFs pour chaque exercice
2. Ajouter les questions QCM
3. Ajouter les URLs des corrections

---

## 📋 Schéma de la base de données

### Champs clés du modèle `Lesson` :

| Champ | Type | Description |
|-------|------|-------------|
| `id` | String | ID unique de la leçon |
| `parentLessonId` | String? | ID de la leçon parente (null = niveau 1) |
| `prerequisiteLessonId` | String? | ID de la leçon prérequise (null = aucun) |
| `order` | Int | Ordre d'affichage |
| `type` | Enum | VIDEO_COURS, EXO_ECRIT, QCM, etc. |
| `subChapterId` | String | Sous-chapitre de rattachement |

### Relations :

```prisma
model Lesson {
  // Hiérarchie parent-enfant
  parentLesson     Lesson?  @relation("LessonHierarchy", fields: [parentLessonId])
  childLessons     Lesson[] @relation("LessonHierarchy")
  
  // Prérequis
  prerequisiteLesson Lesson? @relation("LessonPrerequisite", fields: [prerequisiteLessonId])
  dependentLessons   Lesson[] @relation("LessonPrerequisite")
}
```

---

## 🎯 Parcours élève typique

### Scénario : 15 exercices sur les équations

1. **L'élève arrive sur le sous-chapitre**
   - Voit seulement la vidéo de cours (débloquée)
   - Tous les exercices sont 🔒 verrouillés

2. **L'élève regarde la vidéo à 100%**
   - L'exercice 1 se débloque ✨

3. **L'élève fait l'exercice 1**
   - Clique sur "Marquer comme complété"
   - Le QCM Exercice 1 se débloque ✨

4. **L'élève fait le QCM**
   - Obtient 80% (ou n'importe quel score)
   - La Correction Exercice 1 se débloque ✨

5. **L'élève consulte la correction**
   - Clique pour voir la correction
   - L'exercice 2 se débloque ✨

6. **Le cycle continue...**
   - Exercice 2 → QCM 2 → Correction 2 → Exercice 3 → ...
   - Progression claire et guidée !

---

## 💡 Bonnes pratiques

### ✅ À FAIRE :

1. **Numérotez les exercices clairement**
   ```
   ✅ "Exercice 1 - Équations simples"
   ✅ "Exercice 2 - Équations avec fractions"
   ❌ "Exercice"
   ```

2. **Respectez la hiérarchie**
   - Niveau 1 : 1 seule vidéo de cours par sous-chapitre
   - Niveau 2 : Autant d'exercices que nécessaire
   - Niveau 3 : 1 QCM + 1 Correction par exercice

3. **Prérequis logiques**
   - Correction Ex N → débloque → Exercice N+1
   - Jamais de prérequis circulaires !

4. **Ordre cohérent**
   - Ordre 1 : Vidéo
   - Ordre 2 : Exercice 1
   - Ordre 3 : QCM Ex 1
   - Ordre 4 : Correction Ex 1
   - Ordre 5 : Exercice 2
   - etc.

### ❌ À ÉVITER :

1. **Plusieurs vidéos de cours** au niveau 1 dans le même sous-chapitre
   - Créez plutôt un nouveau sous-chapitre

2. **Exercices sans QCM ni correction**
   - L'élève ne sait pas s'il a compris

3. **Prérequis incohérents**
   - Ex: Exercice 3 avec prérequis = Exercice 1 (on saute l'Exercice 2)

4. **Trop d'exercices d'un coup**
   - 15 exercices c'est bien, mais créez-les progressivement
   - Testez avec 3-5 exercices d'abord

---

## 🔧 Migration de la base de données

### Avant d'utiliser la nouvelle structure :

```sql
-- Dans Supabase SQL Editor
-- Copiez le contenu de :
prisma/migrations/add_parent_hierarchy.sql

-- Puis exécutez
```

**Important** : Cette migration ajoute la colonne `parentLessonId` sans toucher aux données existantes.

---

## 🚀 Cas d'usage avancés

### Cas 1 : Exercices optionnels

```
Vidéo de cours
  ├─ Exercice 1 (obligatoire)
  ├─ Exercice 2 (obligatoire)
  ├─ Exercice Bonus (optionnel - pas de prérequis strict)
  └─ Exercice 3 (obligatoire, prérequis = Correction Ex 2)
```

### Cas 2 : DS de synthèse

```
Vidéo de cours
  ├─ Exercices 1-5
  ├─ Vidéo méthodologie (niveau 1 bis)
  ├─ Exercices 6-10
  └─ DS final (niveau 2, prérequis = Correction Ex 10)
```

### Cas 3 : Parcours différencié

```
Vidéo de cours
  ├─ Exercices faciles (1-5)
  ├─ Exercices moyens (6-10)
  └─ Exercices difficiles (11-15)
  
(L'élève peut choisir son niveau)
```

---

## 📊 Statistiques et suivi

### Pour l'admin :

```sql
-- Voir la progression globale des élèves
SELECT 
  u.email,
  COUNT(DISTINCT p.lessonId) as lessons_completed,
  AVG(CASE WHEN l.type = 'QCM' THEN p.quizScorePercent END) as avg_qcm_score
FROM users u
LEFT JOIN performances p ON p.userId = u.id AND p.isCompleted = true
LEFT JOIN lessons l ON l.id = p.lessonId
GROUP BY u.id
ORDER BY lessons_completed DESC;
```

### Voir la hiérarchie d'un sous-chapitre :

```sql
SELECT 
  l1.id,
  l1.title as "Niveau 1",
  l2.title as "Niveau 2",
  l3.title as "Niveau 3",
  l1.order
FROM lessons l1
LEFT JOIN lessons l2 ON l2.parentLessonId = l1.id
LEFT JOIN lessons l3 ON l3.parentLessonId = l2.id
WHERE l1.subChapterId = '[ID_SOUS_CHAPITRE]'
  AND l1.parentLessonId IS NULL
ORDER BY l1.order, l2.order, l3.order;
```

---

## ❓ Questions fréquentes

### Q : Puis-je avoir plus de 3 niveaux ?
**R :** Non, le système est conçu pour 3 niveaux maximum. Au-delà, créez un nouveau sous-chapitre.

### Q : Que se passe-t-il si je supprime une vidéo de cours (niveau 1) ?
**R :** Tous les exercices et corrections enfants sont supprimés en cascade (ON DELETE CASCADE).

### Q : Puis-je réorganiser l'ordre après création ?
**R :** Oui, éditez chaque leçon et changez l'ordre. Pensez à mettre à jour les prérequis si nécessaire.

### Q : Comment dupliquer une séquence complète ?
**R :** Actuellement, il faut recréer manuellement ou utiliser l'API de séquence.

### Q : Les cartes mentales et répertoires lycées sont-ils concernés ?
**R :** Non, ils restent au niveau CHAPITRE, indépendants de la hiérarchie des leçons.

---

## 🎉 Récapitulatif

| Concept | Description | Exemple |
|---------|-------------|---------|
| **Niveau 1** | Leçon racine | Vidéo de cours |
| **Niveau 2** | Exercices | Exercice 1, 2, 3... |
| **Niveau 3** | QCM + Corrections | QCM Ex1, Correction Ex1 |
| **parentLessonId** | Crée la hiérarchie | Ex1 → parent = Vidéo |
| **prerequisiteLessonId** | Contrôle le déblocage | Ex2 → prérequis = Correction Ex1 |
| **Indentation** | Visuel pour l'élève | Vidéo → Ex1 → QCM Ex1 |

---

**La nouvelle architecture hiérarchique est maintenant prête ! 🌳🎓**

Consultez aussi :
- [GUIDE_PREREQUIS.md](./GUIDE_PREREQUIS.md) - Système de prérequis
- [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) - Interface admin
- [GUIDE_CORRECTIONS.md](./GUIDE_CORRECTIONS.md) - Corrections vidéo/PDF


