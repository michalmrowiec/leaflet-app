import { userContext } from "./userContext.js";

export function getUserLocation(map) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        userContext.userLat = position.coords.latitude;
        userContext.userLon = position.coords.longitude;

        map.setView([userContext.userLat, userContext.userLon], 13);

        var userMarker = L.marker([
          userContext.userLat,
          userContext.userLon,
        ]).addTo(map);

        userMarker
          .bindPopup("<b>Twoja lokalizacja</b><br>Jesteś tutaj!")
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

export function setMarker(map) {
  var marker1 = L.marker([49.82311330035077, 19.048342803649078]).addTo(map);

  if (
    userContext.userLat !== "undefined" &&
    userContext.userLon !== "undefined"
  ) {
    var googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${
      userContext.userLat
    },${
      userContext.userLon
    }&destination=${49.82311330035077},${19.048342803649078}`;

    marker1.bindPopup(
      `<b>Pomnik Reksia</b><br><a href="${googleMapsUrl}" target="_blank">Nawiguj w Google Maps</a>`
    );
  } else {
    marker1.bindPopup(
      `<b>Pomnik Reksia</b><br>Twoja lokalizacja nie jest dostępna.`
    );
  }
}

export function setMarkers(map) {
  fetch("./points.json")
    .then((response) => response.json())
    .then((points) => {
      points.forEach((point) => {
        var marker = L.marker([point.latitude, point.longitude]).addTo(map);

        if (
          userContext.userLat !== "undefined" &&
          userContext.userLon !== "undefined"
        ) {
          var googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userContext.userLat},${userContext.userLon}&destination=${point.latitude},${point.longitude}`;

          marker.bindPopup(
            `<b>${point.name}</b><br>${point.description}<br><a href="${googleMapsUrl}" target="_blank">Nawiguj w Google Maps</a>`
          );
        } else {
          marker.bindPopup(`<b>${point.name}</b><br>${point.description}`);
        }
      });
    })
    .catch((error) => {
      console.log("Błąd wczytywania pliku JSON:", error);
    });
}
