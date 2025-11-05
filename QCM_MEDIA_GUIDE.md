# Guide des Médias QCM

## Vue d'ensemble

Le système QCM supporte maintenant l'ajout de médias (images, PDF, vidéos) pour enrichir les énoncés et explications des questions.

## Fonctionnalités

### 1. Médias pour l'énoncé
- **Image** : Affichée directement dans la question
- **PDF** : Lien cliquable pour ouvrir le document
- **Vidéo** : Intégrée via iframe (YouTube, Vimeo, etc.)

### 2. Médias pour l'explication
- **Image** : Affichée après la soumission du QCM
- **PDF** : Lien vers un document d'explication détaillée
- **Vidéo** : Correction vidéo intégrée

## Migration SQL

Exécutez le script `MIGRATION_QCM_MEDIA.sql` dans Supabase SQL Editor :

```sql
ALTER TABLE qcm_questions 
ADD COLUMN IF NOT EXISTS "questionImageUrl" TEXT,
ADD COLUMN IF NOT EXISTS "questionPdfUrl" TEXT,
ADD COLUMN IF NOT EXISTS "questionVideoUrl" TEXT,
ADD COLUMN IF NOT EXISTS "explanationImageUrl" TEXT,
ADD COLUMN IF NOT EXISTS "explanationPdfUrl" TEXT,
ADD COLUMN IF NOT EXISTS "explanationVideoUrl" TEXT;
```

## Utilisation dans l'Admin

### Pour les leçons
1. Accédez à `/admin/qcm/[lessonId]`
2. Créez ou modifiez une question
3. Utilisez les sections "📸 Médias pour l'énoncé" et "📚 Médias pour l'explication"
4. Entrez les URLs complètes des médias

### Pour les exercices
1. Accédez à `/admin/qcm-exercise/[exerciseId]`
2. Suivez les mêmes étapes que pour les leçons

## Format des URLs

### Images
- **Format** : JPG, PNG, GIF, WebP
- **Exemple** : `https://example.com/image.jpg`
- **Affichage** : Image responsive intégrée

### PDF
- **Format** : PDF accessible via URL
- **Exemple** : `https://example.com/document.pdf`
- **Affichage** : Lien cliquable "📄 Voir le PDF"

### Vidéos
- **Format** : URL d'embed YouTube, Vimeo, ou autre
- **YouTube** : `https://www.youtube.com/embed/VIDEO_ID`
- **Vimeo** : `https://player.vimeo.com/video/VIDEO_ID`
- **Affichage** : Iframe responsive 16:9

## Affichage côté élève

### Énoncé
Les médias de l'énoncé sont affichés immédiatement après la question, avant les options de réponse.

### Explication
Les médias d'explication ne sont visibles qu'après la soumission du QCM, dans la section bleue d'explication.

## Exemples d'utilisation

### Question avec image
```
Question : "Observez le graphique ci-dessous..."
Image : https://example.com/graphique.jpg
```

### Question avec vidéo d'énoncé
```
Question : "Regardez la démonstration puis répondez..."
Vidéo : https://www.youtube.com/embed/abc123
```

### Explication avec PDF
```
Explication : "Consultez le corrigé détaillé..."
PDF : https://example.com/correction-complete.pdf
```

## Notes techniques

### Champs Prisma
```prisma
model QcmQuestion {
  // ... autres champs
  questionImageUrl      String?
  questionPdfUrl        String?
  questionVideoUrl      String?
  explanationImageUrl   String?
  explanationPdfUrl     String?
  explanationVideoUrl   String?
}
```

### API
Les routes API acceptent tous ces champs :
- `POST /api/admin/qcm/[lessonId]`
- `PUT /api/admin/qcm/question/[questionId]`
- `POST /api/admin/qcm-exercise/[exerciseId]`

## Recommandations

1. **Hébergement** : Utilisez un service de stockage fiable (Cloudinary, AWS S3, etc.)
2. **Taille d'images** : Optimisez vos images (max 2MB recommandé)
3. **Vidéos** : Préférez les URLs d'embed plutôt que les liens directs
4. **PDF** : Assurez-vous que les PDFs sont accessibles publiquement
5. **Accessibilité** : Ajoutez toujours un texte d'énoncé même avec des médias

## Dépannage

### L'image ne s'affiche pas
- Vérifiez que l'URL est accessible publiquement
- Vérifiez le format de l'image (JPG, PNG, GIF, WebP)
- Testez l'URL dans un navigateur

### La vidéo ne se charge pas
- Utilisez une URL d'embed, pas une URL de page
- Vérifiez les paramètres de confidentialité de la vidéo
- Pour YouTube : `/embed/VIDEO_ID` et non `/watch?v=VIDEO_ID`

### Le PDF ne s'ouvre pas
- Vérifiez que le PDF est hébergé avec les bons headers CORS
- Testez le lien directement dans un navigateur

