-- Vérifier les questions QCM pour la leçon "Résolution d'équation"
-- Exécuter dans Supabase SQL Editor

-- 1. Trouver la leçon
SELECT 
  l.id as lesson_id,
  l.title as lecon,
  l.type as type_lecon,
  sc.title as sous_chapitre,
  ch.title as chapitre,
  c.title as cours
FROM lessons l
JOIN subchapters sc ON l."subChapterId" = sc.id
JOIN chapters ch ON sc."chapterId" = ch.id
JOIN courses c ON ch."courseId" = c.id
WHERE l.title ILIKE '%résolution%équation%'
   OR l.title ILIKE '%equation%';

-- 2. Vérifier les questions QCM pour cette leçon
SELECT 
  q.id,
  q.question,
  q.options,
  q."correctAnswer",
  q."lessonId",
  q."exerciseId",
  q."order"
FROM qcm_questions q
WHERE q."lessonId" IN (
  SELECT id FROM lessons WHERE title ILIKE '%résolution%'
);

-- 3. Compter les questions par leçon
SELECT 
  l.title as lecon,
  COUNT(q.id) as nb_questions
FROM lessons l
LEFT JOIN qcm_questions q ON q."lessonId" = l.id
WHERE l.title ILIKE '%résolution%'
GROUP BY l.id, l.title;

