-- =============================================
-- MIGRATION INCRÉMENTALE : BADGES POUR EXERCICES
-- Cette migration ajoute UNIQUEMENT le support des badges
-- (les exercices existent déjà)
-- =============================================

-- 1. Ajouter exerciseId dans la table Performance (si pas déjà fait)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'performances' AND column_name = 'exerciseId'
  ) THEN
    ALTER TABLE performances ADD COLUMN "exerciseId" TEXT;
  END IF;
END $$;

-- 2. Ajouter la contrainte de clé étrangère (si pas déjà fait)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.table_constraints 
    WHERE constraint_name = 'performances_exerciseId_fkey'
  ) THEN
    ALTER TABLE performances
      ADD CONSTRAINT "performances_exerciseId_fkey" 
      FOREIGN KEY ("exerciseId") 
      REFERENCES exercises(id) 
      ON DELETE CASCADE;
  END IF;
END $$;

-- 3. Supprimer l'ancienne contrainte unique (si elle existe)
ALTER TABLE performances
  DROP CONSTRAINT IF EXISTS "performances_userId_lessonId_key";

-- 4. Créer l'index pour exerciseId
CREATE INDEX IF NOT EXISTS "performances_exerciseId_idx" 
  ON performances("exerciseId");

-- 5. Rendre lessonId optionnel (nullable)
DO $$
BEGIN
  ALTER TABLE performances
    ALTER COLUMN "lessonId" DROP NOT NULL;
EXCEPTION
  WHEN others THEN
    NULL; -- Déjà nullable
END $$;

-- 6. Ajouter la contrainte CHECK (si pas déjà fait)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.check_constraints 
    WHERE constraint_name = 'performances_check_entity'
  ) THEN
    ALTER TABLE performances
      ADD CONSTRAINT "performances_check_entity" 
      CHECK (
        ("lessonId" IS NOT NULL AND "exerciseId" IS NULL) 
        OR 
        ("lessonId" IS NULL AND "exerciseId" IS NOT NULL)
      );
  END IF;
END $$;

-- 7. Créer les index uniques conditionnels
CREATE UNIQUE INDEX IF NOT EXISTS "performances_userId_lessonId_unique" 
  ON performances("userId", "lessonId") 
  WHERE "lessonId" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "performances_userId_exerciseId_unique" 
  ON performances("userId", "exerciseId") 
  WHERE "exerciseId" IS NOT NULL;

-- =============================================
-- VÉRIFICATIONS
-- =============================================

SELECT 'exerciseId ajouté dans performances ✅' AS status 
WHERE EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_name = 'performances' AND column_name = 'exerciseId'
);

SELECT 'Index exerciseId créé ✅' AS status
WHERE EXISTS (
  SELECT FROM pg_indexes 
  WHERE tablename = 'performances' AND indexname = 'performances_exerciseId_idx'
);

SELECT 'Contrainte CHECK ajoutée ✅' AS status
WHERE EXISTS (
  SELECT FROM information_schema.check_constraints 
  WHERE constraint_name = 'performances_check_entity'
);

SELECT 'Index unique lessonId créé ✅' AS status
WHERE EXISTS (
  SELECT FROM pg_indexes 
  WHERE tablename = 'performances' AND indexname = 'performances_userId_lessonId_unique'
);

SELECT 'Index unique exerciseId créé ✅' AS status
WHERE EXISTS (
  SELECT FROM pg_indexes 
  WHERE tablename = 'performances' AND indexname = 'performances_userId_exerciseId_unique'
);

-- =============================================
-- ✅ MIGRATION BADGES TERMINÉE !
-- =============================================

