import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'CoreLoad HVAC Load Calculator';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#030303',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderTop: '8px solid #06b6d4',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Delta Logo */}
          <svg width="150" height="150" viewBox="0 0 100 100" fill="none" style={{ marginBottom: '40px' }}>
            <polygon points="50,15 88,80 12,80" stroke="#e4e4e7" strokeWidth="8" strokeLinejoin="miter" />
            <line x1="50" y1="27" x2="38.6" y2="7.5" stroke="#030303" strokeWidth="6" />
            <line x1="77.6" y1="74" x2="100" y2="74" stroke="#030303" strokeWidth="6" />
            <line x1="22.4" y1="74" x2="11.0" y2="93.5" stroke="#030303" strokeWidth="6" />
          </svg>
          
          {/* Typography */}
          <div
            style={{
              fontSize: '110px',
              fontFamily: 'sans-serif',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            CoreLoad
          </div>
          <div
            style={{
              fontSize: '40px',
              fontFamily: 'monospace',
              color: '#a1a1aa',
              marginTop: '20px',
              letterSpacing: '0.05em',
            }}
          >
            PRECISION ACCA MANUAL J SIZING
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
