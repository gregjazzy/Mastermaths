# 🎯 Timeline Verticale de Progression - Documentation

## 📐 Concept

Une navigation de cours **premium** et **motivante** qui remplace l'accordéon classique par une timeline verticale progressive. 

### ✨ Caractéristiques principales

1. **Ligne verticale progressive** : La timeline se colore au fur et à mesure de la progression
2. **États visuels clairs** : Locked (🔒), Active (▶️), Completed (✅)
3. **Micro-animations** : Pulse sur la leçon active, transitions fluides
4. **Indicateurs enrichis** : Barres de progression, scores, badges, temps estimé
5. **Design premium** : Ombre, gradients, effets au survol

---

## 🎨 Hiérarchie visuelle

```
📚 CHAPITRE (grand cercle 48px - Bleu foncé/Turquoise)
    │
    ├─ 📑 SOUS-CHAPITRE (moyen cercle 40px - Turquoise léger)
    │
    ├─ 🎥 LEÇON 1 [Carte interactive avec progression]
    │
    ├─ 📝 QCM 1 [Carte avec score + badge]
    │
    ├─ 📄 EXERCICE 1 [Carte avec temps estimé]
    │
📚 CHAPITRE 2
```

---

## 🎯 États des leçons

| État | Cercle | Ligne au-dessus | Carte | Interactivité |
|------|--------|-----------------|-------|---------------|
| **Locked** 🔒 | Gris + Lock | Grise pointillée | Grisée, opacité 60% | Non cliquable |
| **Active** ▶️ | Turquoise + Pulse | Turquoise jusqu'ici | Border turquoise + ring | Cliquable |
| **Completed** ✅ | Turquoise + Check | Turquoise solide | Légèrement grisée | Cliquable |

---

## 📊 Indicateurs de progression

### Pour les vidéos (VIDEO_COURS)
- **Barre de progression** : 0-100% avec gradient turquoise
- **Pourcentage** affiché en temps réel
- **Temps estimé** : ~15 min (si non commencé)

### Pour les QCM
- **Score** : 0-100% avec couleur
- **Badge** : 
  - 🥇 Gold (100%)
  - 🥈 Silver (90-99%)
  - 🥉 Bronze (80-89%)

### Pour les exercices
- **Temps estimé** : ~20 min
- **Nombre d'exercices** liés
- **Statut** : Complété ou non

---

## 🛠️ Fichiers créés

### 1. `components/VerticalTimelineCourseNav.tsx`
Le composant principal de la timeline.

**Props** :
```typescript
interface VerticalTimelineCourseNavProps {
  course: CourseData  // Hiérarchie complète du cours
  currentLessonId?: string  // ID de la leçon actuellement affichée
}
```

**Sous-composants** :
- `ChapterNode` : Affiche un jalon de chapitre
- `SubChapterNode` : Affiche un jalon de sous-chapitre
- `LessonCard` : Affiche une carte de leçon interactive

### 2. `app/cours/[courseId]/lecon/[lessonId]/page.tsx`
La page de leçon mise à jour avec la timeline en sidebar.

**Layout** :
- **Sidebar gauche** (384px) : Timeline fixe et scrollable
- **Contenu principal** (flex-1) : Viewer de leçon

---

## 🎨 Classes Tailwind utilisées

### Animations
- `animate-pulse` : Sur la leçon active
- `transition-all duration-300` : Transitions fluides
- `hover:scale-[1.02]` : Effet au survol des cartes

### Couleurs
- `bg-master-turquoise` : Couleur principale de progression
- `bg-master-dark` : Chapitres
- `ring-master-turquoise/20` : Effets de focus

### Gradients
- `bg-gradient-to-br from-master-turquoise to-cyan-600` : Cercles complétés
- `bg-gradient-to-r from-master-turquoise to-cyan-500` : Barres de progression

---

## 🚀 Fonctionnalités avancées

### 1. Calcul automatique de verrouillage
Les leçons sont verrouillées si la précédente n'est pas complétée (système de progression linéaire).

### 2. Coloration progressive de la ligne
La ligne entre deux éléments devient turquoise uniquement si **les deux** sont complétés.

### 3. Indicateurs de progression globale
En haut de la timeline :
- **Pourcentage global** : X% complété
- **Nombre de leçons** : X / Y leçons terminées

---

## 📱 Responsive

### Desktop (>= 1024px)
- Sidebar visible (384px)
- Layout en deux colonnes

### Mobile (< 1024px)
- Sidebar cachée (hidden lg:block)
- Contenu en pleine largeur
- **Future amélioration** : Timeline horizontale en haut ou menu déroulant

---

## 🎯 Impact psychologique

### Gratification visuelle
- Voir la ligne se remplir = **dopamine** 💊
- Badges de réussite = **fierté** 🏆
- Progression claire = **motivation** 🔥

### Clarté cognitive
- Pas de clicks multiples pour voir la structure
- Vue d'ensemble immédiate
- Hiérarchie visuelle claire

---

## 🔧 Personnalisation possible

### Couleurs
Modifier dans `tailwind.config.js` :
```js
colors: {
  'master-turquoise': '#00BCD4',  // Couleur de progression
  'master-dark': '#1E3A5F',       // Couleur des chapitres
}
```

### Temps estimés
Modifier dans `getEstimatedTime()` (ligne ~70 du composant)

### Badges
Modifier dans `getBadgeFromScore()` (ligne ~80 du composant)

---

## ✅ Avantages vs Accordéon classique

| Caractéristique | Accordéon | Timeline Verticale |
|-----------------|-----------|-------------------|
| **Visibilité** | Click requis | Tout visible |
| **Progression** | Pas claire | Très claire |
| **Motivation** | Faible | Élevée |
| **Premium feel** | Standard | Haut de gamme |
| **Mobile** | Adapté | À améliorer |

---

## 📚 Inspirations

- **Duolingo** : Learning path visuel
- **LinkedIn Learning** : Progression de cours
- **Notion** : Timeline de projets
- **Asana** : Timeline des tâches

---

## 🐛 Problèmes connus

1. **Mobile** : La sidebar est cachée sur mobile (< 1024px)
   - **Solution future** : Timeline horizontale ou bouton pour ouvrir en overlay

2. **Performance** : Si > 100 leçons, peut être lent
   - **Solution future** : Virtualisation avec react-window

---

## 🚀 Prochaines améliorations possibles

1. **Confetti** lors de la complétion d'un chapitre entier
2. **Animation de remplissage** de la ligne (stroke-dasharray)
3. **Son** de réussite lors d'un badge
4. **Drag & drop** pour réorganiser (côté admin)
5. **Mode compact** pour les cours avec beaucoup de leçons
6. **Recherche** dans la timeline
7. **Filtres** : Afficher seulement les leçons non terminées

---

*Créé le 25 octobre 2025 - Master Maths v2.0*

