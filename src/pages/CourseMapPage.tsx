import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { parseGPXFile, extractCheckpoints, ParsedGPXData } from '../utils/gpxParser';
import { Mountain, ArrowLeft, MapPin, TrendingUp, Navigation, Gauge, Info } from 'lucide-react';
import logo from '../logo/logo_transparent.png';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const checkpointIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const finishIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Checkpoint {
  name: string;
  lat: number;
  lon: number;
  type: 'start' | 'end' | 'checkpoint';
  distance?: number;
  elevation?: number;
}

function MapBounds({ bounds }: { bounds: any }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds([
        [bounds.minLat, bounds.minLon],
        [bounds.maxLat, bounds.maxLon]
      ], { padding: [50, 50] });
    }
  }, [bounds, map]);
  
  return null;
}

export default function CourseMapPage() {
  const navigate = useNavigate();
  const [gpxData, setGpxData] = useState<ParsedGPXData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<number | null>(null);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [elevationProfile, setElevationProfile] = useState<Array<{ distance: number; elevation: number }>>([]);

  useEffect(() => {
    const loadGPXData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await parseGPXFile('/data/utmb_2025.gpx');
        setGpxData(data);
        
        const cps = extractCheckpoints(data.waypoints);

        // Build a flat array of track points with cumulative distance in km
        const trackPoints: Array<{ lat: number; lon: number; km: number }> = [];
        data.tracks.forEach(t => t.segments.forEach(s => s.points.forEach(p => {
          const km = (p.cumulativeDistanceM ?? 0) / 1000;
          trackPoints.push({ lat: p.lat, lon: p.lon, km });
        })));

        // Helper: distance between two lat/lon in meters
        const distanceM = (aLat: number, aLon: number, bLat: number, bLon: number) => {
          const R = 6371e3;
          const φ1 = (aLat * Math.PI) / 180;
          const φ2 = (bLat * Math.PI) / 180;
          const Δφ = ((bLat - aLat) * Math.PI) / 180;
          const Δλ = ((bLon - aLon) * Math.PI) / 180;
          const aa = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
          const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
          return R * c;
        };

        // For each checkpoint, find nearest track point to assign accurate distance along the course
        const checkpointsWithDistance: Checkpoint[] = cps.map(cp => {
          let best = { km: 0, d: Number.POSITIVE_INFINITY };
          // Sample track points every N to reduce cost, then refine around best window
          const step = Math.max(1, Math.floor(trackPoints.length / 5000));
          for (let i = 0; i < trackPoints.length; i += step) {
            const tp = trackPoints[i];
            const d = distanceM(cp.lat, cp.lon, tp.lat, tp.lon);
            if (d < best.d) best = { km: tp.km, d };
          }
          return { ...cp, distance: best.km };
        });

        setCheckpoints(checkpointsWithDistance);
        
        // Generate elevation profile
        const profile: Array<{ distance: number; elevation: number }> = [];
        let dist = 0;
        
        if (data.tracks.length > 0) {
          data.tracks[0].segments.forEach(segment => {
            segment.points.forEach((point, idx) => {
              if (idx > 0) {
                const p1 = segment.points[idx - 1];
                const R = 6371e3;
                const φ1 = (p1.lat * Math.PI) / 180;
                const φ2 = (point.lat * Math.PI) / 180;
                const Δφ = ((point.lat - p1.lat) * Math.PI) / 180;
                const Δλ = ((point.lon - p1.lon) * Math.PI) / 180;

                const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                          Math.cos(φ1) * Math.cos(φ2) *
                          Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                
                dist += (R * c) / 1000;
              }
              
              if (point.ele !== undefined) {
                profile.push({
                  distance: parseFloat(dist.toFixed(1)),
                  elevation: Math.round(point.ele),
                });
              }
            });
          });
        }
        
        // Reduce profile size for performance (sample every nth point)
        const sampledProfile = profile.filter((_, idx) => idx % 50 === 0);
        setElevationProfile(sampledProfile);
        
      } catch (err) {
        console.error('Error loading GPX data:', err);
        setError('Impossible de charger les données GPX');
      } finally {
        setLoading(false);
      }
    };

    loadGPXData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-utmb-snow via-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Mountain className="w-16 h-16 text-utmb-blue animate-pulse mx-auto mb-4" />
          <p className="text-xl text-utmb-dark-blue font-semibold">Chargement du parcours UTMB...</p>
        </div>
      </div>
    );
  }

  if (error || !gpxData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-utmb-snow via-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Mountain className="w-16 h-16 text-utmb-orange mx-auto mb-4" />
          <p className="text-xl text-utmb-dark-blue font-semibold mb-4">{error || 'Erreur de chargement'}</p>
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

  const routePositions = gpxData.tracks[0]?.segments[0]?.points.map(p => [p.lat, p.lon] as [number, number]) || [];
  const center: [number, number] = [
    (gpxData.bounds.minLat + gpxData.bounds.maxLat) / 2,
    (gpxData.bounds.minLon + gpxData.bounds.maxLon) / 2
  ];

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl p-2 flex items-center justify-center border border-white/20">
                <img src={logo} alt="UTMB Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">Parcours UTMB</h1>
                <p className="text-sm text-blue-100 flex items-center gap-2 mt-1">
                  <Navigation className="w-4 h-4" />
                  Trace GPS Interactive • 171 km • 10,000 m D+
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Instructions Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg border-2 border-blue-200 p-6 mb-8 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-utmb-blue rounded-xl flex items-center justify-center text-white flex-shrink-0 animate-pulse">
              <Info className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-utmb-dark-blue mb-2">Comment utiliser la carte interactive ?</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-utmb-orange font-bold mt-0.5">🗺️</span>
                  <span><strong>Naviguer :</strong> Glissez la carte avec votre souris ou utilisez le zoom (+/-)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">🟢</span>
                  <span><strong>Départ :</strong> Marqueur vert = Chamonix (point de départ)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-utmb-blue font-bold mt-0.5">🔵</span>
                  <span><strong>Checkpoints :</strong> Marqueurs bleus = Points de passage (refuges, cols)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold mt-0.5">🔴</span>
                  <span><strong>Arrivée :</strong> Marqueur rouge = Chamonix (retour)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-utmb-orange font-bold mt-0.5">📍</span>
                  <span><strong>Cliquez sur un marqueur</strong> pour voir les détails du checkpoint</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Navigation className="w-6 h-6" />}
            title="Distance Totale"
            value={`${gpxData.totalDistance.toFixed(1)} km`}
            gradient="from-utmb-blue to-utmb-light-blue"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Dénivelé Positif"
            value={`${Math.round(gpxData.totalElevationGain)} m`}
            gradient="from-utmb-green to-emerald-500"
          />
          <StatCard
            icon={<Mountain className="w-6 h-6" />}
            title="Dénivelé Négatif"
            value={`${Math.round(gpxData.totalElevationLoss)} m`}
            gradient="from-utmb-orange to-utmb-dark-orange"
          />
          <StatCard
            icon={<MapPin className="w-6 h-6" />}
            title="Points de Passage"
            value={`${checkpoints.length}`}
            gradient="from-utmb-mountain to-cyan-600"
          />
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-utmb-dark-blue flex items-center gap-2">
              <MapPin className="w-6 h-6 text-utmb-orange" />
              Carte Interactive du Parcours
            </h2>
            <div className="hidden md:flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow"></div>
                <span className="text-slate-600">Départ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-utmb-blue rounded-full border-2 border-white shadow"></div>
                <span className="text-slate-600">Checkpoints</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow"></div>
                <span className="text-slate-600">Arrivée</span>
              </div>
            </div>
          </div>
          <div className="h-[600px] rounded-xl overflow-hidden border-4 border-slate-100 shadow-inner relative group">
            <MapContainer
              center={center}
              zoom={10}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              {/* Elegant light basemap with strong boundaries */}
              {/* High-contrast topographic basemap for maximum legibility */}
              <TileLayer
                attribution='Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)'
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              />
              <MapBounds bounds={gpxData.bounds} />
              
              {/* Route Line */}
              <Polyline
                positions={routePositions}
                pathOptions={{
                  color: '#ff4f1f',
                  weight: 5,
                  opacity: 0.95,
                }}
              />
              
              {/* Checkpoints */}
              {checkpoints.map((cp, idx) => {
                const icon = cp.type === 'start' ? startIcon : cp.type === 'end' ? finishIcon : checkpointIcon;
                return (
                  <Marker
                    key={idx}
                    position={[cp.lat, cp.lon]}
                    icon={icon}
                    eventHandlers={{
                      click: () => setSelectedCheckpoint(idx),
                    }}
                  >
                    <Popup>
                      <div className="font-semibold text-utmb-blue">{cp.name}</div>
                      {cp.distance !== undefined && (
                        <div className="text-sm text-slate-600">
                          Distance: {cp.distance.toFixed(1)} km
                        </div>
                      )}
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* Elevation Profile */}
        {elevationProfile.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-utmb-dark-blue mb-4 flex items-center gap-2">
              <Gauge className="w-6 h-6 text-utmb-orange" />
              Profil d'Élévation
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={elevationProfile}>
                <defs>
                  <linearGradient id="colorElev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2C5F7C" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2C5F7C" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="distance" 
                  stroke="#64748b"
                  label={{ value: 'Distance (km)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  stroke="#64748b"
                  label={{ value: 'Altitude (m)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '2px solid #2C5F7C', borderRadius: '12px' }}
                  formatter={(value: number) => [`${value} m`, 'Altitude']}
                  labelFormatter={(label) => `Distance: ${label} km`}
                />
                <Area 
                  type="monotone" 
                  dataKey="elevation" 
                  stroke="#2C5F7C" 
                  strokeWidth={2}
                  fill="url(#colorElev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Checkpoints List */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-utmb-dark-blue flex items-center gap-2">
              <MapPin className="w-6 h-6 text-utmb-orange" />
              Points de Passage ({checkpoints.length})
            </h2>
            <div className="text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-lg">
              Cliquez sur un point pour le localiser sur la carte
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {checkpoints.map((cp, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedCheckpoint(idx)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                  selectedCheckpoint === idx
                    ? 'border-utmb-orange bg-gradient-to-br from-utmb-orange/10 to-utmb-blue/10 shadow-lg scale-105'
                    : 'border-slate-200 bg-white hover:border-utmb-blue hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    cp.type === 'start' ? 'bg-green-500' :
                    cp.type === 'end' ? 'bg-red-500' :
                    'bg-utmb-blue'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-utmb-dark-blue text-sm mb-1">{cp.name}</h3>
                    {cp.distance !== undefined && (
                      <p className="text-xs text-slate-600">
                        <span className="font-semibold">KM:</span> {cp.distance.toFixed(1)}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {cp.lat.toFixed(4)}°, {cp.lon.toFixed(4)}°
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="mt-16 pb-8 bg-gradient-to-r from-utmb-dark-blue to-utmb-mountain text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Mountain className="w-5 h-5 text-utmb-orange" />
            <p className="text-sm">Parcours UTMB 2025 • Données GPS</p>
          </div>
          <p className="text-xs text-blue-200">
            {gpxData.totalDistance.toFixed(1)} km • {Math.round(gpxData.totalElevationGain)} m D+ • {checkpoints.length} points de passage
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
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white shadow-md`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-utmb-dark-blue mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}

