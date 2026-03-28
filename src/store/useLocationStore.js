import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Persisted location store.
 * Saves detected address + coords so checkout can auto-fill
 * and navbar can show the current delivery location.
 */
export const useLocationStore = create(
  persist(
    (set) => ({
      address: "",          // full reverse-geocoded address string
      shortAddress: "",     // short label for navbar e.g. "Guwahati, Assam"
      lat: null,
      lng: null,
      distanceKm: null,
      inZone: null,         // null = unknown, true = in zone, false = out of zone
      detecting: false,

      setLocation: ({ address, shortAddress, lat, lng, distanceKm, inZone }) =>
        set({ address, shortAddress, lat, lng, distanceKm, inZone, detecting: false }),

      setDetecting: (v) => set({ detecting: v }),

      clearLocation: () =>
        set({ address: "", shortAddress: "", lat: null, lng: null, distanceKm: null, inZone: null, detecting: false }),
    }),
    { name: "juimart-location" }
  )
);
