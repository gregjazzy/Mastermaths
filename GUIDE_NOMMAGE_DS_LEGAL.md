# 📋 Guide de Nommage et Gestion des DS - Banque DS

**Date**: 31 octobre 2025  
**Version**: 1.0 (Conforme droit d'auteur)

---

## ⚖️ Stratégie Juridique

### Principe de Base
Tous les DS sont des **œuvres dérivées** :
- ✅ Exercices **substantiellement modifiés**
- ✅ Niveau de difficulté **conservé**
- ❌ **Aucune mention** de lycée source dans le nom
- ✅ **Disclaimer légal** visible sur la page

---

## 📝 Convention de Nommage

### Format Standard
```
DS [Niveau Difficulté] - [Chapitre] - [Mois Année]
```

### Exemples Corrects ✅
```
DS Expert - Suites numériques - Novembre 2024
DS Avancé - Second degré - Octobre 2024
DS Élite - Limites et continuité - Septembre 2024
DS Solide - Dérivation - Décembre 2024
DS Accessible - Fonctions - Janvier 2025
```

### Exemples INTERDITS ❌
```
❌ DS Louis-le-Grand - Suites - Nov 2024
❌ DS Henri IV - Limites - Oct 2024
❌ DS Lycée Hoche - Second degré
❌ DS issu de Louis-le-Grand
❌ DS Top 5 Paris - Suites
```

---

## 🎯 Niveaux de Difficulté

| Niveau | Étoiles | Profil Élève | Équivalent |
|--------|---------|--------------|------------|
| **Accessible** | ⭐ | Élève moyen | Bac standard |
| **Solide** | ⭐⭐ | Bon élève | Bac mention Bien |
| **Avancé** | ⭐⭐⭐ | Très bon élève | Bac mention TB |
| **Expert** | ⭐⭐⭐⭐ | Excellentélève | Prépa HEC/ECS |
| **Élite** | ⭐⭐⭐⭐⭐ | Top 5% national | Classes Prépa* |

---

## 📚 Chapitres par Niveau

### **Seconde**
- Nombres et calculs
- Géométrie plane
- Fonctions (généralités)
- Statistiques et probabilités
- Équations et inéquations

### **Première**
- Second degré
- Dérivation
- Suites numériques (introduction)
- Probabilités conditionnelles
- Produit scalaire
- Fonctions trigonométriques

### **Terminale**
- Limites et continuité
- Suites numériques (avancé)
- Fonction exponentielle
- Fonction logarithme
- Intégration
- Probabilités (lois continues)
- Géométrie dans l'espace

---

## 🗂️ Structure de Fichiers (Supabase Storage)

### Organisation Recommandée
```
ds-banque/
  ├── seconde/
  │   ├── accessible/
  │   │   ├── DS-Accessible-Nombres-calculs-Nov2024.pdf
  │   │   └── DS-Accessible-Nombres-calculs-Nov2024-CORRIGE.pdf
  │   ├── solide/
  │   └── avance/
  ├── premiere/
  │   ├── accessible/
  │   ├── solide/
  │   ├── avance/
  │   ├── expert/
  │   └── elite/
  └── terminale/
      ├── accessible/
      ├── solide/
      ├── avance/
      ├── expert/
      └── elite/
```

### Nommage des Fichiers PDF
```
DS-[Niveau]-[Chapitre-Court]-[MoisAnnée].pdf
DS-[Niveau]-[Chapitre-Court]-[MoisAnnée]-CORRIGE.pdf
```

**Exemples** :
```
DS-Expert-Suites-Nov2024.pdf
DS-Expert-Suites-Nov2024-CORRIGE.pdf

DS-Elite-Limites-Oct2024.pdf
DS-Elite-Limites-Oct2024-CORRIGE.pdf

DS-Avance-Second-degre-Sep2024.pdf
DS-Avance-Second-degre-Sep2024-CORRIGE.pdf
```

---

## 💾 Insertion en Base de Données

### Template SQL
```sql
INSERT INTO ds_banque (
  id,
  title,
  description,
  niveau,
  chapter,
  difficulty,
  duration,
  "pdfUrl",
  "correctionPdfUrl",
  "isPublic"
) VALUES (
  gen_random_uuid(),
  'DS Expert - Suites numériques - Novembre 2024',
  'Suites arithmétiques et géométriques, récurrence, convergence',
  'Terminale',
  'Suites numériques',
  4, -- 1=Accessible, 2=Solide, 3=Avancé, 4=Expert, 5=Élite
  120, -- Durée en minutes
  'https://storage.supabase.co/.../DS-Expert-Suites-Nov2024.pdf',
  'https://storage.supabase.co/.../DS-Expert-Suites-Nov2024-CORRIGE.pdf',
  true
);
```

### Champs Obligatoires
| Champ | Type | Description |
|-------|------|-------------|
| `title` | String | Nom complet du DS (sans lycée) |
| `niveau` | String | "Seconde", "Première", ou "Terminale" |
| `chapter` | String | Nom du chapitre |
| `difficulty` | Int | 1 à 5 (voir tableau niveaux) |
| `pdfUrl` | String | URL du PDF sujet |
| `isPublic` | Boolean | `true` pour affichage |

### Champs Optionnels
| Champ | Type | Description |
|-------|------|-------------|
| `description` | String | Détails sur le contenu |
| `duration` | Int | Durée en minutes (ex: 120) |
| `correctionPdfUrl` | String | URL du PDF corrigé |

---

## 🔒 Checklist de Conformité Juridique

Avant de publier un DS, vérifie :

### ✅ Modifications Substantielles
- [ ] Les nombres/données ont été changés
- [ ] Les formulations ont été réécrites
- [ ] L'ordre des questions peut être différent
- [ ] Des questions ont été ajoutées/retirées
- [ ] Le contexte/habillage est nouveau

### ✅ Pas de Mention de Lycée
- [ ] Le titre ne contient pas de nom de lycée
- [ ] La description ne mentionne pas la source
- [ ] Le PDF ne contient pas d'en-tête de lycée
- [ ] Pas de logo d'établissement

### ✅ Disclaimer Présent
- [ ] Le disclaimer est visible sur `/ds-banque`
- [ ] Il mentionne les modifications substantielles
- [ ] Il indique la non-affiliation

---

## 📄 Disclaimer Légal (À Afficher)

**Version Complète** (page DS Banque) :
```
⚖️ Note juridique : Conformément aux droits d'auteur, 
tous les exercices présentés ont été substantiellement modifiés 
par rapport aux sources d'inspiration, tout en conservant leur 
niveau de difficulté d'origine. Les DS proposés sont des créations 
pédagogiques dérivées, non affiliées aux établissements mentionnés.
```

**Version CGU/Mentions Légales** :
```
Les DS disponibles dans la Banque de DS sont des œuvres dérivées 
créées par Master Maths. Ils sont inspirés de divers sujets 
d'examen mais ont été substantiellement modifiés. Aucune affiliation 
avec les établissements d'origine. Tous droits réservés Master Maths 2025.
```

---

## 🎨 Exemple de Carte DS (Interface)

```tsx
<div className="card">
  {/* Badge de difficulté en couleur */}
  <span className="badge bg-orange-100 text-orange-700">
    ⭐⭐⭐⭐ Expert
  </span>
  
  {/* Titre (sans lycée) */}
  <h3 className="text-xl font-bold">
    DS Expert - Suites numériques - Novembre 2024
  </h3>
  
  {/* Badges informatifs */}
  <div className="flex gap-2">
    <span className="badge bg-indigo-100">Terminale</span>
    <span className="badge bg-teal-100">Suites numériques</span>
    <span className="badge">⏱️ 2h</span>
  </div>
  
  {/* Description */}
  <p className="text-gray-600 text-sm">
    Suites arithmétiques et géométriques, récurrence, convergence
  </p>
  
  {/* Actions */}
  <div className="flex gap-2">
    <button>📥 Télécharger le sujet</button>
    <button>📥 Télécharger le corrigé</button>
  </div>
</div>
```

---

## 🚀 Workflow de Création d'un DS

### 1. **Inspiration** (Optionnel)
- Consulte un DS réel d'un lycée
- Note la structure et les thématiques

### 2. **Création du Contenu**
- Rédige de nouveaux exercices dans le même style
- Change les données, contextes, formulations
- Conserve le niveau de difficulté

### 3. **Génération PDF**
- Utilise LaTeX ou Word
- Pas d'en-tête de lycée
- Format propre et professionnel

### 4. **Upload Supabase**
```bash
# Via interface Supabase Storage
Bucket: ds-banque
Path: terminale/expert/DS-Expert-Suites-Nov2024.pdf
```

### 5. **Insertion BDD**
```sql
INSERT INTO ds_banque (...) VALUES (...);
```

### 6. **Vérification**
- [ ] Affichage correct sur `/ds-banque`
- [ ] Téléchargement fonctionne
- [ ] Disclaimer visible
- [ ] Pas de mention de lycée

---

## 📊 Statistiques Recommandées

Pour une **Banque crédible**, vise :
- **Minimum** : 20-30 DS (10 par niveau de classe)
- **Bon** : 50-70 DS (diversité des chapitres)
- **Excellence** : 100+ DS (mise à jour régulière)

### Répartition Suggérée (pour 50 DS)
| Niveau | Accessible | Solide | Avancé | Expert | Élite | **Total** |
|--------|-----------|--------|--------|--------|-------|-----------|
| Seconde | 3 | 3 | 2 | 1 | 0 | **9** |
| Première | 4 | 4 | 4 | 2 | 1 | **15** |
| Terminale | 4 | 5 | 6 | 6 | 5 | **26** |
| **Total** | **11** | **12** | **12** | **9** | **6** | **50** |

---

## ✅ Checklist Finale

Avant de lancer la feature en production :

### Technique
- [ ] Prisma schema mis à jour (champ `difficulty`)
- [ ] Page `/ds-banque` fonctionne
- [ ] Filtres opérationnels (classe, difficulté)
- [ ] Download tracking actif
- [ ] Supabase Storage configuré

### Contenu
- [ ] Minimum 10-20 DS créés
- [ ] Tous les DS sont substantiellement modifiés
- [ ] PDFs propres (pas de mention de lycée)
- [ ] Corrigés disponibles

### Juridique
- [ ] Disclaimer visible
- [ ] CGU/Mentions légales mises à jour
- [ ] Aucune mention de lycée dans les titres
- [ ] Documentation claire (ce fichier)

---

## 📞 Support & Questions

Si tu as des doutes sur :
- La modification substantielle d'un exercice
- Le nommage d'un DS
- La conformité juridique

→ Consulte ce guide ou demande conseil à un juriste spécialisé en propriété intellectuelle.

---

**Temps estimé pour créer 1 DS complet** : 
- Inspiration + Rédaction : 1-2h
- Génération PDF : 30min
- Upload + BDD : 15min
- **Total : 2-3h par DS**

**Budget alternatif** : Déléguer à un prof freelance (50-100€/DS)

---

**Version** : 1.0  
**Dernière mise à jour** : 31 octobre 2025  
**Statut** : ✅ Conforme droit d'auteur

