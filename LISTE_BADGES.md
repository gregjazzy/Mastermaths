# 🎖️ LISTE COMPLÈTE DES BADGES - Master Maths

## 📊 Vue d'ensemble

**Total de badges** : 11 badges généraux + badges de maîtrise (Or/Argent/Bronze)

**Catégories de badges généraux** :
- 🟢 **COMMUN** : 3 badges de démarrage
- 🔵 **RARE** : 3 badges de progression
- 🟣 **ÉPIQUE** : 3 badges de persévérance
- 🟡 **LÉGENDAIRE** : 2 badges d'excellence absolue

---

## 🟢 BADGES COMMUNS (Démarrage)

### 1. Bienvenue chez Master Maths 🎉
**Rareté** : COMMUN  
**PMU** : 50  
**Critères** : Aucun (attribué automatiquement à l'inscription)  
**Description** : Félicitations pour votre inscription ! Votre aventure mathématique commence maintenant.

### 2. Première Leçon 📚
**Rareté** : COMMUN  
**PMU** : 100  
**Critères** : Compléter 1 leçon  
**Description** : Vous avez terminé votre première leçon. Un bon début !

### 3. Premier QCM Parfait 🏆
**Rareté** : COMMUN  
**PMU** : 150  
**Critères** : Obtenir 100% à 1 QCM  
**Description** : Score de 100% à votre premier QCM. Excellent travail !

---

## 🔵 BADGES RARES (Progression)

### 4. Étudiant Assidu 📖
**Rareté** : RARE  
**PMU** : 300  
**Critères** : Compléter 10 leçons  
**Description** : Vous avez complété 10 leçons. Votre détermination porte ses fruits !

### 5. Expert en QCM ⭐
**Rareté** : RARE  
**PMU** : 400  
**Critères** : Obtenir 100% à 5 QCM  
**Description** : Vous avez obtenu 5 QCM parfaits. Votre maîtrise est impressionnante !

### 6. Moyenne d'Excellence 💯
**Rareté** : RARE  
**PMU** : 500  
**Critères** : Moyenne de 90% ou plus sur tous les QCM  
**Description** : Moyenne de 90% ou plus sur tous vos QCM. Brillant !

---

## 🟣 BADGES ÉPIQUES (Persévérance)

### 7. Streak de Feu 🔥
**Rareté** : ÉPIQUE  
**PMU** : 600  
**Critères** : Se connecter 7 jours consécutifs  
**Description** : Vous vous êtes connecté 7 jours d'affilée. Votre discipline est remarquable !

### 8. Marathonien 🏃
**Rareté** : ÉPIQUE  
**PMU** : 1000  
**Critères** : Se connecter 30 jours consécutifs  
**Description** : Vous vous êtes connecté 30 jours d'affilée. Un engagement exceptionnel !

### 9. Maître des Leçons 🎓
**Rareté** : ÉPIQUE  
**PMU** : 800  
**Critères** : Compléter 50 leçons  
**Description** : Vous avez complété 50 leçons. Votre savoir grandit de jour en jour !

---

## 🟡 BADGES LÉGENDAIRES (Excellence Absolue)

### 10. Légende Vivante 👑
**Rareté** : LÉGENDAIRE  
**PMU** : 2000  
**Critères** : Se connecter 100 jours consécutifs  
**Description** : Vous vous êtes connecté 100 jours d'affilée. Vous êtes une source d'inspiration !

### 11. Perfectionniste Ultime 💎
**Rareté** : LÉGENDAIRE  
**PMU** : 1500  
**Critères** : Obtenir 100% à 20 QCM  
**Description** : Vous avez obtenu 20 QCM parfaits. Vous êtes au sommet de votre art !

---

## 🏅 BADGES DE MAÎTRISE (Automatiques)

Ces badges sont attribués automatiquement en fonction des performances aux QCM.

### Badges par Leçon
- 🥉 **Bronze** : Score 80-89% (+20 PMU)
- 🥈 **Argent** : Score 90-99% (+40 PMU)
- 🥇 **Or** : Score 100% (+60 PMU)

### Badges par Chapitre
- ✅ **Chapitre Complété** : Toutes les leçons terminées (+100 PMU)
- ⭐ **Chapitre Maîtrisé** : Toutes les leçons en Or (+200 PMU)

### Badges par Cours
- 🎓 **Cours Diplômé** : Tous les chapitres complétés (+500 PMU)
- 👑 **Excellence** : Tous les chapitres maîtrisés (+1000 PMU)

---

## 📊 Répartition des PMU

**Total PMU disponibles (badges généraux)** : 8 250 PMU

**Par rareté** :
- COMMUN : 300 PMU (3 badges)
- RARE : 1 200 PMU (3 badges)
- ÉPIQUE : 2 400 PMU (3 badges)
- LÉGENDAIRE : 3 500 PMU (2 badges)

**+ Badges de maîtrise** : PMU illimités (dépendent de la performance)

---

## 🔧 Structure des Critères (JSON)

Les critères sont stockés au format JSON dans la colonne `criteria` :

```json
{
  "connection_days_count": 7,        // Nombre de jours de connexion
  "lessons_completed": 10,           // Nombre de leçons complétées
  "perfect_qcm_count": 5,            // Nombre de QCM à 100%
  "quiz_success_rate": 90            // Moyenne des scores QCM (%)
}
```

**Logique d'évaluation** : Tous les critères doivent être remplis (AND logique)

---

## 📝 Installation

**Exécuter dans Supabase → SQL Editor** :

1. Ouvrir le fichier `seed-badges.sql`
2. Copier tout le contenu
3. Coller dans SQL Editor
4. Cliquer sur "Run"

**Vérification** : La dernière requête du script affiche tous les badges créés.

---

## 🎯 Attribution Automatique

Les badges sont évalués automatiquement dans ces situations :
- **À l'inscription** : Badge "Bienvenue"
- **Après chaque connexion** : Badges de streak
- **Après chaque leçon complétée** : Badges de progression
- **Après chaque QCM** : Badges de performance

Le système vérifie tous les critères et attribue le badge si toutes les conditions sont remplies.

---

## 💡 Personnalisation

Vous pouvez facilement :
- **Ajouter de nouveaux badges** : Insérer une nouvelle ligne dans `badges`
- **Modifier les critères** : Mettre à jour la colonne `criteria` (JSON)
- **Ajuster les PMU** : Modifier la colonne `masteryPoints`
- **Changer l'ordre d'affichage** : Modifier la colonne `order`

**Exemple - Ajouter un badge "Marathonien Ultime"** :
```sql
INSERT INTO badges (id, name, description, icon, rarity, "masteryPoints", "order", criteria)
VALUES (
  'badge_marathonien_ultime',
  'Marathonien Ultime',
  'Connexion pendant 365 jours consécutifs !',
  '🔥',
  'LÉGENDAIRE',
  5000,
  12,
  '{"connection_days_count": 365}'::jsonb
);
```

---

## 📈 Progression Suggérée pour les Élèves

**Semaine 1** :
- 🎉 Bienvenue (inscription)
- 📚 Première Leçon
- 🏆 Premier QCM Parfait

**Mois 1** :
- 📖 Étudiant Assidu (10 leçons)
- 🔥 Streak de Feu (7 jours)
- ⭐ Expert en QCM (5 QCM parfaits)

**Trimestre 1** :
- 🏃 Marathonien (30 jours)
- 🎓 Maître des Leçons (50 leçons)
- 💯 Moyenne d'Excellence (90% moyenne)

**Année 1** :
- 👑 Légende Vivante (100 jours)
- 💎 Perfectionniste Ultime (20 QCM parfaits)

---

**Fichier SQL** : `seed-badges.sql`  
**Documentation** : Ce fichier (`LISTE_BADGES.md`)

