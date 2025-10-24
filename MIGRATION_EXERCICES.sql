-- =============================================
-- MIGRATION : CRÉATION TABLE EXERCISES
-- Master Maths - Architecture hiérarchique propre
-- =============================================
--
-- ARCHITECTURE FINALE :
-- Course → Chapter → SubChapter → Lesson (cours vidéo)
--                                    └─ Exercise (exercice)
--                                        └─ QCM de l'exercice
-- 
-- Les QCM peuvent être rattachés soit à une Lesson, soit à un Exercise
--
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

-- 5. Créer les index pour performances
CREATE INDEX IF NOT EXISTS "exercises_lessonId_idx" ON exercises("lessonId");
CREATE INDEX IF NOT EXISTS "qcm_questions_exerciseId_idx" ON qcm_questions("exerciseId");

-- =============================================
-- VÉRIFICATIONS
-- =============================================

-- Vérifier que la table exercises existe
SELECT 'Table exercises créée ✅' AS status 
WHERE EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'exercises'
);

-- Vérifier que qcm_questions supporte les 2 cas
SELECT 'QCM questions mises à jour ✅' AS status
WHERE EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_name = 'qcm_questions' 
  AND column_name = 'exerciseId'
);

-- =============================================
-- ✅ MIGRATION TERMINÉE !
-- =============================================
-- 
-- PROCHAINES ÉTAPES :
-- 1. Exécuter ce SQL dans Supabase SQL Editor
-- 2. Mettre à jour le schéma Prisma
-- 3. Adapter l'interface admin
-- 4. Adapter l'affichage élève
-- 
-- =============================================

