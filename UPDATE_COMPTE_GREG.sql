-- Mise à jour du compte gregjazzy@gmail.com
-- Mot de passe: Romane18
-- Accès au bilan d'orientation activé (date > 14 jours)

UPDATE users 
SET 
  "hashedPassword" = '$2a$10$t14qQtvgS6WoTzdmXNbVyO9MyyS.mnOyXhlOguHnYJse.y5EI3WMK',
  status = 'PREMIUM',
  "isSubscribed" = true,
  "subscriptionType" = 'ANNUAL',
  "subscriptionStartDate" = NOW() - INTERVAL '30 days',
  "subscriptionEndDate" = '2026-10-31'
WHERE email = 'gregjazzy@gmail.com';

-- Vérification
SELECT 
  email,
  status,
  "subscriptionType",
  "subscriptionStartDate",
  "subscriptionEndDate",
  EXTRACT(DAY FROM (NOW() - "subscriptionStartDate")) as jours_depuis_abonnement
FROM users 
WHERE email = 'gregjazzy@gmail.com';

