# 🔧 Correction - Knowledge Graph Espacement des Nœuds

**Date** : 31 Octobre 2025  
**Version** : v1.4.1  
**Statut** : ✅ Correction appliquée, à tester

---

## 🐛 Problème Identifié

### Symptôme
Les nœuds du **Knowledge Graph** se chevauchaient, rendant le graphe illisible malgré la configuration des forces D3.js.

### Cause Racine

**Incohérence mathématique** entre la taille affichée et le rayon de collision :

#### Dans le rendu (`nodeCanvasObject`) - Ligne 301
```typescript
const nodeSize = node.size * 1.2  // Taille RÉELLE affichée
```

#### Dans le calcul de collision (`d3Force`) - Lignes 273-278 (AVANT)
```typescript
.radius((node: any) => {
  const nodeRelSize = 10
  const realVisualRadius = node.size * nodeRelSize * 1.2  // ❌ Multiplie par 10 !
  return realVisualRadius + 150
})
```

**Résultat :**
- Un nœud leçon (`size: 8`) était affiché avec un rayon de **9.6 pixels**
- Mais D3.js calculait un rayon de collision de **246 pixels** (`8 × 10 × 1.2 + 150`)
- D3.js pensait que les nœuds faisaient **10x leur taille réelle** !

### Exemple Concret

| Type | `node.size` | Taille affichée | Rayon collision (AVANT) | Rayon collision (APRÈS) |
|------|-------------|-----------------|-------------------------|-------------------------|
| Cours | 20 | 24px | 390px | 104px |
| Chapitre | 15 | 18px | 330px | 98px |
| Sous-chapitre | 12 | 14.4px | 294px | 94.4px |
| Leçon | 8 | 9.6px | 246px | 89.6px |

**Analyse :** Le rayon de collision était environ **16x plus grand** que la taille réelle affichée pour les leçons !

---

## ✅ Solution Appliquée

### Fichier Modifié
`app/cours/[courseId]/graphe/page.tsx`

### Correction du Calcul de Collision (Lignes 275-288)

**AVANT :**
```typescript
.radius((node: any) => {
  const nodeRelSize = 10  // ❌ Variable inutile
  const realVisualRadius = node.size * nodeRelSize * 1.2  // ❌ Calcul faux
  return realVisualRadius + 150  // ❌ Marge sur base incorrecte
})
```

**APRÈS :**
```typescript
.radius((node: any) => {
  // Rayon RÉEL affiché dans nodeCanvasObject = node.size * 1.2
  const visualRadius = node.size * 1.2  // ✅ Correspond au rendu
  const margin = 80  // ✅ Marge raisonnable
  const collisionRadius = visualRadius + margin
  
  // Debug (à retirer après test)
  if (node.type === 'course' || node.type === 'chapter' && node.id.includes('chapter-')) {
    console.log(`Node ${node.type} - size: ${node.size}, visual: ${visualRadius}, collision: ${collisionRadius}`)
  }
  
  return collisionRadius  // ✅ Retourne la vraie taille + marge
})
```

### Logs de Debug Ajoutés (Ligne 254)

```typescript
d3Force={(engine: any) => {
  console.log('🔍 d3Force callback appelé')  // ✅ Vérifier que le callback est exécuté
  // ...
}
```

---

## 🧪 Comment Tester

### 1. Démarrer le Serveur
```bash
npm run dev
# ou
PORT=3001 npm run dev
```

### 2. Accéder au Knowledge Graph
1. Se connecter à l'application
2. Aller sur un cours avec du contenu (chapitres, sous-chapitres, leçons)
3. Cliquer sur le bouton **"Graphe du cours"** dans le header

### 3. Vérifier dans la Console
Vous devriez voir :
```
🔍 d3Force callback appelé
Node course - size: 20, visual: 24, collision: 104
Node chapter - size: 15, visual: 18, collision: 98
```

### 4. Observer le Graphe Visuellement

**✅ Succès si :**
- Les nœuds **ne se chevauchent plus**
- L'espacement est **clair et lisible**
- La hiérarchie est **visible** (cours au centre → chapitres → sous-chapitres → leçons)
- Les labels sont **lisibles**

**❌ Échec si :**
- Les nœuds se chevauchent encore
- Les logs n'apparaissent pas dans la console
- Le graphe est trop étalé ou trop compact

---

## 🔄 Si ça ne Fonctionne Toujours Pas

### Option 1 : Augmenter la Marge
```typescript
const margin = 120  // ou 150, ou 200
```

### Option 2 : Augmenter la Force de Répulsion
```typescript
engine.force('charge', d3.forceManyBody()
  .strength(-3000)  // au lieu de -2000
  .distanceMax(1500)
)
```

### Option 3 : Augmenter la Distance des Liens
```typescript
engine.force('link', d3.forceLink()
  .id((d: any) => d.id)
  .distance(600)  // au lieu de 400
  .strength(0.4)
)
```

### Option 4 : Simplifier les Forces (Debug)
```typescript
d3Force={(engine: any) => {
  // Ne garder QUE la force de collision pour isoler le problème
  engine.force('collide', d3.forceCollide()
    .radius((node: any) => node.size * 1.2 + 80)
    .strength(1.5)
  )
  // Supprimer charge, link, center temporairement
}
```

---

## 🎯 Prochaines Étapes

### Si ça Fonctionne ✅
1. **Retirer les logs de debug** :
   - Ligne 254 : `console.log('🔍 d3Force callback appelé')`
   - Lignes 283-285 : `console.log(` pour chaque type de nœud
2. **Mettre à jour HANDOVER.md** : Changer "à tester" en "✅ RÉSOLU ET TESTÉ"
3. **Mettre à jour README.md** : Projet à **99% complet**
4. **Commit final** : "Fix: Résolution problème espacement Knowledge Graph"

### Si ça ne Fonctionne Pas ❌
1. Vérifier que les logs apparaissent (callback appelé ?)
2. Tester les options 1-4 ci-dessus
3. Consulter les issues GitHub de `react-force-graph` : https://github.com/vasturiano/react-force-graph/issues
4. Consulter la doc D3.js forces : https://github.com/d3/d3-force

---

## 📊 Impact de la Correction

### Avant
- **Taille cours** : Affiché 24px, collision 390px → ratio 16x
- **Taille leçon** : Affiché 9.6px, collision 246px → ratio 25x
- **Résultat** : Forces chaotiques, chevauchements constants

### Après
- **Taille cours** : Affiché 24px, collision 104px → ratio 4.3x
- **Taille leçon** : Affiché 9.6px, collision 89.6px → ratio 9.3x
- **Résultat attendu** : Espacement cohérent, pas de chevauchements

---

## 🔍 Analyse Technique Approfondie

### Pourquoi `nodeRelSize` n'est Pas Utilisé ?

Le paramètre `nodeRelSize={10}` est utilisé par `react-force-graph-2d` **uniquement quand il n'y a pas de `nodeCanvasObject` custom**.

Quand vous fournissez un `nodeCanvasObject` personnalisé :
- Vous prenez le contrôle **total** du rendu
- `nodeRelSize` n'affecte **plus** la taille affichée
- Vous devez dessiner les nœuds manuellement avec `ctx.arc()`

**Dans notre cas :**
```typescript
nodeCanvasObject={(node, ctx, globalScale) => {
  const nodeSize = node.size * 1.2  // On définit NOUS la taille
  ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI)  // On dessine NOUS
}}
```

Donc le calcul de collision **doit** utiliser `node.size * 1.2`, **pas** `node.size * nodeRelSize * 1.2`.

### Pourquoi les Forces Se Battaient ?

Avant la correction :
1. **Force charge** (`-2000`) : Repousse les nœuds
2. **Force link** (`400px`) : Maintient les nœuds à 400px
3. **Force collide** (`~300px rayon`) : Empêche les nœuds de se rapprocher à moins de 300px

**Conflit :** La force link veut 400px, la force collide veut minimum 600px (2 × 300px), et la force charge repousse encore plus.

**Résultat :** Les forces s'équilibrent dans un état instable où les nœuds finissent par se chevaucher quand alpha décroît vers 0.

Après la correction :
1. **Force charge** (`-2000`) : Repousse les nœuds
2. **Force link** (`400px`) : Maintient les nœuds à 400px
3. **Force collide** (`~90px rayon`) : Empêche les nœuds de se rapprocher à moins de 90px

**Cohérent :** Link à 400px > Collide à 180px (2 × 90px) → Pas de conflit.

---

## 📚 Ressources

- **react-force-graph GitHub** : https://github.com/vasturiano/react-force-graph
- **D3 Force Documentation** : https://github.com/d3/d3-force
- **D3 forceCollide API** : https://github.com/d3/d3-force#forceCollide
- **D3 forceManyBody API** : https://github.com/d3/d3-force#forceManyBody
- **D3 forceLink API** : https://github.com/d3/d3-force#forceLink

---

**Correction réalisée par :** Assistant IA Claude Sonnet 4.5  
**Date :** 31 Octobre 2025  
**Fichier :** `FIX_KNOWLEDGE_GRAPH_31OCT2025.md`


