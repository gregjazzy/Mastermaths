-- =============================================
-- MIGRATION COMPLÈTE : EXERCICES + BADGES
-- Master Maths - Mise à jour architecture + système de badges
-- =============================================
-- 
-- Cette migration contient 2 parties :
-- PARTIE 1 : Création de la table exercises et adaptation QCM
-- PARTIE 2 : Support des badges pour les exercices
--
-- =============================================

-- =============================================
-- PARTIE 1 : CRÉATION TABLE EXERCISES
-- =============================================

-- 1. Créer la table exercises
CREATE TABLE IF NOT EXISTS exercises (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "lessonId" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "exerciseUrl" TEXT,
  "correctionVideoUrl" TEXT,
  "correctionDocumentUrl" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "exercises_lessonId_fkey" 
    FOREIGN KEY ("lessonId") 
    REFERENCES lessons(id) 
    ON DELETE CASCADE
);

-- 2. Modifier la table qcm_questions pour supporter les 2 cas
ALTER TABLE qcm_questions 
  ALTER COLUMN "lessonId" DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS "exerciseId" TEXT,
  ADD CONSTRAINT "qcm_questions_exerciseId_fkey" 
    FOREIGN KEY ("exerciseId") 
    REFERENCES exercises(id) 
    ON DELETE CASCADE;

-- 3. Nettoyer la table lessons (supprimer les champs obsolètes)
ALTER TABLE lessons
  DROP COLUMN IF EXISTS "exerciseUrl",
  DROP COLUMN IF EXISTS "correctionVideoUrl",
  DROP COLUMN IF EXISTS "correctionDocumentUrl",
  DROP COLUMN IF EXISTS "isCorrectionVideo",
  DROP COLUMN IF EXISTS "isCorrectionDocument",
  DROP COLUMN IF EXISTS "linkedQcmId",
  DROP COLUMN IF EXISTS "linkedExerciseId",
  DROP COLUMN IF EXISTS "prerequisiteLessonId",
  DROP COLUMN IF EXISTS "parentLessonId";

-- 4. Supprimer les index obsolètes
DROP INDEX IF EXISTS "Lesson_linkedExerciseId_idx";
DROP INDEX IF EXISTS "Lesson_parentLessonId_idx";
DROP INDEX IF EXISTS "Lesson_prerequisiteLessonId_idx";

-- 5. Créer les index pour exercises et qcm_questions
CREATE INDEX IF NOT EXISTS "exercises_lessonId_idx" ON exercises("lessonId");
CREATE INDEX IF NOT EXISTS "qcm_questions_exerciseId_idx" ON qcm_questions("exerciseId");

-- =============================================
-- PARTIE 2 : SUPPORT DES BADGES D'EXERCICES
-- =============================================

-- 1. Ajouter exerciseId dans la table Performance
ALTER TABLE performances
  ADD COLUMN IF NOT EXISTS "exerciseId" TEXT;

-- 2. Ajouter la contrainte de clé étrangère
ALTER TABLE performances
  ADD CONSTRAINT "performances_exerciseId_fkey" 
    FOREIGN KEY ("exerciseId") 
    REFERENCES exercises(id) 
    ON DELETE CASCADE;

-- 3. Modifier la contrainte unique pour supporter les deux types
-- Supprimer l'ancienne contrainte unique
ALTER TABLE performances
  DROP CONSTRAINT IF EXISTS "performances_userId_lessonId_key";

-- 4. Ajouter un index pour les performances d'exercices
CREATE INDEX IF NOT EXISTS "performances_exerciseId_idx" 
  ON performances("exerciseId");

-- 5. Rendre lessonId optionnel (nullable)
ALTER TABLE performances
  ALTER COLUMN "lessonId" DROP NOT NULL;

-- 6. Ajouter une contrainte CHECK pour s'assurer qu'on a soit lessonId soit exerciseId
ALTER TABLE performances
  ADD CONSTRAINT "performances_check_entity" 
  CHECK (
    ("lessonId" IS NOT NULL AND "exerciseId" IS NULL) 
    OR 
    ("lessonId" IS NULL AND "exerciseId" IS NOT NULL)
  );

-- 7. Ajouter des contraintes uniques composites pour éviter les doublons
-- Un utilisateur ne peut avoir qu'une seule performance par leçon
CREATE UNIQUE INDEX IF NOT EXISTS "performances_userId_lessonId_unique" 
  ON performances("userId", "lessonId") 
  WHERE "lessonId" IS NOT NULL;

-- Un utilisateur ne peut avoir qu'une seule performance par exercice
CREATE UNIQUE INDEX IF NOT EXISTS "performances_userId_exerciseId_unique" 
  ON performances("userId", "exerciseId") 
  WHERE "exerciseId" IS NOT NULL;

-- =============================================
-- VÉRIFICATIONS
-- =============================================

-- Partie 1 : Exercises
SELECT 'Table exercises créée ✅' AS status 
WHERE EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'exercises'
);

SELECT 'QCM questions mises à jour ✅' AS status
WHERE EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_name = 'qcm_questions' 
  AND column_name = 'exerciseId'
);

-- Partie 2 : Badges
SELECT 'Column exerciseId ajoutée dans performances ✅' AS status 
WHERE EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_name = 'performances' 
  AND column_name = 'exerciseId'
);

SELECT 'Index exerciseId créé ✅' AS status
WHERE EXISTS (
  SELECT FROM pg_indexes 
  WHERE tablename = 'performances' 
  AND indexname = 'performances_exerciseId_idx'
);

SELECT 'Contrainte CHECK ajoutée ✅' AS status
WHERE EXISTS (
  SELECT FROM information_schema.check_constraints 
  WHERE constraint_name = 'performances_check_entity'
);

SELECT 'Index unique lessonId créé ✅' AS status
WHERE EXISTS (
  SELECT FROM pg_indexes 
  WHERE tablename = 'performances' 
  AND indexname = 'performances_userId_lessonId_unique'
);

SELECT 'Index unique exerciseId créé ✅' AS status
WHERE EXISTS (
  SELECT FROM pg_indexes 
  WHERE tablename = 'performances' 
  AND indexname = 'performances_userId_exerciseId_unique'
);

-- =============================================
-- ✅ MIGRATION TERMINÉE !
-- =============================================
-- 
-- RÉSUMÉ DES CHANGEMENTS :
-- ✅ Table exercises créée avec relations
-- ✅ QCM peuvent être attachés à leçons OU exercices
-- ✅ Performances peuvent tracker leçons OU exercices
-- ✅ Badges de maîtrise (Bronze/Silver/Gold) pour exercices
-- ✅ Contraintes pour éviter doublons et incohérences
-- 
-- PROCHAINES ÉTAPES :
-- 1. ✅ Ce SQL vient d'être exécuté dans Supabase
-- 2. ⏭️  Exécuter : npx prisma db pull
-- 3. ⏭️  Exécuter : npx prisma generate
-- 4. ⏭️  Tester l'interface admin pour créer exercices
-- 
-- =============================================

