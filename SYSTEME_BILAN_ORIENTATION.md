# 🎯 Système de Bilan d'Orientation Piloté par IA

**Date de création :** 31 octobre 2025  
**Statut :** ✅ Implémenté et Fonctionnel  
**IA utilisée :** Gemini 1.5 Pro (Google)

---

## 📋 Vue d'Ensemble

Le **Bilan d'Orientation Piloté par IA** est un outil exclusif réservé aux abonnés annuels de Master Maths. Il analyse le profil complet d'un élève (performance académique, soft skills, aspirations) et génère un rapport personnalisé de conseil d'orientation post-bac.

### Caractéristiques Principales

- **Questionnaire exhaustif** : 6 étapes couvrant tous les aspects du profil (académique, linguistique, extrascolaire, aspirations)
- **💾 Sauvegarde automatique locale** : 
  - Enregistrement automatique dans le localStorage du navigateur
  - Reprise du questionnaire à tout moment
  - Message d'information clair pour l'utilisateur
  - Option pour effacer le brouillon et recommencer
- **Triple-passage IA** (système de double validation) :
  1. **Passage 1 (Génération)** : Gemini génère le bilan complet en 5 sections structurées
  2. **Passage 2 (Revue Psychopédagogique)** : Amélioration du ton, valorisation des soft skills, prise en compte des besoins spécifiques
  3. **Passage 3 (Revue Réalité du Terrain)** : Vérification de la faisabilité, cohérence des chiffres, actions SMART
- **Éligibilité stricte** :
  - Abonnement ANNUEL obligatoire
  - Après la période de rétractation (14 jours)
  - 1 bilan par an maximum
- **Validité** : 1 an à partir de la date de création
- **Longueur** : 1500-2000 mots (bilan complet et actionnable)

---

## 🏗️ Architecture Technique

### 1. Modèles de Données (Prisma)

#### `User` (modifié)
```prisma
model User {
  // ... champs existants
  subscriptionType      String?         // "MONTHLY" or "ANNUAL"
  subscriptionStartDate DateTime?       // Date de début d'abonnement
  subscriptionEndDate   DateTime?       // Date de fin d'abonnement
  orientationBilans     OrientationBilan[]
}
```

#### `OrientationBilan` (nouveau)
```prisma
model OrientationBilan {
  id             String   @id @default(cuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  questionnaire  Json     // Toutes les réponses du questionnaire
  analyse        Json     // Analyse structurée de l'IA (Passage 1)
  resultat       String   @db.Text // Message humanisé final (Passage 2)
  
  createdAt      DateTime @default(now())
  expiresAt      DateTime // createdAt + 1 an
  
  @@index([userId])
  @@index([createdAt])
  @@map("orientation_bilans")
}
```

### 2. Types TypeScript

Fichier : `/types/orientation.ts`

- `QuestionnaireOrientation` : Structure complète du questionnaire
- `PerformanceTrimestre` / `PerformanceAnnee` : Notes et classements
- `CertificationsLangues` : Scores TOEIC, TOEFL, SAT, etc.
- `AnalyseIA` : Structure de l'analyse générée par Gemini (Passage 1)
- `BilanOrientationComplet` : Bilan complet avec toutes les données

### 3. Pages et Routes

| Route | Description |
|-------|-------------|
| `/orientation` | Page principale du questionnaire (6 étapes) |
| `/orientation/resultat/[bilanId]` | Affichage du bilan généré |
| `/api/orientation/eligibility` | Vérification de l'éligibilité |
| `/api/orientation/create` | Génération du bilan (appel Gemini) |
| `/api/orientation/bilan/[bilanId]` | Récupération d'un bilan existant |

---

## 🧩 Questionnaire Complet

Le questionnaire se décompose en **6 étapes** :

### Étape 1 : Informations Générales
- Âge, genre
- 3 matières préférées / 3 matières difficiles
- Troubles de l'apprentissage (optionnel)
- Soutien scolaire actuel (optionnel)

### Étape 2 : Performance Académique
- Parcours en Première (3 trimestres) et Terminale (3 trimestres)
- Moyennes, classements, spécialités
- Contexte de classe (niveau Élevé/Moyen/Faible)

### Étape 3 : Méthodes de Travail
- Heures de travail quotidiennes et week-end
- Autonomie dans l'organisation
- Style d'apprentissage (visuel, auditif, kinesthésique)
- Principale source de stress

### Étape 4 : Compétences Linguistiques
- Niveau d'anglais (CECRL : A2, B1, B2, C1, C2)
- Certifications : TOEIC, TOEFL, IELTS, Cambridge
- Tests standardisés : SAT, ACT
- Autres langues (LV2/LV3)

### Étape 5 : Aspirations Post-Bac
- Filières souhaitées (Prépa, École, Université, BUT, etc.)
- Niveau d'ambition (Top 5, Top 15, etc.)
- Études à l'étranger envisagées ?
- Contraintes financières

### Étape 6 : Vie Extrascolaire & Soft Skills
- Activités extrascolaires
- Excellence particulière (leadership, compétitions, etc.)
- 3 qualités comportementales principales
- Accomplissement dont l'élève est le plus fier

---

## 🤖 Processus d'Analyse par IA (Gemini 1.5 Pro)

### Architecture du Triple Passage (Double Validation)

Le système utilise **3 passages successifs** de Gemini 1.5 Pro pour garantir un bilan à la fois **rigoureux** et **humain**.

---

### Passage 1 : Génération du Bilan Complet (5 Sections)

**Objectif :** Générer un bilan structuré et complet en 5 sections à partir des données du questionnaire.

**Prompt :**
```
🎯 MISSION : Vous êtes un Conseiller d'Orientation Pédagogique Expert.

Vous devez générer un Bilan Pédagogique et d'Orientation sur Mesure complet, professionnel, et humain.

📥 DONNÉES D'ENTRÉE :
[Questionnaire complet en JSON]

🔍 STRUCTURE DU BILAN REQUIS :

**1. SYNTHÈSE DU PROFIL ET DE LA TRAJECTOIRE**
- Synthèse Générale : Présenter l'élève (âge, genre, niveau) et résumer les principales forces et les domaines de vigilance identifiés.
- Analyse de la Trajectoire : Décrire la dynamique de performance (progression vs. déclin) en Première et Terminale.

**2. ADÉQUATION PERFORMANCE VS. AMBITION**
- Analyse de l'Alignement : Évaluer la cohérence entre la performance académique et le niveau d'ambition post-bac.
- Bilan Linguistique et International : Valider l'adéquation du niveau de langues et des scores SAT/TOEFL.
- Identification des Écarts : Pointer les matières où un écart de niveau est problématique.

**3. DIAGNOSTIC MÉTHODOLOGIQUE ET COMPORTEMENTAL**
- Habitudes de Travail : Évaluer l'équilibre de la charge de travail et le niveau d'autonomie.
- Soft Skills et Potentiel : Analyser les activités extrascolaires pour identifier les compétences transférables.

**4. RECOMMANDATIONS PÉDAGOGIQUES PRIORITAIRES**
- Proposer 3 à 5 actions concrètes et immédiates pour consolider le dossier.
- Prioriser les matières faibles qui menacent l'objectif d'orientation.

**5. SCÉNARIOS D'ORIENTATION (PLAN A, B, C)**
- Plan A (Idéal) : Valider l'orientation la plus ambitieuse souhaitée et lister les conditions impératives.
- Plan B (Sécurité) : Proposer une filière ou des établissements légèrement moins sélectifs.
- Conclusion : Rédiger une conclusion encourageante, centrée sur le potentiel.

**FORMAT DE RÉPONSE :**
Rédigez un document complet en Markdown, structuré avec des titres clairs (##, ###), des listes à puces, et un ton professionnel mais bienveillant. Longueur cible : 1500-2000 mots.
```

**Résultat** : Un bilan structuré de ~1500-2000 mots avec les 5 sections.

---

### Passage 2 : Revue Psychopédagogique (Soft Skills & Nuances)

**Objectif :** Améliorer le ton du bilan pour le rendre plus encourageant, valoriser les soft skills, et prendre en compte les besoins spécifiques.

**Prompt :**
```
🔍 REVUE 1 - FILTRE PSYCHOPÉDAGOGIQUE (Soft Skills et Nuances)

Vous êtes un psychopédagogue expert. Relisez le bilan suivant et AMÉLIOREZ-LE selon ces critères :

**BILAN INITIAL À AMÉLIORER :**
[Bilan du Passage 1]

**DONNÉES ORIGINALES (pour contexte) :**
[Questionnaire complet en JSON]

**CRITÈRES DE REVUE :**

1. **Ton et Motivation** : Est-ce que le langage est encourageant ? Les difficultés sont-elles présentées comme des défis à relever plutôt que des faiblesses insurmontables ?

2. **Valorisation du Non-Académique** : Les soft skills (leadership, rigueur, créativité) tirés des activités extrascolaires sont-ils suffisamment mis en avant et connectés aux exigences de l'orientation souhaitée ?

3. **Besoins Spécifiques** : Les recommandations prennent-elles en compte le style d'apprentissage et les éventuels besoins spécifiques (TDA/H, DYS) mentionnés ?

**INSTRUCTIONS :**
- Gardez la structure en 5 sections
- Améliorez le ton pour le rendre plus encourageant et personnalisé
- Renforcez les liens entre soft skills et orientation
- Ajoutez de l'empathie sans perdre en professionnalisme
- Retournez le bilan COMPLET et AMÉLIORÉ en Markdown
```

**Résultat** : Le bilan avec un ton plus humain, empathique et personnalisé.

---

### Passage 3 : Revue Réalité du Terrain (Faisabilité & Actions SMART)

**Objectif :** Vérifier la faisabilité des recommandations, la cohérence des chiffres, et s'assurer que toutes les actions sont SMART (Spécifiques, Mesurables, Atteignables, Pertinentes, Temporellement définies).

**Prompt :**
```
🔍 REVUE 2 - FILTRE RÉALITÉ DU TERRAIN / CONSEIL D'ADMISSION

Vous êtes un conseiller d'admission universitaire avec 15 ans d'expérience. Relisez le bilan suivant et AFFINEZ-LE selon ces critères :

**BILAN APRÈS REVUE PSYCHOPÉDAGOGIQUE :**
[Bilan du Passage 2]

**DONNÉES ORIGINALES (pour contexte) :**
[Questionnaire complet en JSON]

**CRITÈRES DE REVUE :**

1. **Faisabilité** : Les recommandations et les scénarios d'orientation sont-ils réalistes et actualisés par rapport aux exigences réelles de Parcoursup ou des admissions internationales ?

2. **Cohérence des Chiffres** : La critique de l'alignement Performance/Ambition est-elle factuelle et basée uniquement sur les données objectives (notes, rangs, scores SAT) ?

3. **Clarté des Actions** : Les actions sont-elles spécifiques, mesurables, atteignables, pertinentes et temporellement définies (SMART) ?

**INSTRUCTIONS :**
- Gardez la structure en 5 sections
- Assurez-vous que TOUTES les recommandations sont concrètes et réalisables
- Vérifiez que les Plans A/B/C sont réalistes compte tenu du profil
- Ajoutez des échéances précises aux actions (Ex: "d'ici décembre 2025")
- Retournez le bilan FINAL, COMPLET et OPTIMISÉ en Markdown
```

**Résultat Final** : Un bilan complet de 1500-2000 mots, structuré en 5 sections, avec :
- Ton encourageant et personnalisé
- Soft skills valorisés et connectés à l'orientation
- Recommandations réalistes et actions SMART avec échéances
- Plans A/B/C cohérents avec le profil

---

### Temps de Génération Estimé

- **Passage 1** : ~40-60 secondes
- **Passage 2** : ~40-60 secondes
- **Passage 3** : ~40-60 secondes
- **TOTAL** : **2-3 minutes**

---

### Structure du Bilan Final (5 Sections)

#### 1. 🎯 Synthèse du Profil et de la Trajectoire
- Présentation de l'élève
- Forces principales
- Domaines de vigilance
- Dynamique de performance (progression/déclin)

#### 2. 📊 Adéquation Performance vs. Ambition
- Alignement académique/ambition
- Bilan linguistique (scores TOEIC, SAT, etc.)
- Identification des écarts problématiques

#### 3. 🧠 Diagnostic Méthodologique et Comportemental
- Habitudes de travail
- Autonomie
- Style d'apprentissage
- Soft skills et activités extrascolaires

#### 4. 💡 Recommandations Pédagogiques Prioritaires
- 3 à 5 actions concrètes et SMART
- Priorisation des matières faibles
- Échéances précises

#### 5. 🚀 Scénarios d'Orientation (Plan A, B, C)
- Plan A (Idéal) : Conditions impératives
- Plan B (Sécurité) : Alternatives cohérentes
- Conclusion encourageante

---

## 🔒 Règles d'Éligibilité

### Conditions d'Accès

1. **Abonnement ANNUEL uniquement**
   - Les abonnés mensuels et gratuits n'ont pas accès
   - Message d'erreur : invite à upgrader vers l'abonnement annuel

2. **Après la période de rétractation (14 jours)**
   - Les 14 premiers jours après souscription = période de rétractation
   - Bilan disponible à partir du 15ème jour
   - Message d'erreur : indique la date de disponibilité

3. **Un bilan par an maximum**
   - Si un bilan valide existe déjà (< 1 an), accès refusé
   - L'utilisateur peut consulter son bilan existant
   - Nouveau bilan disponible après expiration (+ 1 an)

### Implémentation (API `/api/orientation/eligibility`)

```typescript
// Pseudo-code
if (user.subscriptionType !== 'ANNUAL') {
  return { eligible: false, message: "Abonnement annuel requis" }
}

const daysSinceSubscription = (now - subscriptionStartDate) / (1000*60*60*24)
if (daysSinceSubscription < 14) {
  return { eligible: false, message: "Période de rétractation en cours" }
}

const existingBilan = await findMostRecentBilan(userId)
if (existingBilan && existingBilan.expiresAt > now) {
  return { eligible: false, existingBilan, message: "Un bilan existe déjà" }
}

return { eligible: true }
```

---

## 📊 Affichage du Bilan

La page `/orientation/resultat/[bilanId]` affiche :

- **En-tête** :
  - Titre du bilan
  - Date de création
  - Date d'expiration
  - Bouton "Télécharger PDF" (fonctionnalité à venir)

- **Contenu** :
  - Message humanisé du Passage 2 (format Markdown)
  - Rendu avec `react-markdown` pour une typographie soignée

- **Sécurité** :
  - Vérification que le bilan appartient bien à l'utilisateur connecté
  - Accès refusé si `bilan.userId !== user.id`

---

## 🎨 UX et Interface

### Page Questionnaire (`/orientation`)

- **Barre de progression** : affiche l'étape actuelle (1/6, 2/6, etc.) avec pourcentage
- **Navigation** : boutons "Précédent" / "Suivant" / "Générer mon bilan"
- **Validation** : champs requis (`required`) pour éviter les soumissions incomplètes
- **Toast notifications** : feedback immédiat pendant la génération (1-2 minutes)

### Page Résultat (`/orientation/resultat/[bilanId]`)

- **Design moderne** : header violet avec icônes, card blanche pour le contenu
- **Responsive** : bouton PDF mobile + desktop
- **Typographie soignée** : `prose` de Tailwind pour le markdown
- **Avertissement** : note de confidentialité en bas de page

---

## 🔧 Configuration Requise

### Variables d'Environnement

Fichier `.env` :

```env
# Gemini AI (Google)
GEMINI_API_KEY=your_gemini_api_key_here

# Database (déjà configuré)
DATABASE_URL=your_database_url
```

### Dépendances NPM

```bash
npm install @google/generative-ai react-markdown
```

### Modèles Prisma

Synchroniser la base de données :

```bash
npx prisma db push
npx prisma generate
```

---

## 📈 Évolutions Futures

### Fonctionnalités Prévues

1. **Génération PDF** :
   - Export du bilan en PDF téléchargeable
   - Logo Master Maths + mise en page professionnelle

2. **Dashboard Admin** :
   - Statistiques sur les bilans générés
   - Liste des bilans par utilisateur
   - Modération/vérification si nécessaire

3. **Questionnaire Avancé** :
   - Tableaux détaillés pour chaque trimestre (moyennes par matière)
   - Upload de bulletins scolaires (analyse OCR)
   - Graphiques de progression

4. **Recommandations Améliorées** :
   - Liens directs vers Parcoursup
   - Intégration de bases de données d'écoles
   - Comparaison de profils anonymisés

5. **Suivi dans le Temps** :
   - Notifications 6 mois après le bilan (suivi des recommandations)
   - Mise à jour du bilan si nouvelles données disponibles

---

## 🐛 Gestion des Erreurs

### Cas d'Erreur Courants

| Erreur | Cause | Solution |
|--------|-------|----------|
| `Non authentifié` | Utilisateur non connecté | Redirection vers `/auth/login` |
| `Abonnement annuel requis` | User n'a pas `subscriptionType: "ANNUAL"` | Message d'erreur + lien vers `/upgrade` |
| `Période de rétractation` | < 14 jours depuis souscription | Message avec date de disponibilité |
| `Bilan déjà existant` | Un bilan valide existe | Affichage du bilan existant |
| `Erreur Gemini` | Problème API Gemini | Toast d'erreur + log serveur |
| `Timeout Gemini` | Génération > 2 minutes | Retry automatique ou message utilisateur |

### Logs et Monitoring

- Tous les appels Gemini sont loggés côté serveur
- Erreurs capturées dans `console.error` pour débogage
- Possibilité d'intégrer Sentry pour monitoring production

---

## 📝 Exemple de Bilan Généré

### Structure du Message (Passage 2)

```markdown
# 🎯 Votre Bilan d'Orientation Personnalisé

Bonjour [Prénom],

Après une analyse approfondie de votre profil académique, de vos compétences linguistiques et de votre parcours extrascolaire, voici mes recommandations pour votre orientation post-bac.

## 📊 Synthèse de Votre Profil

Vous êtes un élève de [niveau] avec des forces notables en [matières]. Votre trajectoire académique est [ascendante/stable] et votre potentiel est [description].

### Points Forts
- [Force 1]
- [Force 2]
- [Force 3]

### Axes d'Amélioration
- [Faiblesse 1]
- [Faiblesse 2]

## 💡 Recommandations de Filières

### 1. [Filière 1] (Adéquation : 90%)
[Justification détaillée]

**Établissements recommandés :**
- [École 1]
- [École 2]

### 2. [Filière 2] (Adéquation : 80%)
[Justification]

## 📋 Plan d'Action

### Court Terme (3 mois)
- [Action 1]
- [Action 2]

### Moyen Terme (6-12 mois)
- [Action 1]
- [Action 2]

### Long Terme (1-2 ans)
- [Action 1]
- [Action 2]

## ⚠️ Points de Vigilance

- [Alerte 1]
- [Alerte 2]

---

Ce bilan est conçu comme une feuille de route. N'hésitez pas à le relire régulièrement et à ajuster vos actions en fonction de vos progrès. Bonne chance dans votre parcours ! 🚀
```

---

## 🎓 Résumé Technique

| Aspect | Détail |
|--------|--------|
| **IA utilisée** | Gemini 1.5 Pro (Google) |
| **Nombre de passages** | 3 (Génération + 2 Revues) |
| **Temps de génération** | 2-3 minutes |
| **Coût par bilan** | ~$0.03-0.07 (dépend de Gemini pricing) |
| **Longueur du bilan** | 1500-2000 mots |
| **Structure** | 5 sections (Profil, Ambition, Diagnostic, Recommandations, Scénarios) |
| **Validité** | 1 an |
| **Fréquence max** | 1 bilan par an par utilisateur |
| **Éligibilité** | Abonnement ANNUEL après rétractation |
| **Format de stockage** | JSON (questionnaire + analyse) + Text (resultat) |
| **Sécurité** | Vérifié par userId, pas de partage |

---

## 🚀 Déploiement

### Checklist de Déploiement

- [x] Schéma Prisma mis à jour (`OrientationBilan` + champs `User`)
- [x] Base de données synchronisée (`npx prisma db push`)
- [x] Dépendances installées (`@google/generative-ai`, `react-markdown`)
- [ ] Variable `GEMINI_API_KEY` configurée dans `.env` (production)
- [ ] Tests d'éligibilité validés
- [ ] Tests de génération de bilan validés
- [ ] Affichage du bilan vérifié (markdown rendering)
- [ ] Sécurité API vérifiée (accès uniquement au propriétaire)

### Commandes de Déploiement

```bash
# 1. Build de production
npm run build

# 2. Déploiement sur Netlify
git add .
git commit -m "feat: Ajout du système de Bilan d'Orientation IA"
git push origin main

# 3. Configuration Netlify
# Ajouter GEMINI_API_KEY dans les variables d'environnement Netlify
```

---

## 📞 Support et Contact

Si vous rencontrez des problèmes ou avez des suggestions pour améliorer le système de bilan d'orientation, contactez l'équipe technique de Master Maths.

**Bon conseil d'orientation ! 🎯📚**

