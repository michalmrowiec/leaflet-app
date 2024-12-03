import { userContext, userIcon } from "./userContext.js";

export function getUserLocation(map) {
  if (navigator.geolocation) {
    userContext.watchId = navigator.geolocation.watchPosition(
      function (position) {
        userContext.userLat = position.coords.latitude;
        userContext.userLon = position.coords.longitude;

        //map.setView([userContext.userLat, userContext.userLon], 13);

        if (userContext.userMarker) {
          map.removeLayer(userContext.userMarker);
        }

        userContext.userMarker = L.marker(
          [userContext.userLat, userContext.userLon],
          { icon: userIcon }
        ).addTo(map);

        userContext.userMarker.bindPopup(
          "<b>Twoja lokalizacja</b><br>Jesteś tutaj!"
        );

        updateMarkers(map);
      },
      function (error) {
        console.log("Błąd pobierania lokalizacji:", error);
      },
      { enableHighAccuracy: true }
    );
  } else {
    alert("Geolokalizacja jest niedostępna w tej przeglądarce.");
  }
}

export function stopUserLocation() {
  if (userContext.watchId !== null) {
    navigator.geolocation.clearWatch(userContext.watchId);
    userContext.watchId = null;

    if (userContext.userMarker) {
      userContext.userMarker.remove();
      userContext.userMarker = null;
    }

    console.log("Śledzenie lokalizacji zatrzymane.");
  }
}

export function setMarkers(map) {
  fetch("./points.json")
    .then((response) => response.json())
    .then((points) => {
      points.forEach((point) => {
        var marker = L.marker([point.latitude, point.longitude]).addTo(map);
        userContext.markers.push({
          marker: marker,
          point: point,
        });

        marker.bindPopup(
          `<b>${point.name}</b><br>${point.description}
          <button onclick="teleportUser(${point.latitude}, ${point.longitude})" class="btn btn-sm btn-outline-primary">Teleportuj</button>`
        );
      });
    })
    .catch((error) => {
      console.log("Błąd wczytywania pliku JSON:", error);
    });
}

export function updateMarkers(map) {
  if (userContext.userLat !== null && userContext.userLon !== null) {
    userContext.markers.forEach(({ marker, point }) => {
      var userLocation = L.latLng(userContext.userLat, userContext.userLon);
      var pointLocation = L.latLng(point.latitude, point.longitude);
      var distance = userLocation.distanceTo(pointLocation);
      console.log(distance);

      var googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userContext.userLat},${userContext.userLon}&destination=${point.latitude},${point.longitude}`;

      if (distance <= 50) {
        marker.setPopupContent(
          `<b>${point.name}</b>
          <br><b>Dotarłeś!</b> Odległość: ${distance.toFixed(2)} m<br>${
            point.description
          }<br>
    <button onclick="readDescription('${point.description.replace(
      /'/g,
      "\\'"
    )}')" 
    class="btn btn-sm btn-outline-primary">Przeczytaj opis</button>
    <button onclick="stopReading()" class="btn btn-sm btn-outline-danger">Zatrzymaj czytanie</button>`
        );
      } else {
        marker.setPopupContent(
          `<b>${
            point.name
          }</b><br>Dotrzyj do punktu, aby poznać jego historię!<br>
          Odległość: ${distance.toFixed(
            2
          )} m<br><a href="${googleMapsUrl}" target="_blank">Nawiguj w Google Maps</a><br>
          <button onclick="teleportUser(${point.latitude}, ${
            point.longitude
          })" class="btn btn-sm btn-outline-primary">Teleportuj</button>`
        );
      }
    });
  }
}
