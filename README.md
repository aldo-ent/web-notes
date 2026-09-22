# Mon App — squelette PWA

Ce dossier contient une mini app web installable sur téléphone (PWA).
Ce guide part de zéro sur macOS : installation des outils, test en local, puis mise en ligne gratuite sur GitHub Pages, avec un workflow de mise à jour rapide.

---

## 1. Préparer ton Mac

### a) Installer Homebrew (gestionnaire de paquets pour Mac)

Ouvre l'app **Terminal** (Cmd+Espace → tape "Terminal") et colle :

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Suis les instructions affichées à la fin (souvent, il faut ajouter Homebrew au PATH — le script te donne les 2 lignes exactes à copier-coller).

Vérifie que ça marche :
```bash
brew --version
```

### b) Installer Git

```bash
brew install git
git --version
```

Configure ton identité (une seule fois) :
```bash
git config --global user.name "Ton Nom"
git config --global user.email "ton-email@example.com"
```

### c) Installer VS Code

```bash
brew install --cask visual-studio-code
```

Ou télécharge-le directement sur [code.visualstudio.com](https://code.visualstudio.com).

### d) Créer un compte GitHub + connexion SSH

1. Crée un compte sur [github.com](https://github.com) si ce n'est pas déjà fait.
2. Génère une clé SSH :
   ```bash
   ssh-keygen -t ed25519 -C "ton-email@example.com"
   ```
   (appuie sur Entrée à toutes les questions pour les valeurs par défaut)
3. Ajoute la clé à l'agent SSH :
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```
4. Copie la clé publique :
   ```bash
   pbcopy < ~/.ssh/id_ed25519.pub
   ```
5. Sur GitHub : **Settings → SSH and GPG keys → New SSH key**, colle la clé.
6. Teste :
   ```bash
   ssh -T git@github.com
   ```
   Tu dois voir un message du type "Hi *username*! You've successfully authenticated".

---

## 2. Mettre le projet dans un dossier de travail

Décompresse ce zip où tu veux, par exemple :
```bash
cd ~/Documents
unzip pwa-app-demo.zip
cd pwa-app-demo
```

Ouvre le dossier dans VS Code :
```bash
code .
```

Structure des fichiers :
```
pwa-app-demo/
├── index.html          → la page principale
├── manifest.json        → décrit l'app (nom, icône, couleurs) pour l'installation
├── service-worker.js    → gère le cache hors-ligne et les mises à jour
├── css/style.css        → le style
├── js/app.js             → la logique + l'enregistrement du service worker
└── icons/                → icônes (192px et 512px), à remplacer par les tiennes
```

---

## 3. Tester en local sur ton Mac

Un simple double-clic sur `index.html` (ouverture en `file://`) **ne fonctionnera pas** : le service worker exige un vrai serveur, même local. Python (déjà installé sur Mac) suffit :

```bash
cd ~/Documents/pwa-app-demo
python3 -m http.server 8000
```

Va dans ton navigateur sur `http://localhost:8000`. Tu devrais voir la page, et en bas "Prêt (mode hors-ligne activé)".

Arrête le serveur avec `Ctrl+C` quand tu as fini de tester.

---

## 4. Mettre le projet sur GitHub

1. Sur GitHub, clique **New repository**. Nom-le par exemple `mon-app`. Laisse-le public. Ne coche rien d'autre (pas de README auto).
2. Dans le Terminal, depuis le dossier du projet :
   ```bash
   git init
   git add .
   git commit -m "Premier commit"
   git branch -M main
   git remote add origin git@github.com:aldo-ent/mon-app.git
   git push -u origin main
   ```
   (remplace `mon-app` par le nom que tu as choisi)

---

## 5. Activer GitHub Pages (hébergement gratuit)

1. Sur la page du repo GitHub → **Settings → Pages**.
2. Sous "Build and deployment" → Source : **Deploy from a branch**.
3. Branch : `main`, dossier `/ (root)` → **Save**.
4. Attends 1-2 minutes. Ton app sera disponible à :
   ```
   https://aldo-ent.github.io/mon-app/
   ```

---

## 6. Installer l'app sur ton téléphone

- **iPhone (Safari)** : ouvre le lien → bouton Partager (carré avec flèche) → "Sur l'écran d'accueil".
- **Android (Chrome)** : ouvre le lien → un bandeau "Ajouter à l'écran d'accueil" apparaît souvent automatiquement, sinon menu (⋮) → "Installer l'application".

L'icône apparaît alors comme une vraie app, en plein écran, sans la barre d'adresse du navigateur.

---

## 7. Workflow de mise à jour rapide

À chaque fois que tu modifies l'app :

1. **Change le numéro de version** dans `service-worker.js` (ligne `CACHE_NAME`), par exemple `"mon-app-v1"` → `"mon-app-v2"`. C'est ce qui force le téléphone à ne pas réutiliser l'ancienne version en cache.
2. Enregistre tes fichiers.
3. Pousse sur GitHub :
   ```bash
   git add .
   git commit -m "Description de ta modif"
   git push
   ```
4. Attends ~1 minute (le temps que GitHub Pages redéploie).
5. Sur ton téléphone, **ferme complètement l'app** (pas juste mettre en arrière-plan) puis rouvre-la. La nouvelle version se charge.

C'est tout — pas de build, pas de compte développeur, pas d'App Store.

---

## Pour aller plus loin

- Remplace les icônes dans `icons/` par les tiennes (192×192 et 512×512 px, format PNG).
- Teste la qualité PWA de ton app avec **Lighthouse** : dans Chrome, clic droit → Inspecter → onglet "Lighthouse" → "Analyze page load".
- Si tu veux automatiser encore plus (ne plus avoir à changer le numéro de version à la main), ça se fait avec un outil comme **Workbox**, mais ce n'est utile que si l'app devient plus grosse.
