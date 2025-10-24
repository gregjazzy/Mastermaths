-- Ajouter les champs manquants au modèle Badge

ALTER TABLE badges 
ADD COLUMN IF NOT EXISTS "masteryPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS criteria JSONB;

-- Mettre à jour les badges existants avec des valeurs par défaut
-- Les critères seront définis plus tard via l'interface admin ou un script de seed

