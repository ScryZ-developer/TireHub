import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

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
          background: '#1565C0',
          borderRadius: 7,
          color: '#FFFFFF',
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: -1,
          fontFamily: 'Arial Black, Arial, sans-serif',
        }}
      >
        TH
      </div>
    ),
    { ...size },
  );
}
