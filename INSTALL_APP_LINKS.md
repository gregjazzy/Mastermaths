# 🔗 Installation : Liens vers Apps Externes

## ✅ **Étape 1 : Migration SQL dans Supabase**

Allez dans **Supabase → SQL Editor** et exécutez :

\`\`\`sql
ALTER TABLE subchapters 
ADD COLUMN IF NOT EXISTS "appUrl" TEXT,
ADD COLUMN IF NOT EXISTS "appTitle" TEXT,
ADD COLUMN IF NOT EXISTS "appDescription" TEXT;

ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS "appTitle" TEXT,
ADD COLUMN IF NOT EXISTS "appDescription" TEXT;
\`\`\`

## ✅ **Étape 2 : Synchroniser Prisma**

Dans le terminal :

\`\`\`bash
npx prisma db pull
npx prisma generate
\`\`\`

## ✅ **Étape 3 : Testez !**

Allez dans **/admin/subchapters** et créez/éditez un sous-chapitre.

Vous verrez maintenant une nouvelle section bleue :
**"🔗 Lien vers une application externe"**

Remplissez :
- **URL** : https://www.geogebra.org/calculator
- **Titre** : GeoGebra Calculator  
- **Description** : Outil interactif pour visualiser les fonctions

---

## 📝 **Prochaines étapes** (à faire après)

1. Afficher le bouton dans l'interface élève
2. Ajouter la même chose pour les Leçons (formulaire admin)
3. Styling du bouton externe

**Dites-moi quand vous avez fait les étapes 1 et 2 !** 🚀
