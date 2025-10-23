# 🔒 Système de Prérequis - Guide Complet

## 🎯 Vue d'ensemble

Le système de prérequis permet de **verrouiller des leçons** jusqu'à ce que l'élève termine les leçons précédentes.

---

## ✨ Fonctionnement

### Logique pédagogique :
```
Leçon 1 : Vidéo de cours sur les limites
  ↓ [L'élève DOIT terminer cette vidéo]
  
Leçon 2 : Exercices sur les limites 🔒
  ↓ [L'élève DOIT compléter ces exercices]
  
Leçon 3 : QCM de validation 🔒
  ↓ [L'élève DOIT avoir au moins 50% au QCM]
  
Leçon 4 : Correction 🔒
```

---

## 🎓 Comment configurer les prérequis

### Dans l'interface admin :

```bash
1. /admin/lessons
2. Créez d'abord la leçon 1 (Vidéo de cours)
3. Créez la leçon 2 (Exercices)
   └─ Dans "🔒 Prérequis", sélectionnez "Leçon 1"
4. Créez la leçon 3 (QCM)
   └─ Dans "🔒 Prérequis", sélectionnez "Leçon 2"
```

---

## 📝 Exemples d'utilisation

### Exemple 1 : Parcours linéaire simple

```
Sous-chapitre : Introduction au second degré

1. Vidéo de cours (VIDEO_COURS)
   Prérequis : Aucun ✅

2. Feuille d'exercices (EXO_ECRIT) 
   Prérequis : Leçon #1 🔒
   
3. QCM de validation (QCM)
   Prérequis : Leçon #2 🔒
   
4. Correction PDF (CORRECTION_DOCUMENT)
   Prérequis : Leçon #3 🔒
```

### Exemple 2 : Parcours avec DS

```
Sous-chapitre : Trigonométrie

1. Vidéo cours 1 : Cercle trigonométrique
   Prérequis : Aucun ✅
   
2. Exercices niveau 1 (EXO_ECRIT)
   Prérequis : Leçon #1 🔒
   
3. Vidéo cours 2 : Formules trigonométriques
   Prérequis : Leçon #2 🔒
   
4. Exercices niveau 2 (EXO_ECRIT)
   Prérequis : Leçon #3 🔒
   
5. DS de synthèse (DS)
   Prérequis : Leçon #4 🔒
   
6. Correction DS (CORRECTION_PDF)
   Prérequis : Leçon #5 🔒
```

### Exemple 3 : Parcours flexible (plusieurs chemins)

```
Sous-chapitre : Fonctions

1. Vidéo de cours
   Prérequis : Aucun ✅
   
2a. Exercices classiques (EXO_ECRIT)
    Prérequis : Leçon #1 🔒
    
2b. QCM rapide (QCM)
    Prérequis : Leçon #1 🔒
    
3. DS final (DS)
   Prérequis : Leçon #2a OU #2b 🔒
   (Note : actuellement le système ne gère qu'UN prérequis)
```

---

## 🎨 Ce que voit l'élève

### Leçon déverrouillée :
```
┌────────────────────────────────────┐
│ ✅ Vidéo de cours - Les limites    │
│ [Vidéo accessible]                 │
└────────────────────────────────────┘
```

### Leçon verrouillée :
```
┌────────────────────────────────────┐
│ 🔒 Exercices sur les limites       │
│                                    │
│ Cette leçon est verrouillée        │
│                                    │
│ Vous devez d'abord terminer :      │
│ "Vidéo de cours - Les limites"     │
│                                    │
│ 💡 Complétez la leçon prérequise   │
└────────────────────────────────────┘
```

---

## 🔧 Conditions de déblocage

### Une leçon est débloquée SI :

| Type de leçon prérequise | Condition |
|-------------------------|-----------|
| **VIDEO_COURS** | Vidéo regardée à 100% |
| **EXO_ECRIT** | Marqué comme "Complété" |
| **QCM** | QCM soumis (quel que soit le score) |
| **DS** | Marqué comme "Complété" |
| **METHODE** | Marquée comme "Complétée" |
| **CARTOGRAPHIE** | Marquée comme "Complétée" |

---

## 💡 Bonnes pratiques

### ✅ À FAIRE :

1. **Ordre logique** : Toujours mettre les prérequis dans l'ordre chronologique
   ```
   Leçon 1 (ordre: 1) → Leçon 2 (ordre: 2) → Leçon 3 (ordre: 3)
   ```

2. **Progression graduelle** : Ne verrouillez pas trop de leçons d'un coup
   ```
   ✅ Bon : Vidéo → Exercices → QCM
   ❌ Mauvais : Vidéo → 10 leçons verrouillées
   ```

3. **Clarté** : Nommez clairement les leçons
   ```
   ✅ Bon : "Vidéo de cours - Introduction aux limites"
   ❌ Mauvais : "Leçon 1"
   ```

### ❌ À ÉVITER :

1. **Prérequis circulaires** : Ne créez pas de boucles !
   ```
   ❌ Leçon A → Prérequis: Leçon B
      Leçon B → Prérequis: Leçon A
   ```

2. **Prérequis sur soi-même** : Une leçon ne peut pas être son propre prérequis
   ```
   ❌ Leçon 1 → Prérequis: Leçon 1
   ```

3. **Trop de verrouillage** : Laissez au moins 2-3 leçons accessibles au départ

---

## 🚀 Migration de la base de données

### Avant d'utiliser les prérequis :

```sql
-- Copiez le contenu de prisma/migrations/add_prerequisite_system.sql
-- Exécutez-le dans Supabase SQL Editor
```

---

## 🎯 Cas d'usage avancés

### Cas 1 : Déblocage progressif d'un chapitre

```
Chapitre : Équations du second degré

Sous-chapitre 1 : Les bases
├─ Leçon 1.1 : Vidéo (Aucun prérequis)
├─ Leçon 1.2 : Exercices (Prérequis: 1.1)
└─ Leçon 1.3 : QCM (Prérequis: 1.2)

Sous-chapitre 2 : Résolution
├─ Leçon 2.1 : Vidéo (Prérequis: 1.3 du sous-chapitre 1 !)
├─ Leçon 2.2 : Exercices (Prérequis: 2.1)
└─ Leçon 2.3 : DS (Prérequis: 2.2)
```

**Important** : Actuellement, les prérequis entre sous-chapitres ne sont pas supportés. Chaque sous-chapitre démarre sans prérequis.

### Cas 2 : Révisions optionnelles

```
1. Vidéo de cours (Aucun prérequis)
2. Exercices niveau 1 (Prérequis: Leçon 1)
3. Carte mentale (Aucun prérequis) ← Révision accessible à tout moment
4. Exercices niveau 2 (Prérequis: Leçon 2)
```

---

## 🔍 Déboguer les prérequis

### Problème : Une leçon reste verrouillée alors que le prérequis est terminé

**Vérifiez :**
```sql
-- Dans Supabase SQL Editor
SELECT 
  l.id,
  l.title,
  l.prerequisiteLessonId,
  p.isCompleted,
  p.videoProgressPercent
FROM lessons l
LEFT JOIN performances p ON p.lessonId = l.prerequisiteLessonId
WHERE l.id = '[ID_DE_LA_LECON_VERROUILLEE]';
```

**Solutions :**
1. Vérifiez que `p.isCompleted` est `TRUE`
2. Pour les vidéos, vérifiez que `videoProgressPercent` est >= 95%
3. Reconnectez l'élève (parfois nécessaire pour rafraîchir)

---

## 📊 Statistiques admin

Pour voir la progression des élèves :

```sql
SELECT 
  u.email,
  l.title AS lesson_title,
  p.isCompleted,
  CASE 
    WHEN l.prerequisiteLessonId IS NULL THEN 'Débloquée'
    WHEN p2.isCompleted THEN 'Débloquée'
    ELSE 'Verrouillée'
  END as status
FROM users u
CROSS JOIN lessons l
LEFT JOIN performances p ON p.userId = u.id AND p.lessonId = l.id
LEFT JOIN performances p2 ON p2.userId = u.id AND p2.lessonId = l.prerequisiteLessonId
ORDER BY u.email, l.order;
```

---

## ❓ Questions fréquentes

### Q : Puis-je avoir plusieurs prérequis pour une leçon ?
**R :** Non, actuellement une seule leçon prérequise est supportée.

### Q : Les corrections sont-elles automatiquement verrouillées ?
**R :** Non, vous devez définir manuellement le prérequis. Mais c'est recommandé de lier la correction à l'exercice !

### Q : Que se passe-t-il si je supprime une leçon prérequise ?
**R :** Le champ `prerequisiteLessonId` est automatiquement mis à `NULL` (la leçon se déverrouille).

### Q : Puis-je changer un prérequis après création ?
**R :** Oui, dans `/admin/lessons`, éditez la leçon et changez le prérequis.

---

## 🎉 Récapitulatif

| Action | Comment |
|--------|---------|
| **Ajouter un prérequis** | Admin → Edit leçon → Sélectionner dans dropdown |
| **Voir si verrouillé** | L'élève voit 🔒 et un message explicite |
| **Débloquer** | L'élève termine le prérequis → Auto-déblocage |
| **Retirer un prérequis** | Admin → Edit leçon → "Aucun prérequis" |

---

**Le système de prérequis est maintenant actif ! 🎓🔒**


