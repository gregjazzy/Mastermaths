-- Migration : Ajouter le système de génération asynchrone des bilans d'orientation

-- 1. Créer l'enum pour le statut
CREATE TYPE "BilanStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- 2. Ajouter les nouveaux champs à la table
ALTER TABLE "orientation_bilans" 
  ADD COLUMN "status" "BilanStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "errorMessage" TEXT;

-- 3. Modifier les champs existants pour les rendre optionnels (car PENDING au début)
ALTER TABLE "orientation_bilans" 
  ALTER COLUMN "analyse" DROP NOT NULL,
  ALTER COLUMN "resultat" DROP NOT NULL;

-- 4. Créer un index sur le statut pour les requêtes
CREATE INDEX "orientation_bilans_status_idx" ON "orientation_bilans"("status");

-- 5. Mettre à jour les bilans existants en COMPLETED (ils ont déjà un résultat)
UPDATE "orientation_bilans" SET "status" = 'COMPLETED' WHERE "resultat" IS NOT NULL;

