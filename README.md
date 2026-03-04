# Benchmark Canvas JS

Comparatif interactif des principales librairies JavaScript Canvas : **Fabric.js**, **Konva.js**, **PixiJS**, **Paper.js** et **p5.js**.

**[Voir le benchmark en ligne](https://elouanb7.github.io/benchmark-canvas-js/)**

## Contenu

- **Vue d'ensemble** — Carte de chaque librairie avec stats, tags, pros/cons
- **Performance FPS** — Benchmark de 8 000 objets animés sur Chrome, Firefox et Safari
- **Matrice features** — Tableau comparatif (TypeScript, React, SVG parser, etc.)
- **Recommandations** — Quelle lib choisir selon votre use case + arbre de decision

## Stack

- React 19 + Vite 7
- CSS custom properties (theme clair/sombre automatique)
- Deploy via GitHub Actions sur GitHub Pages

## Sources des donnees

- **Performance FPS** : [canvas-engines-comparison](https://github.com/slaylines/canvas-engines-comparison) (MacBook Pro 2019, 8k boxes)
- **Downloads / Stars** : [npm trends](https://npmtrends.com/fabric-vs-konva-vs-pixi.js), [Best of JS](https://bestofjs.org)
- **Bundle sizes** : [Bundlephobia](https://bundlephobia.com)
- **Features** : Documentation officielle de chaque librairie

## Dev local

```bash
npm install
npm run dev
```

## Licence

MIT
