# 🎴 Guide des Badges Format Pokémon - Master Maths

**Dernière mise à jour : 1er Novembre 2025**

---

## 🎨 Concept

Les badges Master Maths en format **carte Pokémon** sont des récompenses visuelles époustouflantes qui combinent :
- 🃏 **Format carte Pokémon** (250px × 350px, ratio 5:7)
- ✨ **Effets holographiques** (comme les cartes brillantes)
- 🔮 **Animations mathématiques** thématiques
- 🌈 **Dégradés vibrants** et effets 3D

---

## 📐 Spécifications Techniques

### Format Standard
```
Largeur  : 250px
Hauteur  : 350px
Ratio    : 5:7 (identique aux cartes Pokémon)
Bordure  : 16px (coins arrondis)
Épaisseur: 4-8px (effet 3D avec box-shadow)
```

### Anatomie d'une Carte Badge

```
┌─────────────────────────────┐
│  ┌───────────────────────┐  │ ← Bordure holographique (8px)
│  │                       │  │
│  │    [Particules]       │  │ ← Zone supérieure (symboles)
│  │                       │  │
│  │                       │  │
│  │       [x²]            │  │ ← Zone centrale (animation math)
│  │                       │  │
│  │                       │  │
│  │   [Titre Badge]       │  │ ← Zone inférieure (nom)
│  │                       │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

---

## 🎯 Premier Badge : Introduction au Second Degré

### 🎨 Design

**Thème** : Second Degré (x²)  
**Couleurs** :
- Violet profond (#667eea)
- Magenta (#764ba2)  
- Rose clair (#f093fb)

**Animations** :
1. **Flottement de la carte** (4s, ease-in-out)
   - Mouvement vertical doux
   - Rotation 3D subtile (-5° à +5°)

2. **Effet holographique** (3s, linear)
   - Rotation de teinte (hue-rotate 360°)
   - Simule les reflets arc-en-ciel

3. **Équation x² expansive** (4s, ease-in-out)
   - Phase 1 : x² petit (scale 0.5, opacity 0.3)
   - Phase 2 : x² grandit (scale 1.5, opacity 1)
   - Phase 3 : Transformation (a+b)²
   - Phase 4 : Retour x²

4. **Lueur pulsante** (2s, ease-in-out)
   - Box-shadow qui pulse
   - Crée un effet de "respiration"

5. **Brillance holographique** (3s, ease-in-out)
   - Ligne de lumière qui traverse la carte
   - Simule les cartes Pokémon "shiny"

### 📂 Fichier CSS

**Emplacement** : `/public/badges-presets/second-degre-intro.css`

**Utilisation dans l'admin** :
1. Aller sur `/admin/badges`
2. Créer un nouveau badge
3. Nom : "Introduction au Second Degré"
4. Description : "Maîtrise les bases des équations quadratiques"
5. Emoji : 📐 ou 🎯
6. Rareté : RARE ou EPIC
7. Points : 50 PMU
8. Animation → CSS Personnalisé
9. Uploader le fichier `second-degre-intro.css`
10. Preview en direct !

---

## 🎨 Styles Disponibles

### Style 1 : Holographique (Second Degré)
- **Couleurs** : Violet → Magenta → Rose
- **Animation** : x² qui se développe
- **Effet** : Holographique rotatif
- **Rareté suggérée** : RARE

### Style 2 : Carte Dorée (à créer)
- **Couleurs** : Or → Jaune → Cuivre
- **Animation** : Équation qui brille
- **Effet** : Pluie de particules dorées
- **Rareté suggérée** : LEGENDARY

### Style 3 : Carte Argentée (à créer)
- **Couleurs** : Argent → Gris → Blanc
- **Animation** : Formule qui tourne
- **Effet** : Reflets métalliques
- **Rareté suggérée** : EPIC

### Style 4 : Carte Arc-en-ciel (à créer)
- **Couleurs** : Multicolore
- **Animation** : Symboles mathématiques
- **Effet** : Prisme lumineux
- **Rareté suggérée** : LEGENDARY

---

## 🎯 Critères de Déclenchement (Exemple)

Pour le badge "Introduction au Second Degré" :

```json
{
  "lessons_completed": 1,
  "lesson_specific": "lecon-second-degre-intro",
  "quiz_success_rate": 80,
  "animation": {
    "useCustomCSS": true,
    "customCSS": "[contenu du fichier second-degre-intro.css]"
  }
}
```

---

## 🎨 Palette de Couleurs Recommandées

### Par Thème Mathématique

**Algèbre** :
- Primaire : #667eea (Bleu-violet)
- Secondaire : #764ba2 (Magenta)
- Accent : #f093fb (Rose)

**Géométrie** :
- Primaire : #4facfe (Bleu ciel)
- Secondaire : #00f2fe (Cyan)
- Accent : #43e97b (Vert)

**Analyse** :
- Primaire : #fa709a (Rose)
- Secondaire : #fee140 (Jaune)
- Accent : #ff6a00 (Orange)

**Probabilités** :
- Primaire : #30cfd0 (Turquoise)
- Secondaire : #330867 (Violet foncé)
- Accent : #a8edea (Vert d'eau)

**Trigonométrie** :
- Primaire : #ff9a56 (Orange)
- Secondaire : #ff6a88 (Rose corail)
- Accent : #ffeaa7 (Jaune pastel)

---

## 🔧 Template CSS pour Nouveaux Badges

```css
/* Badge: [NOM DU BADGE] */
position: relative;
width: 250px;
height: 350px;
border-radius: 16px;

/* Dégradé de fond (À PERSONNALISER) */
background: linear-gradient(135deg, 
  #COULEUR1 0%, 
  #COULEUR2 50%, 
  #COULEUR3 100%
);

/* Bordure 3D */
box-shadow: 
  0 8px 32px rgba(102, 126, 234, 0.4),
  0 0 0 4px rgba(255, 255, 255, 0.8),
  0 0 0 8px #COULEUR_BORDURE,
  inset 0 0 60px rgba(255, 255, 255, 0.1);

/* Animation de flottement */
animation: card-float 4s ease-in-out infinite;

/* Contenu central (À PERSONNALISER) */
&::after {
  content: 'SYMBOLE_MATH';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 80px;
  color: rgba(255, 255, 255, 0.9);
  animation: custom-animation 4s ease-in-out infinite;
}

/* Effet holographique */
&::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  animation: shine 3s ease-in-out infinite;
  border-radius: 16px;
}

/* Animations requises */
@keyframes card-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes shine {
  0% { background-position: 200% 200%; }
  100% { background-position: -200% -200%; }
}

@keyframes custom-animation {
  /* À DÉFINIR selon le badge */
}
```

---

## 📊 Performance

### Charge CSS par Badge
- **Fichier individuel** : ~2-4 KB
- **150 badges** : ~300-600 KB (compressé : ~100-200 KB)
- **Chargement consolidé** : 1 requête HTTP au lieu de 150
- **Cache navigateur** : Réutilisé sur toutes les pages

### Optimisations
- ✅ CSS consolidé (1 seul fichier pour tous les badges)
- ✅ Animations GPU-accélérées (transform, opacity)
- ✅ Lazy loading (chargement différé hors viewport)
- ✅ Compression gzip automatique

---

## 🚀 Prochains Badges à Créer

### Niveau 1 : Bases (COMMON/RARE)
1. ✅ **Introduction au Second Degré** (x²)
2. 🔜 **Fonction Linéaire** (y = ax + b)
3. 🔜 **Théorème de Pythagore** (a² + b² = c²)
4. 🔜 **Équations du Premier Degré** (ax = b)
5. 🔜 **Fractions et Proportions** (a/b)

### Niveau 2 : Intermédiaire (RARE/EPIC)
6. 🔜 **Trinôme du Second Degré** (ax² + bx + c)
7. 🔜 **Dérivées** (f'(x))
8. 🔜 **Limites** (lim)
9. 🔜 **Intégrales** (∫)
10. 🔜 **Vecteurs** (→)

### Niveau 3 : Avancé (EPIC/LEGENDARY)
11. 🔜 **Suite Géométrique** (Uₙ)
12. 🔜 **Nombres Complexes** (z = a + ib)
13. 🔜 **Matrices** ([A][B])
14. 🔜 **Probabilités Conditionnelles** (P(A|B))
15. 🔜 **Master Maths Ultimate** (Badge final)

---

## 💡 Conseils de Design

### ✅ À FAIRE
- Utiliser des dégradés harmonieux (3 couleurs max)
- Animations douces (2-4 secondes)
- Symboles mathématiques clairs (80-100px)
- Effet holographique subtil
- Rotation 3D légère (±10°)

### ❌ À ÉVITER
- Trop de couleurs (> 4)
- Animations trop rapides (< 1s)
- Symboles trop petits (< 60px)
- Effets trop agressifs
- Rotation excessive (> 30°)

---

## 📝 Checklist de Création

Pour chaque nouveau badge :
- [ ] Choisir le thème mathématique
- [ ] Définir la palette de couleurs (3 couleurs)
- [ ] Créer l'animation du symbole central
- [ ] Ajouter l'effet holographique
- [ ] Tester la performance (DevTools)
- [ ] Uploader dans `/public/badges-presets/`
- [ ] Créer le badge dans l'admin
- [ ] Tester sur mobile/desktop
- [ ] Documenter dans ce fichier

---

## 🎉 Résultat Final

Avec ce système, vous pouvez créer **100-150 badges uniques** qui :
- 🎴 Ressemblent à des cartes Pokémon brillantes
- ✨ Ont des animations mathématiques thématiques
- 🚀 Se chargent rapidement (CSS consolidé)
- 💎 Impressionnent les élèves
- 🎯 Gamifient l'apprentissage

**Chaque badge devient une œuvre d'art collectionnable !** 🏆

---

**Fichier créé le 1er Novembre 2025**  
**Guide des Badges Format Pokémon - Master Maths v1.0**

