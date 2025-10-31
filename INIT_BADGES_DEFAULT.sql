-- Script pour insérer les badges par défaut dans Master Maths
-- Structure compatible avec le schéma actuel

-- Badges de connexion
INSERT INTO badges (id, name, description, icon, rarity, "masteryPointsRequired", "masteryPoints", "order", criteria, "createdAt", "updatedAt")
VALUES
  ('badge-connection-7', 'Première Semaine', 'Connectez-vous pendant 7 jours consécutifs', '🔥', 'COMMON', 0, 10, 1, '{"connection_days_count": 7}', NOW(), NOW()),
  ('badge-connection-30', 'Régularité', 'Connectez-vous pendant 30 jours consécutifs', '⚡', 'RARE', 0, 25, 2, '{"connection_days_count": 30}', NOW(), NOW()),
  ('badge-connection-100', 'Persévérance', 'Connectez-vous pendant 100 jours consécutifs', '💪', 'EPIC', 0, 100, 3, '{"connection_days_count": 100}', NOW(), NOW());

-- Badges de performance QCM
INSERT INTO badges (id, name, description, icon, rarity, "masteryPointsRequired", "masteryPoints", "order", criteria, "createdAt", "updatedAt")
VALUES
  ('badge-qcm-90', 'Expert QCM', 'Obtenez une moyenne de 90% aux QCM', '🎯', 'RARE', 0, 30, 4, '{"quiz_success_rate": 90}', NOW(), NOW()),
  ('badge-perfect-5', 'Perfection', 'Réalisez 5 QCM parfaits (100%)', '⭐', 'RARE', 0, 20, 5, '{"perfect_qcm_count": 5}', NOW(), NOW()),
  ('badge-perfect-20', 'Maître des QCM', 'Réalisez 20 QCM parfaits (100%)', '✨', 'EPIC', 0, 75, 6, '{"perfect_qcm_count": 20}', NOW(), NOW());

-- Badges de complétion
INSERT INTO badges (id, name, description, icon, rarity, "masteryPointsRequired", "masteryPoints", "order", criteria, "createdAt", "updatedAt")
VALUES
  ('badge-lessons-10', 'Étudiant', 'Complétez 10 leçons', '📚', 'COMMON', 10, 15, 7, '{"lessons_completed": 10}', NOW(), NOW()),
  ('badge-lessons-50', 'Apprenant Assidu', 'Complétez 50 leçons', '🎓', 'RARE', 50, 50, 8, '{"lessons_completed": 50}', NOW(), NOW()),
  ('badge-lessons-100', 'Dévoué', 'Complétez 100 leçons', '🏆', 'EPIC', 100, 100, 9, '{"lessons_completed": 100}', NOW(), NOW());

-- Badge ultime
INSERT INTO badges (id, name, description, icon, rarity, "masteryPointsRequired", "masteryPoints", "order", criteria, "createdAt", "updatedAt")
VALUES
  ('badge-master', 'Master Maths', 'Le badge ultime : 100 jours de connexion, 95% aux QCM et 100 leçons', '👑', 'LEGENDARY', 100, 500, 10, '{"connection_days_count": 100, "quiz_success_rate": 95, "lessons_completed": 100}', NOW(), NOW());

-- Badge débutant (automatique)
INSERT INTO badges (id, name, description, icon, rarity, "masteryPointsRequired", "masteryPoints", "order", criteria, "createdAt", "updatedAt")
VALUES
  ('badge-welcome', 'Bienvenue', 'Complétez votre première leçon', '🎉', 'COMMON', 1, 5, 0, '{"lessons_completed": 1}', NOW(), NOW());

