
import { ColorOption } from './types';



// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Ultra-optimized low-cost rendering pricing
export const COST_PER_RENDER_PKR = 3.5;

export const COLORS: ColorOption[] = [
  { name: 'Swiss Coffee', hex: '#f2f0e6' },
  { name: 'Midnight Navy', hex: '#1a2a3a' },
  { name: 'Sage Green', hex: '#8b9485' },
  { name: 'Desert Terracotta', hex: '#c17e61' },
  { name: 'Urban Charcoal', hex: '#3d3d3d' },
  { name: 'Rose Quartz', hex: '#e2c8c4' },
  { name: 'Natural Oak', hex: '#d9b68c' },
  { name: 'American Walnut', hex: '#5d4037' },
  { name: 'Calacatta Marble', hex: '#ffffff' },
  { name: 'Nero Marquina', hex: '#111111' },
  { name: 'Imperial Velvet', hex: '#4a0e0e' },
  { name: 'Royal Emerald', hex: '#043927' }
];

export const MODELS = {
  EDITING: 'gemini-2.5-flash-image'
};


export const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
