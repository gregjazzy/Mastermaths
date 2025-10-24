-- =============================================
-- SCRIPT DE CRÉATION DES BADGES GÉNÉRAUX
-- Master Maths - Système de Gamification
-- =============================================

-- Étape 1 : Ajouter les colonnes manquantes (si pas déjà fait)
ALTER TABLE badges 
ADD COLUMN IF NOT EXISTS "masteryPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS criteria JSONB;

-- Étape 2 : Créer les 11 badges généraux avec leurs critères

-- ========================================
-- BADGES DE DÉMARRAGE (Rareté: COMMUN)
-- ========================================

-- Badge 1 : Bienvenue 🎉
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria)
VALUES (
  'badge_bienvenue',
  'Bienvenue chez Master Maths',
  'Félicitations pour votre inscription ! Votre aventure mathématique commence maintenant.',
  '🎉',
  'COMMUN',
  50,
  1,
  '{}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Badge 2 : Première Leçon 📚
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria)
VALUES (
  'badge_premiere_lecon',
  'Première Leçon',
  'Vous avez terminé votre première leçon. Un bon début !',
  '📚',
  'COMMUN',
  100,
  2,
  '{"lessons_completed": 1}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Badge 3 : Premier QCM Parfait 🏆
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria)
VALUES (
  'badge_premier_qcm_parfait',
  'Premier QCM Parfait',
  'Score de 100% à votre premier QCM. Excellent travail !',
  '🏆',
  'COMMUN',
  150,
  3,
  '{"perfect_qcm_count": 1}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- ========================================
-- BADGES DE PROGRESSION (Rareté: RARE)
-- ========================================

-- Badge 4 : Étudiant Assidu 📖
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria)
VALUES (
  'badge_etudiant_assidu',
  'Étudiant Assidu',
  'Vous avez complété 10 leçons. Votre détermination porte ses fruits !',
  '📖',
  'RARE',
  300,
  4,
  '{"lessons_completed": 10}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Badge 5 : Expert en QCM ⭐
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria)
VALUES (
  'badge_expert_qcm',
  'Expert en QCM',
  'Vous avez obtenu 5 QCM parfaits. Votre maîtrise est impressionnante !',
  '⭐',
  'RARE',
  400,
  5,
  '{"perfect_qcm_count": 5}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Badge 6 : Moyenne d''Excellence 💯
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria)
VALUES (
  'badge_moyenne_excellence',
  'Moyenne d''Excellence',
  'Moyenne de 90% ou plus sur tous vos QCM. Brillant !',
  '💯',
  'RARE',
  500,
  6,
  '{"quiz_success_rate": 90}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- ========================================
-- BADGES DE PERSÉVÉRANCE (Rareté: ÉPIQUE)
-- ========================================

-- Badge 7 : Streak de Feu 🔥
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria)
VALUES (
  'badge_streak_7jours',
  'Streak de Feu',
  'Vous vous êtes connecté 7 jours d''affilée. Votre discipline est remarquable !',
  '🔥',
  'ÉPIQUE',
  600,
  7,
  '{"connection_days_count": 7}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Badge 8 : Marathonien 🏃
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria)
VALUES (
  'badge_marathonien',
  'Marathonien',
  'Vous vous êtes connecté 30 jours d''affilée. Un engagement exceptionnel !',
  '🏃',
  'ÉPIQUE',
  1000,
  8,
  '{"connection_days_count": 30}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Badge 9 : Maître des Leçons 🎓
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria)
VALUES (
  'badge_maitre_lecons',
  'Maître des Leçons',
  'Vous avez complété 50 leçons. Votre savoir grandit de jour en jour !',
  '🎓',
  'ÉPIQUE',
  800,
  9,
  '{"lessons_completed": 50}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- ========================================
-- BADGES LÉGENDAIRES (Rareté: LÉGENDAIRE)
-- ========================================

-- Badge 10 : Légende Vivante 👑
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria)
VALUES (
  'badge_legende_vivante',
  'Légende Vivante',
  'Vous vous êtes connecté 100 jours d''affilée. Vous êtes une source d''inspiration !',
  '👑',
  'LÉGENDAIRE',
  2000,
  10,
  '{"connection_days_count": 100}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Badge 11 : Perfectionniste Ultime 💎
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria)
VALUES (
  'badge_perfectionniste',
  'Perfectionniste Ultime',
  'Vous avez obtenu 20 QCM parfaits. Vous êtes au sommet de votre art !',
  '💎',
  'LÉGENDAIRE',
  1500,
  11,
  '{"perfect_qcm_count": 20}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- =============================================
-- VÉRIFICATION : Afficher tous les badges créés
-- =============================================

SELECT 
  name AS "Nom du Badge",
  icon AS "Icône",
  rarity AS "Rareté",
  "masteryPoints" AS "PMU",
  "order" AS "Ordre",
  criteria AS "Critères"
FROM badges
ORDER BY "order";

-- =============================================
-- FIN DU SCRIPT
-- =============================================

