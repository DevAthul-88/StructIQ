import React from 'react';

const SvgDefs: React.FC = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      <pattern id="wallCross" patternUnits="userSpaceOnUse" width="10" height="10">
        <path d="M0 0 L10 10 M10 0 L0 10" stroke="#000000" strokeWidth="0.5" />
      </pattern>
      
      <symbol id="levelMarker" viewBox="0 0 25 25">
        <circle cx="12.5" cy="12.5" r="10" fill="none" stroke="#000000" strokeWidth="1.5" />
        <line x1="12.5" y1="2.5" x2="12.5" y2="22.5" stroke="#000000" strokeWidth="1.5" />
        <line x1="2.5" y1="12.5" x2="22.5" y2="12.5" stroke="#000000" strokeWidth="1.5" />
      </symbol>
      
      <symbol id="doorSymbol" viewBox="0 0 25 25">
        <path d="M5 5 L20 5 L20 20 L5 20" fill="none" stroke="#000000" strokeWidth="1.5" />
        <path d="M5 5 A15 15 0 0 1 20 5" fill="none" stroke="#000000" strokeWidth="1.5" />
      </symbol>
      
      <symbol id="windowSymbol" viewBox="0 0 25 25">
        <rect x="5" y="10" width="15" height="5" fill="none" stroke="#000000" strokeWidth="1.5" />
        <line x1="12.5" y1="10" x2="12.5" y2="15" stroke="#000000" strokeWidth="1.5" />
      </symbol>
    </defs>
  </svg>
);

export default SvgDefs;

