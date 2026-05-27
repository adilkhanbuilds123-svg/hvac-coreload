import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#030303',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '40px',
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g stroke="#d4d4d8" strokeWidth="0.5" strokeDasharray="1 3" opacity="0.3">
            <line x1="12" y1="5" x2="12" y2="95" />
            <line x1="50" y1="5" x2="50" y2="95" />
            <line x1="88" y1="5" x2="88" y2="95" />
            <line x1="5" y1="15" x2="95" y2="15" />
            <line x1="5" y1="47.5" x2="95" y2="47.5" />
            <line x1="5" y1="80" x2="95" y2="80" />
          </g>
          <polygon
            points="50,15 88,80 12,80"
            stroke="#e4e4e7"
            strokeWidth="12"
            strokeLinejoin="miter"
          />
          <line x1="50" y1="27" x2="38.6" y2="7.5" stroke="#030303" strokeWidth="6" />
          <line x1="77.6" y1="74" x2="100" y2="74" stroke="#030303" strokeWidth="6" />
          <line x1="22.4" y1="74" x2="11.0" y2="93.5" stroke="#030303" strokeWidth="6" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
