-- Script pour insérer les badges par défaut dans Master Maths

-- Badges de connexion (type: connection)
INSERT INTO badges (id, name, description, icon, criteria, type, "order", "createdAt", "updatedAt")
VALUES
  ('badge-connection-7', '🔥 Première Semaine', 'Connectez-vous pendant 7 jours', 'fire', '{"connection_days_count": 7}', 'connection', 1, NOW(), NOW()),
  ('badge-connection-30', '⚡ Régularité', 'Connectez-vous pendant 30 jours', 'zap', '{"connection_days_count": 30}', 'connection', 2, NOW(), NOW()),
  ('badge-connection-100', '💪 Persévérance', 'Connectez-vous pendant 100 jours', 'muscle', '{"connection_days_count": 100}', 'connection', 3, NOW(), NOW());

-- Badges de performance (type: performance)
INSERT INTO badges (id, name, description, icon, criteria, type, "order", "createdAt", "updatedAt")
VALUES
  ('badge-qcm-90', '🎯 Expert', 'Obtenez une moyenne de 90% aux QCM', 'target', '{"quiz_success_rate": 90}', 'performance', 4, NOW(), NOW()),
  ('badge-perfect-5', '⭐ Perfection', 'Réalisez 5 QCM parfaits (100%)', 'star', '{"perfect_qcm_count": 5}', 'perfect', 5, NOW(), NOW()),
  ('badge-perfect-20', '✨ Maître des QCM', 'Réalisez 20 QCM parfaits (100%)', 'sparkles', '{"perfect_qcm_count": 20}', 'perfect', 6, NOW(), NOW());

-- Badges de complétion (type: completion)
INSERT INTO badges (id, name, description, icon, criteria, type, "order", "createdAt", "updatedAt")
VALUES
  ('badge-lessons-10', '📚 Étudiant', 'Complétez 10 leçons', 'book', '{"lessons_completed": 10}', 'completion', 7, NOW(), NOW()),
  ('badge-lessons-50', '🎓 Apprenant Assidu', 'Complétez 50 leçons', 'graduation-cap', '{"lessons_completed": 50}', 'completion', 8, NOW(), NOW()),
  ('badge-lessons-100', '🏆 Dévoué', 'Complétez 100 leçons', 'trophy', '{"lessons_completed": 100}', 'completion', 9, NOW(), NOW());

-- Badge ultime (type: master)
INSERT INTO badges (id, name, description, icon, criteria, type, "order", "createdAt", "updatedAt")
VALUES
  ('badge-master', '👑 Master Maths', 'Atteignez 100 jours de connexion, 95% aux QCM et 100 leçons', 'crown', '{"connection_days_count": 100, "quiz_success_rate": 95, "lessons_completed": 100}', 'master', 10, NOW(), NOW());

-- Badge débutant (automatique)
INSERT INTO badges (id, name, description, icon, criteria, type, "order", "createdAt", "updatedAt")
VALUES
  ('badge-welcome', '🎉 Bienvenue', 'Complétez votre première leçon', 'party-popper', '{"lessons_completed": 1}', 'completion', 0, NOW(), NOW());


