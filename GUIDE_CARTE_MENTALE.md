# 🧠 Guide rapide : Créer une Carte Mentale

## ✅ Prérequis

Vous avez besoin de :
1. Une image de carte mentale (PNG, JPG ou SVG)
2. Un fichier JSON de configuration

## 📝 Étape 1 : Créer l'image

Créez votre carte mentale avec un outil comme :
- **Canva** (facile, en ligne)
- **MindMeister**
- **XMind**
- **Photoshop / Figma** (pour du custom)

Exportez en PNG ou SVG.

## 📂 Étape 2 : Placer les fichiers

### A. Placez votre image :
```
/public/mindmaps/mon-chapitre.png
```

### B. Créez le fichier de configuration JSON :
```
/public/mindmaps/[CHAPTER_ID]-config.json
```

**Exemple de configuration** (`/public/mindmaps/[CHAPTER_ID]-config.json`) :
```json
{
  "chapterId": "VOTRE_CHAPTER_ID",
  "imageUrl": "/mindmaps/mon-chapitre.png",
  "concepts": [
    {
      "id": "concept1",
      "label": "Dérivées",
      "x": 100,
      "y": 150,
      "radius": 40
    },
    {
      "id": "concept2",
      "label": "Intégrales",
      "x": 300,
      "y": 150,
      "radius": 40
    },
    {
      "id": "concept3",
      "label": "Primitives",
      "x": 200,
      "y": 300,
      "radius": 40
    }
  ]
}
```

### 📏 Comment trouver les coordonnées (x, y) ?

1. Ouvrez votre image dans un éditeur
2. Pour chaque concept, notez sa position (en pixels depuis le coin supérieur gauche)
3. `radius` = rayon de la zone cliquable (en pixels)

**Astuce** : Utilisez un outil comme Photoshop ou GIMP avec l'outil "Mesure"

## 🗄️ Étape 3 : Mettre à jour la base de données

Exécutez cette requête SQL dans Supabase :

```sql
UPDATE chapters
SET "mentalMapUrl" = '/mindmaps/mon-chapitre.png'
WHERE id = 'VOTRE_CHAPTER_ID';
```

**Pour trouver votre `CHAPTER_ID`** :
```sql
SELECT id, title FROM chapters WHERE "courseId" = 'VOTRE_COURSE_ID';
```

## ✅ Vérification

1. Rechargez votre page de cours
2. Vous devriez voir le bouton **"Carte mentale"** 🧠 apparaître sous le chapitre
3. Cliquez dessus pour voir votre carte interactive !

## 🎨 Exemple complet

Supposons que vous avez un chapitre "Second Degré" avec l'ID `cmh5d0qbq0001wrd8co29tq3d` :

### Fichiers :
```
/public/mindmaps/second-degre.png
/public/mindmaps/cmh5d0qbq0001wrd8co29tq3d-config.json
```

### Configuration JSON :
```json
{
  "chapterId": "cmh5d0qbq0001wrd8co29tq3d",
  "imageUrl": "/mindmaps/second-degre.png",
  "concepts": [
    {
      "id": "forme-canonique",
      "label": "Forme canonique",
      "x": 120,
      "y": 100,
      "radius": 45
    },
    {
      "id": "discriminant",
      "label": "Discriminant Δ",
      "x": 280,
      "y": 100,
      "radius": 45
    },
    {
      "id": "racines",
      "label": "Racines",
      "x": 440,
      "y": 100,
      "radius": 40
    },
    {
      "id": "parabole",
      "label": "Parabole",
      "x": 200,
      "y": 250,
      "radius": 40
    },
    {
      "id": "variations",
      "label": "Tableau de variations",
      "x": 360,
      "y": 250,
      "radius": 50
    }
  ]
}
```

### SQL :
```sql
UPDATE chapters
SET "mentalMapUrl" = '/mindmaps/second-degre.png'
WHERE id = 'cmh5d0qbq0001wrd8co29tq3d';
```

## 🚀 Fonctionnalités

Une fois configurée, votre carte mentale sera :
- ✅ **Interactive** : Cliquez sur les concepts pour les valider
- 📊 **Trackée** : La progression est sauvegardée en BDD
- 🎉 **Gamifiée** : Message de félicitations à 100%
- 📱 **Responsive** : Fonctionne sur mobile

## 💡 Besoin d'aide ?

Pour vérifier vos chapitres existants :
```sql
SELECT id, title, "mentalMapUrl" FROM chapters;
```

