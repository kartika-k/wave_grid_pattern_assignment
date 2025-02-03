import React, { useState, useEffect } from 'react';

const WaveGrid = ({ rows = 15, cols = 20, speed = 50 }) => {
  const [wavePosition, setWavePosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [colorIndex, setColorIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [currentSpeed, setCurrentSpeed] = useState(speed);

  const colors = [
    { primary: '#00ff00', secondary: '#004400' }, // Green
    { primary: '#00ffaa', secondary: '#004433' }, // Teal
    { primary: '#00ffff', secondary: '#004444' }, // Cyan
    { primary: '#00aaff', secondary: '#003344' }, // Light Blue
    { primary: '#0055ff', secondary: '#002244' }, // Blue
    { primary: '#8A2BE2', secondary: '#4B0082' }, // Purple
    { primary: '#9932CC', secondary: '#4B0082' }, // Dark Orchid
    { primary: '#BA55D3', secondary: '#563D7C' }, // Medium Orchid
    { primary: '#DDA0DD', secondary: '#7B68EE' }, // Plum
    { primary: '#E6E6FA', secondary: '#9370DB' }  // Lavender
  ];

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setWavePosition((prev) => {
        if (prev >= cols - 1 && direction === 1) {
          setDirection(-1);
          setColorIndex((prev) => (prev + 1) % colors.length);
          return prev - 1;
        } else if (prev <= 0 && direction === -1) {
          setDirection(1);
          setColorIndex((prev) => (prev + 1) % colors.length);
          return prev + 1;
        }
        return prev + direction;
      });
    }, currentSpeed);

    return () => clearInterval(interval);
  }, [cols, currentSpeed, direction, isRunning]);

  const getCellColor = (col, row) => {
    const distance = Math.abs(col - wavePosition);
    const verticalFactor = Math.sin((row / rows) * Math.PI);
    const intensity = Math.max(0, 1 - (distance * 0.15));
    const color = colors[colorIndex];
    
    if (intensity < 0.1) return '#1a1a1a';
    
    return intensity > 0.5 ? color.primary : color.secondary;
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-gray-900 rounded-lg">
      <div className="flex gap-4 items-center">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? 'Pause' : 'Play'}
        </button>
        <div className="flex items-center gap-2">
          <label className="text-white">Speed:</label>
          <input
            type="range"
            min="10"
            max="200"
            value={201 - currentSpeed}
            onChange={(e) => setCurrentSpeed(201 - e.target.value)}
            className="w-32"
          />
        </div>
      </div>
      
      <div 
        className="grid gap-1 p-4 bg-black rounded-lg"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          width: 'fit-content'
        }}
      >
        {Array.from({ length: rows * cols }).map((_, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          
          return (
            <div
              key={index}
              className="w-6 h-6 rounded-sm transition-colors duration-200"
              style={{
                backgroundColor: getCellColor(col, row)
              }}
            />
          );
        })}
      </div>
      
      <div className="text-gray-400 text-sm">
        Current Wave Color: 
        <span 
          className="ml-2 px-2 py-1 rounded"
          style={{ backgroundColor: colors[colorIndex].primary }}
        >
          &nbsp;
        </span>
      </div>
    </div>
  );
};

export default WaveGrid;