-- Migration pour ajouter des champs de liens externes

-- 1. Ajouter des champs pour les liens d'applications dans SubChapter
ALTER TABLE subchapters 
ADD COLUMN IF NOT EXISTS "appUrl" TEXT,
ADD COLUMN IF NOT EXISTS "appTitle" TEXT,
ADD COLUMN IF NOT EXISTS "appDescription" TEXT;

-- 2. Ajouter un champ pour le titre/description du lien dans Lesson (contentUrl existe déjà)
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS "appTitle" TEXT,
ADD COLUMN IF NOT EXISTS "appDescription" TEXT;

-- 3. Index pour performance
CREATE INDEX IF NOT EXISTS "subchapters_appUrl_idx" ON subchapters("appUrl") WHERE "appUrl" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "lessons_contentUrl_idx" ON lessons("contentUrl") WHERE "contentUrl" IS NOT NULL;

-- Exemple d'utilisation :
-- UPDATE subchapters SET 
--   "appUrl" = 'https://www.geogebra.org/calculator',
--   "appTitle" = 'GeoGebra Calculator',
--   "appDescription" = 'Calculatrice graphique interactive'
-- WHERE id = 'your-subchapter-id';

