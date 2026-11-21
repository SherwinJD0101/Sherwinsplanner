import React from 'react';

export function LotusDivider({ className = '', tone = 'gold' }: { className?: string; tone?: 'gold' | 'light' }) {
  const strokeColor = tone === 'light' ? 'rgba(255, 255, 255, 0.45)' : '#B8860B';
  const fillColor = tone === 'light' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(184, 134, 11, 0.12)';
  const lineColor = tone === 'light' ? 'rgba(255, 255, 255, 0.2)' : '#E6DFD3';

  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden="true">
      <div className="h-px flex-1" style={{ backgroundColor: lineColor }} />
      <svg width="36" height="22" viewBox="0 0 36 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18 2C15.5 7 15.5 12.5 18 17C20.5 12.5 20.5 7 18 2Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1.15"
        />
        <path
          d="M18 17C13 15.5 9.5 11.5 9.5 6.5C13 8.5 15.8 12.2 18 17Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1.15"
        />
        <path
          d="M18 17C23 15.5 26.5 11.5 26.5 6.5C23 8.5 20.2 12.2 18 17Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1.15"
        />
        <path
          d="M18 17C11.5 17.5 6 15.2 3.5 11.2C7.8 11.8 13 13.8 18 17Z"
          stroke={strokeColor}
          strokeWidth="1.05"
        />
        <path
          d="M18 17C24.5 17.5 30 15.2 32.5 11.2C28.2 11.8 23 13.8 18 17Z"
          stroke={strokeColor}
          strokeWidth="1.05"
        />
        <path d="M12 20H24" stroke={strokeColor} strokeWidth="1.1" strokeLinecap="round" />
      </svg>
      <div className="h-px flex-1" style={{ backgroundColor: lineColor }} />
    </div>
  );
}

export function MandalaCorner({ className = '', stroke = 'rgba(201, 162, 39, 0.22)' }: { className?: string; stroke?: string }) {
  return (
    <svg
      className={className}
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="0" cy="0" r="144" stroke={stroke} strokeWidth="1" strokeDasharray="3 4" />
      <circle cx="0" cy="0" r="112" stroke={stroke} strokeWidth="1" />
      <circle cx="0" cy="0" r="80" stroke={stroke} strokeWidth="1" />
      <circle cx="0" cy="0" r="48" stroke={stroke} strokeWidth="1" />
      {[0, 15, 30, 45, 60, 75, 90].map((deg) => (
        <line
          key={deg}
          x1="0"
          y1="0"
          x2={Math.cos((deg * Math.PI) / 180) * 144}
          y2={Math.sin((deg * Math.PI) / 180) * 144}
          stroke={stroke}
          strokeWidth="0.75"
        />
      ))}
      <path
        d="M80 0C78 24 62 46 38 58C52 38 66 20 80 0Z"
        stroke={stroke}
        strokeWidth="1"
      />
      <path
        d="M0 80C24 78 46 62 58 38C38 52 20 66 0 80Z"
        stroke={stroke}
        strokeWidth="1"
      />
    </svg>
  );
}

export function MarigoldAccentIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.2" fill="#D97706" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <ellipse
          key={angle}
          cx="12"
          cy="5.2"
          rx="2.1"
          ry="3.6"
          stroke="#C2410C"
          strokeWidth="1.3"
          fill="#FEF3C7"
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
    </svg>
  );
}
