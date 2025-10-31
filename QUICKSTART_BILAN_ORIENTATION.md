# 🎯 Guide de Démarrage Rapide - Bilan d'Orientation IA

**Temps de lecture : 5 minutes**

---

## 📦 Ce Qu'il Vous Faut

### 1. Clé API Gemini (Google)

Le système utilise **Gemini 1.5 Pro** de Google pour générer les bilans.

#### Obtenir votre clé API :

1. Allez sur https://aistudio.google.com/app/apikey
2. Créez un nouveau projet ou sélectionnez-en un existant
3. Cliquez sur "Get API Key"
4. Copiez la clé générée

#### Configurer la clé dans `.env` :

```env
GEMINI_API_KEY="AIzaSy..."
```

⚠️ **Important** : Cette clé est **gratuite** avec quota généreux (60 requêtes/min, 1500/jour pour Gemini 1.5 Pro).

---

## 🔧 Configuration Technique

### 1. Base de Données

Les tables suivantes ont été ajoutées/modifiées :

```sql
-- Nouveaux champs User
ALTER TABLE users 
  ADD COLUMN subscriptionType VARCHAR(20),
  ADD COLUMN subscriptionStartDate TIMESTAMP,
  ADD COLUMN subscriptionEndDate TIMESTAMP;

-- Nouvelle table OrientationBilan
CREATE TABLE orientation_bilans (
  id VARCHAR PRIMARY KEY,
  userId VARCHAR NOT NULL,
  questionnaire JSONB NOT NULL,
  analyse JSONB NOT NULL,
  resultat TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  expiresAt TIMESTAMP NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_orientation_bilans_userId ON orientation_bilans(userId);
CREATE INDEX idx_orientation_bilans_createdAt ON orientation_bilans(createdAt);
```

Si vous utilisez Prisma (recommandé), synchronisez simplement :

```bash
npx prisma db push
npx prisma generate
```

### 2. Dépendances NPM

Installez les packages nécessaires :

```bash
npm install @google/generative-ai react-markdown
```

### 3. Variables d'Environnement

Fichier `.env` complet :

```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_SECRET="votre_secret_nextauth"
NEXTAUTH_URL="http://localhost:3002"
GEMINI_API_KEY="AIzaSy..."  # ⭐ REQUIS pour l'orientation
```

---

## 🚀 Utilisation

### Accès à la Fonctionnalité

#### 1. Navigation

- Menu **"Outils"** → **"Bilan d'orientation"**
- Ou URL directe : `/orientation`

#### 2. Éligibilité (automatiquement vérifiée)

✅ **Conditions d'accès** :
- Abonnement ANNUEL actif
- Après la période de rétractation (14 jours)
- Pas de bilan déjà existant (< 1 an)

❌ **Accès refusé si** :
- Abonnement mensuel ou gratuit → Message : "Upgrader vers annuel"
- Dans les 14 premiers jours → Message : "Disponible le [date]"
- Bilan existant valide → Affichage du bilan précédent

#### 3. Processus de Génération

1. **Questionnaire** : 6 étapes (~10-15 minutes)
   - Infos générales
   - Performance académique
   - Méthodes de travail
   - Compétences linguistiques
   - Aspirations post-bac
   - Vie extrascolaire

2. **Analyse IA** : 1-2 minutes
   - Passage 1 : Analyse structurée (JSON)
   - Passage 2 : Humanisation (texte chaleureux)

3. **Résultat** : Bilan complet de 800-1200 mots
   - 🎯 Synthèse du profil
   - 💡 Recommandations de filières
   - 📋 Plan d'action (court/moyen/long terme)
   - ⚠️ Points de vigilance

---

## 🧪 Test de l'Intégration

### Test 1 : Vérifier l'Éligibilité

```bash
# Créer un utilisateur test avec abonnement ANNUEL
# Endpoint : POST /api/auth/register
{
  "email": "test@example.com",
  "password": "test123",
  "name": "Test User"
}

# Mettre à jour l'abonnement en base :
UPDATE users 
SET 
  subscriptionType = 'ANNUAL',
  subscriptionStartDate = NOW() - INTERVAL '15 days',
  subscriptionEndDate = NOW() + INTERVAL '1 year'
WHERE email = 'test@example.com';
```

### Test 2 : Générer un Bilan

1. Connectez-vous avec l'utilisateur test
2. Allez sur `/orientation`
3. Remplissez le questionnaire (toutes les étapes)
4. Cliquez sur "Générer mon bilan"
5. Attendez 1-2 minutes
6. Vérifiez que le bilan s'affiche correctement sur `/orientation/resultat/[id]`

### Test 3 : Vérifier les Restrictions

- **Test A** : Utilisateur mensuel → Doit voir "Abonnement annuel requis"
- **Test B** : Utilisateur dans rétractation → Doit voir "Disponible le [date]"
- **Test C** : Utilisateur avec bilan existant → Doit voir le bilan existant

---

## 📊 Monitoring et Logs

### Logs Serveur

Tous les appels Gemini sont loggés dans la console serveur :

```javascript
console.log('Génération bilan pour userId:', userId)
console.log('Passage 1 (Analyse) - Durée:', duration)
console.log('Passage 2 (Humanisation) - Durée:', duration)
console.error('Erreur Gemini:', error)
```

### Métriques à Surveiller

- **Temps de génération** : < 2 minutes idéalement
- **Taux d'erreur Gemini** : < 1%
- **Nombre de bilans générés/jour** : [suivant votre quota]
- **Coût par bilan** : ~$0.02-0.05 (pricing Gemini)

---

## ⚠️ Problèmes Courants

### Problème 1 : "Error: GEMINI_API_KEY not set"

**Cause** : Variable d'environnement manquante

**Solution** :
```bash
# .env
GEMINI_API_KEY="AIzaSy..."

# Redémarrer le serveur
npm run dev
```

### Problème 2 : "Erreur 429 - Rate Limit Exceeded"

**Cause** : Trop de requêtes Gemini

**Solution** :
- Quota gratuit : 60 req/min, 1500/jour
- Attendez quelques minutes
- Ou passez à un plan payant (https://ai.google.dev/pricing)

### Problème 3 : Bilan trop court ou incomplet

**Cause** : Prompt Gemini mal configuré ou réponse tronquée

**Solution** :
- Vérifiez que le `maxOutputTokens` est suffisant (défaut : 8192)
- Ajustez les prompts dans `/app/api/orientation/create/route.ts`

### Problème 4 : JSON invalide (Passage 1)

**Cause** : Gemini a retourné du texte au lieu de JSON pur

**Solution** : Le code nettoie automatiquement les backticks markdown, mais si problème persiste :
```javascript
// Dans /app/api/orientation/create/route.ts
const analyseBrute = result1.response.text()
let analyseJSON = analyseBrute.trim()
  .replace(/```json\n?/g, '')
  .replace(/```\n?/g, '')
const analyse = JSON.parse(analyseJSON)
```

---

## 🎨 Personnalisation

### Modifier les Prompts

Fichier : `/app/api/orientation/create/route.ts`

```javascript
// Passage 1 : Analyse structurée
const prompt1 = `Tu es un conseiller d'orientation expert...`

// Passage 2 : Humanisation
const prompt2 = `Tu es un conseiller d'orientation bienveillant...`
```

### Ajuster le Questionnaire

Fichier : `/app/orientation/page.tsx`

- Ajouter/supprimer des étapes
- Modifier les champs du formulaire
- Changer les validations

### Modifier le Design du Résultat

Fichier : `/app/orientation/resultat/[bilanId]/page.tsx`

- Personnaliser les composants `react-markdown`
- Changer les couleurs/typographies
- Ajouter des sections

---

## 📈 Évolutions Suggérées

### Court Terme (1 mois)

- [ ] Génération PDF téléchargeable
- [ ] Statistiques admin (nombre de bilans générés)
- [ ] Email de notification quand le bilan est prêt

### Moyen Terme (3 mois)

- [ ] Upload de bulletins scolaires (OCR)
- [ ] Graphiques de progression académique
- [ ] Comparaison anonymisée avec d'autres profils

### Long Terme (6 mois)

- [ ] Suivi dans le temps (rappels 6 mois après)
- [ ] Mise à jour du bilan avec nouvelles données
- [ ] Intégration Parcoursup (recommandations directes)

---

## 🆘 Support

Si vous rencontrez des problèmes :

1. **Vérifiez la documentation complète** : `SYSTEME_BILAN_ORIENTATION.md`
2. **Consultez les logs serveur** pour les erreurs détaillées
3. **Testez la clé Gemini** directement sur https://aistudio.google.com
4. **Contactez l'équipe technique** si le problème persiste

---

## ✅ Checklist de Mise en Production

- [ ] Variable `GEMINI_API_KEY` configurée sur Netlify/Vercel
- [ ] Base de données synchronisée (`npx prisma db push`)
- [ ] Test complet effectué (génération d'un bilan réel)
- [ ] Vérification des restrictions d'éligibilité
- [ ] Monitoring des logs activé
- [ ] Quota Gemini vérifié (gratuit ou payant)
- [ ] Documentation remise aux admins/développeurs

---

**C'est tout ! Le système est prêt à l'emploi. 🎉**

Pour toute question, consultez `SYSTEME_BILAN_ORIENTATION.md` pour la documentation complète.

