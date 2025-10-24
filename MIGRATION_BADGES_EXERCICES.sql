-- =============================================
-- MIGRATION : Support des Badges d'Exercices
-- =============================================
-- Cette migration ajoute le support des badges
-- et performances pour les exercices.
-- =============================================

-- 1. Ajouter exerciseId dans la table Performance
-- -------------------------------------------------
ALTER TABLE performances
  ADD COLUMN IF NOT EXISTS "exerciseId" TEXT;

-- 2. Ajouter la contrainte de clé étrangère
-- -------------------------------------------------
ALTER TABLE performances
  ADD CONSTRAINT "performances_exerciseId_fkey" 
    FOREIGN KEY ("exerciseId") 
    REFERENCES exercises(id) 
    ON DELETE CASCADE;

-- 3. Modifier la contrainte unique pour supporter les deux types
-- -------------------------------------------------
-- On ne peut plus avoir @@unique([userId, lessonId])
-- car on veut pouvoir tracker performances de leçon ET d'exercice

-- D'abord, supprimer l'ancienne contrainte unique
ALTER TABLE performances
  DROP CONSTRAINT IF EXISTS "performances_userId_lessonId_key";

-- 4. Ajouter un index pour les performances d'exercices
-- -------------------------------------------------
CREATE INDEX IF NOT EXISTS "performances_exerciseId_idx" 
  ON performances("exerciseId");

-- 5. Rendre lessonId optionnel (nullable)
-- -------------------------------------------------
-- Maintenant une performance peut être soit pour une leçon, soit pour un exercice
ALTER TABLE performances
  ALTER COLUMN "lessonId" DROP NOT NULL;

-- 6. Ajouter une contrainte CHECK pour s'assurer qu'on a soit lessonId soit exerciseId
-- -------------------------------------------------
ALTER TABLE performances
  ADD CONSTRAINT "performances_check_entity" 
  CHECK (
    ("lessonId" IS NOT NULL AND "exerciseId" IS NULL) 
    OR 
    ("lessonId" IS NULL AND "exerciseId" IS NOT NULL)
  );

-- 7. Ajouter une contrainte unique composite pour éviter les doublons
-- -------------------------------------------------
-- Un utilisateur ne peut avoir qu'une seule performance par leçon
-- Un utilisateur ne peut avoir qu'une seule performance par exercice
CREATE UNIQUE INDEX IF NOT EXISTS "performances_userId_lessonId_unique" 
  ON performances("userId", "lessonId") 
  WHERE "lessonId" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "performances_userId_exerciseId_unique" 
  ON performances("userId", "exerciseId") 
  WHERE "exerciseId" IS NOT NULL;

-- Note : Pour Prisma, on utilise une approche différente
-- On ne peut pas utiliser @@unique avec WHERE en Prisma
-- Donc on va gérer ça avec des index conditionnels en SQL
-- et un upsert custom dans le code

-- 8. Ajouter le type EXERCISE dans MasteryBadge
-- -------------------------------------------------
-- Note : La colonne `type` est déjà TEXT, donc pas de modification nécessaire
-- Les valeurs acceptées sont maintenant : 'LESSON', 'EXERCISE', 'CHAPTER', 'COURSE'

-- =============================================
-- VÉRIFICATIONS
-- =============================================

SELECT 'Column exerciseId ajoutée ✅' AS status 
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

-- =============================================
-- INSTRUCTIONS
-- =============================================
-- 1. Copiez ce code
-- 2. Allez dans Supabase → SQL Editor
-- 3. Collez et exécutez
-- 4. Vérifiez les messages de confirmation
-- 5. Ensuite, exécutez : npx prisma db pull
-- 6. Puis : npx prisma generate
-- =============================================

