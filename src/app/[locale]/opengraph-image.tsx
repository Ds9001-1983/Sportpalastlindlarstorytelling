import { ImageResponse } from 'next/og';

// Dynamisch generiertes Open-Graph-/Twitter-Bild (1200×630) für Sharing-Previews
// auf WhatsApp/Facebook/Instagram. Next-16 File-Convention.
export const alt = 'Sportpalast Lindlar — Werde deine beste Version';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'radial-gradient(120% 90% at 80% 0%, #1c1510 0%, #0e0e0f 55%)',
          color: '#f4f1ea',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 26,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#e0a23c',
          }}
        >
          <div style={{ width: 56, height: 3, background: '#e0a23c' }} />
          Premium-Fitness · Oberberg
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 92,
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: -2,
            }}
          >
            Werde deine
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: -2,
              color: '#e0a23c',
            }}
          >
            beste Version.
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: '#b8b2a6' }}>
            eGym · über 30 Kurse · Sauna &amp; Wellness · Physio
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 32,
            fontWeight: 700,
            borderTop: '1px solid #26262c',
            paddingTop: 28,
          }}
        >
          <span>Sportpalast Lindlar</span>
          <span style={{ fontSize: 26, fontWeight: 500, color: '#b8b2a6' }}>
            Lindlar · Meinerzhagen
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
