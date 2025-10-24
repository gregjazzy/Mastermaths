SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name IN ('courses', 'chapters', 'subchapters', 'lessons', 'exercises')
  AND column_name = 'isDemoContent'
ORDER BY table_name;

SELECT 
  id,
  title,
  "isDemoContent",
  "subChapterId",
  type,
  "contentUrl"
FROM lessons
WHERE id = 'cmh5ddlbs000bwrd8phnehbn9';

SELECT 
  c.id AS course_id,
  c.title AS course_title,
  c."isDemoContent" AS course_demo,
  ch.id AS chapter_id,
  ch.title AS chapter_title,
  ch."isDemoContent" AS chapter_demo,
  sc.id AS subchapter_id,
  sc.title AS subchapter_title,
  sc."isDemoContent" AS subchapter_demo,
  l.id AS lesson_id,
  l.title AS lesson_title,
  l."isDemoContent" AS lesson_demo
FROM lessons l
JOIN subchapters sc ON l."subChapterId" = sc.id
JOIN chapters ch ON sc."chapterId" = ch.id
JOIN courses c ON ch."courseId" = c.id
WHERE l.id = 'cmh5ddlbs000bwrd8phnehbn9';

SELECT 
  COUNT(*) AS total_lessons,
  COUNT(*) FILTER (WHERE "isDemoContent" = true) AS demo_lessons,
  COUNT(*) FILTER (WHERE "isDemoContent" = false) AS non_demo_lessons
FROM lessons;

SELECT EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_name = 'lessons' 
  AND column_name = 'isDemoContent'
) AS column_exists;


