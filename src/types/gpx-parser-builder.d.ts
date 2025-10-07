declare module 'gpx-parser-builder' {
  export interface GPXWaypoint {
    name?: string;
    lat: number;
    lon: number;
    ele?: number;
    desc?: string;
    type?: string;
  }

  export interface GPXTrackPoint {
    lat: number;
    lon: number;
    ele?: number;
    time?: string;
  }

  export interface GPXTrackSegment {
    trkpt: GPXTrackPoint[];
  }

  export interface GPXTrack {
    name?: string;
    trkseg: GPXTrackSegment[];
  }

  export interface GPXData {
    wpt?: GPXWaypoint[];
    trk?: GPXTrack[];
  }

  export class GPX {
    static parse(gpxString: string): GPXData;
    static toGeoJSON(gpxData: GPXData): any;
  }
}

