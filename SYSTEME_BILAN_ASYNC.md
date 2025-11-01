# Système de Génération Asynchrone des Bilans d'Orientation

## 🎯 Objectif

Transformer la génération synchrone (90 secondes d'attente) en génération asynchrone (redirection immédiate + notification email).

## ✅ Modifications effectuées

### 1. Base de données (Prisma + SQL)

**Fichiers modifiés :**
- `prisma/schema.prisma` : Ajout du modèle `BilanStatus` et des champs `status`, `errorMessage`
- `MIGRATION_BILAN_ASYNC.sql` : Script de migration SQL à exécuter sur Supabase

**Changements :**
```prisma
model OrientationBilan {
  // ... champs existants
  status         BilanStatus @default(PENDING) // NOUVEAU
  errorMessage   String?                       // NOUVEAU
  analyse        Json?       // Optionnel maintenant
  resultat       String?     // Optionnel maintenant
}

enum BilanStatus {
  PENDING
  COMPLETED
  FAILED
}
```

### 2. Éligibilité modifiée

**Fichiers modifiés :**
- `app/api/orientation/eligibility/route.ts`
- `app/api/orientation/create/route.ts`

**Changements :**
- ✅ **Suppression de la période de rétractation de 14 jours**
- ✅ **Accès dès le premier paiement (MONTHLY ou ANNUAL)**
- ✅ **Conservation de la limite : 1 bilan par an**

### 3. API de création (mode asynchrone)

**Fichier modifié :**
- `app/api/orientation/create/route.ts`

**Nouveau comportement :**
1. Crée le bilan en statut `PENDING`
2. Lance un appel asynchrone vers `/api/orientation/generate`
3. Retourne immédiatement `bilanId` au client
4. Le client est redirigé vers `/orientation/resultat/[id]`

### 4. API de génération (arrière-plan)

**Fichier créé :**
- `app/api/orientation/generate/route.ts`

**Fonctionnalités :**
- Reçoit `bilanId` en paramètre
- Effectue les 3 passages Gemini (Initial + Psychopédagogique + Terrain)
- Met à jour le bilan avec `status: COMPLETED` et le résultat
- **Envoie un email de notification** à l'utilisateur
- En cas d'erreur : `status: FAILED` + `errorMessage`

### 5. Page de résultat

**Fichier créé :**
- `app/orientation/resultat/[id]/page.tsx`

**Fonctionnalités :**
- Affiche 3 états différents selon `status` :
  - **PENDING** : Animation de chargement + rafraîchissement auto toutes les 5 secondes
  - **COMPLETED** : Affichage du bilan en Markdown + bouton Imprimer/PDF
  - **FAILED** : Message d'erreur + lien vers le support
- Permet de fermer la page sans perdre le bilan
- Email envoyé quand prêt

### 6. API de récupération d'un bilan

**Fichier créé :**
- `app/api/orientation/bilan/[id]/route.ts`

**Fonctionnalités :**
- GET `/api/orientation/bilan/[id]`
- Vérification d'authentification et de propriété
- Retourne les informations du bilan (status, resultat, etc.)

## 📋 Étapes de déploiement

### 1. Appliquer la migration SQL

Connectez-vous à Supabase → SQL Editor → Collez le contenu de `MIGRATION_BILAN_ASYNC.sql` :

```sql
-- Migration : Ajouter le système de génération asynchrone des bilans d'orientation

CREATE TYPE "BilanStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

ALTER TABLE "orientation_bilans" 
  ADD COLUMN "status" "BilanStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "errorMessage" TEXT;

ALTER TABLE "orientation_bilans" 
  ALTER COLUMN "analyse" DROP NOT NULL,
  ALTER COLUMN "resultat" DROP NOT NULL;

CREATE INDEX "orientation_bilans_status_idx" ON "orientation_bilans"("status");

UPDATE "orientation_bilans" SET "status" = 'COMPLETED' WHERE "resultat" IS NOT NULL;
```

### 2. Vérifier les variables d'environnement

**Netlify → Site settings → Environment variables :**

- `GEMINI_API_KEY` : Votre clé API Google Gemini
- `NEXTAUTH_URL` : `https://www.master-maths.com`
- `DATABASE_URL` : URL de connexion Supabase (avec mot de passe complet)
- `DIRECT_URL` : URL directe Supabase

### 3. Push et déploiement

```bash
git add -A
git commit -m "feat: Système asynchrone pour bilans d'orientation + éligibilité dès premier paiement"
git push origin main
```

## 🎉 Résultat

### Avant (synchrone)
1. Client soumet le formulaire
2. **Attente de 90 secondes** (3 appels Gemini)
3. Affichage du bilan

### Après (asynchrone)
1. Client soumet le formulaire
2. **Redirection immédiate** vers page "En cours..."
3. Génération en arrière-plan (90 secondes)
4. **Email de notification** quand prêt
5. Client peut consulter son bilan

## 📧 Email envoyé

Sujet : **✅ Votre Bilan d'Orientation est prêt !**

Contenu :
- Lien direct vers le bilan
- Résumé des sections du bilan
- CTA clair avec design moderne

## 🔒 Sécurité

- Vérification d'authentification sur toutes les routes
- Vérification de propriété du bilan (userId)
- Limite : 1 bilan par an conservée
- Questionnaire sauvegardé en base (preuve en cas de litige)

## 🎯 Améliorations futures possibles

- [ ] Notification push (si PWA)
- [ ] Barre de progression (WebSocket ou SSE)
- [ ] Historique des bilans (si on autorise plusieurs par an à l'avenir)
- [ ] Export PDF côté serveur (au lieu de window.print())

