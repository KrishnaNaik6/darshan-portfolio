import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Dynamic App Icon for browser tabs
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
          borderRadius: '8px',
          border: '1.5px solid rgba(245, 158, 11, 0.6)',
        }}
      >
        <span
          style={{
            fontSize: '18px',
            fontWeight: 900,
            fontFamily: 'sans-serif',
            color: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          D
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
