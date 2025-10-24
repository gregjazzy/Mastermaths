UPDATE subchapters 
SET "isDemoContent" = true 
WHERE "chapterId" IN (
  SELECT ch.id 
  FROM chapters ch
  JOIN courses c ON ch."courseId" = c.id
  WHERE c."isDemoContent" = true
);

UPDATE lessons 
SET "isDemoContent" = true 
WHERE "subChapterId" IN (
  SELECT sc.id 
  FROM subchapters sc
  JOIN chapters ch ON sc."chapterId" = ch.id
  JOIN courses c ON ch."courseId" = c.id
  WHERE c."isDemoContent" = true
);

UPDATE exercises 
SET "isDemoContent" = true 
WHERE "lessonId" IN (
  SELECT l.id
  FROM lessons l
  JOIN subchapters sc ON l."subChapterId" = sc.id
  JOIN chapters ch ON sc."chapterId" = ch.id
  JOIN courses c ON ch."courseId" = c.id
  WHERE c."isDemoContent" = true
);

SELECT 'Sous-chapitres mis à jour ✅' AS status, COUNT(*) AS total FROM subchapters WHERE "isDemoContent" = true;
SELECT 'Leçons mises à jour ✅' AS status, COUNT(*) AS total FROM lessons WHERE "isDemoContent" = true;
SELECT 'Exercices mis à jour ✅' AS status, COUNT(*) AS total FROM exercises WHERE "isDemoContent" = true;

