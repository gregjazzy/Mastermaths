# 🗂️ Master Maths - Architecture et Documentation Technique

## 📐 Vue d'ensemble de l'architecture

### Stack technique
- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Base de données** : PostgreSQL avec Prisma ORM
- **Authentification** : NextAuth.js
- **Paiements** : Stripe
- **Styling** : Tailwind CSS
- **Player vidéo** : Vimeo Player API

---

## 🏗️ Architecture des données

### Modèle hiérarchique
```
User (Utilisateur)
└── Performance (suivi par leçon)

Course (Classe/Formation)
└── Chapter (Chapitre)
    └── SubChapter (Sous-chapitre)
        └── Lesson (Leçon/Activité)
            └── QcmQuestion (pour les QCM)
            └── Performance (lien vers utilisateur)
```

### Statuts utilisateur
- **FREE** : Utilisateur gratuit - Accès marketing uniquement
- **DEMO** : Utilisateur en période d'essai - Accès à un cours complet de démo
- **PREMIUM** : Abonné payant - Accès illimité à tout le contenu

### Types de leçons (LessonType)
1. **VIDEO_COURS** : Vidéo de cours principale
2. **QCM** : Quiz à choix multiples
3. **CORRECTION_VIDEO** : Vidéo de correction (liée à un QCM)
4. **EXO_ECRIT** : Exercice écrit (PDF à télécharger)
5. **CARTOGRAPHIE** : Exercice de cartographie
6. **METHODE** : Leçon méthodologique

---

## 🔐 Système d'authentification

### Flow d'authentification
1. L'utilisateur s'inscrit via `/auth/register`
2. Le mot de passe est hashé avec bcrypt
3. Le compte est créé avec le statut `FREE` par défaut
4. La connexion se fait via `/auth/login`
5. NextAuth crée une session JWT
6. Le middleware protège les routes selon le statut

### Middleware de protection
- Routes `/dashboard/*` : Nécessite authentification
- Routes `/cours/*` : Nécessite authentification + vérification d'accès
- Vérification du statut utilisateur pour chaque cours/leçon

---

## 📊 Système de suivi de performance

### Table Performance
Chaque entrée représente la performance d'un utilisateur sur une leçon spécifique.

**Champs clés** :
- `videoProgressPercent` : Progression vidéo (0-100%)
- `quizScorePercent` : Score du QCM (0-100%)
- `isCompleted` : Statut de complétion (pour exercices écrits, méthodes, etc.)
- `hasViewedCorrection` : L'utilisateur a-t-il vu la vidéo de correction ?

### Calcul de la progression
```typescript
// Pour une vidéo
progression = videoProgressPercent

// Pour un QCM
progression = quizScorePercent

// Pour un exercice
progression = isCompleted ? 100 : 0

// Pour un sous-chapitre
progression = moyenne(progressions de toutes les leçons)

// Pour un chapitre
progression = moyenne(progressions de tous les sous-chapitres)

// Pour un cours
progression = moyenne(progressions de tous les chapitres)
```

---

## 🎥 Intégration Vimeo

### Fonctionnement
1. Le composant `VimeoPlayer` utilise `@vimeo/player`
2. L'API Vimeo émet des événements `timeupdate`
3. La progression est mise à jour tous les 5%
4. À 95%, la vidéo est marquée comme complétée
5. Les données sont envoyées à `/api/lessons/[lessonId]/video-progress`

### Format des URLs Vimeo acceptés
- `https://vimeo.com/123456789`
- `https://player.vimeo.com/video/123456789`
- `123456789` (ID seul)

---

## 📝 Système de QCM

### Structure
- Chaque QCM (Lesson de type QCM) peut avoir plusieurs QcmQuestion
- Chaque question a 4 options (tableau de strings)
- L'index de la bonne réponse est stocké dans `correctAnswer`
- Une explication optionnelle peut être fournie

### Flow utilisateur
1. L'utilisateur répond à toutes les questions
2. Clic sur "Soumettre mes réponses"
3. Le score est calculé côté client
4. Envoi à `/api/lessons/[lessonId]/qcm-score`
5. Enregistrement dans Performance
6. Affichage des corrections avec explications
7. **Si score < 100%** : Vérification et affichage de la vidéo de correction

---

## 🎬 Logique de vidéo de correction

### Déclenchement automatique
```typescript
// Conditions pour afficher la correction vidéo :
1. La leçon est un QCM
2. L'utilisateur a soumis le QCM
3. Le score est < 100%
4. Une CORRECTION_VIDEO est liée à ce QCM (via linkedQcmId)

// Alors :
- La vidéo de correction s'affiche sous le QCM
- Un bandeau orange explique pourquoi
- Le visionnage met à jour hasViewedCorrection = true
```

### Création d'une correction vidéo
```sql
-- Créer d'abord le QCM
INSERT INTO lessons (id, title, subChapterId, type, ...)
VALUES ('qcm-1', 'Test sur X', 'subchapter-1', 'QCM', ...);

-- Puis créer la vidéo de correction liée
INSERT INTO lessons (id, title, subChapterId, type, contentUrl, isCorrectionVideo, linkedQcmId, ...)
VALUES ('correction-1', 'Correction : Test sur X', 'subchapter-1', 'CORRECTION_VIDEO', 'https://vimeo.com/...', true, 'qcm-1', ...);
```

---

## 💳 Intégration Stripe

### Flow de paiement
1. Utilisateur clique sur "Passer à Premium"
2. Appel à `/api/stripe/create-checkout-session`
3. Création d'un customer Stripe (ou récupération)
4. Création d'une session de checkout
5. Redirection vers Stripe Checkout
6. Après paiement : redirection vers `/dashboard?success=true`
7. Webhook Stripe appelle `/api/stripe/webhook`
8. Mise à jour du statut utilisateur à `PREMIUM`

### Événements webhook
- `checkout.session.completed` → Mise à niveau PREMIUM
- `customer.subscription.updated` → Mise à jour du statut
- `customer.subscription.deleted` → Révocation de l'accès
- `invoice.payment_failed` → Notification (optionnel)

---

## 🎨 Système de design

### Palette de couleurs
```css
--master-dark: #1E3A5F      /* Bleu foncé principal */
--master-blue: #2C5F8D      /* Bleu moyen */
--master-turquoise: #00BCD4 /* Turquoise (CTA, liens) */
```

### Composants réutilisables
- **Boutons** : `.btn-primary`, `.btn-secondary`, `.btn-outline`
- **Cartes** : `.card` (avec hover shadow)
- **Inputs** : `.input` (avec focus ring turquoise)
- **Navigation** : `.nav-link`, `.nav-link-active`
- **Progression** : `.progress-bar` + `.progress-fill`

---

## 🔍 API Routes

### Authentification
- `POST /api/auth/register` : Créer un compte
- `POST /api/auth/[...nextauth]` : NextAuth handlers

### Cours et leçons
- `GET /api/courses/[courseId]/hierarchy` : Arborescence complète d'un cours
- `GET /api/lessons/[lessonId]` : Détails d'une leçon
- `POST /api/lessons/[lessonId]/complete` : Marquer comme complété
- `POST /api/lessons/[lessonId]/video-progress` : Mettre à jour progression vidéo
- `GET /api/lessons/[lessonId]/qcm` : Récupérer les questions d'un QCM
- `POST /api/lessons/[lessonId]/qcm-score` : Enregistrer le score du QCM
- `GET /api/lessons/[lessonId]/correction-status` : Vérifier si correction disponible

### Performance
- `GET /api/dashboard/performance` : Récupérer toutes les performances de l'utilisateur

### Paiement
- `POST /api/stripe/create-checkout-session` : Créer une session Stripe
- `POST /api/stripe/webhook` : Webhook Stripe (événements)

---

## 📱 Pages principales

### Pages publiques
- `/` : Landing page marketing
- `/auth/login` : Connexion
- `/auth/register` : Inscription
- `/upgrade` : Page de pricing avec plans

### Pages protégées
- `/dashboard` : Dashboard de performance de l'étudiant
- `/cours` : Liste des cours accessibles
- `/cours/[courseId]/lecon/[lessonId]` : Affichage d'une leçon avec sidebar de navigation

---

## 🧩 Composants React principaux

### CourseHierarchyNav
Navigation sidebar affichant la hiérarchie complète du cours avec :
- Expansion/collapse des chapitres et sous-chapitres
- Icônes selon le type de leçon
- Indicateurs de progression (barre, checkmark)
- Highlight de la leçon actuelle

### LessonViewer
Affichage dynamique du contenu selon le type :
- VIDEO_COURS → VimeoPlayer
- QCM → QcmComponent
- CORRECTION_VIDEO → VimeoPlayer + bandeau orange
- EXO_ECRIT/CARTOGRAPHIE/METHODE → Bouton "Marquer comme complété"

### VimeoPlayer
- Intégration Vimeo Player API
- Tracking de progression en temps réel
- Mise à jour automatique dans la base de données
- Loader pendant le chargement

### QcmComponent
- Affichage des questions avec options
- Validation que toutes les questions sont répondues
- Calcul et affichage du score
- Affichage des corrections avec explications
- Bouton "Réessayer"

### DashboardStudent
- Vue hiérarchique de tous les cours
- Statistiques globales (progression, cours, activités complétées)
- Expansion/collapse de la hiérarchie
- Indicateurs détaillés par leçon (vidéo %, QCM %, complétion, correction vue)

---

## 🚀 Déploiement

### Variables d'environnement requises
```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=secret-très-long-et-aléatoire
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Checklist de déploiement
- [ ] Base de données PostgreSQL provisionnée
- [ ] Variables d'environnement configurées
- [ ] `npx prisma generate` exécuté
- [ ] `npx prisma db push` exécuté
- [ ] Données de seed insérées (optionnel)
- [ ] Webhook Stripe configuré vers `/api/stripe/webhook`
- [ ] Domaine personnalisé configuré
- [ ] SSL activé
- [ ] Test de paiement effectué

---

## 📈 Améliorations futures suggérées

1. **Mode administrateur**
   - Interface de création de cours
   - Upload de vidéos vers Vimeo
   - Gestion des utilisateurs

2. **Notifications**
   - Emails de bienvenue
   - Rappels d'inactivité
   - Nouveaux cours disponibles

3. **Analytics avancées**
   - Temps moyen par leçon
   - Taux d'abandon
   - Heatmap de difficultés

4. **Gamification**
   - Badges de réussite
   - Classements
   - Streaks de connexion

5. **Collaboration**
   - Forum/discussions
   - Messages entre étudiants
   - Sessions en direct

6. **Accessibilité**
   - Support multi-langues
   - Sous-titres vidéos
   - Mode sombre

---

Cette architecture a été conçue pour être **scalable**, **maintenable** et **extensible**. Tous les composants sont modulaires et peuvent être facilement adaptés aux besoins futurs de Master Maths.


