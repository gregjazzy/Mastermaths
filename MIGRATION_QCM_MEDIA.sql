-- Migration pour ajouter les champs média aux questions QCM
-- À exécuter dans Supabase SQL Editor

ALTER TABLE qcm_questions 
ADD COLUMN IF NOT EXISTS "questionImageUrl" TEXT,
ADD COLUMN IF NOT EXISTS "questionPdfUrl" TEXT,
ADD COLUMN IF NOT EXISTS "questionVideoUrl" TEXT,
ADD COLUMN IF NOT EXISTS "explanationImageUrl" TEXT,
ADD COLUMN IF NOT EXISTS "explanationPdfUrl" TEXT,
ADD COLUMN IF NOT EXISTS "explanationVideoUrl" TEXT;

-- Ajouter des commentaires pour documenter les colonnes
COMMENT ON COLUMN qcm_questions."questionImageUrl" IS 'URL de l''image pour l''énoncé de la question';
COMMENT ON COLUMN qcm_questions."questionPdfUrl" IS 'URL du PDF pour l''énoncé de la question';
COMMENT ON COLUMN qcm_questions."questionVideoUrl" IS 'URL de la vidéo pour l''énoncé de la question';
COMMENT ON COLUMN qcm_questions."explanationImageUrl" IS 'URL de l''image pour l''explication de la réponse';
COMMENT ON COLUMN qcm_questions."explanationPdfUrl" IS 'URL du PDF pour l''explication de la réponse';
COMMENT ON COLUMN qcm_questions."explanationVideoUrl" IS 'URL de la vidéo pour l''explication de la réponse';

