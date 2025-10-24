-- =============================================
-- SCRIPT COMPLET D'INSTALLATION DES BADGES
-- Master Maths - Système de Gamification
-- À EXÉCUTER UNE SEULE FOIS DANS SUPABASE
-- =============================================

-- =============================================
-- ÉTAPE 1 : AJOUTER LES COLONNES MANQUANTES
-- =============================================

ALTER TABLE badges 
ADD COLUMN IF NOT EXISTS "masteryPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS criteria JSONB;

-- =============================================
-- ÉTAPE 2 : CRÉER LES 11 BADGES GÉNÉRAUX
-- =============================================

-- Badge 1 : Bienvenue 🎉 (COMMUN)
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria, "createdAt")
VALUES (
  'badge_bienvenue',
  'Bienvenue chez Master Maths',
  'Félicitations pour votre inscription ! Votre aventure mathématique commence maintenant.',
  '🎉',
  'COMMUN',
  50,
  1,
  '{}'::jsonb,
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Badge 2 : Première Leçon 📚 (COMMUN)
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria, "createdAt")
VALUES (
  'badge_premiere_lecon',
  'Première Leçon',
  'Vous avez terminé votre première leçon. Un bon début !',
  '📚',
  'COMMUN',
  100,
  2,
  '{"lessons_completed": 1}'::jsonb,
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Badge 3 : Premier QCM Parfait 🏆 (COMMUN)
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria, "createdAt")
VALUES (
  'badge_premier_qcm_parfait',
  'Premier QCM Parfait',
  'Score de 100% à votre premier QCM. Excellent travail !',
  '🏆',
  'COMMUN',
  150,
  3,
  '{"perfect_qcm_count": 1}'::jsonb,
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Badge 4 : Étudiant Assidu 📖 (RARE)
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria, "createdAt")
VALUES (
  'badge_etudiant_assidu',
  'Étudiant Assidu',
  'Vous avez complété 10 leçons. Votre détermination porte ses fruits !',
  '📖',
  'RARE',
  300,
  4,
  '{"lessons_completed": 10}'::jsonb,
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Badge 5 : Expert en QCM ⭐ (RARE)
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria, "createdAt")
VALUES (
  'badge_expert_qcm',
  'Expert en QCM',
  'Vous avez obtenu 5 QCM parfaits. Votre maîtrise est impressionnante !',
  '⭐',
  'RARE',
  400,
  5,
  '{"perfect_qcm_count": 5}'::jsonb,
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Badge 6 : Moyenne d'Excellence 💯 (RARE)
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria, "createdAt")
VALUES (
  'badge_moyenne_excellence',
  'Moyenne d''Excellence',
  'Moyenne de 90% ou plus sur tous vos QCM. Brillant !',
  '💯',
  'RARE',
  500,
  6,
  '{"quiz_success_rate": 90}'::jsonb,
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Badge 7 : Streak de Feu 🔥 (ÉPIQUE)
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria, "createdAt")
VALUES (
  'badge_streak_7jours',
  'Streak de Feu',
  'Vous vous êtes connecté 7 jours d''affilée. Votre discipline est remarquable !',
  '🔥',
  'ÉPIQUE',
  600,
  7,
  '{"connection_days_count": 7}'::jsonb,
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Badge 8 : Marathonien 🏃 (ÉPIQUE)
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria, "createdAt")
VALUES (
  'badge_marathonien',
  'Marathonien',
  'Vous vous êtes connecté 30 jours d''affilée. Un engagement exceptionnel !',
  '🏃',
  'ÉPIQUE',
  1000,
  8,
  '{"connection_days_count": 30}'::jsonb,
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Badge 9 : Maître des Leçons 🎓 (ÉPIQUE)
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria, "createdAt")
VALUES (
  'badge_maitre_lecons',
  'Maître des Leçons',
  'Vous avez complété 50 leçons. Votre savoir grandit de jour en jour !',
  '🎓',
  'ÉPIQUE',
  800,
  9,
  '{"lessons_completed": 50}'::jsonb,
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Badge 10 : Légende Vivante 👑 (LÉGENDAIRE)
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria, "createdAt")
VALUES (
  'badge_legende_vivante',
  'Légende Vivante',
  'Vous vous êtes connecté 100 jours d''affilée. Vous êtes une source d''inspiration !',
  '👑',
  'LÉGENDAIRE',
  2000,
  10,
  '{"connection_days_count": 100}'::jsonb,
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Badge 11 : Perfectionniste Ultime 💎 (LÉGENDAIRE)
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria, "createdAt")
VALUES (
  'badge_perfectionniste',
  'Perfectionniste Ultime',
  'Vous avez obtenu 20 QCM parfaits. Vous êtes au sommet de votre art !',
  '💎',
  'LÉGENDAIRE',
  1500,
  11,
  '{"perfect_qcm_count": 20}'::jsonb,
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- =============================================
-- ÉTAPE 3 : VÉRIFICATION
-- =============================================

-- Afficher tous les badges créés
SELECT 
  name AS "Nom du Badge",
  icon AS "Icône",
  rarity AS "Rareté",
  "masteryPoints" AS "PMU",
  "order" AS "Ordre",
  criteria AS "Critères",
  "createdAt" AS "Date de création"
FROM badges
ORDER BY "order";

-- Afficher un résumé
SELECT 
  rarity AS "Rareté",
  COUNT(*) AS "Nombre de badges",
  SUM("masteryPoints") AS "Total PMU"
FROM badges
GROUP BY rarity
ORDER BY 
  CASE rarity
    WHEN 'COMMUN' THEN 1
    WHEN 'RARE' THEN 2
    WHEN 'ÉPIQUE' THEN 3
    WHEN 'LÉGENDAIRE' THEN 4
  END;

-- =============================================
-- ✅ INSTALLATION TERMINÉE !
-- =============================================
-- 
-- Résultat attendu :
-- - 3 colonnes ajoutées à la table badges
-- - 11 badges créés avec leurs critères
-- - Total : 8250 PMU disponibles
-- 
-- Les badges seront automatiquement attribués 
-- aux utilisateurs en fonction de leurs actions.
-- =============================================

