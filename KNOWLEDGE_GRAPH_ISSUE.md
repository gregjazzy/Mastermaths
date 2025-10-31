# Problème : Distance des liens dans react-force-graph-2d

## Contexte
J'utilise `react-force-graph-2d` avec `d3-force` pour créer un graphe de connaissances hiérarchique (cours → chapitres → sous-chapitres → leçons). 

## Problème
**Les segments/liens entre les nœuds sont beaucoup trop courts**, peu importe les valeurs que je configure. J'ai essayé d'augmenter `linkDistance` jusqu'à 3000px, mais visuellement les liens restent courts (~50-100px).

## Ce que j'ai essayé

### 1. Augmentation de linkDistance
```typescript
linkDistance={3000}
d3Force={(engine: any) => {
  engine.force('link', d3.forceLink()
    .distance(3000)
    .strength(1)
  )
}}
```
❌ **Résultat** : Pas d'effet visible, les liens restent courts

### 2. Mode DAG avec dagLevelDistance
```typescript
dagMode="td"
dagLevelDistance={500}
```
❌ **Résultat** : Meilleur espacement vertical mais perd le dynamisme

### 3. Suppression des forces concurrentes
```typescript
d3Force={(engine: any) => {
  engine.force('charge', null) // Supprimer la répulsion
  engine.force('link', d3.forceLink()
    .distance(3000)
    .strength(0.8)
  )
}}
```
❌ **Résultat** : Toujours pas de changement visible

### 4. Augmentation massive de la répulsion
```typescript
engine.force('charge', d3.forceManyBody()
  .strength(-8000)
  .distanceMax(4000)
)
```
❌ **Résultat** : Les nœuds se repoussent mais les liens ne s'allongent pas proportionnellement

## Code actuel

```typescript
<ForceGraph2D
  ref={graphRef}
  graphData={graphData}
  nodeLabel={getNodeLabel}
  nodeColor={(node: any) => node.color}
  nodeRelSize={8}
  nodeVal={(node: any) => node.size}
  linkColor={(link: any) => link.color}
  linkWidth={2}
  dagMode="td"
  dagLevelDistance={500}
  linkDirectionalParticles={2}
  linkDirectionalParticleSpeed={0.005}
  linkDirectionalParticleWidth={3}
  enableNodeDrag={true}
  enableZoomInteraction={true}
  enablePanInteraction={true}
  d3AlphaDecay={0.01}
  d3VelocityDecay={0.3}
  d3Force={(engine: any) => {
    engine.force('collide', d3.forceCollide()
      .radius(100)
      .strength(1)
    )
  }}
  onNodeClick={handleNodeClick}
  onNodeDragEnd={(node: any) => {
    node.fx = node.x
    node.fy = node.y
  }}
  nodeCanvasObject={(node: any, ctx: any, globalScale: number) => {
    const fontSize = 11 / globalScale
    const nodeSize = node.size * 1.2
    
    // Dessin du cercle
    ctx.beginPath()
    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI)
    ctx.fillStyle = node.color
    ctx.fill()
    
    // Bordure + label...
  }}
  onEngineStop={() => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400, 100)
    }
  }}
  backgroundColor="rgba(0,0,0,0)"
/>
```

## Structure des données
```typescript
interface GraphData {
  nodes: GraphNode[]  // ~50-100 nœuds (cours, chapitres, sous-chapitres, leçons)
  links: GraphLink[]  // Liens hiérarchiques parent → enfant
}
```

## Objectif
**Je veux que les segments entre les nœuds soient 5× plus longs** qu'ils ne le sont actuellement. Je veux un graphe étendu, aéré, avec de longs liens entre les nœuds, tout en gardant :
- ✅ Le dynamisme (animations, particules sur les liens)
- ✅ Les nœuds cliquables
- ✅ La possibilité de drag & drop
- ✅ Pas de chevauchement entre les nœuds

## Question
**Comment puis-je forcer `react-force-graph-2d` / `d3-force` à créer des liens RÉELLEMENT plus longs ?** 

Est-ce que :
1. Je dois calculer manuellement les positions (fx, fy) ?
2. Il y a un paramètre que je rate ?
3. Je dois utiliser une autre approche (custom force, layout pré-calculé) ?
4. Le problème vient d'un conflit entre forces ?

Merci pour votre aide ! 🙏


