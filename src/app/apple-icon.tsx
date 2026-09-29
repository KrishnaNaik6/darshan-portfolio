import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

// Image generation for Apple Touch Icon
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #18181b 0%, #09090b 50%, #040405 100%)',
          borderRadius: '40px',
          border: '4px solid rgba(245, 158, 11, 0.4)',
          position: 'relative',
        }}
      >
        {/* Glow backdrop */}
        <div
          style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)',
          }}
        />

        {/* Monogram D + Badge */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: '92px',
              fontWeight: 900,
              fontFamily: 'sans-serif',
              background: 'linear-gradient(135deg, #fef08a 0%, #fbbf24 40%, #f59e0b 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-4px',
            }}
          >
            D
          </span>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '2px',
              background: '#f59e0b',
              marginLeft: '2px',
              marginTop: '40px',
              transform: 'rotate(45deg)',
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
