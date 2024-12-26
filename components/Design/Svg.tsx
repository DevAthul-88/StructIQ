import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Grid } from 'lucide-react';

const FloorPlan = ({ 
  showGrid,
  scale,
  designData,
  showRuler = true,
  showLayers = true,
  svgRef,
  gridSpacing = 100,
  gridColor = '#E8E8E8',
}) => {
 
  
  // Calculate the drawing bounds
  const width = designData.metadata.boundingBox.maxX - designData.metadata.boundingBox.minX;
  const height = designData.metadata.boundingBox.maxY - designData.metadata.boundingBox.minY;
  
  // Add padding to the viewBox
  const padding = 500;
  const viewBox = `${designData.metadata.boundingBox.minX - padding} 
                  ${designData.metadata.boundingBox.minY - padding} 
                  ${width + (padding * 2)} 
                  ${height + (padding * 2)}`;

  const renderDefs = () => (
    <defs>
      <pattern id="fineGrid" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="none" stroke="#F5F5F5" strokeWidth="0.05"/>
      </pattern>
      
      <pattern id="mainGrid" width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" fill="none" stroke="#E8E8E8" strokeWidth="0.15"/>
        <rect width="100" height="100" fill="url(#fineGrid)"/>
      </pattern>
      
      <pattern id="wallHatch" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="3" stroke="#333333" strokeWidth="0.3"/>
      </pattern>

      <pattern id="wallCross" width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M0,0 L8,8 M0,8 L8,0" stroke="#444444" strokeWidth="0.2"/>
      </pattern>

      <marker 
        id="dimensionArrow" 
        viewBox="0 0 10 10" 
        refX="5" 
        refY="5" 
        markerWidth="4" 
        markerHeight="4" 
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#000000"/>
      </marker>

      <symbol id="doorSymbol" viewBox="0 0 40 40">
        <path d="M0,0 A40,40 0 0 1 40,40" fill="none" stroke="#000" strokeWidth="0.5"/>
      </symbol>

      <symbol id="windowSymbol" viewBox="0 0 40 10">
        <line x1="0" y1="5" x2="40" y2="5" stroke="#000" strokeWidth="1"/>
        <line x1="0" y1="0" x2="0" y2="10" stroke="#000" strokeWidth="1"/>
        <line x1="40" y1="0" x2="40" y2="10" stroke="#000" strokeWidth="1"/>
      </symbol>

      <symbol id="levelMarker" viewBox="0 0 30 30">
        <circle r="12" cx="15" cy="15" fill="white" stroke="#000" strokeWidth="0.5"/>
        <line x1="3" y1="15" x2="27" y2="15" stroke="#000" strokeWidth="0.5"/>
        <line x1="15" y1="3" x2="15" y2="27" stroke="#000" strokeWidth="0.5"/>
      </symbol>
    </defs>
  );

  
  const renderGrid = () => {
    if (!showGrid) return null;

    const minX = designData.metadata.boundingBox.minX;
    const minY = designData.metadata.boundingBox.minY;
    const verticalLines = Math.ceil(width / gridSpacing) + 1;
    const horizontalLines = Math.ceil(height / gridSpacing) + 1;

    return (
      <g className="grid-lines">
        {/* Background grid pattern */}
        <rect 
          x={minX}
          y={minY}
          width={width}
          height={height}
          fill="url(#mainGrid)"
        />
        
        {/* Vertical grid lines */}
        {Array.from({ length: verticalLines }).map((_, i) => (
          <g key={`grid-vertical-${i}`}>
            <line
              x1={minX + i * gridSpacing}
              y1={minY}
              x2={minX + i * gridSpacing}
              y2={minY + height}
              stroke={gridColor}
              strokeWidth="0.5"
            />
            <text
              x={minX + i * gridSpacing}
              y={minY - 10}
              textAnchor="middle"
              fontSize="10"
              fill={gridColor}
            >
              {i * gridSpacing}
            </text>
          </g>
        ))}
        
        {/* Horizontal grid lines */}
        {Array.from({ length: horizontalLines }).map((_, i) => (
          <g key={`grid-horizontal-${i}`}>
            <line
              x1={minX}
              y1={minY + i * gridSpacing}
              x2={minX + width}
              y2={minY + i * gridSpacing}
              stroke={gridColor}
              strokeWidth="0.5"
            />
            <text
              x={minX - 10}
              y={minY + i * gridSpacing + 3}
              textAnchor="end"
              fontSize="10"
              fill={gridColor}
            >
              {i * gridSpacing}
            </text>
          </g>
        ))}
      </g>
    );
  };

  const renderRooms = () => {
    if (!showLayers) return null;
    
    return designData.rooms.elements.map(room => {
      const corners = room.bounds.corners;
      const pathData = corners.map((point, i) => 
        `${i === 0 ? 'M' : 'L'} ${point.x},${point.y}`
      ).join(' ') + 'Z';

      const centerX = corners.reduce((sum, pt) => sum + pt.x, 0) / corners.length;
      const centerY = corners.reduce((sum, pt) => sum + pt.y, 0) / corners.length;
      const areaInSqM = (room.bounds.area / 1000000).toFixed(2);

      return (
        <g key={room.id}>
          <path 
            d={pathData} 
            fill="white"
            stroke="#000000" 
            strokeWidth="4"
          />
          
          <path 
            d={pathData} 
            fill="url(#wallCross)" 
            fillOpacity="0.7"
            stroke="none"
          />
          
          <g transform={`translate(${centerX},${centerY})`}>
            <rect 
              x="-80" 
              y="-50" 
              width="160" 
              height="100" 
              fill="white" 
              stroke="#000000" 
              strokeWidth="0.3" 
              strokeDasharray="4,2"
            />
            <text 
              textAnchor="middle" 
              fontSize="16" 
              fontFamily="Arial" 
              fontWeight="bold"
            >
              <tspan x="0" y="-25">{room.name.toUpperCase()}</tspan>
              <tspan x="0" y="5" fontSize="14" fontWeight="normal">Area: {areaInSqM} m²</tspan>
              <tspan x="0" y="35" fontSize="12">FFL: +0.00</tspan>
            </text>
          </g>

          {showRuler && corners.map((point, i) => {
            const nextPoint = corners[(i + 1) % corners.length];
            const dx = nextPoint.x - point.x;
            const dy = nextPoint.y - point.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            return (
              <g key={`dim-${i}`} transform={`translate(${(point.x + nextPoint.x)/2},${(point.y + nextPoint.y)/2})`}>
                <g transform={`rotate(${angle})`}>
                  <line
                    x1="-30"
                    y1="-20"
                    x2={length + 30}
                    y2="-20"
                    stroke="#000000"
                    strokeWidth="0.5"
                    markerStart="url(#dimensionArrow)"
                    markerEnd="url(#dimensionArrow)"
                  />
                  <text
                    x={length/2}
                    y="-30"
                    fontSize="12"
                    textAnchor="middle"
                    transform={angle > 90 || angle < -90 ? 'rotate(180)' : ''}
                  >
                    {(length/1000).toFixed(2)}m
                  </text>
                </g>
              </g>
            );
          })}

          <use 
            href="#levelMarker" 
            x={centerX - 15} 
            y={centerY + 60} 
            width="30" 
            height="30"
          />
        </g>
      );
    });
  };

  const renderTitleBlock = () => (
    <g transform="translate(1400, 800)">
      {/* Title block content remains the same */}
    </g>
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
     

      <div className="w-full h-full overflow-hidden">
        <svg 
          ref={svgRef}
          viewBox={viewBox}
          className="w-full h-full bg-white"
          style={{
            minWidth: '100%',
            minHeight: '100%',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out'
          }}
        >
          {renderDefs()}
          
          <rect 
            x={designData.metadata.boundingBox.minX}
            y={designData.metadata.boundingBox.minY}
            width={width}
            height={height}
            fill="white"
            stroke="#000000" 
            strokeWidth="2"
          />
          
          {showGrid && (
            <>
              <rect 
                x={designData.metadata.boundingBox.minX}
                y={designData.metadata.boundingBox.minY}
                width={width}
                height={height}
                fill="url(#mainGrid)"
              />
              {/* Additional grid lines */}
              {Array.from({ length: Math.ceil(width / 100) + 1 }).map((_, i) => (
                <line
                  key={`vertical-${i}`}
                  x1={designData.metadata.boundingBox.minX + i * 100}
                  y1={designData.metadata.boundingBox.minY}
                  x2={designData.metadata.boundingBox.minX + i * 100}
                  y2={designData.metadata.boundingBox.minY + height}
                  stroke="#E8E8E8"
                  strokeWidth="0.5"
                />
              ))}
              {Array.from({ length: Math.ceil(height / 100) + 1 }).map((_, i) => (
                <line
                  key={`horizontal-${i}`}
                  x1={designData.metadata.boundingBox.minX}
                  y1={designData.metadata.boundingBox.minY + i * 100}
                  x2={designData.metadata.boundingBox.minX + width}
                  y2={designData.metadata.boundingBox.minY + i * 100}
                  stroke="#E8E8E8"
                  strokeWidth="0.5"
                />
              ))}
            </>
          )}
          
          {renderRooms()}
          {renderGrid()}
          {renderTitleBlock()}
          
          <g transform="translate(-300, 700)">
            <circle r="50" fill="white" stroke="#000000" strokeWidth="1"/>
            <path 
              d="M0,-45 L15,25 L0,10 L-15,25 Z" 
              fill="#000000" 
              stroke="#000000" 
              strokeWidth="1"
            />
            <text 
              x="0" 
              y="-55" 
              textAnchor="middle" 
              fontSize="24" 
              fontWeight="bold"
            >
              N
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default FloorPlan;