import React from 'react';

const LegendItem = ({ symbol, label }) => (
  <div className="flex items-center gap-3 text-gray-900 dark:text-gray-200">
    <svg className="w-6 h-6" viewBox="0 0 24 24">
      {symbol === 'wall' && (
        <rect width="24" height="24" fill="transparent" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2"/>
      )}
      {symbol === 'line' && (
        <line x1="0" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth="2"/>
      )}
      {symbol === 'level' && (
        <circle cx="12" cy="12" r="10" fill="currentColor"/>
      )}
      {symbol === 'door' && (
        <path d="M4 4h12v16H4V4zM4 20h16" stroke="currentColor" fill="transparent" strokeWidth="2"/>
      )}
      {symbol === 'window' && (
        <>
          <rect x="4" y="6" width="16" height="12" stroke="currentColor" fill="transparent" strokeWidth="2"/>
          <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2"/>
        </>
      )}
      {symbol === 'proposed' && (
        <rect width="24" height="24" fill="currentColor"/>
      )}
    </svg>
    <span className="text-sm">{label}</span>
  </div>
);

const Legend = () => (
  <div>
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-6">
      <LegendItem symbol="wall" label="Existing Wall" />
      <LegendItem symbol="line" label="Property Line" />
      <LegendItem symbol="level" label="Level Point" />
      <LegendItem symbol="door" label="Door" />
      <LegendItem symbol="window" label="Window" />
      <LegendItem symbol="proposed" label="Proposed Area" />
    </div>
  </div>
);

export default Legend;