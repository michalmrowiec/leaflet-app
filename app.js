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

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var userLat = position.coords.latitude;
        var userLon = position.coords.longitude;

        map.setView([userLat, userLon], 13);

        var userMarker = L.marker([userLat, userLon]).addTo(map);

        userMarker
          .bindPopup("<b>Twoja lokalizacja</b><br>Jesteś tutaj! (21.25)")
          .openPopup();
      },
      function (error) {
        console.log("Błąd pobierania lokalizacji:", error);
      }
    );
  } else {
    alert("Geolokalizacja jest niedostępna w tej przeglądarce.");
  }
}

getUserLocation();
