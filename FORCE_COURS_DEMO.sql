-- Forcer TOUT le contenu d'un cours à être DEMO
-- Remplacez 'Maths Première' par le titre exact de votre cours

DO $$
DECLARE
  demo_course_id TEXT;
BEGIN
  -- Trouver le cours "Maths Première" (ou celui que vous voulez)
  SELECT id INTO demo_course_id 
  FROM courses 
  WHERE title ILIKE '%première%' OR title ILIKE '%premiere%'
  LIMIT 1;

  IF demo_course_id IS NOT NULL THEN
    -- Marquer le COURS comme DEMO
    UPDATE courses 
    SET "isDemoContent" = true 
    WHERE id = demo_course_id;

    -- Marquer TOUS les CHAPITRES comme DEMO
    UPDATE chapters 
    SET "isDemoContent" = true 
    WHERE "courseId" = demo_course_id;

    -- Marquer TOUS les SOUS-CHAPITRES comme DEMO
    UPDATE subchapters 
    SET "isDemoContent" = true 
    WHERE "chapterId" IN (
      SELECT id FROM chapters WHERE "courseId" = demo_course_id
    );

    -- Marquer TOUTES les LEÇONS comme DEMO
    UPDATE lessons 
    SET "isDemoContent" = true 
    WHERE "subChapterId" IN (
      SELECT sc.id 
      FROM subchapters sc
      JOIN chapters ch ON sc."chapterId" = ch.id
      WHERE ch."courseId" = demo_course_id
    );

    -- Marquer TOUS les EXERCICES comme DEMO
    UPDATE exercises 
    SET "isDemoContent" = true 
    WHERE "lessonId" IN (
      SELECT l.id
      FROM lessons l
      JOIN subchapters sc ON l."subChapterId" = sc.id
      JOIN chapters ch ON sc."chapterId" = ch.id
      WHERE ch."courseId" = demo_course_id
    );

    RAISE NOTICE 'Tout le contenu du cours % est maintenant DEMO ✅', demo_course_id;
  ELSE
    RAISE NOTICE 'Aucun cours trouvé avec "Première" dans le titre ❌';
  END IF;
END $$;

-- Vérification
SELECT 
  'Cours' AS niveau,
  COUNT(*) AS total,
  SUM(CASE WHEN "isDemoContent" THEN 1 ELSE 0 END) AS demo
FROM courses
WHERE title ILIKE '%première%' OR title ILIKE '%premiere%'
UNION ALL
SELECT 
  'Chapitres' AS niveau,
  COUNT(*) AS total,
  SUM(CASE WHEN ch."isDemoContent" THEN 1 ELSE 0 END) AS demo
FROM chapters ch
JOIN courses c ON ch."courseId" = c.id
WHERE c.title ILIKE '%première%' OR c.title ILIKE '%premiere%'
UNION ALL
SELECT 
  'Sous-chapitres' AS niveau,
  COUNT(*) AS total,
  SUM(CASE WHEN sc."isDemoContent" THEN 1 ELSE 0 END) AS demo
FROM subchapters sc
JOIN chapters ch ON sc."chapterId" = ch.id
JOIN courses c ON ch."courseId" = c.id
WHERE c.title ILIKE '%première%' OR c.title ILIKE '%premiere%'
UNION ALL
SELECT 
  'Leçons' AS niveau,
  COUNT(*) AS total,
  SUM(CASE WHEN l."isDemoContent" THEN 1 ELSE 0 END) AS demo
FROM lessons l
JOIN subchapters sc ON l."subChapterId" = sc.id
JOIN chapters ch ON sc."chapterId" = ch.id
JOIN courses c ON ch."courseId" = c.id
WHERE c.title ILIKE '%première%' OR c.title ILIKE '%premiere%'
UNION ALL
SELECT 
  'Exercices' AS niveau,
  COUNT(*) AS total,
  SUM(CASE WHEN e."isDemoContent" THEN 1 ELSE 0 END) AS demo
FROM exercises e
JOIN lessons l ON e."lessonId" = l.id
JOIN subchapters sc ON l."subChapterId" = sc.id
JOIN chapters ch ON sc."chapterId" = ch.id
JOIN courses c ON ch."courseId" = c.id
WHERE c.title ILIKE '%première%' OR c.title ILIKE '%premiere%';

