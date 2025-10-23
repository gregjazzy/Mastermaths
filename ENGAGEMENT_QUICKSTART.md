# 🚀 Guide de mise à jour - Système d'Engagement

## ⚡ Installation rapide (5 minutes)

### Étape 1 : Mettre à jour la base de données

```bash
# 1. Générer le client Prisma avec les nouveaux modèles
npx prisma generate

# 2. Appliquer les changements de schéma
npx prisma db push

# 3. Insérer les 11 badges par défaut
psql -U postgres -d mastermaths -f prisma/seed-badges.sql
```

### Étape 2 : Vérifier que tout fonctionne

```bash
# Lancer le serveur de développement
npm run dev

# Ouvrir http://localhost:3000
```

### Étape 3 : Tester les fonctionnalités

1. **Connexion** :
   - Se connecter avec un compte
   - Le Dashboard charge → compteur de connexion incrémenté

2. **Complétion d'une leçon** :
   - Regarder une vidéo jusqu'à 95%+
   - Badge "Bienvenue" débloqué automatiquement

3. **QCM** :
   - Répondre à un QCM
   - Si score < 100% : vidéo de correction affichée
   - Si score = 100% : pas de correction, badge potentiel

4. **Badges** :
   - Section "Mes Badges" visible sur le Dashboard
   - Affiche tous les badges obtenus

---

## 📋 Checklist de vérification

### Base de données

- [ ] `npx prisma generate` exécuté sans erreur
- [ ] `npx prisma db push` appliqué avec succès
- [ ] Badges insérés (vérifier : `SELECT COUNT(*) FROM badges;`)
- [ ] Nouveaux champs User visibles (`connectionDaysCount`, `badgesUnlocked`)

### API Routes

- [ ] `POST /api/engagement/track-connection` répond 200
- [ ] `POST /api/engagement/badges` répond 200
- [ ] `GET /api/engagement/badges` retourne les badges

### Composants

- [ ] `BadgesSection` s'affiche dans le Dashboard
- [ ] Pas d'erreurs dans la console
- [ ] Badges animés au hover

### Logique métier

- [ ] Connexion quotidienne incrémentée (1x par jour max)
- [ ] Badges débloqués après activités
- [ ] Correction vidéo affichée seulement si score < 100%

---

## 🔍 Vérifications SQL

### Vérifier les badges insérés

```sql
SELECT id, name, type, criteria 
FROM badges 
ORDER BY "order";
```

Résultat attendu : 11 badges

### Vérifier les nouveaux champs User

```sql
SELECT 
  email, 
  "connectionDaysCount", 
  "lastConnectionDate",
  array_length("badgesUnlocked", 1) as badges_count
FROM users
LIMIT 5;
```

### Simuler un déblocage de badge

```sql
-- Donner 10 jours de connexion à un utilisateur de test
UPDATE users 
SET "connectionDaysCount" = 10
WHERE email = 'test@example.com';

-- Le badge "Première Semaine" devrait se débloquer à la prochaine connexion
```

---

## 🐛 Résolution de problèmes

### Erreur : "Badge model not found"

```bash
# Régénérer le client Prisma
rm -rf node_modules/.prisma
npx prisma generate
npm run dev
```

### Erreur : "Column connectionDaysCount does not exist"

```bash
# Forcer la mise à jour du schéma
npx prisma db push --force-reset
psql -U postgres -d mastermaths -f prisma/seed-badges.sql
```

### Les badges ne se débloquent pas

1. Vérifier les logs serveur :
```bash
# Regarder la console Next.js pour les erreurs
```

2. Tester manuellement l'API :
```bash
curl -X POST http://localhost:3000/api/engagement/badges \
  -H "Cookie: next-auth.session-token=..." \
  -H "Content-Type: application/json"
```

3. Vérifier les critères :
```sql
SELECT * FROM badges WHERE id = 'badge-welcome';
-- Critère devrait être : {"lessons_completed": 1}
```

### La correction vidéo s'affiche toujours

Vérifier dans `LessonViewer.tsx` :
```typescript
// Cette condition doit être présente
if (score < 100 && lesson?.type === 'QCM') {
  // Afficher correction
} else if (score === 100) {
  // Masquer correction
  setShowCorrectionVideo(false)
}
```

---

## 📊 Tester le système complet

### Test 1 : Connexion quotidienne

```javascript
// Ouvrir la console du navigateur sur le Dashboard
// Vérifier qu'il y a un appel à :
fetch('/api/engagement/track-connection', { method: 'POST' })

// Dans la BDD, vérifier :
SELECT "connectionDaysCount", "lastConnectionDate" 
FROM users 
WHERE email = 'votre@email.com';
```

### Test 2 : Badge de bienvenue

```javascript
// Compléter votre première leçon
// Dans BadgesSection, vous devriez voir :
// 🎉 Bienvenue - "Complétez votre première leçon"

// Vérifier dans la BDD :
SELECT "badgesUnlocked" 
FROM users 
WHERE email = 'votre@email.com';
// Devrait contenir : ["badge-welcome"]
```

### Test 3 : Correction vidéo conditionnelle

```javascript
// 1. Faire un QCM avec un mauvais score (< 100%)
//    → La correction vidéo s'affiche

// 2. Réessayer le QCM et obtenir 100%
//    → La correction disparaît

// Vérifier dans la BDD :
SELECT 
  l.title,
  p."quizScorePercent",
  p."hasViewedCorrection"
FROM performances p
JOIN lessons l ON l.id = p."lessonId"
WHERE p."userId" = 'votre-user-id' 
  AND l.type = 'QCM';
```

---

## 🎯 Créer des badges personnalisés

### Exemple : Badge "Mathématicien"

```sql
INSERT INTO badges (
  id, 
  name, 
  description, 
  icon, 
  criteria, 
  type, 
  "order",
  "createdAt",
  "updatedAt"
)
VALUES (
  'badge-mathematicien',
  '🧮 Mathématicien',
  'Complétez 200 leçons avec une moyenne de 95% aux QCM',
  'calculator',
  '{"lessons_completed": 200, "quiz_success_rate": 95}',
  'master',
  11,
  NOW(),
  NOW()
);
```

### Exemple : Badge "Marathon"

```sql
INSERT INTO badges (
  id, 
  name, 
  description, 
  icon, 
  criteria, 
  type, 
  "order",
  "createdAt",
  "updatedAt"
)
VALUES (
  'badge-marathon',
  '🏃 Marathon',
  'Connectez-vous 365 jours',
  'running',
  '{"connection_days_count": 365}',
  'connection',
  12,
  NOW(),
  NOW()
);
```

---

## 📈 Monitoring et analytics

### Requête : Utilisateurs les plus actifs

```sql
SELECT 
  u.name,
  u."connectionDaysCount",
  array_length(u."badgesUnlocked", 1) as badges_count,
  COUNT(p.id) as total_lessons
FROM users u
LEFT JOIN performances p ON p."userId" = u.id
WHERE u.status IN ('DEMO', 'PREMIUM')
GROUP BY u.id, u.name, u."connectionDaysCount", u."badgesUnlocked"
ORDER BY u."connectionDaysCount" DESC
LIMIT 10;
```

### Requête : Badges les plus rares

```sql
WITH badge_counts AS (
  SELECT 
    b.id,
    b.name,
    COUNT(DISTINCT u.id) as user_count
  FROM badges b
  LEFT JOIN users u ON b.id = ANY(u."badgesUnlocked")
  GROUP BY b.id, b.name
)
SELECT 
  name,
  user_count,
  ROUND(user_count::decimal / (SELECT COUNT(*) FROM users) * 100, 2) as percentage
FROM badge_counts
ORDER BY user_count ASC;
```

### Requête : Taux d'engagement par jour

```sql
SELECT 
  DATE("lastConnectionDate") as date,
  COUNT(DISTINCT "userId") as active_users
FROM users
WHERE "lastConnectionDate" >= NOW() - INTERVAL '30 days'
GROUP BY DATE("lastConnectionDate")
ORDER BY date DESC;
```

---

## 🔐 Sécurité

### Vérifications automatiques

✅ Toutes les API nécessitent l'authentification  
✅ Les calculs de badges sont côté serveur uniquement  
✅ Impossible de manipuler les critères depuis le client  
✅ Les badges ne peuvent pas être retirés une fois obtenus  
✅ Le compteur de connexion est limité à 1x par jour  

### Audit de sécurité

```sql
-- Vérifier qu'aucun utilisateur n'a de valeurs aberrantes
SELECT 
  email,
  "connectionDaysCount",
  array_length("badgesUnlocked", 1) as badges_count
FROM users
WHERE "connectionDaysCount" > 365  -- Plus d'un an impossible
   OR array_length("badgesUnlocked", 1) > 20;  -- Trop de badges suspect
```

---

## 🎨 Personnalisation du design

### Modifier les couleurs des badges

Dans `components/BadgesSection.tsx` :

```typescript
const getBadgeColor = (type: string) => {
  switch (type) {
    case 'connection':
      return 'from-blue-500 to-blue-600'      // ← Changer ici
    case 'performance':
      return 'from-yellow-500 to-yellow-600'  // ← Ou ici
    // ...
  }
}
```

### Ajouter de nouvelles icônes

```typescript
import { NewIcon } from 'lucide-react'

const getBadgeIcon = (type: string) => {
  switch (type) {
    case 'nouveau_type':
      return <NewIcon className="w-8 h-8" />
    // ...
  }
}
```

---

## 📞 Support

### Logs utiles

```bash
# Voir les appels API d'engagement
# Dans la console du navigateur, filtrer par "engagement"

# Voir les logs serveur Next.js
# Terminal où tourne `npm run dev`

# Voir les requêtes SQL
# Activer dans prisma/schema.prisma :
# log: ['query', 'error', 'warn']
```

### Contacts

- Documentation : `ENGAGEMENT_SYSTEM.md`
- Architecture : `ARCHITECTURE.md`
- Guide rapide : `QUICKSTART.md`

---

**Le système d'engagement est maintenant opérationnel ! 🚀🏆✨**

Consultez `ENGAGEMENT_UPDATE.md` pour voir toutes les fonctionnalités implémentées.


