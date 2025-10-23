# 📚 Master Maths - Plateforme LMS Complète

## 🎯 Vue d'ensemble

**Master Maths** est une plateforme LMS (Learning Management System) complète pour l'enseignement des mathématiques, intégrant gamification, tracking avancé, et gestion multi-niveaux.

---

## ✨ Fonctionnalités Principales

### 🏗️ **Architecture Robuste**
- Next.js 14 + TypeScript
- PostgreSQL + Prisma ORM
- NextAuth (authentification)
- Tailwind CSS (design)
- Architecture RESTful

### 📚 **Système de Cours**
- **Hiérarchie profonde** : Course → Chapter → SubChapter → Lesson
- **6 types de leçons** : VIDEO_COURS, QCM, CORRECTION_VIDEO, EXO_ECRIT, CARTOGRAPHIE, METHODE
- **Contrôle d'accès à 3 niveaux** : FREE, DEMO, PREMIUM
- **Contenus additionnels** : Carte mentale, Répertoire lycées par chapitre

### 🎮 **Gamification Complète**
- **Points de Maîtrise Universelle (PMU)**
  - Historique (all-time)
  - Mensuel (reset chaque mois)
  - Hebdomadaire (reset chaque semaine)
- **13 Titres évolutifs** (de Novice à Grand Maître)
- **Système de badges à 5 raretés** : Commun, Rare, Épique, Légendaire, Secret
- **Hall of Fame** avec 3 classements
- **Récompenses** : Top 10 historique + Top 5% mensuel = cours gratuit

### 📊 **Tracking Ultra-Détaillé**
- **Progression vidéo** : % exact avec Vimeo API
- **Scores QCM** : Enregistrement de chaque tentative
- **Streak de connexion** : Jours consécutifs
- **Temps de connexion** : Durée exacte par session
- **Historique complet** : Toutes les activités

### 📧 **Système d'Emails Automatisés**
- Rappels d'inactivité (3, 7, 14 jours)
- Célébrations de milestones (7, 30, 100 jours)
- Support multi-emails (parents)
- Templates personnalisables

### 💳 **Paiement Stripe**
- 3 formules : FREE (0€), DEMO (29€), PREMIUM (79€)
- Webhooks automatiques
- Gestion d'abonnements
- Mode test intégré

### 👨‍👩‍👧 **Dashboard Multi-Rôles**
- **Dashboard Étudiant** : PMU, badges, progression, temps
- **Dashboard Parent** : Suivi de plusieurs enfants
- **Statistiques détaillées** : Graphiques, moyennes, classements

---

## 📁 Structure du Projet

```
MasterMaths/
├── app/
│   ├── api/                          # APIs REST
│   │   ├── auth/                     # Authentification
│   │   │   ├── [...nextauth]/        # NextAuth handler
│   │   │   └── register/             # Inscription
│   │   ├── courses/                  # Gestion des cours
│   │   │   └── [courseId]/hierarchy/ # Hiérarchie du cours
│   │   ├── lessons/                  # Gestion des leçons
│   │   │   └── [lessonId]/
│   │   │       ├── complete/         # Marquer comme complété
│   │   │       ├── qcm/              # Questions QCM
│   │   │       ├── qcm-score/        # Soumettre score
│   │   │       ├── video-progress/   # Progression vidéo
│   │   │       └── correction-status/# Status correction
│   │   ├── engagement/               # Gamification & Tracking
│   │   │   ├── track-connection/     # Connexion
│   │   │   ├── badges/               # Badges
│   │   │   ├── heartbeat/            # Session active
│   │   │   ├── disconnect/           # Déconnexion
│   │   │   ├── time-stats/           # Stats temps
│   │   │   ├── streak-stats/         # Stats streak
│   │   │   └── connection-history/   # Historique
│   │   ├── dashboard/                # Dashboards
│   │   │   ├── performance/          # Performance élève
│   │   │   ├── user-stats/           # Stats utilisateur
│   │   │   └── parent/               # Dashboard parent
│   │   ├── leaderboard/              # Classements
│   │   │   ├── historical/           # Hall of Fame historique
│   │   │   ├── monthly/              # Classement mensuel
│   │   │   └── weekly/               # Classement hebdomadaire
│   │   ├── stripe/                   # Paiements
│   │   │   ├── create-checkout-session/
│   │   │   └── webhook/              # Webhooks Stripe
│   │   └── cron/                     # Tâches automatisées
│   │       └── send-reminders/       # Emails de rappel
│   ├── auth/                         # Pages authentification
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/                    # Dashboards
│   │   └── parent/                   # Dashboard parent
│   ├── hall-of-fame/                 # Page Hall of Fame
│   ├── cours/                        # Pages de cours
│   │   ├── [courseId]/lecon/[lessonId]/
│   │   └── page.tsx
│   ├── upgrade/                      # Page pricing
│   ├── layout.tsx                    # Layout racine
│   └── page.tsx                      # Page d'accueil
├── components/                       # Composants React
│   ├── BadgesSection.tsx             # Affichage badges
│   ├── BadgeShowcase.tsx             # Showcase badges
│   ├── ConnectionStats.tsx           # Stats connexion
│   ├── CourseHierarchyNav.tsx        # Navigation cours
│   ├── DashboardParent.tsx           # Dashboard parent
│   ├── DashboardStudent.tsx          # Dashboard étudiant
│   ├── LeaderboardWidget.tsx         # Widget classement
│   ├── LessonViewer.tsx              # Viewer de leçon
│   ├── LyceesRepertoireViewer.tsx    # Viewer répertoire
│   ├── MentalMapViewer.tsx           # Viewer carte mentale
│   ├── Navbar.tsx                    # Barre de navigation
│   ├── QcmComponent.tsx              # Composant QCM
│   ├── SessionProvider.tsx           # Provider NextAuth
│   ├── SessionTracker.tsx            # Tracking session
│   ├── StreakDisplay.tsx             # Affichage streak
│   ├── TimeStatsDisplay.tsx          # Stats temps
│   └── VimeoPlayer.tsx               # Lecteur Vimeo
├── lib/                              # Services & utilitaires
│   ├── access-control.ts             # Contrôle d'accès
│   ├── auth.ts                       # Config NextAuth
│   ├── badge-service.ts              # Service badges
│   ├── connection-service.ts         # Service connexion
│   ├── email-service.ts              # Service emails
│   ├── mastery-points-service.ts     # Service PMU
│   └── prisma.ts                     # Client Prisma
├── prisma/
│   ├── schema.prisma                 # Modèles de données
│   ├── seed.sql                      # Données de test
│   └── seed-badges.sql               # Badges initiaux
├── types/
│   └── next-auth.d.ts                # Types NextAuth
├── public/                           # Assets statiques
│   └── images/
├── middleware.ts                     # Middleware routes
├── next.config.js                    # Config Next.js
├── tailwind.config.js                # Config Tailwind
└── Documentation/
    ├── ARCHITECTURE.md               # Architecture complète
    ├── DEMARRAGE_RAPIDE.md           # Guide démarrage
    ├── ENGAGEMENT_SYSTEM.md          # Système engagement
    ├── TIME_TRACKING_SYSTEM.md       # Tracking temps
    ├── QUICKSTART.md                 # Quick start
    └── README.md                     # README principal
```

---

## 🗄️ Modèles de Données

### **User** (Utilisateur)
- Informations de base (email, nom, mot de passe)
- Status (FREE/DEMO/PREMIUM)
- Gamification (PMU, titres, badges)
- Connexions (streak, lastConnection)
- Multi-emails pour parents

### **Course** (Cours)
- Titre, description
- Niveau d'accès (FREE/DEMO/PREMIUM)
- Relations avec chapitres

### **Chapter** (Chapitre)
- Titre, ordre
- Carte mentale (optionnel)
- Répertoire lycées (optionnel)

### **SubChapter** (Sous-chapitre)
- Titre, ordre
- Relations avec leçons

### **Lesson** (Leçon)
- 6 types possibles
- Vimeo video ID
- QCM lié
- Metadata

### **Performance** (Progression)
- User + Lesson
- Progression vidéo (%)
- Score QCM (%)
- Completion status

### **Badge** (Badge)
- Nom, description, icône
- Critères (JSON)
- Rareté, points, ordre

### **ConnectionLog** (Log de connexion)
- User, timestamps
- Durée, IP, User-Agent

### **QcmQuestion** (Question QCM)
- Question, options
- Bonne réponse
- Explication

---

## 🎨 Design System

### **Couleurs**
```css
--master-dark: #1E3A5F       /* Bleu foncé */
--master-blue: #2C5F8D       /* Bleu moyen */
--master-turquoise: #00BCD4  /* Turquoise */
```

### **Composants CSS**
- `.btn-primary` : Boutons principaux
- `.btn-secondary` : Boutons secondaires
- `.card` : Cartes uniformes
- `.input` : Champs de formulaire
- `.progress-bar` : Barres de progression

---

## 📊 Calcul des PMU (Points de Maîtrise)

### **Sources de PMU**
| Action | PMU |
|--------|-----|
| Vidéo complétée (95%+) | 100 |
| Vidéo partielle | 1/% |
| QCM 100% | 200 |
| QCM 80-99% | 150 |
| QCM 50-79% | 100 |
| Exercice complété | 80 |
| Badge commun | 50 |
| Badge rare | 150 |
| Badge épique | 300 |
| Badge légendaire | 500 |
| Badge secret | 1000 |
| Jour de streak | 10 |

### **Titres**
| PMU | Titre |
|-----|-------|
| 0-99 | 🔰 Novice |
| 100-499 | 🌱 Apprenti Mathématicien |
| 500-999 | 📚 Apprenti Avancé |
| 1000-1999 | 🎓 Étudiant Dévoué |
| 2000-2999 | ✨ Algébriste Prometteur |
| 3000-4999 | 📐 Géomètre Talentueux |
| 5000-7499 | 🔥 Calculateur Accompli |
| 7500-9999 | 💎 Mathématicien d'Élite |
| 10000-14999 | 🌟 Maître des Équations |
| 15000-19999 | 🎯 Expert Confirmé |
| 20000-29999 | ⚡ Virtuose des Mathématiques |
| 30000-49999 | 🏆 Maître Suprême |
| 50000+ | 👑 Grand Maître Master Maths |

---

## 🚀 Déploiement

### **Stack recommandée**
- **Frontend** : Vercel
- **Base de données** : Supabase / Railway
- **Emails** : SendGrid / Mailgun
- **Paiements** : Stripe
- **Monitoring** : Sentry
- **Analytics** : Plausible / Google Analytics

### **Variables d'environnement**
```env
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
SMTP_HOST=
SMTP_USER=
SMTP_PASSWORD=
```

---

## 📈 Roadmap Future

### **v2.0 - Interface Admin**
- [ ] CRUD cours/chapitres/leçons
- [ ] Upload vidéos Vimeo
- [ ] Gestion QCM
- [ ] Gestion badges personnalisés
- [ ] Analytics avancées

### **v2.1 - Fonctionnalités sociales**
- [ ] Forum Q&A
- [ ] Messages privés
- [ ] Groupes d'étude
- [ ] Partage de notes

### **v2.2 - Mobile App**
- [ ] React Native app
- [ ] Notifications push
- [ ] Mode hors-ligne

### **v2.3 - IA**
- [ ] Recommandations personnalisées
- [ ] Assistant virtuel
- [ ] Génération de QCM automatique
- [ ] Détection de difficultés

---

## 📞 Support

- **Documentation** : `/docs`
- **Email** : support@mastermaths.com
- **Discord** : [discord.gg/mastermaths](https://discord.gg/mastermaths)
- **GitHub** : Issues & Pull Requests

---

## 📝 Licence

Propriétaire - Master Maths © 2025

---

## 🙏 Remerciements

Développé avec ❤️ pour l'excellence en mathématiques.

**Technologies utilisées :**
- Next.js, React, TypeScript
- Prisma, PostgreSQL
- NextAuth, Stripe
- Tailwind CSS, Vimeo
- Et bien d'autres...

---

**Projet complet et prêt pour la production ! 🎉**


