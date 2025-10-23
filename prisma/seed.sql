-- Script de peuplement pour Master Maths
-- À exécuter après la création de la base de données

-- Créer un cours de démonstration
INSERT INTO courses (id, title, description, "order", "isDemoContent", "createdAt", "updatedAt")
VALUES 
  ('demo-course-1', 'Algèbre Fondamentale (DÉMO)', 'Découvrez les bases de l''algèbre avec ce cours complet de démonstration', 0, true, NOW(), NOW());

-- Créer des chapitres
INSERT INTO chapters (id, title, description, "order", "courseId", "createdAt", "updatedAt")
VALUES
  ('chapter-1', 'Introduction à l''algèbre', 'Découvrir les concepts de base', 0, 'demo-course-1', NOW(), NOW()),
  ('chapter-2', 'Équations du premier degré', 'Résoudre des équations simples', 1, 'demo-course-1', NOW(), NOW());

-- Créer des sous-chapitres
INSERT INTO subchapters (id, title, description, "order", "chapterId", "createdAt", "updatedAt")
VALUES
  ('subchapter-1', 'Les nombres et opérations', 'Maîtriser les opérations de base', 0, 'chapter-1', NOW(), NOW()),
  ('subchapter-2', 'Variables et expressions', 'Comprendre les variables', 1, 'chapter-1', NOW(), NOW()),
  ('subchapter-3', 'Résolution d''équations simples', 'Techniques de résolution', 0, 'chapter-2', NOW(), NOW());

-- Créer des leçons
INSERT INTO lessons (id, title, "subChapterId", type, "contentUrl", "isCorrectionVideo", "linkedQcmId", "order", "createdAt", "updatedAt")
VALUES
  -- Sous-chapitre 1
  ('lesson-1', 'Vidéo : Les opérations arithmétiques', 'subchapter-1', 'VIDEO_COURS', 'https://vimeo.com/123456789', false, NULL, 0, NOW(), NOW()),
  ('lesson-2', 'QCM : Test sur les opérations', 'subchapter-1', 'QCM', NULL, false, NULL, 1, NOW(), NOW()),
  ('lesson-3', 'Vidéo correction : Opérations arithmétiques', 'subchapter-1', 'CORRECTION_VIDEO', 'https://vimeo.com/987654321', true, 'lesson-2', 2, NOW(), NOW()),
  ('lesson-4', 'Exercices écrits', 'subchapter-1', 'EXO_ECRIT', 'https://example.com/exercices.pdf', false, NULL, 3, NOW(), NOW()),
  
  -- Sous-chapitre 2
  ('lesson-5', 'Vidéo : Introduction aux variables', 'subchapter-2', 'VIDEO_COURS', 'https://vimeo.com/111222333', false, NULL, 0, NOW(), NOW()),
  ('lesson-6', 'QCM : Variables et expressions', 'subchapter-2', 'QCM', NULL, false, NULL, 1, NOW(), NOW()),
  
  -- Sous-chapitre 3
  ('lesson-7', 'Vidéo : Résoudre une équation simple', 'subchapter-3', 'VIDEO_COURS', 'https://vimeo.com/444555666', false, NULL, 0, NOW(), NOW()),
  ('lesson-8', 'Méthode : Étapes de résolution', 'subchapter-3', 'METHODE', 'https://example.com/methode.pdf', false, NULL, 1, NOW(), NOW());

-- Créer des questions QCM pour lesson-2
INSERT INTO qcm_questions (id, "lessonId", question, options, "correctAnswer", explanation, "order", "createdAt", "updatedAt")
VALUES
  ('qcm-1', 'lesson-2', 'Combien font 7 + 8 ?', ARRAY['13', '14', '15', '16'], 2, '7 + 8 = 15', 0, NOW(), NOW()),
  ('qcm-2', 'lesson-2', 'Combien font 12 × 5 ?', ARRAY['50', '55', '60', '65'], 2, '12 × 5 = 60', 1, NOW(), NOW()),
  ('qcm-3', 'lesson-2', 'Combien font 100 ÷ 4 ?', ARRAY['20', '25', '30', '35'], 1, '100 ÷ 4 = 25', 2, NOW(), NOW());

-- Créer des questions QCM pour lesson-6
INSERT INTO qcm_questions (id, "lessonId", question, options, "correctAnswer", explanation, "order", "createdAt", "updatedAt")
VALUES
  ('qcm-4', 'lesson-6', 'Quelle est la valeur de x dans : x + 5 = 12 ?', ARRAY['5', '6', '7', '8'], 2, 'x = 12 - 5 = 7', 0, NOW(), NOW()),
  ('qcm-5', 'lesson-6', 'Si y = 3, que vaut 2y + 4 ?', ARRAY['8', '9', '10', '11'], 2, '2(3) + 4 = 6 + 4 = 10', 1, NOW(), NOW());

-- Créer un cours Premium (verrouillé pour DEMO et FREE)
INSERT INTO courses (id, title, description, "order", "isDemoContent", "createdAt", "updatedAt")
VALUES 
  ('premium-course-1', 'Géométrie Avancée', 'Maîtrisez la géométrie euclidienne et analytique', 1, false, NOW(), NOW());

INSERT INTO chapters (id, title, description, "order", "courseId", "createdAt", "updatedAt")
VALUES
  ('chapter-3', 'Théorème de Pythagore', 'Applications pratiques', 0, 'premium-course-1', NOW(), NOW());

INSERT INTO subchapters (id, title, description, "order", "chapterId", "createdAt", "updatedAt")
VALUES
  ('subchapter-4', 'Introduction au théorème', 'Démonstration et exemples', 0, 'chapter-3', NOW(), NOW());

INSERT INTO lessons (id, title, "subChapterId", type, "contentUrl", "isCorrectionVideo", "linkedQcmId", "order", "createdAt", "updatedAt")
VALUES
  ('lesson-9', 'Vidéo : Le théorème de Pythagore', 'subchapter-4', 'VIDEO_COURS', 'https://vimeo.com/777888999', false, NULL, 0, NOW(), NOW());


