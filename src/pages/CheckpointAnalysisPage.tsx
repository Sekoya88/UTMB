import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Mountain, ArrowLeft, MapPin, TrendingUp, Timer, Award } from 'lucide-react';
import logo from '../logo/logo_transparent.png';

interface CheckpointData {
  year: number;
  checkpoint: string;
  avgTime: number; // in minutes from start
  finishers: number;
}

export default function CheckpointAnalysisPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [checkpointData, setCheckpointData] = useState<CheckpointData[]>([]);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<string>('');
  const [availableCheckpoints, setAvailableCheckpoints] = useState<string[]>([]);

  useEffect(() => {
    const loadCheckpointData = async () => {
      try {
        setLoading(true);
        
        // Load data from 2007 as example (would need all years in production)
        const response = await fetch('/data/races/race_2007.json');
        const data = await response.json();
        
        // Extract checkpoint columns from the first participant
        // In a real implementation, you'd parse all CSV files
        const mockCheckpoints = [
          'La Charme',
          'Saint-Gervais',
          'Les Contamines',
          'La Balme',
          'Refuge Croix du Bonhomme',
          'Les Chapieux CCAS',
          'Col de la Seigne',
          'Refuge Elisabetta',
          'Courmayeur - Dolonne',
          'Refuge Bertone',
          'Refuge Bonatti',
          'Arnuva',
          'Grand Col Ferret',
          'La Fouly',
          'Champex Lac',
          'Bovine',
          'Trient',
          'Catogne',
          'Vallorcine',
          'Argentière',
        ];
        
        setAvailableCheckpoints(mockCheckpoints);
        setSelectedCheckpoint(mockCheckpoints[0]);
        
        // Mock data for demonstration
        // In production, this would parse actual CSV data
        const mockData: CheckpointData[] = [];
        for (let year = 2003; year <= 2017; year++) {
          mockCheckpoints.forEach((cp, idx) => {
            mockData.push({
              year,
              checkpoint: cp,
              avgTime: (idx + 1) * 60 + Math.random() * 30, // Mock average time
              finishers: 200 + Math.floor(Math.random() * 100),
            });
          });
        }
        
        setCheckpointData(mockData);
      } catch (error) {
        console.error('Error loading checkpoint data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCheckpointData();
  }, []);

  const filteredData = checkpointData.filter(d => d.checkpoint === selectedCheckpoint);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-utmb-snow via-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Mountain className="w-16 h-16 text-utmb-blue animate-pulse mx-auto mb-4" />
          <p className="text-xl text-utmb-dark-blue font-semibold">Chargement des données des points de passage...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-4xl font-bold text-white tracking-tight">Analyse des Points de Passage</h1>
              <p className="text-sm text-blue-100 flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4" />
                Évolution des temps par checkpoint (2003-2017)
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Checkpoint Selector */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8 animate-fade-in">
          <h2 className="text-lg font-semibold text-utmb-dark-blue mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-utmb-orange" />
            Sélectionner un Point de Passage
          </h2>
          <select
            value={selectedCheckpoint}
            onChange={(e) => setSelectedCheckpoint(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-utmb-blue focus:outline-none transition-colors bg-white font-medium text-lg"
          >
            {availableCheckpoints.map(cp => (
              <option key={cp} value={cp}>{cp}</option>
            ))}
          </select>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-utmb-blue to-utmb-light-blue rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Timer className="w-8 h-8" />
              <h3 className="text-lg font-bold">Temps Moyen 2017</h3>
            </div>
            <p className="text-3xl font-bold">
              {filteredData.length > 0 
                ? `${(filteredData[filteredData.length - 1].avgTime / 60).toFixed(1)}h`
                : 'N/A'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-utmb-green to-emerald-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-8 h-8" />
              <h3 className="text-lg font-bold">Finishers Moyens</h3>
            </div>
            <p className="text-3xl font-bold">
              {filteredData.length > 0
                ? Math.round(filteredData.reduce((sum, d) => sum + d.finishers, 0) / filteredData.length)
                : 'N/A'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-utmb-orange to-utmb-dark-orange rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8" />
              <h3 className="text-lg font-bold">Évolution</h3>
            </div>
            <p className="text-3xl font-bold">
              {filteredData.length >= 2
                ? `${((filteredData[filteredData.length - 1].avgTime - filteredData[0].avgTime) / 60).toFixed(1)}h`
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          {/* Average Time Evolution */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-utmb-dark-blue mb-4 flex items-center gap-2">
              <Timer className="w-6 h-6 text-utmb-orange" />
              Évolution du Temps Moyen - {selectedCheckpoint}
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066CC" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0066CC" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" />
                <YAxis 
                  stroke="#64748b"
                  tickFormatter={(value) => `${(value / 60).toFixed(0)}h`}
                  label={{ value: 'Temps (heures)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '2px solid #0066CC', borderRadius: '12px' }}
                  formatter={(value: number) => `${(value / 60).toFixed(1)} heures`}
                  labelFormatter={(label) => `Année ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="avgTime" 
                  stroke="#0066CC" 
                  strokeWidth={3}
                  fill="url(#colorTime)"
                  name="Temps Moyen"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Finishers at Checkpoint */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-utmb-dark-blue mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-utmb-orange" />
              Nombre de Coureurs au Point - {selectedCheckpoint}
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '2px solid #4CAF50', borderRadius: '12px' }}
                />
                <Bar 
                  dataKey="finishers" 
                  fill="#4CAF50" 
                  name="Coureurs"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg border-2 border-blue-200 p-8 animate-fade-in">
          <h3 className="text-2xl font-bold text-utmb-dark-blue mb-4 flex items-center gap-2">
            <Mountain className="w-6 h-6 text-utmb-orange" />
            Note sur les Données
          </h3>
          <p className="text-slate-700 leading-relaxed mb-4">
            Cette page présente une analyse temporelle des points de passage de l'UTMB. Les données montrent l'évolution 
            des temps moyens et du nombre de coureurs à chaque checkpoint au fil des années (2003-2017).
          </p>
          <p className="text-slate-700 leading-relaxed">
            <strong className="text-utmb-blue">Note:</strong> Les données affichées sont des valeurs d'exemple pour 
            démonstration. Dans une implémentation complète, les temps réels seraient extraits des fichiers CSV 
            historiques pour chaque année et chaque point de passage.
          </p>
        </div>
      </main>

      <footer className="mt-16 pb-8 bg-gradient-to-r from-utmb-dark-blue to-utmb-mountain text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Mountain className="w-5 h-5 text-utmb-orange" />
            <p className="text-sm">Analyse des Points de Passage UTMB • 2003-2017</p>
          </div>
          <p className="text-xs text-blue-200">
            Données historiques des temps de passage
          </p>
        </div>
      </footer>
    </div>
  );
}

