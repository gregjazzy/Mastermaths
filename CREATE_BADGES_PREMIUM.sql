-- Création des 5 badges Premium pour le chapitre "Second Degré"
-- ID du chapitre : cmh5d2pff0003wrd80j0gsqi8

-- Badge 1 : APPRENTI
INSERT INTO badges (
  id,
  name,
  description,
  icon,
  rarity,
  "masteryPoints",
  "order",
  "type",
  "chapterId",
  "useCustomCSS"
) VALUES (
  'badge_seconddegre_apprenti',
  'Second Degré - APPRENTI',
  'Première leçon du chapitre Second Degré complétée (vidéo + QCM + exercices)',
  '🎴',
  'COMMON',
  50,
  100,
  'CHAPTER_PREMIUM',
  'cmh5d2pff0003wrd80j0gsqi8',
  false
);

-- Badge 2 : CONFIRMÉ
INSERT INTO badges (
  id,
  name,
  description,
  icon,
  rarity,
  "masteryPoints",
  "order",
  "type",
  "chapterId",
  "useCustomCSS"
) VALUES (
  'badge_seconddegre_confirme',
  'Second Degré - CONFIRMÉ',
  'Deux leçons du chapitre Second Degré complétées',
  '🎴',
  'RARE',
  100,
  101,
  'CHAPTER_PREMIUM',
  'cmh5d2pff0003wrd80j0gsqi8',
  false
);

-- Badge 3 : EXPERT
INSERT INTO badges (
  id,
  name,
  description,
  icon,
  rarity,
  "masteryPoints",
  "order",
  "type",
  "chapterId",
  "useCustomCSS"
) VALUES (
  'badge_seconddegre_expert',
  'Second Degré - EXPERT',
  'Trois leçons du chapitre Second Degré complétées',
  '🎴',
  'EPIC',
  150,
  102,
  'CHAPTER_PREMIUM',
  'cmh5d2pff0003wrd80j0gsqi8',
  false
);

-- Badge 4 : MAÎTRE
INSERT INTO badges (
  id,
  name,
  description,
  icon,
  rarity,
  "masteryPoints",
  "order",
  "type",
  "chapterId",
  "useCustomCSS"
) VALUES (
  'badge_seconddegre_maitre',
  'Second Degré - MAÎTRE',
  'Quatre leçons du chapitre Second Degré complétées',
  '🎴',
  'EPIC',
  200,
  103,
  'CHAPTER_PREMIUM',
  'cmh5d2pff0003wrd80j0gsqi8',
  false
);

-- Badge 5 : VIRTUOSE
INSERT INTO badges (
  id,
  name,
  description,
  icon,
  rarity,
  "masteryPoints",
  "order",
  "type",
  "chapterId",
  "useCustomCSS"
) VALUES (
  'badge_seconddegre_virtuose',
  'Second Degré - VIRTUOSE',
  'Toutes les leçons du chapitre Second Degré complétées ! Maîtrise totale !',
  '🎴',
  'LEGENDARY',
  300,
  104,
  'CHAPTER_PREMIUM',
  'cmh5d2pff0003wrd80j0gsqi8',
  false
);

-- Vérification
SELECT id, name, rarity, "masteryPoints", "type", "chapterId" 
FROM badges 
WHERE "type" = 'CHAPTER_PREMIUM'
ORDER BY "order";

