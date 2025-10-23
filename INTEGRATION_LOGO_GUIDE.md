# 🎨 Intégration du logo Master Maths - Guide complet

## 📁 Structure des fichiers

```
MasterMaths/
└── public/
    └── images/
        ├── master-maths-logo.jpg     ← VOTRE LOGO ICI (horizontal)
        └── master-maths-icon.png     ← VERSION CARRÉE (optionnel)
```

---

## 📋 Instructions étape par étape

### Étape 1 : Créer le dossier

```bash
cd /Users/gregorymittelette/Documents/MasterMaths
mkdir -p public/images
```

### Étape 2 : Copier votre logo

1. **Trouvez votre fichier JPG** sur votre ordinateur
2. **Renommez-le** en `master-maths-logo.jpg`
3. **Copiez-le** dans le dossier `/public/images/`

```bash
# Exemple de commande (ajustez le chemin source)
cp ~/Downloads/votre-logo.jpg public/images/master-maths-logo.jpg
```

### Étape 3 : Lancer l'application

```bash
npm run dev
```

Le logo apparaîtra automatiquement ! ✨

---

## 🎨 Formats recommandés

### Logo principal (horizontal)
- **Fichier** : `master-maths-logo.jpg`
- **Dimensions idéales** : 300x90px ou 400x120px
- **Ratio** : 3:1 ou 10:3 (format horizontal)
- **Format** : JPG ou PNG (PNG si fond transparent)
- **Poids** : < 100 KB

### Icône carrée (optionnel)
- **Fichier** : `master-maths-icon.png`
- **Dimensions idéales** : 512x512px
- **Format** : PNG avec fond transparent
- **Usage** : Favicon, applications mobiles
- **Poids** : < 50 KB

---

## 📍 Où le logo apparaît

### 1. ✅ Navbar (toutes les pages)
- Position : En haut à gauche
- Taille : 40x40px
- Cliquable vers le Dashboard

### 2. ✅ Page d'accueil
- Position : Header (haut à gauche)
- Taille : 40x40px
- Avec fond blanc arrondi

### 3. ✅ Pages d'authentification
- Login page : Centré en haut, 80x80px
- Register page : Centré en haut, 80x80px
- Avec fond dégradé bleu/turquoise

### 4. ✅ Favicon (onglet navigateur)
- Fichier : `master-maths-icon.png`
- Taille : 32x32px
- Apparaît dans l'onglet du navigateur

---

## 🔄 Fallback automatique

Si le logo n'est pas trouvé, le système affiche :
- Icône BookOpen de Lucide React
- Couleur turquoise Master Maths
- Texte "Master Maths"

---

## 🎨 Optimisations Next.js

Le logo utilise le composant `Image` de Next.js qui :
- ✅ Optimise automatiquement la taille
- ✅ Charge en priorité (priority)
- ✅ Responsive selon l'écran
- ✅ Lazy loading intelligent

---

## 🖼️ Préparation de votre logo

### Si vous avez un logo avec texte :
✅ Parfait ! Utilisez-le tel quel.

### Si vous avez juste une icône/symbole :
✅ Créez 2 versions :
1. Logo avec texte (horizontal) → `master-maths-logo.jpg`
2. Icône seule (carré) → `master-maths-icon.png`

### Outils de retouche recommandés :
- **En ligne** : Photopea (gratuit)
- **Mac** : Preview, Pixelmator
- **Windows** : Paint.NET, GIMP
- **Pro** : Photoshop, Figma

---

## 🎯 Conseils de design

### Pour la navbar :
- Fond transparent de préférence (PNG)
- Hauteur : 40-50px
- Largeur : proportionnelle (100-150px)

### Pour l'authentification :
- Version haute résolution
- Peut avoir un fond si nécessaire
- Bien visible sur dégradé bleu

### Pour le favicon :
- Version simplifiée de votre logo
- Bien visible à petite taille
- Contraste élevé

---

## 🔍 Vérification

### Checklist après installation :

- [ ] Fichier `master-maths-logo.jpg` dans `/public/images/`
- [ ] Le logo apparaît dans la Navbar
- [ ] Le logo apparaît sur la page d'accueil
- [ ] Le logo apparaît sur Login/Register
- [ ] Pas d'erreur 404 dans la console
- [ ] Le logo est bien dimensionné

### Commandes de vérification :

```bash
# Vérifier que le fichier existe
ls -lh public/images/master-maths-logo.jpg

# Vérifier la taille du fichier
du -h public/images/master-maths-logo.jpg

# Ouvrir l'application
open http://localhost:3000
```

---

## 🐛 Résolution de problèmes

### Le logo ne s'affiche pas

1. **Vérifier le chemin du fichier** :
```bash
# Le fichier doit être exactement ici :
/Users/gregorymittelette/Documents/MasterMaths/public/images/master-maths-logo.jpg
```

2. **Vérifier le nom du fichier** :
- Doit être en minuscules
- Pas d'espaces (utiliser des tirets)
- Extension correcte (.jpg, .jpeg, ou .png)

3. **Vérifier les permissions** :
```bash
chmod 644 public/images/master-maths-logo.jpg
```

4. **Redémarrer le serveur** :
```bash
# Arrêter (Ctrl+C) puis relancer
npm run dev
```

### Le logo est déformé

Dans `next.config.js`, vérifiez :
```javascript
images: {
  domains: ['player.vimeo.com', 'vimeo.com'],
}
```

### Le logo est trop grand/petit

Ajustez dans le composant :
```tsx
<div className="relative w-10 h-10">  // ← Modifier w-XX et h-XX
```

---

## 📱 Version mobile

Le logo s'adapte automatiquement sur mobile grâce à :
- Classes Tailwind responsive
- Composant Image de Next.js
- Breakpoints adaptatifs

---

## 🚀 Exemple complet

Voici à quoi ressemble l'intégration finale :

```tsx
{/* Dans Navbar.tsx */}
<div className="relative w-10 h-10">
  <Image
    src="/images/master-maths-logo.jpg"
    alt="Master Maths Logo"
    fill
    className="object-contain"
    priority
  />
</div>
```

---

## 📞 Support

Si le logo ne s'affiche toujours pas :

1. Vérifiez la console du navigateur (F12)
2. Cherchez les erreurs 404 ou d'images
3. Vérifiez que le fichier est bien nommé
4. Essayez avec un autre format (PNG au lieu de JPG)

---

## ✅ C'est fait !

Une fois votre logo placé dans `/public/images/master-maths-logo.jpg`, 
il apparaîtra automatiquement partout dans l'application ! 🎉

**Aucune modification de code nécessaire** - tout est déjà configuré !


