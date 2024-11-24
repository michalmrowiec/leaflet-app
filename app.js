import { getUserLocation, setMarkers } from "./location.js";

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

var map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

getUserLocation(map);
setMarkers(map);
