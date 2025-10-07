# UTMB Analytics Dashboard 🏔️

Application web professionnelle pour analyser les données historiques de l'Ultra-Trail du Mont-Blanc (UTMB) de 2003 à 2017.

## 🚀 Lancement de l'application

### Option 1 : Docker Compose (Recommandé) ⭐
```bash
# Démarrer l'application
docker compose up

# Ou en arrière-plan
docker compose up -d

# Arrêter l'application
docker compose down

# Reconstruire et démarrer
docker compose up --build
```

### Option 2 : Docker classique
```bash
npm run docker:build    # Build l'image
npm run docker:run      # Lance le container
npm run docker:stop     # Arrête et supprime le container
```

### Option 3 : Développement local (sans Docker)
```bash
npm install             # Installer les dépendances
npm run dev            # Mode développement (hot reload)
# ou
npm run build          # Build de production
npm run preview        # Prévisualiser le build
```

### 🌐 Accéder à l'application
Ouvre ton navigateur sur: **http://localhost:4173**

(En mode dev avec `npm run dev`, utilise le port affiché dans le terminal, généralement 5173)

---

## ✨ Fonctionnalités

### Vue d'ensemble
- **Range Slider Double** pour filtrer par période d'années (2003-2017)
- **Statistiques globales** : participants, finishers, taux DNF, temps moyens
- **Sélection de course** interactive avec grille d'années
- **Visualisations avancées** :
  - Évolution de la participation
  - Taux d'abandon (DNF) dans le temps
  - Distribution des catégories
  - Top nationalités

### Vue Détaillée de Course
- **Podium animé** avec les 3 premiers (🥇 or, 🥈 argent, 🥉 bronze)
- **Classement complet** avec tous les participants
- **Recherche et filtres** par nom, nationalité, équipe, catégorie
- **Graphiques détaillés** spécifiques à chaque année
- **Table interactive** scrollable avec 8 colonnes:
  - Rang (badge coloré pour top 3)
  - Dossard
  - Nom
  - Équipe
  - Catégorie
  - Nationalité
  - Temps (avec icône ⏰)
  - Écart avec le 1er

## 🎨 Design

Interface inspirée du site officiel UTMB avec:
- **Palette de couleurs UTMB**:
  - Bleu principal: `#0066CC`
  - Bleu foncé: `#003366`
  - Orange: `#FF6B35`
  - Vert montagne: `#4CAF50`
- **Logo UTMB** intégré dans l'en-tête
- **Gradients de montagne** avec patterns SVG
- **Animations fluides** (fade-in, slide-up, scale-in)
- **Design responsive** mobile-first

## 🛠️ Technologies

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS 3
- **Charts**: Recharts 2
- **Icons**: Lucide React
- **Routing**: React Router v7
- **Server**: Vite Preview (production)
- **Container**: Docker + Docker Compose

## 📊 Données

- **15 années** de courses (2003-2017)
- **~35,000 participants** au total
- **Podium et classement complet** pour chaque année
- Données extraites des CSV officiels UTMB

## 📁 Structure

```
src/
├── App.tsx                 # Application principale
├── components/
│   └── RangeSlider.css    # Styles du slider double
├── data/
│   ├── processedData.ts   # Stats agrégées (2003-2017)
│   └── races/             # Données détaillées JSON (15 fichiers)
├── logo/
│   └── logo_transparent.png
└── index.css              # Styles globaux

data/                       # CSV originaux (2003-2017)
scripts/
├── process_data.py        # Génération stats agrégées
└── load_race_detail.py    # Génération données détaillées
```

## 🎯 Améliorations Récentes

1. ✅ **Range Slider Fixé** - Curseurs superposés correctement avec z-index dynamique
2. ✅ **Sélection de Course** - Navigation interactive vers pages détaillées
3. ✅ **Podium Professionnel** - Affichage animé avec médailles or/argent/bronze
4. ✅ **Classement Complet** - Table scrollable avec tous les participants
5. ✅ **Recherche Avancée** - Filtres temps réel par nom, nationalité, équipe, catégorie
6. ✅ **Logo UTMB** - Intégration du logo transparent dans l'en-tête
7. ✅ **Design UTMB** - Palette de couleurs et gradients inspirés du site officiel
8. ✅ **Animations** - Transitions fluides et effets hover professionnels

## 📝 License

MIT
