import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

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
          background: '#1565C0',
          borderRadius: 40,
          color: '#FFFFFF',
          fontSize: 84,
          fontWeight: 800,
          letterSpacing: -2,
          fontFamily: 'Arial Black, Arial, sans-serif',
        }}
      >
        TH
      </div>
    ),
    { ...size },
  );
}
