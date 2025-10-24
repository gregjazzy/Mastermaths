# 🚀 GUIDE D'EXÉCUTION DE LA MIGRATION

## ⚠️ IMPORTANT : MIGRATION SQL REQUISE

La migration SQL **n'a pas encore été exécutée** dans Supabase.

---

## 📋 ÉTAPES À SUIVRE

### **1️⃣ Exécuter la Migration SQL dans Supabase**

1. **Ouvrir Supabase** : https://supabase.com/dashboard
2. **Aller dans votre projet** : `zqgjhtafyuivnmgyqcix`
3. **Cliquer sur "SQL Editor"** dans le menu gauche
4. **Créer une nouvelle requête** (bouton "+ New query")
5. **Copier-coller le contenu du fichier** : `MIGRATION_COMPLETE.sql`
6. **Cliquer sur "Run"** (ou Cmd+Enter / Ctrl+Enter)
7. **Vérifier les messages de confirmation** (5 messages "✅" devraient apparaître)

---

### **2️⃣ Synchroniser Prisma avec la Base de Données**

Une fois la migration SQL exécutée dans Supabase :

```bash
# Récupérer le nouveau schéma depuis Supabase
npx prisma db pull

# Régénérer le client Prisma avec les nouveaux types
npx prisma generate
```

---

### **3️⃣ Vérifier que tout compile**

```bash
npm run build
```

Si tout est OK, vous verrez :
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Creating an optimized production build
```

---

### **4️⃣ Redémarrer le serveur de développement**

```bash
# Arrêter le serveur actuel (Ctrl+C)
killall node
sleep 2
PORT=3000 npm run dev
```

---

## 📄 FICHIER À UTILISER

**Fichier de migration** : `MIGRATION_COMPLETE.sql`

Ce fichier contient :
- ✅ Création de la table `exercises`
- ✅ Adaptation des QCM pour supporter leçons ET exercices
- ✅ Support des badges d'exercices dans `performances`
- ✅ Contraintes et index pour éviter les doublons

---

## 🆘 EN CAS D'ERREUR

### **Erreur : "relation already exists"**
➡️ Normal si certaines tables existent déjà. Les `IF NOT EXISTS` et `IF EXISTS` gèrent cela.

### **Erreur : "constraint already exists"**
➡️ Même chose, c'est géré par les `IF NOT EXISTS`.

### **Erreur : Prisma ne détecte pas les changements**
➡️ Assurez-vous d'avoir bien exécuté la migration SQL **dans Supabase**, pas localement.

---

## ✅ APRÈS LA MIGRATION

Une fois la migration réussie, vous pourrez :
- ✅ Créer des exercices depuis l'admin (`/admin/exercises`)
- ✅ Ajouter des QCM aux exercices
- ✅ Les élèves gagneront des badges Bronze/Silver/Gold sur les exercices
- ✅ Les performances seront trackées séparément pour leçons et exercices

---

## 📞 BESOIN D'AIDE ?

Si vous rencontrez un problème :
1. Vérifiez que la migration SQL a bien été exécutée dans Supabase
2. Vérifiez les messages de confirmation (5 ✅)
3. Relancez `npx prisma db pull` et `npx prisma generate`
4. Vérifiez que le fichier `prisma/schema.prisma` contient bien `exerciseId` dans `Performance`

---

**Prêt ? Exécutez la migration SQL dans Supabase maintenant ! 🚀**

