-- Migration pour ajouter les champs CSS personnalisés aux badges
-- À exécuter dans Supabase SQL Editor

-- Ajouter le champ pour stocker le CSS personnalisé
ALTER TABLE badges 
ADD COLUMN IF NOT EXISTS "customCSS" TEXT,
ADD COLUMN IF NOT EXISTS "useCustomCSS" BOOLEAN DEFAULT false;

-- Ajouter un index pour les badges avec CSS personnalisé
CREATE INDEX IF NOT EXISTS "badges_useCustomCSS_idx" ON badges("useCustomCSS") WHERE "useCustomCSS" = true;

-- Commentaires
COMMENT ON COLUMN badges."customCSS" IS 'CSS personnalisé pour l''animation du badge (style Pokémon)';
COMMENT ON COLUMN badges."useCustomCSS" IS 'Si true, utilise customCSS au lieu du style par défaut';

