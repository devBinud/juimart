import { useLocationStore } from "../store/useLocationStore";

/* ── Delivery zone config — change these to adjust ── */
export const STORE_LOCATION = {
  lat: 26.1445,
  lng: 91.7362,
  name: "Royal Global University, Guwahati",
};
export const DELIVERY_RADIUS_KM = 500;

/* Haversine distance in km */
export const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/* Reverse geocode with Nominatim + BigDataCloud fallback */
export const reverseGeocode = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=18`,
      { headers: { "Accept-Language": "en", "User-Agent": "JuiMart/1.0" } }
    );
    if (res.ok) {
      const data = await res.json();
      const a = data.address || {};
      const full = [
        a.house_number, a.road || a.pedestrian || a.footway,
        a.amenity || a.building, a.neighbourhood || a.suburb,
        a.city || a.town || a.village, a.state_district,
        a.state, a.postcode,
      ].map(p => (p || "").trim()).filter(Boolean);

      const short = [
        a.neighbourhood || a.suburb || a.road,
        a.city || a.town || a.village,
      ].filter(Boolean).join(", ");

      if (full.length >= 3) return { full: full.join(", "), short: short || full.slice(0, 2).join(", ") };
    }
  } catch (_) {}

  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    if (res.ok) {
      const d = await res.json();
      const full = [d.locality, d.city, d.principalSubdivision].filter(Boolean).join(", ");
      const short = [d.locality || d.city, d.principalSubdivision].filter(Boolean).join(", ");
      if (full) return { full, short };
    }
  } catch (_) {}

  return null;
};

/* Main detect function — updates the Zustand store */
export const detectAndSaveLocation = () => {
  const { setLocation, setDetecting } = useLocationStore.getState();

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    setDetecting(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const km = getDistanceKm(STORE_LOCATION.lat, STORE_LOCATION.lng, latitude, longitude);
        const distanceKm = Math.round(km * 10) / 10;
        const inZone = km <= DELIVERY_RADIUS_KM;

        const geo = await reverseGeocode(latitude, longitude);
        const address = geo?.full || "";
        const shortAddress = geo?.short || "Your location";

        setLocation({ address, shortAddress, lat: latitude, lng: longitude, distanceKm, inZone });
        resolve({ address, shortAddress, distanceKm, inZone });
      },
      (err) => {
        setDetecting(false);
        reject(err);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  });
};
