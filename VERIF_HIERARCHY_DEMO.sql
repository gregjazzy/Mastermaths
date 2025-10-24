SELECT 
  c.title AS cours,
  c."isDemoContent" AS cours_demo,
  ch.title AS chapitre,
  ch."isDemoContent" AS chapitre_demo,
  sc.title AS sous_chapitre,
  sc."isDemoContent" AS sous_chapitre_demo,
  l.title AS lecon,
  l."isDemoContent" AS lecon_demo
FROM courses c
LEFT JOIN chapters ch ON ch."courseId" = c.id
LEFT JOIN subchapters sc ON sc."chapterId" = ch.id
LEFT JOIN lessons l ON l."subChapterId" = sc.id
WHERE c."isDemoContent" = true
ORDER BY c.title, ch.title, sc.title, l.title;

