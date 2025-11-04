-- Ajouter un champ isAdmin pour sécuriser l'accès admin

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN DEFAULT false;

-- Mettre votre compte en admin
UPDATE users 
SET "isAdmin" = true 
WHERE email ILIKE '%mittelette%' OR email ILIKE '%gregorymittelette%';

-- Vérifier
SELECT email, name, status, "isAdmin"
FROM users
WHERE email ILIKE '%mittelette%';

