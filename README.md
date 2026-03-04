# ⚡ Benchmark Canvas JS 2025

Comparatif interactif des principales librairies JavaScript Canvas : **Fabric.js**, **Konva.js**, **PixiJS**, **Paper.js** et **p5.js**.

## 🚀 Déploiement sur GitHub Pages

### 1. Créer le repo

```bash
git init
git add .
git commit -m "initial commit"
gh repo create canvas-benchmark --public --push --source=.
```

### 2. Configurer GitHub Pages

1. Va dans **Settings → Pages** de ton repo
2. Source : **GitHub Actions**
3. Le workflow `.github/workflows/deploy.yml` se lance automatiquement au push

### 3. Personnaliser

Avant de déployer, pense à modifier :

- **`vite.config.js`** → Change `base: '/canvas-benchmark/'` par le nom de ton repo si différent
- **`index.html`** → Remplace les URLs `elouan.github.io/canvas-benchmark/` par les tiennes
- **`src/App.jsx`** → Recherche les `TODO:` pour mettre tes vrais liens (email, GitHub, Twitter)
- **`public/og-image.png`** → Ajoute une image OG pour le partage social (1200x630px recommandé)

### 4. Dev local

```bash
npm install
npm run dev
```

### 5. Build

```bash
npm run build
npm run preview
```

## 📁 Structure

```
├── .github/workflows/deploy.yml  # CI/CD GitHub Pages
├── index.html                     # SEO, Open Graph, Structured Data
├── public/favicon.svg             # Favicon
├── src/
│   ├── main.jsx                   # Entry point
│   ├── index.css                  # Global styles
│   ├── App.jsx                    # Composant principal
│   └── data.js                    # Données des librairies
└── vite.config.js                 # Config Vite + base path
```

## 📊 Sources des données

- **Performance FPS** : [canvas-engines-comparison](https://github.com/slaylines/canvas-engines-comparison) (MacBook Pro 2019, 8k boxes)
- **Downloads / Stars** : [npm trends](https://npmtrends.com/fabric-vs-konva-vs-pixi.js), [Best of JS](https://bestofjs.org)
- **Bundle sizes** : [Bundlephobia](https://bundlephobia.com)
- **Features** : Documentation officielle de chaque librairie

## 📄 Licence

MIT
