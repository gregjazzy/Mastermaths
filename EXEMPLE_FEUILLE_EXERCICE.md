# 🎯 Exemple Concret : Ajouter une Feuille d'Exercices

## Scénario

Vous voulez ajouter une **feuille d'exercices sur les limites** en PDF à votre cours de Terminale.

---

## 📋 Étape par Étape

### 1️⃣ Préparez votre PDF
- Créez votre feuille d'exercices (Word, LaTeX, etc.)
- Exportez en PDF : `exercices_limites.pdf`

### 2️⃣ Uploadez sur Google Drive
```
1. drive.google.com
2. Nouveau → Importer un fichier
3. Sélectionnez exercices_limites.pdf
4. Clic droit sur le fichier → Partager → Obtenir le lien
5. Changez en "Tous les utilisateurs disposant du lien"
6. Copiez le lien : 
   https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/view
```

### 3️⃣ Ajoutez dans l'Admin

#### A. Naviguez vers l'admin
```
http://localhost:3000/admin/lessons
```

#### B. Cliquez sur "➕ Nouvelle leçon"

#### C. Remplissez le formulaire
```yaml
Sous-chapitre: [Sélectionnez "Limites et continuité"]
Titre: Feuille d'exercices - Calculs de limites
Type: 📄 Exercice écrit
Ordre: 5
URL du document: https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/view
```

#### D. Cliquez sur "Créer"

---

## 🎨 Résultat pour l'élève

### Quand l'élève clique sur la leçon, il voit :

```
┌────────────────────────────────────────────────────────────┐
│  Terminale > Analyse > Limites et continuité               │
│                                                             │
│  📄 Feuille d'exercices - Calculs de limites               │
│     [Badge: Exercice écrit]                                │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  📄 Document de l'exercice    [Ouvrir dans un nouvel onglet]│
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │  [PDF affiché ici - 800px de haut]                  │  │
│  │                                                       │  │
│  │  Exercice 1 : Calculer lim(x→∞) (3x² + 2x - 1)      │  │
│  │  Exercice 2 : ...                                     │  │
│  │  ...                                                  │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │  📄 Exercice écrit                                  │    │
│  │  Complétez cet exercice et marquez-le comme terminé │    │
│  │  une fois que vous avez fini.                       │    │
│  │                                                      │    │
│  │        [✓ Marquer comme complété]                   │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
```

---

## 🔄 Variantes possibles

### Variante 1 : Feuille + Correction Vidéo
```
Leçon 1 : Feuille d'exercices (EXO_ECRIT)
          → URL du document : [Lien PDF]

Leçon 2 : Correction des exercices (VIDEO_COURS)
          → ID Vimeo : 987654321
```

### Variante 2 : Feuille + QCM
```
Leçon 1 : Feuille d'exercices (EXO_ECRIT)
          → URL du document : [Lien PDF]

Leçon 2 : QCM de vérification (QCM)
          → Questions intégrées

Leçon 3 : Vidéo correction du QCM (CORRECTION_VIDEO)
          → ID Vimeo : 123456789
          → Lié au QCM de la leçon 2
```

### Variante 3 : Série progressive
```
Leçon 1 : Feuille d'exercices - Niveau 1 (EXO_ECRIT)
Leçon 2 : Feuille d'exercices - Niveau 2 (EXO_ECRIT)
Leçon 3 : Feuille d'exercices - Niveau 3 (EXO_ECRIT)
Leçon 4 : Annales de bac (EXO_ECRIT)
```

---

## 💡 Astuces Pro

### Astuce 1 : Nommage cohérent
```
✅ Bon : "Feuille d'exercices - Calculs de limites"
❌ Mauvais : "Exercices"
```

### Astuce 2 : Ordre logique
```
1. Vidéo cours (VIDEO_COURS)
2. Méthode (METHODE)
3. Feuille d'exercices (EXO_ECRIT)
4. QCM (QCM)
5. Correction vidéo (CORRECTION_VIDEO)
```

### Astuce 3 : Organisation Google Drive
```
Mon Drive/
├── Master Maths/
│   ├── Terminale/
│   │   ├── Analyse/
│   │   │   ├── exercices_limites.pdf
│   │   │   ├── exercices_derivees.pdf
│   │   │   └── exercices_integrales.pdf
│   │   └── Probabilités/
│   └── Première/
```

### Astuce 4 : Mise à jour sans changer le lien
Si vous modifiez le PDF sur Google Drive :
1. Gardez le même nom de fichier
2. Téléversez la nouvelle version
3. Le lien reste le même ! 🎉
4. Les élèves voient automatiquement la nouvelle version

---

## 🎬 Prochaines étapes

1. **Testez avec un vrai PDF** : Créez une leçon test
2. **Vérifiez l'affichage** : Ouvrez la leçon en tant qu'élève
3. **Ajustez si nécessaire** : Modifiez l'URL ou le titre
4. **Déployez !** : Ajoutez toutes vos feuilles d'exercices

---

## 📊 Statistiques

L'élève qui complète la feuille d'exercices gagne :
- ✅ **Progression dans le sous-chapitre**
- ✅ **Points de maîtrise** (via le système de gamification)
- ✅ **Badges potentiels** (si critères remplis)
- ✅ **Historique de performance** (visible dans le dashboard)

---

**Et voilà !** Vous savez maintenant comment remplacer une vidéo d'exercice par une feuille PDF. 🎉


