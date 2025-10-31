-- Mettre la date d'abonnement à il y a 30 jours pour gregjazzy@gmail.com
UPDATE users 
SET "subscriptionStartDate" = NOW() - INTERVAL '30 days',
    "subscriptionEndDate" = '2026-10-31'
WHERE email = 'gregjazzy@gmail.com';

-- Vérifier
SELECT 
  email,
  status,
  "subscriptionType",
  "subscriptionStartDate",
  "subscriptionEndDate",
  EXTRACT(DAY FROM (NOW() - "subscriptionStartDate")) as jours_ecoules
FROM users 
WHERE email = 'gregjazzy@gmail.com';
