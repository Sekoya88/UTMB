export interface GPXWaypoint {
  name: string;
  lat: number;
  lon: number;
  description?: string;
  type?: string;
}

export interface GPXTrackPoint {
  lat: number;
  lon: number;
  ele?: number;
  time?: Date;
  // distance from start along the track in meters
  cumulativeDistanceM?: number;
}

export interface GPXSegment {
  points: GPXTrackPoint[];
}

export interface GPXTrack {
  name?: string;
  segments: GPXSegment[];
}

export interface ParsedGPXData {
  waypoints: GPXWaypoint[];
  tracks: GPXTrack[];
  bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  };
  totalDistance: number;
  totalElevationGain: number;
  totalElevationLoss: number;
}

export async function parseGPXFile(filePath: string): Promise<ParsedGPXData> {
  try {
    const response = await fetch(filePath);
    const gpxText = await response.text();
    
    // Parse GPX using DOMParser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gpxText, 'text/xml');

    // Parse waypoints
    const waypoints: GPXWaypoint[] = [];
    const wptElements = xmlDoc.getElementsByTagName('wpt');
    for (let i = 0; i < wptElements.length; i++) {
      const wpt = wptElements[i];
      const nameEl = wpt.getElementsByTagName('name')[0];
      const descEl = wpt.getElementsByTagName('desc')[0];
      const typeEl = wpt.getElementsByTagName('type')[0];
      
      waypoints.push({
        name: nameEl?.textContent || '',
        lat: parseFloat(wpt.getAttribute('lat') || '0'),
        lon: parseFloat(wpt.getAttribute('lon') || '0'),
        description: descEl?.textContent || '',
        type: typeEl?.textContent || '',
      });
    }

    // Parse tracks
    const tracks: GPXTrack[] = [];
    const trkElements = xmlDoc.getElementsByTagName('trk');
    for (let i = 0; i < trkElements.length; i++) {
      const trk = trkElements[i];
      const nameEl = trk.getElementsByTagName('name')[0];
      
      const segments: GPXSegment[] = [];
      const trksegElements = trk.getElementsByTagName('trkseg');
      
      for (let j = 0; j < trksegElements.length; j++) {
        const trkseg = trksegElements[j];
        const points: GPXTrackPoint[] = [];
        const trkptElements = trkseg.getElementsByTagName('trkpt');
        
        for (let k = 0; k < trkptElements.length; k++) {
          const trkpt = trkptElements[k];
          const eleEl = trkpt.getElementsByTagName('ele')[0];
          const timeEl = trkpt.getElementsByTagName('time')[0];
          
          points.push({
            lat: parseFloat(trkpt.getAttribute('lat') || '0'),
            lon: parseFloat(trkpt.getAttribute('lon') || '0'),
            ele: eleEl ? parseFloat(eleEl.textContent || '0') : undefined,
            time: timeEl ? new Date(timeEl.textContent || '') : undefined,
          });
        }
        
        segments.push({ points });
      }
      
      tracks.push({
        name: nameEl?.textContent || '',
        segments,
      });
    }

    // Calculate bounds
    let minLat = Infinity, maxLat = -Infinity;
    let minLon = Infinity, maxLon = -Infinity;

    tracks.forEach(track => {
      track.segments.forEach(segment => {
        segment.points.forEach(point => {
          minLat = Math.min(minLat, point.lat);
          maxLat = Math.max(maxLat, point.lat);
          minLon = Math.min(minLon, point.lon);
          maxLon = Math.max(maxLon, point.lon);
        });
      });
    });

    waypoints.forEach(wpt => {
      minLat = Math.min(minLat, wpt.lat);
      maxLat = Math.max(maxLat, wpt.lat);
      minLon = Math.min(minLon, wpt.lon);
      maxLon = Math.max(maxLon, wpt.lon);
    });

    // Calculate distance and elevation (and fill cumulative distance)
    let totalDistance = 0;
    let totalElevationGain = 0;
    let totalElevationLoss = 0;

    tracks.forEach(track => {
      track.segments.forEach(segment => {
        if (segment.points.length > 0) {
          segment.points[0].cumulativeDistanceM = totalDistance;
        }
        for (let i = 1; i < segment.points.length; i++) {
          const p1 = segment.points[i - 1];
          const p2 = segment.points[i];
          
          // Haversine formula for distance
          const R = 6371e3; // Earth radius in meters
          const φ1 = (p1.lat * Math.PI) / 180;
          const φ2 = (p2.lat * Math.PI) / 180;
          const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
          const Δλ = ((p2.lon - p1.lon) * Math.PI) / 180;

          const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          
          const d = R * c;
          totalDistance += d;
          p2.cumulativeDistanceM = totalDistance;

          // Elevation gain/loss
          if (p1.ele !== undefined && p2.ele !== undefined) {
            const elevDiff = p2.ele - p1.ele;
            if (elevDiff > 0) {
              totalElevationGain += elevDiff;
            } else {
              totalElevationLoss += Math.abs(elevDiff);
            }
          }
        }
      });
    });

    return {
      waypoints,
      tracks,
      bounds: {
        minLat,
        maxLat,
        minLon,
        maxLon,
      },
      totalDistance: totalDistance / 1000, // Convert to km
      totalElevationGain,
      totalElevationLoss,
    };
  } catch (error) {
    console.error('Error parsing GPX file:', error);
    throw error;
  }
}

// Extract checkpoints from waypoints
export function extractCheckpoints(waypoints: GPXWaypoint[]): Array<{
  name: string;
  lat: number;
  lon: number;
  type: 'start' | 'end' | 'checkpoint';
}> {
  const candidates = waypoints.filter(wpt => (wpt.name || '').toLowerCase().includes('segment'));

  const cps = candidates.map((wpt, idx, arr) => {
    const base = {
      name: (wpt.name || '').split('/')[0].trim(),
      lat: wpt.lat,
      lon: wpt.lon,
    };
    const isFirst = idx === 0;
    const isLast = idx === arr.length - 1;
    const type: 'start' | 'end' | 'checkpoint' = isFirst ? 'start' : isLast ? 'end' : 'checkpoint';
    return { ...base, type };
  });

  return cps;
}

