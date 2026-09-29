import { ImageResponse } from 'next/og';
import { getPortfolioData } from '@/lib/portfolio';

export const runtime = 'nodejs';

// Image metadata
export const alt = 'Darshan G Poojari — Video Editor & Multimedia Designer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const data = await getPortfolioData();
  const name = data.profile.name || 'Darshan G Poojari';
  const role = data.profile.role || 'Video Editor & Multimedia Designer';
  const bio =
    data.profile.bio ||
    'Specializing in cinematic video editing, high-CTR YouTube thumbnails, and brand design.';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #18181b 0%, #09090b 50%, #040405 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Glow ambient circle */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
          }}
        />

        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '2px solid rgba(245, 158, 11, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24',
                fontSize: '24px',
                fontWeight: 900,
              }}
            >
              D
            </div>
            <span
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#a1a1aa',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              Portfolio Studio
            </span>
          </div>

          <div
            style={{
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fef08a',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            Available for Projects
          </div>
        </div>

        {/* Center Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '900px',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              fontWeight: 900,
              lineHeight: 1.1,
              background: 'linear-gradient(135deg, #ffffff 0%, #e4e4e7 60%, #a1a1aa 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-2px',
            }}
          >
            {name}
          </div>

          <div
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#fbbf24',
              letterSpacing: '-0.5px',
            }}
          >
            {role}
          </div>

          <div
            style={{
              fontSize: '20px',
              color: '#a1a1aa',
              lineHeight: 1.5,
              marginTop: '4px',
            }}
          >
            {bio}
          </div>
        </div>

        {/* Footer badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            paddingTop: '20px',
            borderTop: '1px solid #27272a',
          }}
        >
          <span
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: '#27272a',
              color: '#d4d4d8',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            Premiere Pro
          </span>
          <span
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: '#27272a',
              color: '#d4d4d8',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            DaVinci Resolve
          </span>
          <span
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: '#27272a',
              color: '#d4d4d8',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            After Effects
          </span>
          <span
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: '#27272a',
              color: '#d4d4d8',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            Photoshop & Retouching
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
