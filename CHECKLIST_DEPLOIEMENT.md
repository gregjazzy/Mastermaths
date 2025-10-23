# ✅ Checklist Complète de Déploiement

## 📋 Avant de commencer

- [ ] Compte GitHub créé
- [ ] Compte Supabase créé
- [ ] Compte Netlify créé
- [ ] Compte Stripe créé
- [ ] Compte SendGrid créé (optionnel pour les emails)
- [ ] Domaine personnalisé (optionnel)

---

## 🗄️ PARTIE 1 : Base de données Supabase

### Configuration
- [ ] Projet Supabase créé (`master-maths`)
- [ ] Region choisie (Europe West)
- [ ] Mot de passe sauvegardé en lieu sûr
- [ ] Connection String copiée

### Installation
- [ ] `.env` mis à jour avec DATABASE_URL
- [ ] `npx prisma generate` exécuté
- [ ] `npx prisma db push` exécuté avec succès
- [ ] Badges chargés (`seed-badges.sql`)
- [ ] Tables visibles dans Supabase Table Editor

### Tests
- [ ] Connexion locale à la DB fonctionne
- [ ] Inscription d'un utilisateur test réussie
- [ ] Dashboard se charge correctement

---

## 🌐 PARTIE 2 : Hébergement Netlify

### Préparation du code
- [ ] `@netlify/plugin-nextjs` installé
- [ ] `netlify.toml` créé
- [ ] Repository GitHub créé
- [ ] Code pushé sur GitHub (`main` branch)

### Configuration Netlify
- [ ] Site créé sur Netlify
- [ ] Repo GitHub connecté
- [ ] Build settings configurés :
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `.next`
- [ ] Premier déploiement lancé

### Variables d'environnement Netlify
- [ ] `DATABASE_URL` (Supabase)
- [ ] `NEXTAUTH_URL` (URL Netlify)
- [ ] `NEXTAUTH_SECRET` (généré avec openssl)
- [ ] `STRIPE_SECRET_KEY` (sk_test_...)
- [ ] `STRIPE_WEBHOOK_SECRET` (whsec_...)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_test_...)
- [ ] `SMTP_HOST` (smtp.sendgrid.net)
- [ ] `SMTP_PORT` (587)
- [ ] `SMTP_USER` (apikey)
- [ ] `SMTP_PASSWORD` (clé SendGrid)
- [ ] `SMTP_FROM` (email vérifié)

### Tests Netlify
- [ ] Site accessible via URL Netlify
- [ ] Page d'accueil s'affiche
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Dashboard s'affiche
- [ ] Pas d'erreurs dans la console navigateur
- [ ] Pas d'erreurs dans les logs Netlify

---

## 💳 PARTIE 3 : Paiements Stripe

### Configuration Stripe
- [ ] Compte Stripe créé
- [ ] Mode test activé
- [ ] Produit DEMO créé (29€/mois)
  - [ ] Metadata: `plan: DEMO`
- [ ] Produit PREMIUM créé (79€/mois)
  - [ ] Metadata: `plan: PREMIUM`
- [ ] Clés API copiées (pk_test, sk_test)

### Webhook Stripe
- [ ] Endpoint créé : `https://votre-site.netlify.app/api/stripe/webhook`
- [ ] Events configurés :
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.created`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
- [ ] Signing secret copié (whsec_...)
- [ ] Variables Netlify mises à jour

### Tests Stripe
- [ ] Page `/upgrade` accessible
- [ ] Checkout DEMO fonctionne (carte test)
- [ ] Status utilisateur passe à DEMO
- [ ] Checkout PREMIUM fonctionne
- [ ] Status utilisateur passe à PREMIUM
- [ ] Webhook reçu et traité (vérifier dans Stripe Dashboard)

---

## 📧 PARTIE 4 : Emails SendGrid

### Configuration SendGrid
- [ ] Compte créé (plan Free)
- [ ] Email vérifié
- [ ] API Key créée (`master-maths-production`)
- [ ] Single Sender vérifié

### Configuration des emails
- [ ] Variables SMTP dans Netlify
- [ ] Email de test envoyé
- [ ] Template de bienvenue fonctionne
- [ ] Email de rappel fonctionne
- [ ] Email de célébration streak fonctionne

---

## 🔒 PARTIE 5 : Sécurité

### Secrets et clés
- [ ] NEXTAUTH_SECRET fort (32+ caractères)
- [ ] Tous les secrets stockés dans Netlify (pas dans le code)
- [ ] `.env` dans `.gitignore`
- [ ] Aucune clé exposée dans le code source

### HTTPS et domaine
- [ ] HTTPS activé (automatique Netlify)
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Certificat SSL actif
- [ ] Redirections HTTP → HTTPS

### Headers de sécurité
- [ ] Headers définis dans `netlify.toml`
- [ ] X-Frame-Options: DENY
- [ ] Content-Security-Policy configuré

---

## 📊 PARTIE 6 : Monitoring

### Logs et erreurs
- [ ] Logs Netlify accessibles
- [ ] Logs Supabase accessibles
- [ ] Sentry configuré (optionnel)
- [ ] Alertes configurées pour erreurs critiques

### Analytics
- [ ] Netlify Analytics activé (optionnel, payant)
- [ ] Plausible ou GA configuré (optionnel)
- [ ] Stripe Dashboard accessible

---

## 🧪 PARTIE 7 : Tests finaux

### Tests utilisateur
- [ ] Inscription nouvel utilisateur
- [ ] Connexion utilisateur existant
- [ ] Dashboard s'affiche correctement
- [ ] Navigation entre les pages
- [ ] Déconnexion fonctionne

### Tests gamification
- [ ] Connexion enregistrée dans ConnectionLog
- [ ] Streak incrémenté correctement
- [ ] PMU calculés correctement
- [ ] Badges débloqués
- [ ] Hall of Fame accessible

### Tests de paiement
- [ ] Passer de FREE à DEMO
- [ ] Passer de DEMO à PREMIUM
- [ ] Annulation d'abonnement
- [ ] Webhook Stripe traité

### Tests de contenu
- [ ] Créer un cours (via Prisma Studio ou SQL)
- [ ] Cours visible dans l'interface
- [ ] Vidéo Vimeo fonctionne
- [ ] QCM fonctionne
- [ ] Progression enregistrée

---

## 🚀 PARTIE 8 : Production

### Passer Stripe en mode LIVE
- [ ] Basculer en mode LIVE dans Stripe
- [ ] Mettre à jour les clés API (sk_live, pk_live)
- [ ] Vérifier les produits en mode LIVE
- [ ] Re-créer le webhook en mode LIVE
- [ ] Tester un vrai paiement (petite somme)

### Domaine personnalisé
- [ ] DNS configuré
- [ ] domaine pointé vers Netlify
- [ ] Certificat SSL actif
- [ ] NEXTAUTH_URL mis à jour

### Communication
- [ ] Page "À propos" créée
- [ ] CGV/CGU rédigées
- [ ] Politique de confidentialité
- [ ] Page de contact
- [ ] Support email configuré

---

## 📈 PARTIE 9 : Post-lancement

### Suivi
- [ ] Monitorer les premiers utilisateurs
- [ ] Vérifier les paiements fonctionnent
- [ ] Vérifier les emails sont envoyés
- [ ] Vérifier les performances (temps de chargement)

### Backups
- [ ] Backup automatique Supabase activé
- [ ] Export manuel de la DB hebdomadaire
- [ ] Code versionné sur GitHub

### Marketing
- [ ] Page d'accueil optimisée
- [ ] SEO de base (meta tags, sitemap)
- [ ] Google Search Console configuré
- [ ] Réseaux sociaux (optionnel)

---

## ✅ Checklist complète !

**Félicitations !** Si toutes les cases sont cochées, votre plateforme Master Maths est en production ! 🎉

---

## 📞 Support

En cas de problème, consultez :
- `DEPLOIEMENT_SUPABASE_NETLIFY.md` (guide détaillé)
- `SUPABASE_QUICKSTART.md` (DB setup)
- Logs Netlify (erreurs de build)
- Logs Supabase (erreurs de DB)
- Support Stripe (problèmes de paiement)

---

**Temps estimé total : 2-3 heures** ⏱️


