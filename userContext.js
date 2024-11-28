export const userContext = {
  userLat: null,
  userLon: null,
  userMarker: undefined,
  watchId: null,
  markers: [],
};

export const userIcon = L.icon({
  iconUrl: "icons/user-icon.png",
  iconSize: [36, 36],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
