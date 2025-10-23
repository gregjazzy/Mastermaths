# 📄 Guide : Ajouter des Feuilles d'Exercices et Documents

## 🎯 Vue d'ensemble

Vous pouvez maintenant ajouter des **feuilles d'exercices PDF**, des **images**, ou tout autre document à vos leçons. Ces documents s'affichent directement dans la plateforme !

---

## 📝 Comment ajouter une feuille d'exercices

### Étape 1 : Héberger votre document

Vous avez plusieurs options :

#### Option A : **Google Drive** (Recommandé)

1. Allez sur [drive.google.com](https://drive.google.com)
2. Téléversez votre PDF
3. Clic droit sur le fichier → **Obtenir le lien**
4. Sélectionnez **"Tous les utilisateurs disposant du lien"**
5. Copiez le lien (ex: `https://drive.google.com/file/d/1ABC...XYZ/view`)

#### Option B : **Dropbox**

1. Téléversez sur Dropbox
2. Clic sur **Partager**
3. Créez un lien de partage public
4. Copiez le lien

#### Option C : **Votre serveur**

1. Téléversez le PDF sur votre serveur web
2. Utilisez l'URL directe (ex: `https://votresite.com/documents/exercices.pdf`)

---

### Étape 2 : Créer la leçon dans l'admin

1. **Connectez-vous à l'admin** : `/admin/lessons`

2. **Cliquez sur "➕ Nouvelle leçon"**

3. **Remplissez le formulaire** :
   ```
   Sous-chapitre : [Sélectionnez le sous-chapitre]
   Titre : Feuille d'exercices - Les limites
   Type : 📄 Exercice écrit
   ```

4. **Collez l'URL du document** :
   - Le champ **"URL du document"** apparaît automatiquement
   - Collez le lien Google Drive ou Dropbox
   - Pas besoin d'ID Vimeo !

5. **Cliquez sur "Créer"** ✅

---

## 🎨 Comment ça s'affiche pour les élèves

### Si vous mettez un PDF :
- ✅ Le PDF s'affiche **directement** dans la page (iframe 800px de haut)
- ✅ Un bouton **"Ouvrir dans un nouvel onglet"** est disponible
- ✅ L'élève peut scroller le PDF sans quitter la leçon

### Si vous mettez une image :
- ✅ L'image s'affiche directement

### Si vous mettez un autre type de fichier :
- ✅ Un bouton **"Télécharger le document"** apparaît

---

## 🎓 Types de leçons qui acceptent des documents

| Type de leçon | Accepte un document | Description |
|--------------|---------------------|-------------|
| 📄 **Exercice écrit** | ✅ Oui | Feuilles d'exercices PDF |
| 🗺️ **Cartographie** | ✅ Oui | Cartes conceptuelles, schémas |
| 📋 **Méthode** | ✅ Oui | Fiches méthodologiques |
| 🎥 **Vidéo cours** | ❌ Non | Utilise un ID Vimeo |
| ❓ **QCM** | ❌ Non | Questions intégrées |
| 🎥 **Vidéo correction** | ❌ Non | Utilise un ID Vimeo |

---

## 💡 Exemples d'utilisation

### Exemple 1 : Feuille d'exercices simple
```
Type : 📄 Exercice écrit
Titre : Exercices sur les limites
URL : https://drive.google.com/file/d/1ABC...XYZ/view
```

### Exemple 2 : Carte mentale
```
Type : 🗺️ Cartographie
Titre : Carte mentale - Fonctions trigonométriques
URL : https://drive.google.com/file/d/1DEF...UVW/view
```

### Exemple 3 : Fiche méthode
```
Type : 📋 Méthode
Titre : Méthode pour résoudre les équations du second degré
URL : https://drive.google.com/file/d/1GHI...RST/view
```

---

## 🔧 Astuces Google Drive

### Convertir un lien Google Drive pour l'iframe :
Le système le fait automatiquement ! Il convertit :
- De : `https://drive.google.com/file/d/ABC/view`
- Vers : `https://drive.google.com/file/d/ABC/preview`

Cela permet l'affichage direct dans la page.

### Si le PDF ne s'affiche pas :
1. Vérifiez que le lien est **public** (accessible à tous)
2. Essayez de remplacer `/view` par `/preview` manuellement
3. Ou utilisez un autre hébergeur (Dropbox, votre serveur)

---

## 🎯 Avantages de cette méthode

| Avantage | Description |
|----------|-------------|
| 💾 **Pas de stockage local** | Les fichiers sont hébergés sur Google Drive/Dropbox |
| 🔄 **Mise à jour facile** | Modifiez le PDF sur Drive, le lien reste le même |
| 📱 **Responsive** | S'affiche bien sur mobile et desktop |
| 🚀 **Rapide** | Pas de limite de taille dans votre base de données |
| 🔐 **Sécurisé** | Vous contrôlez l'accès via Google Drive |

---

## ❓ Questions fréquentes

### Q : Puis-je mettre plusieurs PDFs sur une leçon ?
**R :** Non, une seule URL par leçon. Créez plusieurs leçons si nécessaire.

### Q : Quel format de fichier puis-je utiliser ?
**R :** PDF, images (JPG, PNG), ou tout fichier accessible via une URL.

### Q : Comment modifier le document après création ?
**R :** Retournez dans `/admin/lessons`, cliquez sur "✏️ Modifier" et changez l'URL.

### Q : Le document est-il obligatoire ?
**R :** Non, il est optionnel. Vous pouvez créer une leçon "Exercice écrit" sans document.

---

## 🚀 Prochaines étapes

Maintenant que vous savez ajouter des documents :
1. Créez vos feuilles d'exercices PDF
2. Téléversez-les sur Google Drive
3. Ajoutez-les dans l'admin
4. Vos élèves peuvent les consulter directement !

---

**Besoin d'aide ?** Consultez le [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) pour plus de détails sur l'interface admin.


