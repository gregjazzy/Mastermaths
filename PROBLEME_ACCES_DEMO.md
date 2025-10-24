# 🚨 PROBLÈME D'ACCÈS AU CONTENU DEMO

## Contexte
Application Master Maths - Plateforme LMS avec système de gamification et accès granulaire au contenu.

## Problème Actuel
Les utilisateurs avec le statut `DEMO` ne peuvent pas accéder au contenu marqué comme `isDemoContent: true`, malgré toutes les vérifications mises en place.

## Comportement Observé

### Ce qui devrait se passer :
1. Utilisateur crée un compte → statut = `DEMO`
2. Va sur `/cours` → voit "Maths Première" (course avec `isDemoContent: true`)
3. Clique sur "Maths Première" → devrait accéder à la première leçon accessible
4. La page de la leçon s'affiche avec le contenu

### Ce qui se passe réellement :
1. ✅ Utilisateur crée un compte → statut = `DEMO`
2. ✅ Va sur `/cours` → voit "Maths Première"
3. ✅ Clique sur "Maths Première" → redirige vers `/cours/cmh5d0qbq0000wrd8co29tq3d/lecon/cmh5ddlbs000bwrd8phnehbn9`
4. ❌ **La page redirige vers `/upgrade` ou affiche "Leçon non trouvée"**

## Ce qui a été vérifié

### 1. Base de données ✅
Tous les éléments de la hiérarchie sont bien marqués `isDemoContent: true` :
- Course: "Les Maths en Première" (`cmh5d0qbq0000wrd8co29tq3d`)
- Chapter: "Les Dérivées" et "Les équations du Second Degré"
- SubChapter: "Introduction au Second Degré" et "Résoudre une équation du Second degré"
- Lesson: "Découvre le Second Degré" (`cmh5ddlbs000bwrd8phnehbn9`)

### 2. Logs serveur ✅
Les logs montrent :
```
🔍 Processing course: Les Maths en Première { userStatus: 'DEMO', nbChapters: 2 }
  📖 Chapter: Les Dérivées, isDemoContent: true
  📖 Chapter: Les équations du Second Degré, isDemoContent: true
    📑 SubChapter: Résoudre une équation du Second degré, isDemoContent: true
    📑 SubChapter: Introduction au Second Degré, isDemoContent: true
      📝 Lesson: Découvre le Second Degré, isDemoContent: true
        ✅ Found first accessible lesson: cmh5ddlbs000bwrd8phnehbn9
✅ Will redirect to: /cours/cmh5d0qbq0000wrd8co29tq3d/lecon/cmh5ddlbs000bwrd8phnehbn9
✅ Access granted!
```

Puis immédiatement après :
```
✓ Compiled /upgrade in 118ms (735 modules)
```

### 3. Code de vérification d'accès
**Fichier:** `app/cours/[courseId]/lecon/[lessonId]/page.tsx`

```typescript
// Vérification complète de la hiérarchie
const isContentDemo = 
  lesson.isDemoContent &&
  lesson.subChapter.isDemoContent &&
  lesson.subChapter.chapter.isDemoContent &&
  lesson.subChapter.chapter.course.isDemoContent

if (user.status === 'DEMO' && !isContentDemo) {
  redirect('/upgrade')
}

if (user.status === 'FREE') {
  redirect('/upgrade')
}
```

## Hypothèses sur la cause

### Hypothèse 1 : Cache navigateur
Le navigateur cache une ancienne version de la page ou du token d'authentification.

**Solution à tester :** Navigation privée / Vider cache et cookies

### Hypothèse 2 : Middleware qui bloque
Le middleware (`middleware.ts`) pourrait bloquer l'accès avant même d'arriver à la page.

**À vérifier :** Logs du middleware

### Hypothèse 3 : Token NextAuth obsolète
Le token JWT contient un ancien statut utilisateur (`FREE` au lieu de `DEMO`).

**Solution à tester :** Se déconnecter complètement et se reconnecter

### Hypothèse 4 : Redirection en cascade
La page compile `/upgrade` APRÈS avoir affiché "Access granted!", ce qui suggère qu'il y a peut-être :
- Une redirection client-side (JavaScript)
- Un composant enfant qui fait une redirection
- Un effet de bord dans `LessonViewer`

**À vérifier :** Le composant `LessonViewer`

### Hypothèse 5 : Race condition
Plusieurs vérifications en parallèle, et l'une d'elles échoue/redirige.

### Hypothèse 6 : Port différent
L'application tourne sur le port 3002, mais il pourrait y avoir des appels internes qui utilisent un autre port.

## Fichiers Critiques

### 1. Page de leçon
`app/cours/[courseId]/lecon/[lessonId]/page.tsx`
- Gère l'accès à une leçon spécifique
- Fait les vérifications `isDemoContent` sur toute la hiérarchie
- Redirige vers `/upgrade` si accès refusé

### 2. Middleware
`middleware.ts`
- Vérifie l'authentification
- Gère l'accès basé sur le statut utilisateur
- **Lignes 48-60** : Gestion spéciale pour les utilisateurs DEMO

### 3. Composant LessonViewer
`components/LessonViewer.tsx`
- Affiche le contenu de la leçon
- **Pourrait contenir des vérifications d'accès supplémentaires**

### 4. Page de liste des cours
`app/cours/page.tsx`
- Filtre les cours accessibles
- Trouve la première leçon accessible
- Génère le lien vers la leçon

## Migrations Appliquées

### Migration : Contrôle granulaire DEMO
Fichier: `MIGRATION_DEMO_GRANULAIRE_CLEAN.sql`

Ajout du champ `isDemoContent` à tous les niveaux :
- `courses.isDemoContent`
- `chapters.isDemoContent`
- `subchapters.isDemoContent`
- `lessons.isDemoContent`
- `exercises.isDemoContent`

**Statut :** ✅ Appliqué et vérifié dans Supabase

### Mise à jour des utilisateurs
Fichier: `UPDATE_USERS_TO_DEMO.sql`

Tous les utilisateurs `FREE` ont été mis à jour vers `DEMO`.

**Statut :** ✅ Appliqué

### Nouveau compte
Les nouveaux comptes sont créés avec `status: 'DEMO'` par défaut (changé dans `app/api/auth/register/route.ts`).

**Statut :** ✅ Modifié

## État du Serveur

- **Port actuel :** 3002
- **Commande de lancement :** `PORT=3002 npm run dev`
- **Environnement :** Local (macOS)
- **Base de données :** Supabase (IPv4 add-on activé)

## Actions Recommandées pour le Prochain Assistant

### 1. Vérifier le composant LessonViewer
Chercher toute logique de redirection ou vérification d'accès dans ce composant.

### 2. Ajouter des logs dans le middleware
Vérifier si le middleware bloque l'accès avant d'arriver à la page.

### 3. Vérifier le token NextAuth
Console.log le token JWT pour voir quel statut il contient réellement.

### 4. Tester avec un utilisateur PREMIUM
Créer un compte PREMIUM manuellement dans Supabase et tester si l'accès fonctionne.

### 5. Simplification temporaire
Pour débloquer la situation :
- Commenter temporairement TOUTES les vérifications d'accès
- Vérifier si le contenu s'affiche
- Réactiver les vérifications une par une pour trouver laquelle bloque

## Commandes Utiles

### Restart serveur propre
```bash
cd /Users/gregorymittelette/Documents/MasterMaths && killall node && rm -rf .next && sleep 2 && PORT=3002 npm run dev
```

### Vérifier le contenu DEMO dans Supabase
```sql
-- Vérifier le cours
SELECT id, title, "isDemoContent" FROM courses WHERE id = 'cmh5d0qbq0000wrd8co29tq3d';

-- Vérifier la leçon
SELECT id, title, "isDemoContent" FROM lessons WHERE id = 'cmh5ddlbs000bwrd8phnehbn9';

-- Vérifier toute la hiérarchie
SELECT 
  c.title AS course,
  ch.title AS chapter,
  sc.title AS subchapter,
  l.title AS lesson,
  c."isDemoContent" AS course_demo,
  ch."isDemoContent" AS chapter_demo,
  sc."isDemoContent" AS subchapter_demo,
  l."isDemoContent" AS lesson_demo
FROM lessons l
JOIN subchapters sc ON l."subChapterId" = sc.id
JOIN chapters ch ON sc."chapterId" = ch.id
JOIN courses c ON ch."courseId" = c.id
WHERE l.id = 'cmh5ddlbs000bwrd8phnehbn9';
```

### Vérifier le statut utilisateur
```sql
SELECT email, status FROM users ORDER BY "createdAt" DESC LIMIT 5;
```

## Notes Importantes

1. **Le système fonctionne en théorie** : Tous les logs montrent "Access granted!"
2. **La redirection se fait APRÈS** : La compilation de `/upgrade` arrive après le "Access granted!"
3. **Comportement différent selon navigateur** :
   - Safari : "Leçon non trouvée"
   - Chrome : Redirection vers `/upgrade`
4. **Le problème est récent** : Introduit lors de l'ajout du système de contrôle granulaire

## Dernière Tentative

Simplification de la page de leçon pour supprimer le fetch problématique vers `localhost:3000` et afficher directement le contenu.

**Résultat :** Pas encore testé complètement

---

**Date :** 24 octobre 2025
**Serveur :** Port 3002
**Base de données :** Supabase avec IPv4
**Statut :** 🔴 Problème non résolu

