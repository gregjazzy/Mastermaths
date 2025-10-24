-- =============================================
-- VÉRIFICATION DU CONTENU CRÉÉ
-- =============================================

-- 1. Vérifier les cours
SELECT 
  id,
  title,
  "isDemoContent",
  "order",
  "createdAt"
FROM courses
ORDER BY "order" ASC;

-- 2. Vérifier les chapitres
SELECT 
  c.title AS course_title,
  ch.title AS chapter_title,
  ch."order",
  ch."createdAt"
FROM chapters ch
JOIN courses c ON ch."courseId" = c.id
ORDER BY c."order", ch."order";

-- 3. Vérifier les sous-chapitres
SELECT 
  c.title AS course_title,
  ch.title AS chapter_title,
  sc.title AS subchapter_title,
  sc."order",
  sc."createdAt"
FROM subchapters sc
JOIN chapters ch ON sc."chapterId" = ch.id
JOIN courses c ON ch."courseId" = c.id
ORDER BY c."order", ch."order", sc."order";

-- 4. Vérifier les leçons
SELECT 
  c.title AS course_title,
  ch.title AS chapter_title,
  sc.title AS subchapter_title,
  l.title AS lesson_title,
  l.type,
  l."order",
  l."createdAt"
FROM lessons l
JOIN subchapters sc ON l."subChapterId" = sc.id
JOIN chapters ch ON sc."chapterId" = ch.id
JOIN courses c ON ch."courseId" = c.id
ORDER BY c."order", ch."order", sc."order", l."order";

-- 5. Vérifier les utilisateurs
SELECT 
  email,
  name,
  status,
  "createdAt"
FROM users
ORDER BY "createdAt" DESC;

-- =============================================
-- ✅ Ce qui devrait apparaître :
-- - Au moins 1 cours avec isDemoContent = true
-- - Des chapitres, sous-chapitres et leçons associés
-- - Les utilisateurs avec status DEMO ou PREMIUM
-- =============================================

