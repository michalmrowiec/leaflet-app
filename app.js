import { getUserLocation, stopUserLocation, setMarkers } from "./location.js";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(function (registration) {
      console.log("Service Worker zarejestrowany:", registration);
    })
    .catch(function (error) {
      console.log("Błąd rejestracji Service Workera:", error);
    });
}

export var map = L.map("map").setView([51.505, -0.09], 12);
map.setView([49.82245, 19.04686], 14);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

document.addEventListener("DOMContentLoaded", function () {
  const checkbox = document.getElementById("localize");
  checkbox.checked = true;

  setMarkers(map);

  getUserLocation(map);

  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      getUserLocation(map);
    } else {
      stopUserLocation();
    }
  });
});
