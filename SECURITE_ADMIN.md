# 🔒 Sécurisation de l'accès Admin

## ⚠️ **Problème détecté :**
N'importe quel utilisateur authentifié pouvait accéder à `/admin` !

## ✅ **Solution implémentée :**

### **1. Ajout du champ `isAdmin`**
- Nouveau champ booléen dans la table `users`
- Par défaut `false` pour tous les utilisateurs
- Seuls les admins ont `isAdmin = true`

### **2. Middleware mis à jour**
- Vérifie maintenant `token.isAdmin`
- Redirige les non-admins vers `/cours`

### **3. JWT/Session mis à jour**
- `isAdmin` inclus dans le token
- `isAdmin` inclus dans la session

---

## 🚀 **Installation :**

### **Étape 1 : Migration SQL dans Supabase**

```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN DEFAULT false;

-- Mettre votre compte en admin
UPDATE users 
SET "isAdmin" = true 
WHERE email ILIKE '%mittelette%';

-- Vérifier
SELECT email, name, status, "isAdmin"
FROM users
WHERE email ILIKE '%mittelette%';
```

### **Étape 2 : Synchroniser Prisma**

```bash
npx prisma db pull
npx prisma generate
```

### **Étape 3 : Déconnexion/Reconnexion**

**IMPORTANT** : Vous devez vous **déconnecter** puis **reconnecter** pour que le nouveau champ `isAdmin` soit dans votre session !

---

## 🎯 **Résultat :**

✅ **Utilisateurs normaux** : Redirigés vers `/cours` si ils tentent `/admin`  
✅ **Administrateurs** (`isAdmin = true`) : Accès complet à `/admin`  
✅ **Logs dans la console** pour tracer les tentatives d'accès

---

## 📝 **Pour créer un nouvel admin :**

```sql
UPDATE users 
SET "isAdmin" = true 
WHERE email = 'nouvel-admin@example.com';
```

**N'oubliez pas** : L'utilisateur doit se déconnecter/reconnecter après !

