-- Script pour vérifier la hiérarchie complète
-- Copier-coller dans Supabase SQL Editor

-- 1. Vérifier les cours
SELECT COUNT(*) as nb_cours FROM courses;

-- 2. Vérifier les chapitres
SELECT COUNT(*) as nb_chapitres FROM chapters;

-- 3. Vérifier les sous-chapitres
SELECT COUNT(*) as nb_sous_chapitres FROM subchapters;

-- 4. Vérifier les leçons
SELECT COUNT(*) as nb_lecons FROM lessons;

-- 5. Afficher la hiérarchie complète
SELECT 
  c.title as cours,
  ch.title as chapitre,
  sc.title as sous_chapitre,
  l.title as lecon,
  l.type as type_lecon
FROM courses c
LEFT JOIN chapters ch ON ch."courseId" = c.id
LEFT JOIN subchapters sc ON sc."chapterId" = ch.id
LEFT JOIN lessons l ON l."subChapterId" = sc.id
ORDER BY c."order", ch."order", sc."order", l."order"
LIMIT 50;

