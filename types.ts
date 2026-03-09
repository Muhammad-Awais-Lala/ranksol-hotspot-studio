
export interface Hotspot {
  id: string;
  label: string; // Title
  area: string;  // Application Area
  applicationAreaSlug: string; // Slug for sheets API
  description?: string; // Short description from API
  x: number;     // 0-1000
  y: number;     // 0-1000
}



export enum AppStatus {
  IDLE = 'IDLE',
  FETCHING = 'FETCHING',

  READY = 'READY',
  EDITING = 'EDITING',
  ERROR = 'ERROR'
}

export interface ColorOption {
  name: string;
  hex: string;
}
