import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mountain, BarChart3, LineChart as LineChartIcon, TrendingUp, PieChart, MapPin, Activity, BookOpen, Info } from 'lucide-react';
import logo from '../logo/logo_transparent.png';

export default function AnnexesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-utmb-snow via-slate-50 to-blue-50">
      <header className="bg-mountain-gradient shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0wIDQwTDQwIDBNNDAgNDBMMCA0MCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNwYXR0ZXJuKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 relative z-10">
          <button
            onClick={() => navigate('/')}
            className="mb-4 inline-flex items-center gap-2 text-white hover:text-utmb-orange transition-colors font-medium backdrop-blur-sm bg-white/10 px-4 py-2 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à l'accueil
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl p-2 flex items-center justify-center border border-white/20">
              <img src={logo} alt="UTMB Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">Annexes & Documentation</h1>
              <p className="text-sm text-blue-100 flex items-center gap-2 mt-1">
                <BookOpen className="w-4 h-4" />
                Guide des Visualisations et Méthodes d'Analyse
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Introduction */}
        <div className="bg-gradient-to-br from-utmb-blue to-utmb-light-blue rounded-2xl shadow-2xl p-8 mb-8 text-white animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-8 h-8" />
            <h2 className="text-3xl font-bold">À Propos de cette Application</h2>
          </div>
          <p className="text-lg leading-relaxed mb-4">
            Cette application web offre une analyse visuelle complète des données de l'Ultra-Trail du Mont-Blanc (UTMB) 
            de 2003 à 2017. Elle combine des techniques de visualisation de données avancées avec une interface utilisateur 
            moderne pour explorer les tendances, performances et statistiques de cette course légendaire.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="font-bold text-xl mb-1">15 Années</p>
              <p className="text-sm text-blue-100">de données analysées</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="font-bold text-xl mb-1">171 km</p>
              <p className="text-sm text-blue-100">de parcours cartographié</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="font-bold text-xl mb-1">10+ Types</p>
              <p className="text-sm text-blue-100">de visualisations</p>
            </div>
          </div>
        </div>

        {/* Visualizations Guide */}
        <div className="space-y-6">
          <VisualizationCard
            icon={<LineChartIcon className="w-6 h-6" />}
            title="Graphiques en Ligne (Line Charts)"
            color="from-utmb-blue to-utmb-light-blue"
            description="Les graphiques en ligne sont utilisés pour montrer l'évolution temporelle des données."
            usage={[
              "Évolution de la participation année par année",
              "Tendance du nombre de finishers au fil du temps",
              "Progression des performances moyennes"
            ]}
            interpretation="Les pentes ascendantes indiquent une augmentation, les pentes descendantes une diminution. Les points de données permettent de comparer précisément les valeurs entre années."
          />

          <VisualizationCard
            icon={<Activity className="w-6 h-6" />}
            title="Graphiques en Aires (Area Charts)"
            color="from-utmb-orange to-utmb-dark-orange"
            description="Les graphiques en aires mettent l'accent sur l'ampleur et la variation des données."
            usage={[
              "Évolution du taux d'abandon (DNF) avec visualisation de l'impact",
              "Profil d'élévation du parcours montrant le dénivelé cumulé",
              "Zones de données continues avec gradient de couleur"
            ]}
            interpretation="L'aire colorée sous la courbe permet de mieux visualiser l'amplitude des changements. Plus l'aire est importante, plus la valeur est élevée."
          />

          <VisualizationCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Graphiques à Barres (Bar Charts)"
            color="from-utmb-green to-emerald-500"
            description="Les graphiques à barres comparent des catégories discrètes entre elles."
            usage={[
              "Distribution des catégories d'âge (SE H, V1 H, V2 H, etc.)",
              "Comparaison du nombre de participants par nationalité",
              "Classement des équipes les plus représentées"
            ]}
            interpretation="La longueur de chaque barre représente la valeur de la catégorie. Utilisé pour identifier rapidement les catégories dominantes."
          />

          <VisualizationCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Nuages de Points (Scatter Plots)"
            color="from-utmb-mountain to-cyan-600"
            description="Les nuages de points révèlent les relations entre deux variables."
            usage={[
              "Relation entre le temps de course et le taux d'abandon",
              "Corrélation entre l'âge des participants et leur performance",
              "Distribution des performances par point de passage"
            ]}
            interpretation="Chaque point représente un individu ou une course. Les patterns (clusters, corrélations) révèlent des tendances cachées dans les données."
          />

          <VisualizationCard
            icon={<MapPin className="w-6 h-6" />}
            title="Carte Interactive (Map Visualization)"
            color="from-purple-600 to-pink-500"
            description="La carte interactive affiche le parcours réel de l'UTMB avec tous les points de passage."
            usage={[
              "Visualisation du tracé GPS complet du parcours",
              "Localisation précise de chaque point de passage (refuges, cols)",
              "Profil d'élévation avec distance et altitude",
              "Navigation interactive pour explorer le parcours"
            ]}
            interpretation="Les marqueurs verts indiquent le départ, les bleus les points de passage, et le rouge l'arrivée. La ligne orange représente le tracé officiel du parcours."
          />

          <VisualizationCard
            icon={<PieChart className="w-6 h-6" />}
            title="Statistiques Agrégées"
            color="from-indigo-600 to-blue-500"
            description="Les cartes statistiques offrent un aperçu rapide des métriques clés."
            usage={[
              "Total de participants sur la période sélectionnée",
              "Nombre de finishers et taux de réussite global",
              "Taux d'abandon moyen (DNF rate)",
              "Temps moyen de course"
            ]}
            interpretation="Ces métriques permettent une compréhension immédiate des performances globales et de la difficulté de la course."
          />
        </div>

        {/* Methodologies */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-utmb-dark-blue mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-utmb-orange" />
            Méthodologies d'Analyse
          </h2>
          
          <div className="space-y-6">
            <MethodologySection
              title="Calcul du Taux DNF (Did Not Finish)"
              formula="DNF Rate = ((Total Participants - Finishers) / Total Participants) × 100"
              explanation="Le taux DNF mesure le pourcentage de coureurs qui n'ont pas terminé la course. Un taux élevé indique des conditions difficiles ou un parcours particulièrement exigeant."
            />

            <MethodologySection
              title="Temps Moyen de Course"
              formula="Temps Moyen = Σ(Temps de tous les finishers) / Nombre de finishers"
              explanation="Le temps moyen donne une indication de la difficulté globale de la course pour une année donnée. Il exclut les DNF car ils n'ont pas de temps final."
            />

            <MethodologySection
              title="Calcul de Distance GPS"
              formula="Distance = R × c, où c = 2 × arctan2(√a, √(1−a))"
              explanation="Utilise la formule de Haversine pour calculer la distance entre deux points GPS sur une sphère (la Terre). Chaque segment est additionné pour obtenir la distance totale."
            />

            <MethodologySection
              title="Dénivelé Cumulé"
              formula="D+ = Σ(élévation[i] - élévation[i-1]) si positif"
              explanation="Le dénivelé positif (D+) cumule toutes les montées. Le dénivelé négatif cumule toutes les descentes. Ces métriques sont essentielles pour comprendre la difficulté d'un parcours de trail."
            />
          </div>
        </div>

        {/* Data Sources */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-utmb-dark-blue mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-utmb-orange" />
            Sources de Données
          </h2>
          
          <div className="space-y-4">
            <DataSourceItem
              title="Données Historiques UTMB (2003-2017)"
              description="Résultats officiels de course incluant les temps, classements, catégories, nationalités et points de passage pour chaque participant."
              format="CSV"
            />
            
            <DataSourceItem
              title="Trace GPX du Parcours"
              description="Fichier GPS officiel du parcours UTMB 2025 contenant les coordonnées géographiques, l'altitude et les points de passage (waypoints)."
              format="GPX (XML)"
            />
            
            <DataSourceItem
              title="Traitement des Données"
              description="Les données CSV ont été nettoyées, normalisées et agrégées en utilisant Python (pandas) pour créer des fichiers JSON optimisés pour le web."
              format="JSON"
            />
          </div>
        </div>

        {/* Technologies */}
        <div className="mt-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 text-white animate-slide-up">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Mountain className="w-6 h-6 text-utmb-orange" />
            Technologies Utilisées
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TechCard title="React 18" description="Framework UI moderne avec hooks" />
            <TechCard title="TypeScript" description="Typage statique pour plus de robustesse" />
            <TechCard title="Vite" description="Build tool ultra-rapide" />
            <TechCard title="Tailwind CSS" description="Framework CSS utility-first" />
            <TechCard title="Recharts" description="Bibliothèque de graphiques React" />
            <TechCard title="Leaflet" description="Cartographie interactive" />
            <TechCard title="React Router" description="Navigation client-side" />
            <TechCard title="GPX Parser" description="Analyse de fichiers GPS" />
            <TechCard title="Python/Pandas" description="Traitement des données" />
          </div>
        </div>

        {/* Variables et Abréviations */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-utmb-dark-blue mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-utmb-orange" />
            Variables et Abréviations
          </h2>
          
          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-lg font-bold text-utmb-blue mb-3">Catégories d'Âge</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">SE H</div>
                  <div>
                    <p className="font-bold text-slate-800">Senior Homme</p>
                    <p className="text-sm text-slate-600">18-39 ans</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-16 h-16 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">SE F</div>
                  <div>
                    <p className="font-bold text-slate-800">Senior Femme</p>
                    <p className="text-sm text-slate-600">18-39 ans</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">V1 H</div>
                  <div>
                    <p className="font-bold text-slate-800">Vétéran 1 Homme</p>
                    <p className="text-sm text-slate-600">40-49 ans</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-16 h-16 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">V1 F</div>
                  <div>
                    <p className="font-bold text-slate-800">Vétéran 1 Femme</p>
                    <p className="text-sm text-slate-600">40-49 ans</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">V2 H</div>
                  <div>
                    <p className="font-bold text-slate-800">Vétéran 2 Homme</p>
                    <p className="text-sm text-slate-600">50+ ans</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-16 h-16 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">V2 F</div>
                  <div>
                    <p className="font-bold text-slate-800">Vétéran 2 Femme</p>
                    <p className="text-sm text-slate-600">50+ ans</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nationalities */}
            <div>
              <h3 className="text-lg font-bold text-utmb-blue mb-3">Codes Nationalités (ISO 3166-1 alpha-2)</h3>
              <div className="grid md:grid-cols-3 gap-2 text-sm">
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <span className="font-bold text-utmb-blue w-8">FR</span>
                  <span className="text-slate-700">France</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <span className="font-bold text-utmb-blue w-8">IT</span>
                  <span className="text-slate-700">Italie</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <span className="font-bold text-utmb-blue w-8">CH</span>
                  <span className="text-slate-700">Suisse</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <span className="font-bold text-utmb-blue w-8">ES</span>
                  <span className="text-slate-700">Espagne</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <span className="font-bold text-utmb-blue w-8">GB</span>
                  <span className="text-slate-700">Royaume-Uni</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <span className="font-bold text-utmb-blue w-8">US</span>
                  <span className="text-slate-700">États-Unis</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <span className="font-bold text-utmb-blue w-8">DE</span>
                  <span className="text-slate-700">Allemagne</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <span className="font-bold text-utmb-blue w-8">BE</span>
                  <span className="text-slate-700">Belgique</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <span className="font-bold text-utmb-blue w-8">NL</span>
                  <span className="text-slate-700">Pays-Bas</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <span className="font-bold text-utmb-blue w-8">JP</span>
                  <span className="text-slate-700">Japon</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <span className="font-bold text-utmb-blue w-8">CA</span>
                  <span className="text-slate-700">Canada</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <span className="font-bold text-utmb-blue w-8">AU</span>
                  <span className="text-slate-700">Australie</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-3 italic">
                Les codes suivent la norme ISO 3166-1 alpha-2 (codes pays à 2 lettres)
              </p>
            </div>

            {/* Other Variables */}
            <div>
              <h3 className="text-lg font-bold text-utmb-blue mb-3">Autres Variables</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
                  <p className="font-bold text-red-800 mb-1">DNF</p>
                  <p className="text-sm text-red-700">Did Not Finish - Abandon en cours de course</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                  <p className="font-bold text-green-800 mb-1">Finisher</p>
                  <p className="text-sm text-green-700">Coureur ayant terminé la course</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <p className="font-bold text-blue-800 mb-1">D+</p>
                  <p className="text-sm text-blue-700">Dénivelé positif (cumul des montées)</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <p className="font-bold text-purple-800 mb-1">D-</p>
                  <p className="text-sm text-purple-700">Dénivelé négatif (cumul des descentes)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color Legend */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-utmb-dark-blue mb-6 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-utmb-orange" />
            Légende des Couleurs
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <ColorLegendItem color="bg-utmb-blue" label="UTMB Blue" usage="Données principales, participants" />
            <ColorLegendItem color="bg-utmb-orange" label="UTMB Orange" usage="Accents, parcours GPS" />
            <ColorLegendItem color="bg-utmb-green" label="Success Green" usage="Finishers, réussites" />
            <ColorLegendItem color="bg-red-500" label="Alert Red" usage="DNF, abandons, alertes" />
            <ColorLegendItem color="bg-yellow-500" label="Warning Yellow" usage="Avertissements modérés" />
            <ColorLegendItem color="bg-utmb-mountain" label="Mountain Teal" usage="Statistiques de terrain" />
            <ColorLegendItem color="bg-slate-600" label="Neutral Gray" usage="Informations secondaires" />
            <ColorLegendItem color="bg-purple-600" label="Category Purple" usage="Catégories, groupes" />
          </div>
        </div>
      </main>

      <footer className="mt-16 pb-8 bg-gradient-to-r from-utmb-dark-blue to-utmb-mountain text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Mountain className="w-5 h-5 text-utmb-orange" />
            <p className="text-sm">UTMB Analytics • Documentation & Annexes</p>
          </div>
          <p className="text-xs text-blue-200">
            Application développée avec React + TypeScript + Vite
          </p>
        </div>
      </footer>
    </div>
  );
}

interface VisualizationCardProps {
  icon: React.ReactNode;
  title: string;
  color: string;
  description: string;
  usage: string[];
  interpretation: string;
}

function VisualizationCard({ icon, title, color, description, usage, interpretation }: VisualizationCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in hover:shadow-xl transition-shadow">
      <div className={`bg-gradient-to-r ${color} p-4 flex items-center gap-3`}>
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <div className="p-6">
        <p className="text-slate-700 mb-4">{description}</p>
        
        <h4 className="font-bold text-utmb-blue mb-2">Utilisations dans l'Application:</h4>
        <ul className="list-disc list-inside space-y-1 mb-4 text-slate-600">
          {usage.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
        
        <h4 className="font-bold text-utmb-blue mb-2">Comment Interpréter:</h4>
        <p className="text-slate-600">{interpretation}</p>
      </div>
    </div>
  );
}

interface MethodologySectionProps {
  title: string;
  formula: string;
  explanation: string;
}

function MethodologySection({ title, formula, explanation }: MethodologySectionProps) {
  return (
    <div className="border-l-4 border-utmb-orange pl-6">
      <h3 className="text-lg font-bold text-utmb-dark-blue mb-2">{title}</h3>
      <div className="bg-slate-50 rounded-lg p-4 mb-3 font-mono text-sm text-slate-700">
        {formula}
      </div>
      <p className="text-slate-600">{explanation}</p>
    </div>
  );
}

interface DataSourceItemProps {
  title: string;
  description: string;
  format: string;
}

function DataSourceItem({ title, description, format }: DataSourceItemProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
      <div className="w-12 h-12 bg-utmb-blue rounded-lg flex items-center justify-center text-white font-bold text-xs">
        {format}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-utmb-dark-blue mb-1">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}

interface TechCardProps {
  title: string;
  description: string;
}

function TechCard({ title, description }: TechCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-colors">
      <h3 className="font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-blue-200">{description}</p>
    </div>
  );
}

interface ColorLegendItemProps {
  color: string;
  label: string;
  usage: string;
}

function ColorLegendItem({ color, label, usage }: ColorLegendItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
      <div className={`w-12 h-12 ${color} rounded-lg shadow-md`} />
      <div>
        <p className="font-bold text-utmb-dark-blue text-sm">{label}</p>
        <p className="text-xs text-slate-600">{usage}</p>
      </div>
    </div>
  );
}

