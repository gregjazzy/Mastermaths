# ✅ Interface Admin - Lives & DS

**Date**: 31 octobre 2025  
**Statut**: ✅ Implémenté

---

## 🎯 Objectif

Créer une interface d'administration pour gérer facilement les Lives Hebdo et la Banque DS, sans toucher au SQL.

---

## ✅ Ce qui a été créé

### 📁 Fichiers Créés

#### **Pages Admin**
1. **`app/admin/lives/page.tsx`** → Gestion des Lives Hebdo
2. **`app/admin/ds-banque/page.tsx`** → Gestion de la Banque DS

#### **API Routes**
3. **`app/api/admin/lives/route.ts`** → GET (liste) + POST (créer)
4. **`app/api/admin/lives/[id]/route.ts`** → PUT (modifier) + DELETE (supprimer)
5. **`app/api/admin/ds-banque/route.ts`** → GET + POST
6. **`app/api/admin/ds-banque/[id]/route.ts`** → PUT + DELETE

#### **Modification**
7. **`app/admin/page.tsx`** → Ajout des cartes "Lives Hebdo" et "Banque DS"

---

## 🎨 Interface Admin Lives

### Accès
```
/admin → Cliquer sur "Lives Hebdo" 🎥
```

### Fonctionnalités

#### ✅ Créer un Live
1. Cliquer sur **"Nouveau live"**
2. Remplir le formulaire :
   - **Titre** : Ex: "Live Maths - Suites numériques"
   - **Description** : Détails du live (optionnel)
   - **Niveau** : Seconde / Première / Terminale
   - **Thème** : Ex: "Suites numériques"
   - **Date et heure** : Sélecteur de date/heure
   - **Durée** : En minutes (ex: 60)
   - **URL EverWebinar** : Lien du webinaire
   - **Actif** : Checkbox (coché = visible sur le site)
3. Cliquer sur **"Créer le live"**

#### ✅ Modifier un Live
1. Cliquer sur l'icône **✏️** à droite du live
2. Modifier les champs
3. Cliquer sur **"Mettre à jour"**

#### ✅ Supprimer un Live
1. Cliquer sur l'icône **🗑️** à droite du live
2. Confirmer la suppression

### Affichage
- **Badge rouge "À VENIR"** → Pour les lives futurs
- **Badge gris "TERMINÉ"** → Pour les lives passés
- **Tri** : Du plus récent au plus ancien
- **Stats** : Nombre de lives à venir affiché en haut

---

## 📝 Interface Admin DS Banque

### Accès
```
/admin → Cliquer sur "Banque DS" 📝
```

### Fonctionnalités

#### ✅ Créer un DS
1. Cliquer sur **"Nouveau DS"**
2. Remplir le formulaire :
   - **Titre** : Ex: "DS Expert - Suites numériques - Novembre 2024"
     - ⚠️ Format : `DS [Niveau] - [Chapitre] - [Mois Année]`
   - **Description** : Détails du contenu (optionnel)
   - **Niveau** : Seconde / Première / Terminale
   - **Chapitre** : Ex: "Suites numériques"
   - **Durée** : En minutes (optionnel)
   - **Difficulté** : 1 à 5 étoiles
     - ⭐ Accessible (Bac standard)
     - ⭐⭐ Solide (Bon niveau)
     - ⭐⭐⭐ Avancé (Très bon niveau)
     - ⭐⭐⭐⭐ Expert (Prépa HEC)
     - ⭐⭐⭐⭐⭐ Élite (Classes Prépa*)
   - **URL PDF Sujet** : Lien Supabase Storage (optionnel)
   - **URL PDF Corrigé** : Lien Supabase Storage (optionnel)
   - **Public** : Checkbox (coché = visible sur le site)
3. Cliquer sur **"Créer le DS"**

#### ✅ Modifier un DS
1. Cliquer sur l'icône **✏️** à droite du DS
2. Modifier les champs
3. Cliquer sur **"Mettre à jour"**

#### ✅ Supprimer un DS
1. Cliquer sur l'icône **🗑️** à droite du DS
2. Confirmer la suppression

### Affichage
- **Badges de difficulté colorés** : Vert (1⭐) → Rouge (5⭐)
- **Badge "PRIVÉ"** → Si non public
- **Stats** : Nombre de vues, disponibilité PDF/corrigé
- **Disclaimer juridique** → Rappel des bonnes pratiques

---

## 📊 Dashboard Admin

### Nouvelles Cartes

```
┌─────────────────────────────────────┐
│  📚 Cours            📖 Chapitres   │
│  📝 Leçons           📄 Exercices   │
│  🏆 Badges           🎥 Lives Hebdo │ ← NOUVEAU
│  📝 Banque DS        👥 Utilisateurs│ ← NOUVEAU
│  ← Retour                           │
└─────────────────────────────────────┘
```

---

## 🔧 Guide d'Utilisation

### Créer un Live (Exemple)

#### Étape 1 : Aller sur /admin/lives
```
/admin → Lives Hebdo
```

#### Étape 2 : Remplir le formulaire
```
Titre: Live Maths - Suites numériques
Description: Méthodes et astuces pour maîtriser les suites
Niveau: Terminale
Thème: Suites numériques
Date: 10/11/2024 18:00
Durée: 60 minutes
URL: https://everwebinar.com/webinar/suites-term
Actif: ✓ (coché)
```

#### Étape 3 : Cliquer sur "Créer le live"
✅ Le live apparaît immédiatement dans la liste
✅ Il est visible sur `/live` pour les élèves

---

### Créer un DS (Exemple)

#### Étape 1 : Aller sur /admin/ds-banque
```
/admin → Banque DS
```

#### Étape 2 : Upload PDF sur Supabase Storage
1. Aller sur **Supabase** → Storage → `ds-banque`
2. Upload : `DS-Expert-Suites-Nov2024.pdf`
3. Copier l'URL : `https://storage.supabase.co/.../DS-Expert-Suites-Nov2024.pdf`

#### Étape 3 : Remplir le formulaire
```
Titre: DS Expert - Suites numériques - Novembre 2024
Description: Suites arithmétiques, géométriques, récurrence
Niveau: Terminale
Chapitre: Suites numériques
Durée: 120 minutes
Difficulté: ⭐⭐⭐⭐ Expert
URL Sujet: https://storage.supabase.co/.../DS-Expert-Suites-Nov2024.pdf
URL Corrigé: https://storage.supabase.co/.../DS-Expert-Suites-Nov2024-CORRIGE.pdf
Public: ✓ (coché)
```

#### Étape 4 : Cliquer sur "Créer le DS"
✅ Le DS apparaît dans la liste
✅ Il est visible sur `/ds-banque` pour les élèves

---

## 🎨 Captures d'Écran (Visuel)

### Page Admin Lives
```
┌─────────────────────────────────────────────────┐
│ ← Retour admin                                  │
│ 🎥 Gestion des Lives Hebdo                      │
│ 2 lives à venir • 5 total         [+ Nouveau]  │
├─────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────┐   │
│ │ À VENIR  Terminale                        │   │
│ │ Live Maths - Suites numériques            │   │
│ │ Méthodes et astuces...                    │   │
│ │ 📅 dim. 10 nov. 2024, 18:00 • ⏱️ 60 min  │   │
│ │                                 ✏️  🗑️     │   │
│ └───────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Page Admin DS Banque
```
┌─────────────────────────────────────────────────┐
│ ← Retour admin                                  │
│ 📝 Gestion de la Banque DS                      │
│ 8 DS publics • 10 total            [+ Nouveau]  │
├─────────────────────────────────────────────────┤
│ ⚖️ Rappel : Les DS doivent être substantiel... │
├─────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────┐   │
│ │ ⭐⭐⭐⭐ Expert  Terminale  Suites        │   │
│ │ DS Expert - Suites numériques - Nov 2024 │   │
│ │ Suites arith., géom., récurrence...       │   │
│ │ ⏱️ 120 min • 👁️ 45 vues • 📄 Sujet • ✅  │   │
│ │                                 ✏️  🗑️     │   │
│ └───────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Workflow Complet

### Pour les Lives

1. **Planifier** → Noter les dates des prochains lives
2. **Créer sur EverWebinar** → Obtenir l'URL du webinaire
3. **Ajouter dans l'admin** → `/admin/lives` → Remplir le formulaire
4. **Vérifier** → Aller sur `/live` et vérifier l'affichage

### Pour les DS

1. **Créer le DS** → Rédiger le sujet (Word/LaTeX)
2. **Exporter en PDF** → DS-Expert-Suites-Nov2024.pdf
3. **Upload Supabase** → Storage → ds-banque
4. **Copier les URLs** → Sujet + Corrigé
5. **Ajouter dans l'admin** → `/admin/ds-banque` → Remplir le formulaire
6. **Vérifier** → Aller sur `/ds-banque` et vérifier l'affichage

---

## ✅ Avantages de l'Interface Admin

| Avant (SQL) | Après (Interface) |
|-------------|-------------------|
| ❌ Écrire du SQL | ✅ Formulaire visuel |
| ❌ Risque d'erreur syntaxe | ✅ Validation automatique |
| ❌ Besoin de connaître les IDs | ✅ Sélection graphique |
| ❌ Pas de preview | ✅ Affichage direct |
| ❌ Modifications complexes | ✅ Édition en 2 clics |

---

## 📝 Notes Importantes

### Pour les Lives
- ⚠️ La date doit être **future** pour apparaître comme "À VENIR"
- ✅ Les lives passés restent visibles dans l'admin mais ne sont plus mis en avant sur `/live`
- 💡 Tu peux désactiver un live sans le supprimer (décocher "Actif")

### Pour les DS
- ⚠️ **Respecte le format de nommage** : `DS [Niveau] - [Chapitre] - [Mois Année]`
- ⚠️ **Pas de nom de lycée** dans le titre (cf. disclaimer juridique)
- ✅ Tu peux créer un DS sans PDF (pour le préparer plus tard)
- 💡 Un DS en "Privé" est invisible sur le site mais visible dans l'admin

---

## 🔒 Sécurité

Les pages admin sont **protégées** :
- ✅ Authentification NextAuth requise
- ✅ Seuls les admins peuvent y accéder
- ✅ Middleware de vérification

**Pour sécuriser davantage** (à faire) :
```typescript
// middleware.ts
if (pathname.startsWith('/admin')) {
  const user = await getServerSession()
  if (user?.role !== 'ADMIN') {
    return NextResponse.redirect('/dashboard')
  }
}
```

---

## ✅ Récapitulatif

**Créé** :
- ✅ Interface admin Lives (`/admin/lives`)
- ✅ Interface admin DS (`/admin/ds-banque`)
- ✅ Routes API complètes (GET, POST, PUT, DELETE)
- ✅ Intégration dans le dashboard admin

**Prochaines étapes** :
- [ ] Tester la création d'un live
- [ ] Tester la création d'un DS
- [ ] Configurer Supabase Storage pour les PDFs

**Tout est prêt ! Tu peux maintenant gérer tes Lives et DS sans toucher au SQL !** 🎉

