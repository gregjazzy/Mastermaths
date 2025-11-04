-- 1. Vérifier combien de cours existent
SELECT 
  COUNT(*) as "Nombre total de cours"
FROM courses;

-- 2. Liste détaillée des cours
SELECT 
  id,
  title,
  "isDemoContent",
  "order",
  "createdAt"
FROM courses
ORDER BY "order";

-- 3. Vérifier les chapitres par cours
SELECT 
  c.title as "Cours",
  COUNT(ch.id) as "Nombre de chapitres"
FROM courses c
LEFT JOIN chapters ch ON ch."courseId" = c.id
GROUP BY c.id, c.title
ORDER BY c."order";

