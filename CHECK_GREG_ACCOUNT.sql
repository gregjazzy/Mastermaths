-- Vérifier le compte de Gregory Mittelette

SELECT 
  id,
  email,
  name,
  status,
  "createdAt",
  "updatedAt"
FROM users
WHERE email ILIKE '%gregory%mittelette%' OR email ILIKE '%gregorymittelette%';

-- Si le statut n'est pas PREMIUM, le mettre à jour :
-- UPDATE users SET status = 'PREMIUM' WHERE email ILIKE '%gregory%mittelette%';

