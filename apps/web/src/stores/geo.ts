import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { KRASNOYARSK, type GeoLocation } from '@tirehub/shared';

interface GeoState extends GeoLocation {
  setLocation: (location: Partial<GeoLocation>) => void;
  detectLocation: () => void;
  resetToDefault: () => void;
}

export const useGeoStore = create<GeoState>()(
  persist(
    (set) => ({
      ...KRASNOYARSK,

      setLocation: (location) =>
        set((state) => ({
          ...state,
          ...location,
          source: location.source ?? 'manual',
        })),

      detectLocation: () => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            set({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              source: 'gps',
            });
          },
          () => {
            /* keep current city */
          },
          { enableHighAccuracy: false, timeout: 8000 },
        );
      },

      resetToDefault: () => set({ ...KRASNOYARSK }),
    }),
    { name: 'tirehub-geo' },
  ),
);
