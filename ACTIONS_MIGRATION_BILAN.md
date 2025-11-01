# ⚠️ ACTIONS REQUISES AVANT UTILISATION

## 1. ✅ Exécuter la migration SQL sur Supabase

**Étapes :**
1. Connectez-vous à [Supabase](https://supabase.com)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor** (menu de gauche)
4. Créez une nouvelle requête
5. Copiez-collez le contenu du fichier `MIGRATION_BILAN_ASYNC.sql`
6. Cliquez sur **Run**

**Contenu de la migration :**
```sql
-- Migration : Ajouter le système de génération asynchrone des bilans d'orientation

-- 1. Créer l'enum pour le statut
CREATE TYPE "BilanStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- 2. Ajouter les nouveaux champs à la table
ALTER TABLE "orientation_bilans" 
  ADD COLUMN "status" "BilanStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "errorMessage" TEXT;

-- 3. Modifier les champs existants pour les rendre optionnels
ALTER TABLE "orientation_bilans" 
  ALTER COLUMN "analyse" DROP NOT NULL,
  ALTER COLUMN "resultat" DROP NOT NULL;

-- 4. Créer un index sur le statut
CREATE INDEX "orientation_bilans_status_idx" ON "orientation_bilans"("status");

-- 5. Mettre à jour les bilans existants en COMPLETED
UPDATE "orientation_bilans" SET "status" = 'COMPLETED' WHERE "resultat" IS NOT NULL;
```

**Vérification :**
```sql
-- Vérifier que la migration a fonctionné
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orientation_bilans';
```

Vous devriez voir les colonnes `status` et `errorMessage`.

---

## 2. ⏳ Attendre le déploiement Netlify

Le code a été pushé sur GitHub. Netlify va automatiquement :
1. Détecter le nouveau commit
2. Lancer le build
3. Déployer sur https://www.master-maths.com

**Vérifier le déploiement :**
1. Allez sur [Netlify](https://app.netlify.com)
2. Sélectionnez votre site
3. Onglet **Deploys**
4. Attendez que le status soit **Published** (⏱️ ~2-3 minutes)

---

## 3. ✅ Tester le système

### Test 1 : Éligibilité

1. Connectez-vous avec `gregjazzy@gmail.com`
2. Allez sur `/orientation`
3. **Vous devriez avoir accès** (MONTHLY ou ANNUAL, plus de délai de 14 jours)

### Test 2 : Soumission du formulaire

1. Remplissez le formulaire d'orientation
2. Cliquez sur "Générer mon bilan"
3. **Vous devriez être redirigé immédiatement** vers `/orientation/resultat/[id]`
4. La page affiche "Génération en cours..." avec animation

### Test 3 : Génération asynchrone

1. Sur la page de résultat, attendez **30 secondes à 2 minutes**
2. La page se rafraîchit automatiquement toutes les 5 secondes
3. Quand le bilan est prêt :
   - La page affiche le bilan complet en Markdown
   - Vous recevez un email à `gregjazzy@gmail.com`

### Test 4 : Email de notification

1. Vérifiez votre boîte mail `gregjazzy@gmail.com`
2. Vous devriez avoir reçu un email avec :
   - Sujet : "✅ Votre Bilan d'Orientation est prêt !"
   - Lien vers le bilan
   - Design moderne

---

## 4. 🔍 Débuggage si problème

### Si la génération ne se lance pas :

**Vérifier les logs Netlify :**
1. Netlify → Functions
2. Cherchez `orientation-generate`
3. Vérifiez les logs pour voir si l'API est appelée

**Vérifier la base de données :**
```sql
-- Voir les bilans en cours
SELECT id, status, "createdAt" 
FROM orientation_bilans 
WHERE status = 'PENDING' 
ORDER BY "createdAt" DESC 
LIMIT 10;
```

### Si l'email n'est pas envoyé :

**Vérifier la configuration email :**
1. Vérifiez que `lib/email.ts` est bien configuré
2. Vérifiez les variables d'environnement sur Netlify :
   - `SMTP_HOST`
   - `SMTP_USER`
   - `SMTP_PASS`
   - etc.

### Si le modèle Gemini échoue :

**Vérifier la clé API :**
```bash
# Sur Netlify → Environment variables
GEMINI_API_KEY=AIza... (39 caractères)
```

**Tester manuellement :**
```bash
# En local
node test-gemini.js
```

---

## 5. 📊 Suivi et monitoring

### Voir les bilans en cours de génération

```sql
SELECT 
  ob.id,
  u.email,
  ob.status,
  ob."createdAt",
  EXTRACT(EPOCH FROM (NOW() - ob."createdAt")) as "secondes_écoulées"
FROM orientation_bilans ob
JOIN users u ON u.id = ob."userId"
WHERE ob.status = 'PENDING'
ORDER BY ob."createdAt" DESC;
```

### Voir les bilans échoués

```sql
SELECT 
  ob.id,
  u.email,
  ob."errorMessage",
  ob."createdAt"
FROM orientation_bilans ob
JOIN users u ON u.id = ob."userId"
WHERE ob.status = 'FAILED'
ORDER BY ob."createdAt" DESC;
```

### Statistiques

```sql
SELECT 
  status,
  COUNT(*) as nombre,
  AVG(EXTRACT(EPOCH FROM (NOW() - "createdAt"))) as "age_moyen_secondes"
FROM orientation_bilans
GROUP BY status;
```

---

## 6. 🎉 C'est prêt !

Une fois ces étapes effectuées :
- ✅ Migration SQL appliquée
- ✅ Déploiement Netlify terminé
- ✅ Tests réussis
- ✅ Email fonctionnel

Le système de génération asynchrone est opérationnel ! 🚀

**Expérience utilisateur :**
1. Client soumet → Redirection immédiate (pas d'attente)
2. Génération en arrière-plan (90 secondes)
3. Email de notification automatique
4. Client consulte son bilan quand il le souhaite

**Avantages :**
- Pas de timeout sur Netlify Functions (limite 10 secondes en gratuit)
- Meilleure UX (pas d'attente)
- Possibilité de fermer la page et revenir plus tard
- Email de rappel si oubli

