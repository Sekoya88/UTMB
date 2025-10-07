# UTMB Analytics Dashboard 🏔️

Application web professionnelle pour analyser les données historiques de l'Ultra-Trail du Mont-Blanc (UTMB) de 2003 à 2017.

## 🚀 Lancement Rapide

### Docker Compose (Recommandé) ⭐
```bash
# Démarrer l'application
docker compose up -d

# Reconstruire et démarrer
docker compose up --build -d

# Arrêter l'application
docker compose down
```

### Docker Classique
```bash
npm run docker:build    # Build l'image
npm run docker:run      # Lance le container
npm run docker:stop     # Arrête et supprime le container
```

### Développement Local
```bash
npm install             # Installer les dépendances
npm run dev            # Mode développement (hot reload)
npm run build          # Build de production
npm run preview        # Prévisualiser le build
```

### 🌐 Accès
**http://localhost:4173** (Docker/Preview) ou **http://localhost:5173** (Dev)

---

## ✨ Fonctionnalités Principales

### 🏠 Page d'Accueil
- **Navigation Rapide** vers 3 sections principales (Parcours, Checkpoints, Documentation)
- **Filtrage Temporel** avec double slider (2003-2017)
- **Statistiques Globales** : participants, finishers, taux DNF, temps moyens
- **13 Visualisations** :
  - Graphiques de base (Line, Area, Bar)
  - Graphiques avancés (Scatter, Radar, Composed, Growth)
  - Tableau de données interactif

### 🏆 Pages de Détail par Course
- **Podium Animé** avec médailles (🥇 🥈 🥉)
- **Classement Complet** avec tous les participants
- **Recherche & Filtres** par nom, nationalité, équipe, catégorie
- **12 Visualisations** incluant :
  - Histogramme de distribution des temps
  - Graphique de taux de réussite par position
  - Temps moyens par catégorie
  - Distribution des nationalités

### 🗺️ Page Parcours UTMB
- **Carte Interactive Leaflet** avec trace GPX complète (171 km)
- **Marqueurs Personnalisés** :
  - 🟢 Départ
  - 🔵 Points de passage (~20)
  - 🔴 Arrivée
- **Profil d'Élévation** avec graphique altitude/distance
- **Statistiques du Parcours** : 10,000m D+, dénivelé négatif
- **Liste Interactive** des checkpoints avec coordonnées GPS

### 📊 Page Analyse des Checkpoints
- **Sélecteur de Checkpoint** (~20 points de passage)
- **Évolution Temporelle** des temps moyens (2003-2017)
- **Graphiques** : Area Chart (temps), Bar Chart (coureurs)
- **Statistiques** détaillées par point

### 📚 Page Annexes & Documentation
- **Guide Complet** des visualisations utilisées
- **Méthodologies** d'analyse (DNF, distances GPS, dénivelé)
- **Sources de Données** : CSV, GPX, JSON
- **Technologies** : React, TypeScript, Tailwind, Recharts, Leaflet
- **Légende des Couleurs** UTMB

---

## 🎨 Design System

### Palette de Couleurs UTMB
- **Bleu Principal** : `#0066CC` (utmb-blue)
- **Bleu Foncé** : `#003366` (utmb-dark-blue)
- **Orange** : `#FF6B35` (utmb-orange)
- **Vert Montagne** : `#4CAF50` (utmb-green)
- **Teal Montagne** : `#2C5F7C` (utmb-mountain)

### Animations CSS
- `animate-fade-in` : Apparition en fondu (0.6s)
- `animate-slide-up` : Glissement vers le haut (0.5s)
- `animate-slide-down` : Glissement vers le bas (0.4s)
- `animate-scale-in` : Zoom progressif (0.4s)
- `animate-pulse` : Pulsation continue
- `animate-shimmer` : Effet de brillance
- `animate-bounce` : Rebond

### Composants Réutilisables
- **StatCard** : Cartes statistiques avec icônes et gradients
- **ChartCard** : Conteneurs uniformes pour graphiques
- **Podium** : Affichage animé du top 3

---

## 🛠️ Architecture Technique

### Stack Frontend
- **React 18** avec Hooks
- **TypeScript** (typage strict)
- **Vite** (build tool ultra-rapide)
- **TailwindCSS 3** (utility-first)
- **React Router v7** (navigation)

### Visualisations
- **Recharts 2** : Line, Area, Bar, Scatter, Radar, Composed Charts
- **Leaflet** + **React-Leaflet** : Cartes interactives
- **Lucide React** : Icônes modernes

### Traitement des Données
- **Parser GPX Custom** (DOMParser natif)
- **Formule de Haversine** (calcul distances GPS)
- **Calcul de Dénivelé** (D+ et D-)
- **Python/Pandas** (preprocessing CSV → JSON)

### Déploiement
- **Docker** + **Docker Compose**
- **Node 20 Alpine** (image légère)
- **Vite Preview Server** (production)

---

## 📊 Données

- **15 années** de courses (2003-2017)
- **~35,000 participants** au total
- **171 km** de parcours GPX (UTMB 2025)
- **~20 checkpoints** avec coordonnées GPS
- **48+ visualisations** uniques

---

## 📁 Structure du Projet

```
src/
├── App.tsx                       # Router principal
├── pages/
│   ├── HomePage.tsx              # Vue d'ensemble + graphiques avancés
│   ├── RaceDetailPage.tsx        # Détails course + analyses avancées
│   ├── CourseMapPage.tsx         # Carte interactive + profil élévation
│   ├── CheckpointAnalysisPage.tsx # Analyse temporelle checkpoints
│   └── AnnexesPage.tsx           # Documentation complète
├── components/
│   └── RangeSlider.css           # Styles slider double
├── data/
│   ├── processedData.ts          # Stats agrégées (2003-2017)
│   └── races/                    # JSON détaillés (15 fichiers)
├── utils/
│   └── gpxParser.ts              # Parser GPX custom
├── types/
│   └── gpx-parser-builder.d.ts   # Types TypeScript
├── logo/
│   └── logo_transparent.png      # Logo UTMB
└── index.css                     # Styles globaux + animations

public/
└── data/
    ├── races/                    # JSON race details
    └── utmb_2025.gpx            # Trace GPS parcours

data/                             # CSV originaux (2003-2017)
scripts/
├── process_data.py               # Génération stats agrégées
└── load_race_detail.py           # Génération données détaillées

Dockerfile                        # Image Docker Node 20
docker-compose.yml                # Orchestration container
```

---

## 📦 Dépendances Principales

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^7.9.3",
  "recharts": "^2.10.3",
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "lucide-react": "^0.294.0",
  "typescript": "^5.2.2",
  "tailwindcss": "^3.3.6",
  "vite": "^5.0.8"
}
```

---

## 🚀 Performance

- **Build Size** : 859 KB (gzip: 239 KB)
- **CSS Size** : 48 KB (gzip: 13 KB)
- **Optimisations** :
  - Sampling du profil d'élévation (1/50 points)
  - Lazy loading des données JSON
  - Animations CSS natives (hardware-accelerated)
  - Code splitting potentiel

---

## 🌟 Points Forts

1. ✅ **Ultra-Stylé** : Gradients, animations, transitions fluides
2. ✅ **Complet** : 5 pages, 48+ visualisations uniques
3. ✅ **Performant** : Build optimisé, animations CSS natives
4. ✅ **Documenté** : Page Annexes expliquant tout
5. ✅ **Interactif** : Cartes, filtres, sélecteurs, recherche
6. ✅ **Moderne** : React 18, TypeScript, Tailwind CSS 3
7. ✅ **Responsive** : Design adaptatif mobile/tablette/desktop
8. ✅ **Accessible** : Couleurs contrastées, labels clairs

---

## 🔮 Roadmap Futur

- [ ] Données réelles des checkpoints (parsing CSV complet)
- [ ] Comparaison multi-années sur carte
- [ ] Export PDF des rapports
- [ ] Dark mode complet
- [ ] Profil d'élévation 3D
- [ ] PWA (fonctionnalité offline)
- [ ] API Backend pour données dynamiques

---

## 📝 Notes Techniques

- **GPX Parser** : DOMParser natif (pas de dépendance externe problématique)
- **Leaflet Icons** : URLs CDN pour markers colorés
- **Recharts** : Composants React purs
- **TypeScript** : Typage strict activé
- **Tailwind** : Configuration personnalisée avec couleurs UTMB

---

## 📄 License

MIT

---

## 🎉 Prêt pour la Production !

Application complète avec 5 pages, 48+ visualisations, carte interactive, et documentation exhaustive. 🚀
