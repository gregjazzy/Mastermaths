# 🏆 Système d'Engagement et de Badges - Master Maths

## 📋 Vue d'ensemble

Le système d'engagement de Master Maths permet de suivre et de récompenser l'activité et la performance des étudiants à travers :
- **Tracking de connexion quotidienne** : Compteur de jours actifs
- **Système de badges** : Récompenses débloquées selon des critères précis
- **Notifications multi-emails** : Jusqu'à 3 emails (élève + parents/tuteurs)
- **Évaluation automatique** : Les badges sont vérifiés après chaque activité

---

## 🗄️ Modèles de données mis à jour

### User (Utilisateur)
```typescript
{
  emailsNotification: String[]     // Jusqu'à 3 emails pour notifications
  connectionDaysCount: Int         // Compteur de jours de connexion avec activité
  lastConnectionDate: DateTime     // Dernière date de connexion comptabilisée
  badgesUnlocked: String[]         // Liste des IDs de badges obtenus
}
```

### Performance (Métriques)
```typescript
{
  connectionDaysCount: Int         // Jours où l'élève a suivi cette lesson
  badgesUnlocked: String[]         // Badges obtenus pour cette performance
}
```

### Badge (Nouveau modèle)
```typescript
{
  id: String
  name: String                     // Nom du badge
  description: String              // Description
  icon: String                     // URL ou nom d'icône
  criteria: Json                   // Critères de déclenchement
  type: String                     // Type: connection, performance, completion, perfect, master
  order: Int                       // Ordre d'affichage
}
```

---

## 🎯 Types de badges

### 1. Badges de connexion (type: connection)
Récompensent la régularité de connexion.

**Exemples** :
- 🔥 **Première Semaine** : 7 jours de connexion
- ⚡ **Régularité** : 30 jours de connexion
- 💪 **Persévérance** : 100 jours de connexion

**Critères** :
```json
{
  "connection_days_count": 30
}
```

### 2. Badges de performance (type: performance)
Récompensent les résultats aux QCM.

**Exemples** :
- 🎯 **Expert** : Moyenne de 90% aux QCM
- ⭐ **Perfection** : 5 QCM parfaits (100%)
- ✨ **Maître des QCM** : 20 QCM parfaits

**Critères** :
```json
{
  "quiz_success_rate": 90,
  "perfect_qcm_count": 5
}
```

### 3. Badges de complétion (type: completion)
Récompensent le nombre de leçons complétées.

**Exemples** :
- 📚 **Étudiant** : 10 leçons complétées
- 🎓 **Apprenant Assidu** : 50 leçons complétées
- 🏆 **Dévoué** : 100 leçons complétées

**Critères** :
```json
{
  "lessons_completed": 50
}
```

### 4. Badge ultime (type: master)
Combine plusieurs critères.

**Exemple** :
- 👑 **Master Maths** : 100 jours + 95% QCM + 100 leçons

**Critères** :
```json
{
  "connection_days_count": 100,
  "quiz_success_rate": 95,
  "lessons_completed": 100
}
```

---

## ⚙️ Logique de fonctionnement

### 1. Tracking de connexion quotidienne

**Quand** : À chaque fois que l'utilisateur charge le Dashboard

**API** : `POST /api/engagement/track-connection`

**Logique** :
```typescript
1. Récupérer la dernière date de connexion (lastConnectionDate)
2. Comparer avec la date du jour (sans les heures)
3. Si c'est un nouveau jour :
   - Incrémenter connectionDaysCount
   - Mettre à jour lastConnectionDate
   - Évaluer les badges
4. Sinon : Ne rien faire
```

**Implémentation** :
```typescript
// Dans DashboardStudent.tsx
useEffect(() => {
  trackConnection()
}, [])

const trackConnection = async () => {
  await fetch('/api/engagement/track-connection', {
    method: 'POST'
  })
}
```

### 2. Évaluation des badges

**Quand** : 
- Après complétion d'une vidéo (95%+)
- Après soumission d'un QCM
- Après marquage d'une leçon comme complétée
- Après incrémentation du compteur de connexion

**API** : `POST /api/engagement/badges`

**Logique** :
```typescript
1. Récupérer tous les badges non débloqués
2. Calculer les statistiques de l'utilisateur :
   - connection_days_count
   - quiz_success_rate (moyenne)
   - lessons_completed
   - perfect_qcm_count
   - video_completion_rate
3. Pour chaque badge :
   - Vérifier si tous les critères sont remplis
   - Si oui : ajouter le badge à badgesUnlocked
4. Retourner la liste des nouveaux badges
```

**Implémentation** :
```typescript
// Après complétion d'une activité
await fetch('/api/engagement/badges', {
  method: 'POST'
})
```

### 3. Affichage des badges

**Composant** : `BadgesSection.tsx`

**API** : `GET /api/engagement/badges`

**Affichage** :
- Grille responsive (1/2/3 colonnes)
- Icône avec gradient de couleur selon le type
- Nom et description du badge
- Critères affichés avec icônes
- Animation au survol
- Message d'encouragement

---

## 🎬 Logique de correction vidéo améliorée

### Conditions d'affichage

La vidéo de correction s'affiche **SEULEMENT** si :

1. ✅ La leçon est un QCM
2. ✅ L'utilisateur a soumis le QCM
3. ✅ Le score est **< 100%**
4. ✅ Une CORRECTION_VIDEO est liée au QCM (linkedQcmId)

### Implémentation

```typescript
const handleQcmComplete = async (score: number) => {
  // Évaluer les badges
  await fetch('/api/engagement/badges', { method: 'POST' })

  // Afficher la correction SEULEMENT si score < 100%
  if (score < 100 && lesson?.type === 'QCM') {
    await checkCorrectionVideoAvailability(lesson.id)
  } else if (score === 100) {
    // Score parfait : masquer la correction
    setShowCorrectionVideo(false)
    setCorrectionVideoUrl(null)
  }
}
```

### API de vérification

`GET /api/lessons/[lessonId]/correction-status`

**Retour** :
```json
{
  "shouldShowCorrection": true,
  "correctionVideoUrl": "https://vimeo.com/...",
  "correctionVideoId": "lesson-correction-1"
}
```

---

## 📊 Calcul des statistiques

### Service BadgeService

**Méthode** : `getUserStats(userId)`

**Retour** :
```typescript
{
  connection_days_count: 45,
  lessons_completed: 23,
  quiz_success_rate: 87.5,    // Moyenne des scores QCM
  perfect_qcm_count: 8,        // Nombre de QCM à 100%
  video_completion_rate: 92.3, // Moyenne de complétion vidéo
  total_lessons: 30
}
```

**Logique de complétion** :
```typescript
Une leçon est considérée complétée si :
- isCompleted = true OU
- videoProgressPercent >= 95 OU
- quizScorePercent >= 50
```

---

## 🔔 Système de notifications (prévu)

### Emails de notification

**Modèle** : `User.emailsNotification` (Array)

**Limite** : 3 emails maximum
- Email de l'élève
- Email parent 1
- Email parent 2

**Cas d'usage** :
- Nouveau badge débloqué
- X jours de connexion consécutifs
- Rappel d'inactivité
- Nouveau cours disponible

---

## 🚀 Installation et configuration

### 1. Mettre à jour la base de données

```bash
# Générer les migrations Prisma
npx prisma generate

# Appliquer les changements
npx prisma db push

# Insérer les badges par défaut
psql -U postgres -d mastermaths -f prisma/seed-badges.sql
```

### 2. Vérifier les routes API

Assurez-vous que ces routes existent :
- `POST /api/engagement/track-connection`
- `POST /api/engagement/badges`
- `GET /api/engagement/badges`

### 3. Composants à mettre à jour

- ✅ `DashboardStudent.tsx` : Import et affichage de `BadgesSection`
- ✅ `BadgesSection.tsx` : Nouveau composant
- ✅ `LessonViewer.tsx` : Évaluation badges après activités
- ✅ `VimeoPlayer.tsx` : Évaluation badges après vidéo complétée

---

## 📈 Métriques et analytics

### Requêtes utiles

**Statistiques utilisateur** :
```sql
SELECT 
  u.name,
  u.connectionDaysCount,
  array_length(u.badgesUnlocked, 1) as badges_count,
  COUNT(p.id) as total_performances,
  AVG(p.quizScorePercent) as avg_qcm_score
FROM users u
LEFT JOIN performances p ON p.userId = u.id
GROUP BY u.id;
```

**Badges les plus obtenus** :
```sql
SELECT 
  b.name,
  COUNT(*) as unlock_count
FROM badges b
CROSS JOIN LATERAL unnest(
  ARRAY(SELECT id FROM users WHERE b.id = ANY(badgesUnlocked))
) as user_badges
GROUP BY b.id, b.name
ORDER BY unlock_count DESC;
```

---

## 🎨 Design des badges

### Couleurs par type

```typescript
connection:  from-blue-500 to-blue-600      // Bleu
performance: from-yellow-500 to-yellow-600  // Jaune/Or
completion:  from-green-500 to-green-600    // Vert
perfect:     from-purple-500 to-purple-600  // Violet
master:      from-orange-500 to-orange-600  // Orange
```

### Icônes (Lucide React)

- Connection : `Zap`, `Flame`
- Performance : `Trophy`, `Target`
- Completion : `Award`, `Book`
- Perfect : `Star`, `Sparkles`
- Master : `Crown`

---

## 🔒 Sécurité

- ✅ Toutes les API requirent l'authentification
- ✅ Validation côté serveur des critères de badges
- ✅ Impossible de tricher (calculs serveur uniquement)
- ✅ Les badges ne peuvent pas être retirés une fois obtenus

---

## 🎯 Améliorations futures

1. **Notifications push** : Alertes temps réel lors de déblocage
2. **Badges secrets** : Critères cachés à découvrir
3. **Système de niveaux** : XP et paliers
4. **Classements** : Leaderboards par badges
5. **Partage social** : Partager ses badges sur les réseaux
6. **Badges temporaires** : Événements spéciaux
7. **Badges collaboratifs** : Défis en équipe

---

Cette documentation complète le système d'engagement de Master Maths. Toutes les fonctionnalités demandées sont maintenant implémentées et documentées ! 🎉


