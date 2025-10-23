# 📚 Guide : Corrections Vidéo et PDF

## 🎯 Vue d'ensemble

Vous pouvez maintenant ajouter des **corrections en vidéo OU en PDF** pour vos exercices, DS et QCM !

---

## 🔧 Types de corrections disponibles

| Type | Format | Utilisation |
|------|--------|-------------|
| **Correction Vidéo** | 🎥 Vimeo | Explication orale et visuelle |
| **Correction PDF** | 📄 Google Drive / Dropbox | Corrigé écrit détaillé |

---

## 📝 Quand utiliser chaque format ?

### ✅ Vidéo de correction
- Explications orales complexes
- Démonstrations étape par étape
- Méthodes de résolution détaillées
- Astuces et pièges à éviter

### ✅ Correction PDF
- Corrigés complets d'exercices
- Barèmes de DS détaillés
- Solutions avec justifications écrites
- Copies annotées

---

## 🎓 Comment ajouter une correction

### Méthode 1 : Correction Vidéo

#### Étape 1 : Uploadez votre vidéo sur Vimeo
```
1. Allez sur vimeo.com
2. Uploadez votre vidéo de correction
3. Notez l'ID Vimeo (ex: 987654321)
```

#### Étape 2 : Créez la leçon
```
/admin/lessons → ➕ Nouvelle leçon

Type : ✅ Vidéo de correction
Titre : Correction - Exercices sur les limites
ID Vimeo : 987654321
Lier à un exercice : [Sélectionnez l'exercice correspondant]
```

---

### Méthode 2 : Correction PDF

#### Étape 1 : Hébergez votre PDF
```
1. Google Drive : Téléversez → Obtenir le lien public
2. Copiez l'URL
```

#### Étape 2 : Créez la leçon
```
/admin/lessons → ➕ Nouvelle leçon

Type : 📄 Correction PDF
Titre : Corrigé - DS de trigonométrie
URL de la correction PDF : [Collez le lien Google Drive]
Lier à un exercice : [Sélectionnez le DS correspondant]
```

---

## 🎯 Exemples d'utilisation

### Exemple 1 : Exercice avec correction vidéo

```
📋 Organisation du sous-chapitre :

1. Vidéo de cours (VIDEO_COURS)
2. Exercices (EXO_ECRIT) + PDF
3. Correction Vidéo (CORRECTION_VIDEO) ← Liée à l'exercice #2
```

**Résultat pour l'élève :**
- L'élève fait l'exercice #2
- Clique sur "Marquer comme complété"
- La correction vidéo #3 apparaît automatiquement ! ✨

---

### Exemple 2 : DS avec correction PDF

```
📋 Organisation du sous-chapitre :

1. Devoir Surveillé (DS) + PDF du sujet
2. Correction PDF (CORRECTION_DOCUMENT) ← Liée au DS #1
```

**Résultat pour l'élève :**
- L'élève consulte le DS #1
- Fait le devoir
- Clique sur "Marquer comme complété"
- Le corrigé PDF #2 apparaît ! ✨

---

### Exemple 3 : QCM avec correction vidéo (cas spécial)

```
📋 Organisation du sous-chapitre :

1. QCM (QCM) - Questions intégrées
2. Correction Vidéo (CORRECTION_VIDEO) ← Liée au QCM #1
```

**Résultat pour l'élève :**
- L'élève fait le QCM #1
- Si score < 100% → La correction vidéo #2 s'affiche automatiquement
- Si score = 100% → Pas de correction (il a tout juste !)

---

## 🎨 Scénarios avancés

### Scénario 1 : Double correction (vidéo + PDF)

```
1. Exercices (EXO_ECRIT) + PDF
2. Correction Vidéo (CORRECTION_VIDEO) ← Explications orales
3. Correction PDF (CORRECTION_DOCUMENT) ← Corrigé écrit détaillé
```

Les deux corrections sont liées à l'exercice #1 !

---

### Scénario 2 : Progression logique

```
1. Vidéo de cours (VIDEO_COURS)
2. Méthode (METHODE) + PDF
3. Exercices d'application (EXO_ECRIT) + PDF
4. Correction PDF (CORRECTION_DOCUMENT)
5. Exercices approfondis (EXO_ECRIT) + PDF
6. Correction Vidéo (CORRECTION_VIDEO)
7. DS de synthèse (DS) + PDF
8. Correction PDF complète (CORRECTION_DOCUMENT)
```

---

## 🔗 Lier une correction à un exercice

### Dans l'interface admin :

Quand vous créez une **Correction Vidéo** ou une **Correction PDF**, vous verrez :

```yaml
┌─────────────────────────────────────────────────┐
│ 💡 Lier à un exercice/DS/QCM - Optionnel       │
│                                                 │
│ [Sélectionnez...]                              │
│   -- Aucun lien --                             │
│   Exercice 1 : Calculs de limites              │
│   DS : Trigonométrie                           │
│   QCM : Fonctions                              │
│                                                 │
│ La correction s'affichera après que l'élève    │
│ termine l'exercice.                            │
└─────────────────────────────────────────────────┘
```

**Important :** Seuls les exercices/DS/QCM du **même sous-chapitre** apparaissent !

---

## 📊 Comparaison : Vidéo vs PDF

| Critère | Vidéo | PDF |
|---------|-------|-----|
| **Préparation** | Plus long (enregistrement) | Rapide |
| **Engagement** | Très élevé | Moyen |
| **Détail** | Explications orales | Écrit détaillé |
| **Taille** | Hébergé sur Vimeo | Léger (Drive) |
| **Annotation** | Non | Oui (élève peut imprimer) |
| **Recherche** | Difficile | Facile (Ctrl+F) |
| **Accessibilité** | Nécessite audio | Peut être lu partout |

---

## 🎯 Bonnes pratiques

### Pour les corrections vidéo :
✅ Parlez clairement et lentement
✅ Montrez chaque étape à l'écran
✅ Expliquez les erreurs courantes
✅ Donnez des astuces mnémotechniques
✅ Durée idéale : 5-15 minutes

### Pour les corrections PDF :
✅ Utilisez une police lisible (Arial, Calibri)
✅ Ajoutez des couleurs (rouge pour erreurs, vert pour astuces)
✅ Numérotez clairement chaque question
✅ Donnez le barème pour chaque question
✅ Ajoutez des annotations manuscrites si besoin

---

## 🚀 Workflow recommandé

### Création d'un chapitre complet :

1. **Semaine 1** : Créez les cours (vidéos + PDF méthodes)
2. **Semaine 2** : Ajoutez les exercices (PDF)
3. **Semaine 3** : Créez les corrections (vidéo OU PDF selon besoin)
4. **Semaine 4** : Liez les corrections aux exercices
5. **Semaine 5** : Testez le parcours élève
6. **Semaine 6** : Publiez le chapitre ! 🎉

---

## 🔧 Résolution de problèmes

### La correction ne s'affiche pas automatiquement

**Vérifiez :**
1. La correction est bien **liée** à l'exercice
2. Les deux sont dans le **même sous-chapitre**
3. L'élève a bien **marqué l'exercice comme complété**

### Le PDF ne s'affiche pas

**Vérifiez :**
1. Le lien Google Drive est **public**
2. L'URL contient `/view` ou `/preview`
3. Le fichier n'est pas supprimé de Drive

### La vidéo Vimeo ne se charge pas

**Vérifiez :**
1. L'ID Vimeo est correct (juste les chiffres)
2. La vidéo est **publique** ou **non listée** sur Vimeo
3. La vidéo n'est pas privée

---

## 💡 Cas d'usage spéciaux

### Pour les DS (Devoirs Surveillés)

```
Ordre recommandé :
1. DS (DS) avec le sujet PDF
2. Correction PDF (CORRECTION_DOCUMENT) avec barème détaillé
3. Correction Vidéo (CORRECTION_VIDEO) pour explications orales
```

### Pour les annales de bac

```
1. Annale (EXO_ECRIT) avec sujet officiel PDF
2. Correction PDF (CORRECTION_DOCUMENT) avec barème officiel
3. Conseils méthodologiques (METHODE) PDF
```

---

## ❓ Questions fréquentes

### Q : Puis-je avoir plusieurs corrections pour un même exercice ?
**R :** Oui ! Créez plusieurs leçons de correction et liez-les toutes au même exercice.

### Q : La correction est-elle visible AVANT que l'élève fasse l'exercice ?
**R :** Non ! Elle apparaît APRÈS que l'élève marque l'exercice comme complété.

### Q : Puis-je mélanger vidéo et PDF ?
**R :** Oui ! C'est même recommandé pour offrir plusieurs formats d'apprentissage.

### Q : Comment modifier une correction déjà publiée ?
**R :** Allez dans `/admin/lessons`, cliquez sur "✏️ Modifier" et changez l'URL ou l'ID Vimeo.

---

## 🎉 Récapitulatif

| Action | Comment faire |
|--------|---------------|
| **Ajouter correction vidéo** | Type: Correction Vidéo → ID Vimeo → Lier |
| **Ajouter correction PDF** | Type: Correction PDF → URL PDF → Lier |
| **Lier à un exercice** | Dropdown dans le formulaire |
| **Modifier une correction** | Admin → Edit → Changer URL/ID |
| **Voir comme élève** | Complétez l'exercice → Correction apparaît |

---

**Besoin d'aide ?** Consultez [GUIDE_DOCUMENTS.md](./GUIDE_DOCUMENTS.md) pour plus de détails sur les PDFs.


