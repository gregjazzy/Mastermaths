# 🎉 Interface Admin Master Maths

## ✅ Interface Admin Complète !

Vous avez maintenant une interface admin complète pour gérer tout le contenu de Master Maths !

---

## 📍 Accès à l'interface admin

**URL** : `http://localhost:3000/admin`

(En production : `https://votre-site.netlify.app/admin`)

---

## 🎯 Fonctionnalités

### 1. **Dashboard Admin** (`/admin`)
- Statistiques en temps réel
- Nombre de cours, chapitres, leçons, utilisateurs
- Accès rapide à toutes les sections

### 2. **Gestion des Cours** (`/admin/courses`)
- ➕ Créer un nouveau cours
- ✏️ Modifier un cours existant
- 🗑️ Supprimer un cours
- 📊 Voir le nombre de chapitres par cours
- 🔒 Définir le niveau d'accès (FREE/DEMO/PREMIUM)

### 3. **Gestion des Chapitres** (`/admin/chapters`)
- ➕ Créer un chapitre dans un cours
- 🗺️ Ajouter carte mentale (URL)
- 🏫 Ajouter répertoire lycées (URL)
- ✏️ Modifier/Supprimer

### 4. **Gestion des Leçons** (`/admin/lessons`) ⭐ **IMPORTANT**
- ➕ Créer une leçon (6 types disponibles)
- 🎥 **Ajouter une vidéo Vimeo** (juste l'ID !)
- 📝 Créer des QCM
- ✅ Ajouter des vidéos de correction
- 📄 Exercices écrits
- 🗺️ Cartographie
- 💡 Méthodes

---

## 🎥 Comment ajouter une vidéo Vimeo

### Étape 1 : Upload sur Vimeo

1. Allez sur [vimeo.com](https://vimeo.com)
2. Créez un compte (gratuit)
3. Cliquez sur "Upload" et uploadez votre vidéo
4. Attendez que la vidéo soit traitée

### Étape 2 : Récupérer l'ID

1. Une fois uploadée, allez sur la page de la vidéo
2. Regardez l'URL : `https://vimeo.com/987654321`
3. **L'ID est le numéro** : `987654321`

### Étape 3 : Ajouter dans Master Maths

1. Allez sur `/admin/lessons`
2. Cliquez sur "Nouvelle leçon"
3. Sélectionnez le type : **🎥 Vidéo de cours**
4. Remplissez le titre
5. **Collez l'ID Vimeo** dans le champ prévu
6. Cliquez sur "Créer la leçon"

**C'est tout ! 🎉** La vidéo sera automatiquement intégrée dans votre plateforme.

---

## 📋 Workflow complet de création de contenu

### 1️⃣ Créer un cours
```
/admin/courses
→ "Nouveau cours"
→ Titre: "Mathématiques Terminale S"
→ Niveau: DEMO
→ Créer
```

### 2️⃣ Créer des chapitres
```
/admin/chapters
→ "Nouveau chapitre"
→ Cours: "Mathématiques Terminale S"
→ Titre: "Chapitre 1 - Les limites"
→ Carte mentale: https://... (optionnel)
→ Créer
```

### 3️⃣ Créer des sous-chapitres
Via Prisma Studio ou SQL :
```sql
INSERT INTO "subChapters" (id, "chapterId", title, "order")
VALUES ('sc-1', 'chapter-id', 'Introduction aux limites', 1);
```
*(Note: On pourrait ajouter une page admin pour ça aussi)*

### 4️⃣ Créer des leçons
```
/admin/lessons
→ "Nouvelle leçon"
→ Sous-chapitre: "Introduction aux limites"
→ Type: 🎥 Vidéo de cours
→ Titre: "Définition de limite"
→ ID Vimeo: 987654321
→ Créer
```

---

## 🔐 Sécurité (À ajouter en v2)

Pour l'instant, **tous les utilisateurs connectés** peuvent accéder à l'admin.

Pour restreindre l'accès :

### Option 1 : Ajouter un champ `isAdmin`
```prisma
model User {
  // ...
  isAdmin Boolean @default(false)
}
```

Puis dans chaque API admin :
```typescript
const user = await prisma.user.findUnique({
  where: { email: session.user.email }
})

if (!user?.isAdmin) {
  return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
}
```

### Option 2 : Liste d'emails admin
```typescript
// lib/admin.ts
const ADMIN_EMAILS = [
  'votre-email@example.com'
]

export function isAdmin(email: string) {
  return ADMIN_EMAILS.includes(email)
}
```

---

## 🎨 Pages créées

- ✅ `/admin` - Dashboard admin
- ✅ `/admin/courses` - Gestion des cours
- ✅ `/admin/chapters` - Gestion des chapitres
- ✅ `/admin/lessons` - Gestion des leçons (avec Vimeo !)

---

## 🚀 APIs créées

- ✅ `GET /api/admin/stats` - Stats dashboard
- ✅ `GET/POST /api/admin/courses` - CRUD cours
- ✅ `PUT/DELETE /api/admin/courses/[id]` - Modifier/Supprimer
- ✅ `GET/POST /api/admin/chapters` - CRUD chapitres
- ✅ `PUT/DELETE /api/admin/chapters/[id]` - Modifier/Supprimer
- ✅ `GET/POST /api/admin/lessons` - CRUD leçons
- ✅ `PUT/DELETE /api/admin/lessons/[id]` - Modifier/Supprimer
- ✅ `GET /api/admin/subchapters` - Liste sous-chapitres

---

## 💡 Astuces

### Créer rapidement des sous-chapitres

Via Prisma Studio :
1. `npx prisma studio`
2. Ouvrir la table `subChapters`
3. Cliquer sur "Add record"
4. Remplir les champs

Ou via SQL (plus rapide) :
```sql
INSERT INTO "subChapters" (id, "chapterId", title, "order") VALUES
  ('sc-1', 'votre-chapter-id', 'Introduction', 1),
  ('sc-2', 'votre-chapter-id', 'Définitions', 2),
  ('sc-3', 'votre-chapter-id', 'Exercices', 3);
```

---

## 📝 TODO v2 (Améliorations futures)

- [ ] Page admin pour sous-chapitres
- [ ] Page admin pour QCM (créer les questions)
- [ ] Upload direct Vimeo depuis l'interface
- [ ] Gestion des badges personnalisés
- [ ] Gestion des utilisateurs (changer status, etc.)
- [ ] Aperçu en direct de la leçon
- [ ] Drag & drop pour réordonner
- [ ] Duplication de contenu

---

## 🎉 C'est terminé !

Vous avez maintenant une interface admin **complète et fonctionnelle** !

**Pour commencer** :
1. Allez sur `http://localhost:3000/admin`
2. Créez un cours
3. Ajoutez des chapitres
4. Créez des sous-chapitres (via Prisma Studio)
5. Ajoutez vos vidéos Vimeo dans les leçons

**Bon courage avec Master Maths ! 🚀**


