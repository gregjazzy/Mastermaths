ALTER TABLE chapters ADD COLUMN IF NOT EXISTS "isDemoContent" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE subchapters ADD COLUMN IF NOT EXISTS "isDemoContent" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS "isDemoContent" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS "isDemoContent" BOOLEAN NOT NULL DEFAULT false;

DO $$
DECLARE
  demo_course_id TEXT;
BEGIN
  SELECT id INTO demo_course_id FROM courses WHERE "isDemoContent" = true LIMIT 1;
  IF demo_course_id IS NOT NULL THEN
    UPDATE chapters SET "isDemoContent" = true WHERE "courseId" = demo_course_id;
    UPDATE subchapters SET "isDemoContent" = true WHERE "chapterId" IN (SELECT id FROM chapters WHERE "courseId" = demo_course_id);
    UPDATE lessons SET "isDemoContent" = true WHERE "subChapterId" IN (SELECT sc.id FROM subchapters sc JOIN chapters ch ON sc."chapterId" = ch.id WHERE ch."courseId" = demo_course_id);
    UPDATE exercises SET "isDemoContent" = true WHERE "lessonId" IN (SELECT l.id FROM lessons l JOIN subchapters sc ON l."subChapterId" = sc.id JOIN chapters ch ON sc."chapterId" = ch.id WHERE ch."courseId" = demo_course_id);
  END IF;
END $$;

SELECT 'Champ isDemoContent ajouté aux chapters ✅' AS status WHERE EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'chapters' AND column_name = 'isDemoContent');
SELECT 'Champ isDemoContent ajouté aux subchapters ✅' AS status WHERE EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'subchapters' AND column_name = 'isDemoContent');
SELECT 'Champ isDemoContent ajouté aux lessons ✅' AS status WHERE EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'isDemoContent');
SELECT 'Champ isDemoContent ajouté aux exercises ✅' AS status WHERE EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'exercises' AND column_name = 'isDemoContent');

SELECT 'Cours DEMO' AS type, COUNT(*) AS total, SUM(CASE WHEN "isDemoContent" THEN 1 ELSE 0 END) AS demo_content FROM courses
UNION ALL SELECT 'Chapitres DEMO' AS type, COUNT(*) AS total, SUM(CASE WHEN "isDemoContent" THEN 1 ELSE 0 END) AS demo_content FROM chapters
UNION ALL SELECT 'Sous-chapitres DEMO' AS type, COUNT(*) AS total, SUM(CASE WHEN "isDemoContent" THEN 1 ELSE 0 END) AS demo_content FROM subchapters
UNION ALL SELECT 'Leçons DEMO' AS type, COUNT(*) AS total, SUM(CASE WHEN "isDemoContent" THEN 1 ELSE 0 END) AS demo_content FROM lessons
UNION ALL SELECT 'Exercices DEMO' AS type, COUNT(*) AS total, SUM(CASE WHEN "isDemoContent" THEN 1 ELSE 0 END) AS demo_content FROM exercises;

