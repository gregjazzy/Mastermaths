-- =============================================
-- MIGRATION : Contrôle Granulaire isDemoContent
-- =============================================
-- Ajoute le champ isDemoContent à tous les niveaux
-- pour permettre un contrôle d'accès granulaire
-- =============================================

-- 1. Ajouter isDemoContent aux chapitres
ALTER TABLE chapters
  ADD COLUMN IF NOT EXISTS "isDemoContent" BOOLEAN NOT NULL DEFAULT false;

-- 2. Ajouter isDemoContent aux sous-chapitres
ALTER TABLE subchapters
  ADD COLUMN IF NOT EXISTS "isDemoContent" BOOLEAN NOT NULL DEFAULT false;

-- 3. Ajouter isDemoContent aux leçons
ALTER TABLE lessons
  ADD COLUMN IF NOT EXISTS "isDemoContent" BOOLEAN NOT NULL DEFAULT false;

-- 4. Ajouter isDemoContent aux exercices
ALTER TABLE exercises
  ADD COLUMN IF NOT EXISTS "isDemoContent" BOOLEAN NOT NULL DEFAULT false;

-- 5. Mettre à jour le contenu existant du cours "Les Maths en Première"
-- Marquer tout le contenu comme DEMO automatiquement

-- Récupérer l'ID du cours "Les Maths en Première"
DO $$
DECLARE
  demo_course_id TEXT;
BEGIN
  SELECT id INTO demo_course_id
  FROM courses
  WHERE "isDemoContent" = true
  LIMIT 1;

  IF demo_course_id IS NOT NULL THEN
    -- Mettre à jour tous les chapitres de ce cours
    UPDATE chapters
    SET "isDemoContent" = true
    WHERE "courseId" = demo_course_id;

    -- Mettre à jour tous les sous-chapitres de ces chapitres
    UPDATE subchapters
    SET "isDemoContent" = true
    WHERE "chapterId" IN (
      SELECT id FROM chapters WHERE "courseId" = demo_course_id
    );

    -- Mettre à jour toutes les leçons de ces sous-chapitres
    UPDATE lessons
    SET "isDemoContent" = true
    WHERE "subChapterId" IN (
      SELECT sc.id 
      FROM subchapters sc
      JOIN chapters ch ON sc."chapterId" = ch.id
      WHERE ch."courseId" = demo_course_id
    );

    -- Mettre à jour tous les exercices de ces leçons
    UPDATE exercises
    SET "isDemoContent" = true
    WHERE "lessonId" IN (
      SELECT l.id
      FROM lessons l
      JOIN subchapters sc ON l."subChapterId" = sc.id
      JOIN chapters ch ON sc."chapterId" = ch.id
      WHERE ch."courseId" = demo_course_id
    );

    RAISE NOTICE 'Contenu DEMO mis à jour pour le cours %', demo_course_id;
  END IF;
END $$;

-- =============================================
-- VÉRIFICATIONS
-- =============================================

SELECT 'Champ isDemoContent ajouté aux chapters ✅' AS status
WHERE EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_name = 'chapters' AND column_name = 'isDemoContent'
);

SELECT 'Champ isDemoContent ajouté aux subchapters ✅' AS status
WHERE EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_name = 'subchapters' AND column_name = 'isDemoContent'
);

SELECT 'Champ isDemoContent ajouté aux lessons ✅' AS status
WHERE EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_name = 'lessons' AND column_name = 'isDemoContent'
);

SELECT 'Champ isDemoContent ajouté aux exercises ✅' AS status
WHERE EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_name = 'exercises' AND column_name = 'isDemoContent'
);

-- Afficher le résumé du contenu DEMO
SELECT 
  'Cours DEMO' AS type,
  COUNT(*) AS total,
  SUM(CASE WHEN "isDemoContent" THEN 1 ELSE 0 END) AS demo_content
FROM courses
UNION ALL
SELECT 
  'Chapitres DEMO' AS type,
  COUNT(*) AS total,
  SUM(CASE WHEN "isDemoContent" THEN 1 ELSE 0 END) AS demo_content
FROM chapters
UNION ALL
SELECT 
  'Sous-chapitres DEMO' AS type,
  COUNT(*) AS total,
  SUM(CASE WHEN "isDemoContent" THEN 1 ELSE 0 END) AS demo_content
FROM subchapters
UNION ALL
SELECT 
  'Leçons DEMO' AS type,
  COUNT(*) AS total,
  SUM(CASE WHEN "isDemoContent" THEN 1 ELSE 0 END) AS demo_content
FROM lessons
UNION ALL
SELECT 
  'Exercices DEMO' AS type,
  COUNT(*) AS total,
  SUM(CASE WHEN "isDemoContent" THEN 1 ELSE 0 END) AS demo_content
FROM exercises;

-- =============================================
-- ✅ MIGRATION TERMINÉE !
-- =============================================
-- Maintenant vous pouvez contrôler l'accès DEMO
-- à chaque niveau :
-- - Cours
-- - Chapitre
-- - Sous-chapitre
-- - Leçon
-- - Exercice
-- =============================================

