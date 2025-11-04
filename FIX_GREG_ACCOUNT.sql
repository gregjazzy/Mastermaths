-- 1. Vérifier le statut actuel de Gregory Mittelette
SELECT 
  id,
  email,
  name,
  status,
  "createdAt"
FROM users
WHERE email ILIKE '%mittelette%';

-- 2. Mettre à jour le statut en PREMIUM
UPDATE users 
SET status = 'PREMIUM'
WHERE email ILIKE '%mittelette%';

-- 3. Vérifier que c'est bien appliqué
SELECT 
  email,
  name,
  status
FROM users
WHERE email ILIKE '%mittelette%';

