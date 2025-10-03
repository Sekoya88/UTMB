import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { raceData, getTotalParticipants } from '../data/processedData';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, AlertCircle, Award, Mountain, ChevronRight, Calendar } from 'lucide-react';
import logo from '../logo/logo_transparent.png';
import { useState, useEffect, useRef } from 'react';
import '../components/RangeSlider.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedYears, setSelectedYears] = useState<[number, number]>([2003, 2017]);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const rangeBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rangeBarRef.current) {
      const leftPercent = ((selectedYears[0] - 2003) / 14) * 100;
      const rightPercent = 100 - ((selectedYears[1] - 2003) / 14) * 100;
      rangeBarRef.current.style.left = `${leftPercent}%`;
      rangeBarRef.current.style.right = `${rightPercent}%`;
    }
  }, [selectedYears]);

  const filteredData = useMemo(() => {
    return raceData.filter(d => 
      d.year >= selectedYears[0] && 
      d.year <= selectedYears[1]
    );
  }, [selectedYears]);

  const stats = useMemo(() => {
    const totalParticipants = filteredData.reduce((sum, d) => sum + d.total_participants, 0);
    const totalFinishers = filteredData.reduce((sum, d) => sum + d.finishers, 0);
    const avgDNFRate = totalParticipants > 0 ? ((totalParticipants - totalFinishers) / totalParticipants * 100) : 0;
    const avgTime = filteredData.reduce((sum, d) => sum + d.avg_time_minutes, 0) / filteredData.length;
    
    return {
      totalParticipants,
      totalFinishers,
      avgDNFRate: avgDNFRate.toFixed(1),
      avgTime: (avgTime / 60).toFixed(1)
    };
  }, [filteredData]);

  const categoryData = useMemo(() => {
    const combined: Record<string, number> = {};
    filteredData.forEach(year => {
      Object.entries(year.categories).forEach(([cat, count]) => {
        if (cat && cat !== 'null') {
          combined[cat] = (combined[cat] || 0) + count;
        }
      });
    });
    return Object.entries(combined)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filteredData]);

  const nationalityData = useMemo(() => {
    const combined: Record<string, number> = {};
    filteredData.forEach(year => {
      Object.entries(year.top_nationalities).forEach(([nat, count]) => {
        if (nat && nat !== 'null' && nat.trim()) {
          combined[nat] = (combined[nat] || 0) + count;
        }
      });
    });
    return Object.entries(combined)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [filteredData]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value);
    if (newMin <= selectedYears[1]) {
      setSelectedYears([newMin, selectedYears[1]]);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value);
    if (newMax >= selectedYears[0]) {
      setSelectedYears([selectedYears[0], newMax]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-utmb-snow via-slate-50 to-blue-50">
      <header className="bg-mountain-gradient shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0wIDQwTDQwIDBNNDAgNDBMMCA0MCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNwYXR0ZXJuKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl p-2 flex items-center justify-center border border-white/20 animate-scale-in">
                <img src={logo} alt="UTMB Logo" className="w-full h-full object-contain" />
              </div>
              <div className="animate-slide-down">
                <h1 className="text-4xl font-bold text-white tracking-tight">UTMB Analytics</h1>
                <p className="text-sm text-blue-100 flex items-center gap-2 mt-1">
                  <Mountain className="w-4 h-4" />
                  Ultra-Trail du Mont-Blanc (2003-2017)
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Award className="w-5 h-5 text-utmb-orange" />
              <span className="text-white font-semibold">{getTotalParticipants().toLocaleString()}</span>
              <span className="text-blue-100 text-sm">coureurs</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8 animate-fade-in">
          <h2 className="text-lg font-semibold text-utmb-dark-blue mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-utmb-orange" />
            Filtres de Période
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Année:</span>
              <span className="text-2xl font-bold text-utmb-blue">
                {selectedYears[0]} - {selectedYears[1]}
              </span>
            </div>
            
            <div className="relative pt-8 pb-2">
              <div className="relative h-2 bg-slate-200 rounded-full">
                <div 
                  ref={rangeBarRef}
                  className="absolute h-full bg-gradient-to-r from-utmb-blue to-utmb-orange rounded-full transition-all duration-300"
                  style={{ zIndex: 1 }}
                />
              </div>
              
              <div className="absolute top-1 left-0 w-full" style={{ height: '24px' }}>
                <input
                  type="range"
                  min="2003"
                  max="2017"
                  value={selectedYears[0]}
                  onChange={handleMinChange}
                  className="range-slider range-slider-min absolute w-full"
                  style={{ zIndex: selectedYears[0] > selectedYears[1] - 2 ? 5 : 3 }}
                />
                
                <input
                  type="range"
                  min="2003"
                  max="2017"
                  value={selectedYears[1]}
                  onChange={handleMaxChange}
                  className="range-slider range-slider-max absolute w-full"
                  style={{ zIndex: 4 }}
                />
              </div>
              
              <div className="flex justify-between mt-4 text-xs text-slate-500">
                <span className="font-medium">2003</span>
                <span>2007</span>
                <span>2010</span>
                <span>2013</span>
                <span className="font-medium">2017</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Total Participants"
            value={stats.totalParticipants.toLocaleString()}
            gradient="from-utmb-blue to-utmb-light-blue"
            delay="0.1s"
          />
          <StatCard
            icon={<Award className="w-6 h-6" />}
            title="Finishers"
            value={stats.totalFinishers.toLocaleString()}
            gradient="from-utmb-green to-emerald-500"
            delay="0.2s"
          />
          <StatCard
            icon={<AlertCircle className="w-6 h-6" />}
            title="Taux DNF Moyen"
            value={`${stats.avgDNFRate}%`}
            gradient="from-utmb-orange to-utmb-dark-orange"
            delay="0.3s"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Temps Moyen"
            value={`${stats.avgTime}h`}
            gradient="from-utmb-mountain to-cyan-600"
            delay="0.4s"
          />
        </div>

        {/* Race Selection Grid */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-6 animate-slide-up">
          <h2 className="text-xl font-bold text-utmb-dark-blue mb-4 flex items-center gap-2">
            <Mountain className="w-6 h-6 text-utmb-orange" />
            Sélectionner une Course pour Plus de Détails
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {raceData.map((race) => (
              <button
                key={race.year}
                onClick={() => navigate(`/race/${race.year}`)}
                onMouseEnter={() => setHoveredYear(race.year)}
                onMouseLeave={() => setHoveredYear(null)}
                className={`group relative p-4 rounded-xl border-2 transition-all duration-300 ${
                  hoveredYear === race.year
                    ? 'border-utmb-orange bg-gradient-to-br from-utmb-orange/10 to-utmb-blue/10 scale-105 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-utmb-blue hover:shadow-md'
                }`}
              >
                <div className="text-center">
                  <div className={`text-2xl font-bold transition-colors ${
                    hoveredYear === race.year ? 'text-utmb-orange' : 'text-utmb-dark-blue'
                  }`}>
                    {race.year}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {race.total_participants} coureurs
                  </div>
                  <div className={`mt-2 inline-flex items-center text-xs font-medium transition-all ${
                    hoveredYear === race.year ? 'text-utmb-orange opacity-100' : 'text-slate-400 opacity-0'
                  }`}>
                    Voir détails
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
                <div 
                  className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-lg transition-all ${
                    race.dnf_rate > 50 ? 'bg-red-500' :
                    race.dnf_rate > 30 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard title="Évolution de la Participation" icon={<TrendingUp className="w-5 h-5" />}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '2px solid #0066CC', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="total_participants" stroke="#0066CC" strokeWidth={3} name="Participants" dot={{ fill: '#0066CC', r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="finishers" stroke="#4CAF50" strokeWidth={3} name="Finishers" dot={{ fill: '#4CAF50', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Évolution du Taux d'Abandon (DNF)" icon={<AlertCircle className="w-5 h-5" />}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="colorDNF" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF6B35" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '2px solid #FF6B35', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Area type="monotone" dataKey="dnf_rate" stroke="#FF6B35" strokeWidth={3} fill="url(#colorDNF)" name="Taux DNF %" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top Catégories" icon={<Users className="w-5 h-5" />}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '2px solid #2C5F7C', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" fill="#2C5F7C" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top Nationalités" icon={<Award className="w-5 h-5" />}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={nationalityData}>
                <defs>
                  <linearGradient id="colorNat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066CC" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#4A90E2" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '2px solid #0066CC', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" fill="url(#colorNat)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Data Table */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
          <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-utmb-dark-blue to-utmb-blue">
            <h2 className="text-lg font-semibold text-white">Statistiques Année par Année</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-utmb-dark-blue uppercase tracking-wider">Année</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-utmb-dark-blue uppercase tracking-wider">Participants</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-utmb-dark-blue uppercase tracking-wider">Finishers</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-utmb-dark-blue uppercase tracking-wider">Taux DNF</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-utmb-dark-blue uppercase tracking-wider">Temps Moyen</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-utmb-dark-blue uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredData.map((row) => (
                  <tr key={row.year} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-utmb-blue">{row.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{row.total_participants.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{row.finishers.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        row.dnf_rate > 50 ? 'bg-red-100 text-red-800 border border-red-200' : 
                        row.dnf_rate > 30 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
                        'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {row.dnf_rate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                      {formatTime(row.avg_time_minutes)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => navigate(`/race/${row.year}`)}
                        className="inline-flex items-center gap-1 text-utmb-blue hover:text-utmb-orange font-medium transition-colors group-hover:underline"
                      >
                        Détails
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="mt-16 pb-8 bg-gradient-to-r from-utmb-dark-blue to-utmb-mountain text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Mountain className="w-5 h-5 text-utmb-orange" />
            <p className="text-sm">Données UTMB 2003-2017 • Construit avec React + TypeScript + Vite</p>
          </div>
          <p className="text-xs text-blue-200">
            {getTotalParticipants().toLocaleString()} participants traités sur 15 années de course
          </p>
        </div>
      </footer>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  gradient: string;
  delay?: string;
}

function StatCard({ icon, title, value, gradient, delay = '0s' }: StatCardProps) {
  const animationStyle = { animationDelay: delay };
  
  return (
    <div 
      className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
      style={animationStyle}
    >
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white shadow-md`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-utmb-dark-blue mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}

interface ChartCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function ChartCard({ title, icon, children }: ChartCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-300 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-utmb-orange">{icon}</div>
        <h3 className="text-lg font-bold text-utmb-dark-blue">{title}</h3>
      </div>
      {children}
    </div>
  );
}

