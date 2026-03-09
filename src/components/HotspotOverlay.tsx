
import React from 'react';
import { Hotspot } from '../../types';

interface HotspotOverlayProps {
  hotspots: Hotspot[];
  onSelect: (hotspot: Hotspot) => void;
  activeId?: string | null;
}

const HotspotOverlay: React.FC<HotspotOverlayProps> = ({ hotspots, onSelect, activeId }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
      {hotspots.map((spot) => (
        <button
          key={spot.id}
          className={`absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 ease-out outline-none ${activeId === spot.id ? 'z-20 scale-125' : 'z-10 hover:z-30 hover:scale-110'
            }`}
          style={{ left: `${spot.x / 10}%`, top: `${spot.y / 10}%` }}
          onClick={() => onSelect(spot)}
          title={spot.label}
        >
          {/* Subtle Outer Glow Ring on Hover */}
          <div className="absolute inset-[-4px] rounded-full border border-indigo-400/0 group-hover:border-indigo-400/40 group-hover:scale-110 transition-all duration-300" />

          {/* Inner ring pulse - stops or becomes more subtle on hover to show focus */}
          <div className={`absolute inset-0 rounded-full bg-white opacity-20 ${activeId === spot.id ? 'animate-none' : 'animate-ping group-hover:animate-none'}`} />

          {/* Main Hotspot Circle */}
          <div className={`relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-white shadow-lg transition-all duration-300 ${activeId === spot.id
            ? 'bg-white scale-110'
            : 'bg-white/60 backdrop-blur-md group-hover:bg-white group-hover:scale-110'
            }`}>
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeId === spot.id
              ? 'bg-slate-900 border border-slate-200'
              : 'bg-white group-hover:bg-slate-900 shadow-sm'
              }`} />
          </div>

          {/* Label Tooltip - with slide-up animation */}
          <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900/90 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-xl opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none whitespace-nowrap border border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              {spot.label}
            </div>
            {/* Tooltip arrow */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900/90 rotate-45 border-l border-t border-white/10" />
          </div>
        </button>
      ))}
    </div>
  );
};

export default HotspotOverlay;
