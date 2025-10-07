import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { raceData } from '../data/processedData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Users, AlertCircle, Award, Mountain, ArrowLeft, Clock, TrendingUp, Trophy, Medal, Timer, MapPin, Activity } from 'lucide-react';
import logo from '../logo/logo_transparent.png';

interface RaceParticipant {
  bib: string;
  name: string;
  team: string;
  category: string;
  rank: string;
  nationality: string;
  time: string;
  timediff: string;
}

interface RaceDetail {
  year: number;
  participants: RaceParticipant[];
  total: number;
}

export default function RaceDetailPage() {
  const { year } = useParams<{ year: string }>();
  const navigate = useNavigate();
  const [raceDetail, setRaceDetail] = useState<RaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const raceYear = parseInt(year || '2003');
  const raceInfo = raceData.find(d => d.year === raceYear);

  useEffect(() => {
    const loadRaceDetail = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(`/data/races/race_${raceYear}.json`);
        if (!response.ok) throw new Error('Failed to load');
        const data = await response.json();
        setRaceDetail(data);
      } catch (err) {
        console.error('Error loading race details:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadRaceDetail();
  }, [raceYear]);

  const filteredParticipants = useMemo(() => {
    if (!raceDetail) return [];
    
    return raceDetail.participants.filter(p => {
      const matchesSearch = searchTerm === '' || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.team.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [raceDetail, searchTerm, selectedCategory]);

  const podium = raceDetail?.participants.slice(0, 3) || [];

  const categories = useMemo(() => {
    if (!raceDetail) return [];
    const cats = new Set(raceDetail.participants.map(p => p.category).filter(c => c));
    return Array.from(cats).sort();
  }, [raceDetail]);

  const categoryChartData = useMemo(() => {
    if (!raceInfo) return [];
    return Object.entries(raceInfo.categories)
      .filter(([cat]) => cat && cat !== 'null')
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [raceInfo]);

  const nationalityChartData = useMemo(() => {
    if (!raceInfo) return [];
    return Object.entries(raceInfo.top_nationalities)
      .filter(([nat]) => nat && nat !== 'null' && nat.trim())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 12);
  }, [raceInfo]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}min`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-utmb-snow via-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Mountain className="w-16 h-16 text-utmb-blue animate-pulse mx-auto mb-4" />
          <p className="text-xl text-utmb-dark-blue font-semibold">Chargement des données de {raceYear}...</p>
        </div>
      </div>
    );
  }

  if (error || !raceInfo || !raceDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-utmb-snow via-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Mountain className="w-16 h-16 text-utmb-orange mx-auto mb-4" />
          <p className="text-xl text-utmb-dark-blue font-semibold mb-4">Données non disponibles pour {raceYear}</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-2 bg-utmb-blue text-white rounded-lg hover:bg-utmb-dark-blue transition-colors"
          >
            Retour à l'accueil
          </button>
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
            Retour à la vue d'ensemble
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl p-2 flex items-center justify-center border border-white/20">
                <img src={logo} alt="UTMB Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white tracking-tight">UTMB {raceYear}</h1>
                <p className="text-sm text-blue-100 flex items-center gap-2 mt-1">
                  <Mountain className="w-4 h-4" />
                  Analyse Détaillée de la Course
                </p>
              </div>
            </div>
            <div className="hidden md:block bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20">
              <div className="text-white text-center">
                <p className="text-sm text-blue-100">Total Participants</p>
                <p className="text-3xl font-bold">{raceDetail.total}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* PODIUM */}
        {podium.length > 0 && (
          <div className="mb-8 bg-gradient-to-br from-utmb-dark-blue via-utmb-blue to-utmb-light-blue rounded-3xl shadow-2xl p-8 text-white animate-fade-in">
            <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8 text-utmb-orange" />
              Podium {raceYear}
              <Trophy className="w-8 h-8 text-utmb-orange" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {podium[1] && (
                <div className="order-2 md:order-1 transform md:translate-y-8 animate-slide-in-left animation-delay-100">
                  <div className="bg-gradient-to-br from-slate-300 to-slate-400 rounded-2xl p-6 text-slate-800 shadow-xl hover:scale-110 hover:rotate-2 transition-all duration-300">
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center shadow-lg">
                        <Medal className="w-12 h-12 text-slate-600" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold mb-2">2nd</p>
                      <p className="text-xl font-bold mb-1">{podium[1].name}</p>
                      <p className="text-sm opacity-80 mb-1">{podium[1].nationality}</p>
                      <p className="text-lg font-semibold flex items-center justify-center gap-1">
                        <Clock className="w-4 h-4" />
                        {podium[1].time}
                      </p>
                      <p className="text-xs mt-2 bg-slate-200 inline-block px-3 py-1 rounded-full">{podium[1].category}</p>
                    </div>
                  </div>
                </div>
              )}

              {podium[0] && (
                <div className="order-1 md:order-2 animate-scale-in">
                  <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl p-8 text-yellow-900 shadow-2xl transform md:scale-110 hover:scale-125 hover:rotate-3 transition-all duration-300 animate-glow">
                    <div className="flex justify-center mb-4">
                      <div className="w-24 h-24 rounded-full bg-yellow-200 flex items-center justify-center shadow-lg animate-pulse">
                        <Trophy className="w-16 h-16 text-yellow-700" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-5xl font-bold mb-3">1st</p>
                      <p className="text-2xl font-bold mb-2">{podium[0].name}</p>
                      <p className="text-sm opacity-90 mb-2">{podium[0].nationality}</p>
                      <p className="text-xl font-bold flex items-center justify-center gap-2">
                        <Clock className="w-5 h-5" />
                        {podium[0].time}
                      </p>
                      <p className="text-sm mt-3 bg-yellow-200 inline-block px-4 py-1 rounded-full font-semibold">{podium[0].category}</p>
                    </div>
                  </div>
                </div>
              )}

              {podium[2] && (
                <div className="order-3 animate-slide-in-right animation-delay-200">
                  <div className="bg-gradient-to-br from-orange-300 to-orange-500 rounded-2xl p-6 text-orange-900 shadow-xl hover:scale-110 hover:-rotate-2 transition-all duration-300 transform md:translate-y-12">
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 rounded-full bg-orange-200 flex items-center justify-center shadow-lg">
                        <Medal className="w-12 h-12 text-orange-700" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold mb-2">3rd</p>
                      <p className="text-xl font-bold mb-1">{podium[2].name}</p>
                      <p className="text-sm opacity-90 mb-1">{podium[2].nationality}</p>
                      <p className="text-lg font-semibold flex items-center justify-center gap-1">
                        <Clock className="w-4 h-4" />
                        {podium[2].time}
                      </p>
                      <p className="text-xs mt-2 bg-orange-200 inline-block px-3 py-1 rounded-full">{podium[2].category}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Participants"
            value={raceInfo.total_participants.toLocaleString()}
            gradient="from-utmb-blue to-utmb-light-blue"
          />
          <StatCard
            icon={<Award className="w-6 h-6" />}
            title="Finishers"
            value={raceInfo.finishers.toLocaleString()}
            gradient="from-utmb-green to-emerald-500"
          />
          <StatCard
            icon={<AlertCircle className="w-6 h-6" />}
            title="Taux DNF"
            value={`${raceInfo.dnf_rate.toFixed(1)}%`}
            gradient="from-utmb-orange to-utmb-dark-orange"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Temps Moyen"
            value={formatTime(raceInfo.avg_time_minutes)}
            gradient="from-utmb-mountain to-cyan-600"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartCard title={`Distribution des Catégories ${raceYear}`} icon={<Users className="w-5 h-5" />}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={categoryChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '2px solid #0066CC', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="#2C5F7C" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title={`Nationalités Représentées ${raceYear}`} icon={<Award className="w-5 h-5" />}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={nationalityChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '2px solid #FF6B35', borderRadius: '12px' }}
                />
                <Bar dataKey="value" fill="#FF6B35" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Advanced Analytics */}
        <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-lg border-2 border-indigo-200 p-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-utmb-dark-blue mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-600" />
            Analyses Avancées de Performance
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Time Distribution Histogram */}
            <ChartCard title="Distribution des Temps de Course" icon={<Timer className="w-5 h-5" />}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={(() => {
                  if (!raceDetail) return [];
                  // Create time buckets (in hours)
                  const buckets: Record<number, number> = {};
                  raceDetail.participants.forEach(p => {
                    if (p.time && p.time !== '') {
                      const parts = p.time.split(':');
                      const hours = parseInt(parts[0]);
                      const bucket = Math.floor(hours / 2) * 2; // 2-hour buckets
                      buckets[bucket] = (buckets[bucket] || 0) + 1;
                    }
                  });
                  return Object.entries(buckets)
                    .map(([hour, count]) => ({ 
                      range: `${hour}-${parseInt(hour) + 2}h`, 
                      count 
                    }))
                    .sort((a, b) => parseInt(a.range) - parseInt(b.range));
                })()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="range" stroke="#64748b" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#64748b" label={{ value: 'Nombre de coureurs', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: '2px solid #6366f1', borderRadius: '12px' }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {(() => {
                      const data = (() => {
                        if (!raceDetail) return [];
                        const buckets: Record<number, number> = {};
                        raceDetail.participants.forEach(p => {
                          if (p.time && p.time !== '') {
                            const parts = p.time.split(':');
                            const hours = parseInt(parts[0]);
                            const bucket = Math.floor(hours / 2) * 2;
                            buckets[bucket] = (buckets[bucket] || 0) + 1;
                          }
                        });
                        return Object.entries(buckets)
                          .map(([hour, count]) => ({ range: `${hour}-${parseInt(hour) + 2}h`, count }))
                          .sort((a, b) => parseInt(a.range) - parseInt(b.range));
                      })();
                      return data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${220 + index * 20}, 70%, 60%)`} />
                      ));
                    })()}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-slate-600 text-center mt-3">
                Répartition des coureurs par tranches de 2 heures
              </p>
            </ChartCard>

            {/* Performance by Nationality - Top 10 */}
            <ChartCard title="Top 10 Nationalités - Nombre de Finishers" icon={<TrendingUp className="w-5 h-5" />}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={(() => {
                    if (!raceDetail) return [];
                    const natCount: Record<string, number> = {};
                    raceDetail.participants.forEach(p => {
                      if (p.nationality && p.time && p.time !== '') {
                        natCount[p.nationality] = (natCount[p.nationality] || 0) + 1;
                      }
                    });
                    return Object.entries(natCount)
                      .map(([nat, count]) => ({ nationality: nat, finishers: count }))
                      .sort((a, b) => b.finishers - a.finishers)
                      .slice(0, 10);
                  })()}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis dataKey="nationality" type="category" stroke="#64748b" width={50} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: '2px solid #8b5cf6', borderRadius: '12px' }}
                    formatter={(value: number) => [`${value} finishers`, 'Total']}
                  />
                  <Bar dataKey="finishers" radius={[0, 8, 8, 0]}>
                    {(() => {
                      if (!raceDetail) return [];
                      const natCount: Record<string, number> = {};
                      raceDetail.participants.forEach(p => {
                        if (p.nationality && p.time && p.time !== '') {
                          natCount[p.nationality] = (natCount[p.nationality] || 0) + 1;
                        }
                      });
                      const data = Object.entries(natCount)
                        .map(([nat, count]) => ({ nationality: nat, finishers: count }))
                        .sort((a, b) => b.finishers - a.finishers)
                        .slice(0, 10);
                      
                      return data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${250 - index * 15}, 70%, 55%)`} />
                      ));
                    })()}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-slate-600 text-center mt-3">
                Classement des 10 pays avec le plus de finishers
              </p>
            </ChartCard>

            {/* Finishing Rate Trend */}
            <ChartCard title="Taux de Réussite (Top 200)" icon={<Award className="w-5 h-5" />}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={(() => {
                  if (!raceDetail) return [];
                  const top200 = raceDetail.participants.slice(0, 200);
                  const step = 20;
                  const result = [];
                  for (let i = 0; i < top200.length; i += step) {
                    const segment = top200.slice(i, i + step);
                    const finishers = segment.filter(p => p.time && p.time !== '').length;
                    result.push({
                      position: `${i + 1}-${Math.min(i + step, top200.length)}`,
                      rate: (finishers / segment.length) * 100,
                    });
                  }
                  return result;
                })()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="position" stroke="#64748b" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#64748b" domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: '2px solid #10b981', borderRadius: '12px' }}
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Taux de Réussite"
                    dot={{ fill: '#10b981', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-slate-600 text-center mt-3">
                Pourcentage de finishers par tranche de 20 positions
              </p>
            </ChartCard>

            {/* Category Performance Comparison */}
            <ChartCard title="Temps Moyen par Catégorie" icon={<Users className="w-5 h-5" />}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={(() => {
                  if (!raceDetail) return [];
                  const categoryTimes: Record<string, { total: number; count: number }> = {};
                  raceDetail.participants.forEach(p => {
                    if (p.time && p.time !== '' && p.category) {
                      const parts = p.time.split(':');
                      const minutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);
                      if (!categoryTimes[p.category]) {
                        categoryTimes[p.category] = { total: 0, count: 0 };
                      }
                      categoryTimes[p.category].total += minutes;
                      categoryTimes[p.category].count += 1;
                    }
                  });
                  return Object.entries(categoryTimes)
                    .map(([cat, data]) => ({
                      category: cat,
                      avgTime: data.total / data.count / 60, // Convert to hours
                    }))
                    .sort((a, b) => a.avgTime - b.avgTime);
                })()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" stroke="#64748b" />
                  <YAxis stroke="#64748b" label={{ value: 'Temps Moyen (h)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: '2px solid #0066CC', borderRadius: '12px' }}
                    formatter={(value: number) => `${value.toFixed(1)}h`}
                  />
                  <Bar dataKey="avgTime" radius={[8, 8, 0, 0]}>
                    {(() => {
                      if (!raceDetail) return [];
                      const categoryTimes: Record<string, { total: number; count: number }> = {};
                      raceDetail.participants.forEach(p => {
                        if (p.time && p.time !== '' && p.category) {
                          const parts = p.time.split(':');
                          const minutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);
                          if (!categoryTimes[p.category]) {
                            categoryTimes[p.category] = { total: 0, count: 0 };
                          }
                          categoryTimes[p.category].total += minutes;
                          categoryTimes[p.category].count += 1;
                        }
                      });
                      const data = Object.entries(categoryTimes)
                        .map(([cat, data]) => ({ category: cat, avgTime: data.total / data.count / 60 }))
                        .sort((a, b) => a.avgTime - b.avgTime);
                      
                      return data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${200 - index * 15}, 70%, 50%)`} />
                      ));
                    })()}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Participants Table */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-slide-up">
          <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-utmb-dark-blue to-utmb-blue">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6" />
              Classement Complet - {raceDetail.total} Participants
            </h2>
          </div>
          
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Rechercher par nom, nationalité ou équipe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-utmb-blue focus:outline-none transition-colors"
                />
              </div>
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full md:w-auto px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-utmb-blue focus:outline-none transition-colors bg-white font-medium"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3 text-sm text-slate-600">
              {filteredParticipants.length} résultat(s) affiché(s)
            </div>
          </div>

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-slate-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-utmb-dark-blue uppercase tracking-wider">Rang</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-utmb-dark-blue uppercase tracking-wider">Dossard</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-utmb-dark-blue uppercase tracking-wider">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-utmb-dark-blue uppercase tracking-wider">Équipe</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-utmb-dark-blue uppercase tracking-wider">Catégorie</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-utmb-dark-blue uppercase tracking-wider">Nat.</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-utmb-dark-blue uppercase tracking-wider">Temps</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-utmb-dark-blue uppercase tracking-wider">Écart</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredParticipants.map((participant, idx) => {
                  const rankNum = parseInt(participant.rank);
                  const isPodium = rankNum <= 3;
                  return (
                    <tr 
                      key={idx} 
                      className={`hover:bg-blue-50/50 transition-colors ${
                        isPodium ? 'bg-yellow-50/30' : ''
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                          rankNum === 1 ? 'bg-yellow-500 text-yellow-900' :
                          rankNum === 2 ? 'bg-slate-400 text-slate-900' :
                          rankNum === 3 ? 'bg-orange-400 text-orange-900' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {participant.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-600">
                        #{participant.bib}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-bold text-utmb-dark-blue">{participant.name}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 max-w-xs truncate">
                        {participant.team || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-utmb-blue/10 text-utmb-blue border border-utmb-blue/20">
                          {participant.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                          {participant.nationality}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-utmb-dark-blue flex items-center gap-1">
                        <Clock className="w-4 h-4 text-utmb-orange" />
                        {participant.time}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                        {participant.timediff || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h3 className="text-2xl font-bold text-utmb-dark-blue mb-4 flex items-center gap-2">
            <Mountain className="w-6 h-6 text-utmb-orange" />
            Résumé UTMB {raceYear}
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-slate-700">
            <div>
              <p className="mb-2"><span className="font-semibold text-utmb-blue">Participation:</span> {raceInfo.total_participants} coureurs inscrits</p>
              <p className="mb-2"><span className="font-semibold text-utmb-green">Finishers:</span> {raceInfo.finishers} arrivants ({((raceInfo.finishers / raceInfo.total_participants) * 100).toFixed(1)}%)</p>
              <p className="mb-2"><span className="font-semibold text-utmb-orange">Abandons:</span> {raceInfo.dnf_count} DNF ({raceInfo.dnf_rate.toFixed(1)}%)</p>
            </div>
            <div>
              <p className="mb-2"><span className="font-semibold text-utmb-mountain">Temps moyen:</span> {formatTime(raceInfo.avg_time_minutes)}</p>
              <p className="mb-2"><span className="font-semibold text-utmb-blue">Catégories:</span> {Object.keys(raceInfo.categories).filter(c => c && c !== 'null').length} représentées</p>
              <p className="mb-2"><span className="font-semibold text-utmb-orange">Nationalités:</span> {Object.keys(raceInfo.top_nationalities).filter(n => n && n !== 'null').length} pays</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 pb-8 bg-gradient-to-r from-utmb-dark-blue to-utmb-mountain text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Mountain className="w-5 h-5 text-utmb-orange" />
            <p className="text-sm">UTMB {raceYear} • Ultra-Trail du Mont-Blanc</p>
          </div>
          <p className="text-xs text-blue-200">
            Données officielles de course
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
}

function StatCard({ icon, title, value, gradient }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up group">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white shadow-md group-hover:animate-rotate-in transition-all duration-300`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 group-hover:text-utmb-blue transition-colors">{title}</p>
          <p className="text-3xl font-bold text-utmb-dark-blue mt-1 group-hover:scale-110 transition-transform duration-300">{value}</p>
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
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-2xl hover:border-utmb-blue transition-all duration-300 group">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-utmb-orange group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">{icon}</div>
        <h3 className="text-lg font-bold text-utmb-dark-blue group-hover:text-utmb-blue transition-colors">{title}</h3>
      </div>
      {children}
    </div>
  );
}

