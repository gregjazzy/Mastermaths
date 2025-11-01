# 🏆 Guide Complet du Système de Badges - Master Maths

**Dernière mise à jour : 1er Novembre 2025**

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Types de badges](#types-de-badges)
3. [Critères de déclenchement](#critères-de-déclenchement)
4. [Système de rareté](#système-de-rareté)
5. [Attribution automatique](#attribution-automatique)
6. [Personnalisation CSS](#personnalisation-css)
7. [Interface admin](#interface-admin)
8. [Exemples de badges](#exemples-de-badges)
9. [Créer de nouveaux badges](#créer-de-nouveaux-badges)

---

## 🎯 Vue d'ensemble

Le système de badges Master Maths est un **système de gamification automatique** qui récompense les élèves pour leur engagement et leurs progrès.

### Caractéristiques principales :
- ✅ **Attribution automatique** basée sur des critères mesurables
- ✅ **Personnalisation complète** avec CSS (animations, couleurs, effets)
- ✅ **4 niveaux de rareté** (COMMON, RARE, EPIC, LEGENDARY)
- ✅ **Points de maîtrise** (PMU) gagnés à chaque badge
- ✅ **Notifications email** automatiques lors du déblocage
- ✅ **Preview temps réel** dans l'interface admin

---

## 🎨 Types de badges

### 1. **Badges de Connexion** 🔥
Récompensent l'assiduité et la régularité de l'élève.

**Critère :** `connection_days_count`

**Exemples :**
- 🔥 **Première Semaine** : 7 jours de connexion
- ⚡ **Régularité** : 30 jours de connexion
- 💪 **Persévérance** : 100 jours de connexion

**Déclenchement :** Vérifié à chaque connexion quotidienne de l'élève.

---

### 2. **Badges de QCM** 🎯
Récompensent la performance aux quiz.

**Critères :**
- `quiz_success_rate` : Taux de réussite moyen aux QCM
- `perfect_qcm_count` : Nombre de QCM parfaits (100%)

**Exemples :**
- 🎯 **Expert QCM** : 90% de moyenne aux QCM
- ⭐ **Perfection** : 5 QCM parfaits
- ✨ **Maître des QCM** : 20 QCM parfaits

**Déclenchement :** Vérifié après chaque QCM complété.

---

### 3. **Badges de Leçons** 📚
Récompensent la progression dans le contenu pédagogique.

**Critère :** `lessons_completed`

**Exemples :**
- 📚 **Étudiant** : 10 leçons complétées
- 🎓 **Apprenant Assidu** : 50 leçons complétées
- 🏆 **Dévoué** : 100 leçons complétées

**Déclenchement :** Vérifié après chaque leçon marquée comme complétée.

---

### 4. **Badges Combinés** 👑
Nécessitent plusieurs critères simultanément (les plus prestigieux).

**Critères multiples :** Connexion + QCM + Leçons

**Exemple :**
- 👑 **Master Maths** : 100 jours de connexion + 95% aux QCM + 100 leçons complétées

**Déclenchement :** Vérifié à chaque action de l'élève (connexion, QCM, leçon).

---

### 5. **Badge de Bienvenue** 🎉
Badge d'accueil donné dès la première leçon complétée.

**Critère :** `lessons_completed: 1`

**Exemple :**
- 🎉 **Bienvenue** : Complétez votre première leçon

**Déclenchement :** Immédiatement après la première leçon.

---

## 🎲 Système de rareté

Chaque badge a un niveau de rareté qui définit sa valeur et son prestige.

### 🟢 COMMON (Commun)
- **Points de maîtrise :** 5-15 PMU
- **Difficulté :** Facile à obtenir
- **Exemples :** Bienvenue, Première Semaine, Étudiant
- **Couleur suggérée :** Vert, gris
- **Animation suggérée :** pulse douce, glow faible

### 🔵 RARE
- **Points de maîtrise :** 20-50 PMU
- **Difficulté :** Effort régulier requis
- **Exemples :** Régularité (30j), Expert QCM (90%), Apprenant Assidu (50 leçons)
- **Couleur suggérée :** Bleu, violet
- **Animation suggérée :** glow moyen, shimmer

### 🟣 EPIC (Épique)
- **Points de maîtrise :** 75-100 PMU
- **Difficulté :** Engagement soutenu
- **Exemples :** Persévérance (100j), Maître des QCM (20 parfaits), Dévoué (100 leçons)
- **Couleur suggérée :** Violet, magenta
- **Animation suggérée :** rotate, float, glow fort

### 🟡 LEGENDARY (Légendaire)
- **Points de maîtrise :** 200+ PMU
- **Difficulté :** Excellence exceptionnelle
- **Exemples :** Master Maths (100j + 95% + 100 leçons)
- **Couleur suggérée :** Or, arc-en-ciel
- **Animation suggérée :** Combinaisons complexes, glow ultra, rainbow

---

## ⚙️ Critères de déclenchement

Chaque badge est stocké avec un objet JSON `criteria` qui définit ses conditions d'obtention.

### Structure du JSON `criteria` :

```json
{
  "connection_days_count": 30,      // Nombre de jours de connexion uniques
  "quiz_success_rate": 90,          // Taux de réussite moyen aux QCM (%)
  "lessons_completed": 50,          // Nombre de leçons complétées
  "perfect_qcm_count": 5,           // Nombre de QCM parfaits (100%)
  "video_completion_rate": 80,      // Taux de complétion des vidéos (%)
  
  "animation": {                     // (Optionnel) Design du badge
    "animationType": "glow",
    "animationColor": "violet",
    "glowIntensity": "fort",
    "useCustomCSS": false,
    "customCSS": ""
  }
}
```

### Critères disponibles :

| Critère | Type | Description | Exemple |
|---------|------|-------------|---------|
| `connection_days_count` | number | Nombre de jours uniques de connexion | `30` |
| `quiz_success_rate` | number | Moyenne des scores QCM (0-100) | `90` |
| `lessons_completed` | number | Leçons marquées comme complétées | `50` |
| `perfect_qcm_count` | number | Nombre de QCM à 100% | `5` |
| `video_completion_rate` | number | Moyenne de complétion vidéo (0-100) | `80` |

### Combinaisons :

Un badge peut avoir **plusieurs critères simultanément** (condition `AND`).

**Exemple : Badge "Master Maths"**
```json
{
  "connection_days_count": 100,
  "quiz_success_rate": 95,
  "lessons_completed": 100
}
```
➡️ L'élève doit remplir **TOUS** ces critères pour débloquer le badge.

---

## 🤖 Attribution automatique

Le système évalue automatiquement les badges à chaque action de l'élève.

### Points de déclenchement :

1. **À chaque connexion quotidienne**
   - `BadgeService.incrementConnectionDaysCount(userId)`
   - Vérifie les badges de connexion

2. **Après chaque QCM complété**
   - `BadgeService.evaluateUserBadges(userId)`
   - Vérifie les badges de QCM

3. **Après chaque leçon complétée**
   - `BadgeService.evaluateUserBadges(userId)`
   - Vérifie les badges de leçons

### Processus d'évaluation :

```
1. Récupérer les badges déjà obtenus par l'utilisateur
2. Récupérer tous les badges disponibles dans la base
3. Pour chaque badge non obtenu :
   a. Récupérer les statistiques de l'utilisateur
   b. Vérifier si TOUS les critères sont remplis
   c. Si OUI :
      - Créer une entrée dans user_badges
      - Incrémenter les points de maîtrise (PMU)
      - Envoyer un email de félicitations
      - Déclencher une animation confetti sur le dashboard
4. Retourner la liste des nouveaux badges débloqués
```

### Code (simplifié) :

```typescript
// Dans lib/badge-service.ts
static async evaluateUserBadges(userId: string): Promise<string[]> {
  const newBadges: string[] = []
  const user = await prisma.user.findUnique({ where: { id: userId } })
  const stats = await this.getUserStats(userId)
  const allBadges = await prisma.badge.findMany()

  for (const badge of allBadges) {
    if (!userAlreadyHasBadge(badge.id)) {
      if (this.evaluateCriteria(badge.criteria, stats)) {
        await prisma.user_badges.create({ userId, badgeId: badge.id })
        await EmailService.sendBadgeUnlocked(user.email, badge.name)
        newBadges.push(badge.id)
      }
    }
  }

  return newBadges
}
```

---

## 🎨 Personnalisation CSS

Chaque badge peut avoir une apparence unique avec CSS personnalisé.

### Méthode 1 : Presets (Rapide) ⚡

**8 animations disponibles :**
- `pulse` : Pulsation douce
- `glow` : Lueur autour du badge
- `bounce` : Rebondissement
- `shake` : Tremblement
- `rotate` : Rotation
- `float` : Flottement vertical
- `shimmer` : Brillance qui passe
- `aucune` : Pas d'animation

**8 couleurs de dégradés :**
- `or` : Or/jaune
- `argent` : Argent/gris
- `bronze` : Bronze/cuivre
- `violet` : Violet/magenta
- `bleu` : Bleu/cyan
- `vert` : Vert/émeraude
- `rouge` : Rouge/orange
- `arc-en-ciel` : Dégradé multicolore

**4 intensités de lueur :**
- `faible` : Lueur subtile (10px)
- `moyen` : Lueur normale (20px)
- `fort` : Lueur marquée (30px)
- `ultra` : Lueur intense (50px)

**Exemple de configuration preset :**
```json
{
  "animation": {
    "animationType": "glow",
    "animationColor": "violet",
    "glowIntensity": "fort",
    "useCustomCSS": false
  }
}
```

---

### Méthode 2 : CSS Personnalisé (Avancé) 🎨

**Permet un contrôle total sur l'apparence du badge.**

#### Exemple 1 : Badge Légendaire avec animation complexe

```css
/* Badge Master Maths - Légendaire */
.badge-custom-animation {
  background: linear-gradient(
    135deg, 
    #FFD700 0%, 
    #FFA500 50%, 
    #FF8C00 100%
  );
  
  animation: 
    rotate 4s infinite linear,
    glow-pulse 2s infinite ease-in-out;
  
  box-shadow: 
    0 0 30px rgba(255, 215, 0, 0.8),
    0 0 60px rgba(255, 215, 0, 0.4),
    inset 0 0 20px rgba(255, 255, 255, 0.3);
  
  border: 3px solid #FFD700;
  border-radius: 50%;
  
  position: relative;
  transform-style: preserve-3d;
}

.badge-custom-animation::before {
  content: '✨';
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 24px;
  animation: sparkle 1.5s infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.8); }
  50% { box-shadow: 0 0 60px rgba(255, 215, 0, 1); }
}

@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1.2); }
}
```

#### Exemple 2 : Badge Rare avec effet shimmer

```css
.badge-custom-animation {
  background: linear-gradient(
    45deg,
    #667eea 0%,
    #764ba2 100%
  );
  
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(118, 75, 162, 0.6);
  border-radius: 50%;
}

.badge-custom-animation::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}
```

#### Exemple 3 : Badge Common simple

```css
.badge-custom-animation {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  animation: pulse 2s infinite ease-in-out;
  box-shadow: 0 0 10px rgba(72, 187, 120, 0.5);
  border-radius: 50%;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

---

### Upload de fichier CSS

**Via l'interface admin :**
1. Créer ou modifier un badge
2. Activer "CSS Personnalisé"
3. Cliquer sur la zone d'upload
4. Sélectionner un fichier `.css`
5. Preview automatique
6. Sauvegarder

**Le CSS sera stocké dans :** `criteria.animation.customCSS`

---

## 🖥️ Interface admin

### Accès : `/admin/badges`

**Fonctionnalités disponibles :**

1. **Liste des badges**
   - Affichage avec emoji, nom, rareté
   - Preview de l'animation en temps réel
   - Actions : Modifier / Supprimer

2. **Créer un badge**
   - Formulaire complet avec tous les champs
   - Choix preset ou CSS personnalisé
   - Preview temps réel avant sauvegarde

3. **Modifier un badge**
   - Édition de tous les paramètres
   - Changement d'animation
   - Upload nouveau CSS

4. **Supprimer un badge**
   - Confirmation avant suppression
   - Supprime aussi les attributions (user_badges)

### Champs du formulaire :

| Champ | Type | Description | Exemple |
|-------|------|-------------|---------|
| **Nom** | Texte | Nom du badge | "Première Semaine" |
| **Description** | Texte | Explication du badge | "Connectez-vous pendant 7 jours" |
| **Icône** | Emoji | Emoji représentant le badge | "🔥" |
| **Rareté** | Dropdown | COMMON/RARE/EPIC/LEGENDARY | COMMON |
| **Points PMU** | Nombre | Points de maîtrise gagnés | 10 |
| **Leçons requises** | Nombre | Critère `lessons_completed` | 10 |
| **Jours connexion** | Nombre | Critère `connection_days_count` | 7 |
| **Taux QCM** | Nombre | Critère `quiz_success_rate` | 90 |
| **QCM parfaits** | Nombre | Critère `perfect_qcm_count` | 5 |
| **Animation** | Preset/CSS | Design du badge | preset ou upload |

---

## 📊 Exemples de badges

### Badges par défaut (INIT_BADGES_DEFAULT.sql)

#### 🔥 Badges de Connexion

```sql
-- Première Semaine (COMMON)
{
  "name": "Première Semaine",
  "description": "Connectez-vous pendant 7 jours consécutifs",
  "icon": "🔥",
  "rarity": "COMMON",
  "masteryPoints": 10,
  "criteria": {
    "connection_days_count": 7
  }
}

-- Régularité (RARE)
{
  "name": "Régularité",
  "description": "Connectez-vous pendant 30 jours consécutifs",
  "icon": "⚡",
  "rarity": "RARE",
  "masteryPoints": 25,
  "criteria": {
    "connection_days_count": 30
  }
}

-- Persévérance (EPIC)
{
  "name": "Persévérance",
  "description": "Connectez-vous pendant 100 jours consécutifs",
  "icon": "💪",
  "rarity": "EPIC",
  "masteryPoints": 100,
  "criteria": {
    "connection_days_count": 100
  }
}
```

#### 🎯 Badges de QCM

```sql
-- Expert QCM (RARE)
{
  "name": "Expert QCM",
  "description": "Obtenez une moyenne de 90% aux QCM",
  "icon": "🎯",
  "rarity": "RARE",
  "masteryPoints": 30,
  "criteria": {
    "quiz_success_rate": 90
  }
}

-- Perfection (RARE)
{
  "name": "Perfection",
  "description": "Réalisez 5 QCM parfaits (100%)",
  "icon": "⭐",
  "rarity": "RARE",
  "masteryPoints": 20,
  "criteria": {
    "perfect_qcm_count": 5
  }
}

-- Maître des QCM (EPIC)
{
  "name": "Maître des QCM",
  "description": "Réalisez 20 QCM parfaits (100%)",
  "icon": "✨",
  "rarity": "EPIC",
  "masteryPoints": 75,
  "criteria": {
    "perfect_qcm_count": 20
  }
}
```

#### 📚 Badges de Leçons

```sql
-- Étudiant (COMMON)
{
  "name": "Étudiant",
  "description": "Complétez 10 leçons",
  "icon": "📚",
  "rarity": "COMMON",
  "masteryPoints": 15,
  "criteria": {
    "lessons_completed": 10
  }
}

-- Apprenant Assidu (RARE)
{
  "name": "Apprenant Assidu",
  "description": "Complétez 50 leçons",
  "icon": "🎓",
  "rarity": "RARE",
  "masteryPoints": 50,
  "criteria": {
    "lessons_completed": 50
  }
}

-- Dévoué (EPIC)
{
  "name": "Dévoué",
  "description": "Complétez 100 leçons",
  "icon": "🏆",
  "rarity": "EPIC",
  "masteryPoints": 100,
  "criteria": {
    "lessons_completed": 100
  }
}
```

#### 👑 Badge Légendaire

```sql
-- Master Maths (LEGENDARY)
{
  "name": "Master Maths",
  "description": "Le badge ultime : 100 jours de connexion, 95% aux QCM et 100 leçons",
  "icon": "👑",
  "rarity": "LEGENDARY",
  "masteryPoints": 500,
  "criteria": {
    "connection_days_count": 100,
    "quiz_success_rate": 95,
    "lessons_completed": 100
  }
}
```

#### 🎉 Badge de Bienvenue

```sql
-- Bienvenue (COMMON)
{
  "name": "Bienvenue",
  "description": "Complétez votre première leçon",
  "icon": "🎉",
  "rarity": "COMMON",
  "masteryPoints": 5,
  "criteria": {
    "lessons_completed": 1
  }
}
```

---

## 🛠️ Créer de nouveaux badges

### Étape 1 : Définir le concept

**Questions à se poser :**
- Quel comportement voulez-vous récompenser ?
- À quelle fréquence ce badge sera-t-il débloqué ?
- Quel niveau de difficulté (COMMON, RARE, EPIC, LEGENDARY) ?
- Combien de PMU devrait-il rapporter ?

**Exemples d'idées :**
- Badge "Nuit Blanche" : Se connecter entre 23h et 5h
- Badge "Week-end Studieux" : Compléter 5 leçons un samedi/dimanche
- Badge "Marathon" : 10 leçons complétées en une seule session
- Badge "Perfectionniste" : 10 QCM parfaits d'affilée
- Badge "Spécialiste [Thème]" : Compléter toutes les leçons d'un chapitre

---

### Étape 2 : Créer via l'interface admin

1. Aller sur `/admin/badges`
2. Cliquer sur **"Créer un badge"**
3. Remplir le formulaire :
   - Nom attractif
   - Description claire
   - Emoji représentatif
   - Rareté adaptée
   - Points PMU proportionnels
   - Critères précis
4. Choisir l'animation (preset ou CSS)
5. Preview
6. Sauvegarder

---

### Étape 3 : Tester le badge

**Méthode 1 : Test manuel**
1. Créer un compte de test
2. Effectuer les actions nécessaires
3. Vérifier l'attribution du badge
4. Vérifier l'email de notification

**Méthode 2 : Script de test SQL**
```sql
-- Forcer l'attribution d'un badge pour test
INSERT INTO user_badges (id, "userId", "badgeId", "unlockedAt")
VALUES (
  'test_user_badge_id',
  'user_id_here',
  'badge_id_here',
  NOW()
);
```

**Méthode 3 : API de test**
```bash
# Forcer l'évaluation des badges
curl -X POST https://master-maths.com/api/engagement/badges/evaluate \
  -H "Authorization: Bearer TOKEN" \
  -d '{"userId": "user_id_here"}'
```

---

### Étape 4 : Ajuster si nécessaire

**Critères trop faciles ?**
- Augmenter les valeurs numériques
- Ajouter des critères supplémentaires
- Changer la rareté

**Critères trop difficiles ?**
- Diminuer les valeurs
- Séparer en plusieurs badges progressifs
- Ajuster les PMU

**Animation pas assez visible ?**
- Augmenter l'intensité du glow
- Changer l'animation (ex: pulse → rotate)
- Ajouter des keyframes custom

---

## 📈 Quantité recommandée de badges

### Par niveau de rareté :

| Rareté | Quantité | Fréquence d'obtention | PMU moyen |
|--------|----------|----------------------|-----------|
| COMMON | 15-20 | Hebdomadaire | 5-15 |
| RARE | 10-15 | Mensuelle | 20-50 |
| EPIC | 5-10 | Trimestrielle | 75-150 |
| LEGENDARY | 2-5 | Annuelle | 200-500 |

### Total recommandé : **30-50 badges**

**Répartition par type :**
- 🔥 **Connexion** : 5-8 badges (7j, 14j, 30j, 60j, 100j, 365j, etc.)
- 🎯 **QCM** : 8-12 badges (%, parfaits, séries, etc.)
- 📚 **Leçons** : 8-12 badges (10, 25, 50, 100, 200, etc.)
- 🏆 **Combinés** : 3-5 badges (critères multiples)
- 🎉 **Spéciaux** : 5-10 badges (événements, thèmes, challenges)

---

## 🎓 Bonnes pratiques

### ✅ À FAIRE :

1. **Progression claire** : Créer des séries de badges (Bronze → Argent → Or)
2. **Noms inspirants** : "Maître des Équations" plutôt que "Badge QCM 3"
3. **Descriptions précises** : L'élève doit savoir comment l'obtenir
4. **Émojis cohérents** : Utiliser les mêmes familles d'émojis par type
5. **Animations adaptées** : COMMON = simple, LEGENDARY = spectaculaire
6. **Points proportionnels** : Plus difficile = plus de PMU
7. **Tester avant déploiement** : Vérifier les critères avec un compte test

### ❌ À ÉVITER :

1. **Badges trop faciles** : Dévaluent le système
2. **Critères impossibles** : Démotivent les élèves
3. **Trop de badges** : Dilue la valeur
4. **Animations trop lourdes** : Impact performance
5. **Descriptions vagues** : "Badge de progression" → Quoi exactement ?
6. **Doublons** : Deux badges pour la même chose
7. **PMU incohérents** : Un COMMON qui donne plus qu'un RARE

---

## 🔗 Fichiers liés

**Code source :**
- `lib/badge-service.ts` : Logique d'attribution
- `app/admin/badges/page.tsx` : Interface admin
- `app/api/admin/badges/route.ts` : API CRUD badges
- `components/BadgeDisplay.tsx` : Affichage des badges

**Documentation :**
- `LISTE_BADGES.md` : Liste complète des badges généraux
- `SYSTEME_BADGES_COMPLETE.md` : Documentation badges de maîtrise
- `INIT_BADGES_DEFAULT.sql` : Script d'initialisation

**Base de données :**
- Table `badges` : Définition des badges
- Table `user_badges` : Attribution aux utilisateurs
- Champ JSON `criteria` : Critères de déclenchement

---

## 🚀 Prochaines étapes

**Pour enrichir le système de badges :**

1. ✅ Créer 30-50 badges variés avec Cursor AI
2. ✅ Designer des CSS personnalisés pour les badges LEGENDARY
3. ✅ Tester avec des comptes élèves
4. ✅ Ajuster les critères selon les retours
5. 🔜 Créer un "Badge du Mois" spécial
6. 🔜 Ajouter des badges événementiels (Noël, rentrée, etc.)
7. 🔜 Créer des badges de compétition (leaderboard)
8. 🔜 Badges de mentorat (aider d'autres élèves)

---

## 💡 Template pour Cursor AI

**Copiez-collez ceci dans un nouveau chat Cursor pour générer des badges :**

```
Tu es un expert en gamification pour une plateforme éducative de mathématiques.

Crée 30 badges pour mon système Master Maths avec :

1. **15 badges COMMON** (5-15 PMU) :
   - Faciles à obtenir
   - Encouragent les premiers pas
   - Critères : 1-10 leçons, 3-7 jours connexion, 70% QCM

2. **10 badges RARE** (20-50 PMU) :
   - Nécessitent engagement régulier
   - Critères : 20-50 leçons, 14-30 jours, 80-90% QCM, 3-5 QCM parfaits

3. **4 badges EPIC** (75-150 PMU) :
   - Pour élèves dévoués
   - Critères : 75-100 leçons, 60-100 jours, 90%+ QCM, 10-20 QCM parfaits

4. **1 badge LEGENDARY** (500 PMU) :
   - Badge ultime
   - Critères multiples combinés

Pour chaque badge, génère :
- Un nom créatif et inspirant
- Une description claire (1 phrase)
- Un emoji représentatif
- Les critères précis en JSON
- Un design CSS unique et moderne

Format de sortie : JSON array prêt pour import SQL.
```

---

**📝 Guide créé le 1er Novembre 2025**
**🎯 Système de badges Master Maths v2.0**
**🚀 Prêt pour la création de contenu gamifié !**

