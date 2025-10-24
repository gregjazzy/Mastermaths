-- =============================================
-- Mise à jour des utilisateurs FREE vers DEMO
-- =============================================
-- Ce script met à jour tous les utilisateurs avec statut FREE
-- vers le statut DEMO pour leur donner accès au contenu démo
-- =============================================

UPDATE users
SET status = 'DEMO'
WHERE status = 'FREE';

-- Vérification
SELECT 
  email, 
  name, 
  status, 
  "createdAt" 
FROM users 
ORDER BY "createdAt" DESC;

-- =============================================
-- ✅ Résultat attendu :
-- Tous les utilisateurs devraient avoir status = 'DEMO' ou 'PREMIUM'
-- =============================================

