import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GarageVehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  tireSize: string;
  installDate?: string;
  nickname?: string;
}

interface GarageState {
  vehiclesByUser: Record<string, GarageVehicle[]>;
  getVehicles: (userId: string) => GarageVehicle[];
  addVehicle: (userId: string, vehicle: Omit<GarageVehicle, 'id'>) => void;
  removeVehicle: (userId: string, vehicleId: string) => void;
}

export const useGarageStore = create<GarageState>()(
  persist(
    (set, get) => ({
      vehiclesByUser: {},

      getVehicles: (userId) => get().vehiclesByUser[userId] ?? [],

      addVehicle: (userId, vehicle) =>
        set((state) => ({
          vehiclesByUser: {
            ...state.vehiclesByUser,
            [userId]: [
              ...(state.vehiclesByUser[userId] ?? []),
              { ...vehicle, id: crypto.randomUUID() },
            ],
          },
        })),

      removeVehicle: (userId, vehicleId) =>
        set((state) => ({
          vehiclesByUser: {
            ...state.vehiclesByUser,
            [userId]: (state.vehiclesByUser[userId] ?? []).filter(
              (v) => v.id !== vehicleId,
            ),
          },
        })),
    }),
    { name: 'tirehub-garage' },
  ),
);
