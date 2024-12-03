import {
  getUserLocation,
  stopUserLocation,
  setMarkers,
  updateMarkers,
} from "./location.js";
import { userContext, userIcon } from "./userContext.js";

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
map.setView([49.82245, 19.04686], 13);

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

export function teleportUser(lat, lon) {
  const offsetLat = (Math.random() - 0.5) * 0.0002;
  const offsetLon = (Math.random() - 0.5) * 0.0002;

  const newLat = lat + offsetLat;
  const newLon = lon + offsetLon;

  userContext.userLat = newLat;
  userContext.userLon = newLon;

  map.setView([newLat, newLon], 18);

  if (userContext.userMarker) {
    userContext.userMarker.setLatLng([newLat, newLon]);
  } else {
    userContext.userMarker = L.marker([newLat, newLon], {
      icon: userIcon,
    }).addTo(map);
  }

  userContext.userMarker.bindPopup("<b>Twoja lokalizacja</b><br>Jesteś tutaj!");

  updateMarkers(map);
}
window.teleportUser = teleportUser;

export function findMe() {
  map.setView([userContext.userLat, userContext.userLon], 13);
}
window.findMe = findMe;

let currentUtterance = null;

function readDescription(text) {
  if ("speechSynthesis" in window) {
    const voices = speechSynthesis.getVoices();
    const femaleVoice =
      voices.find(
        (voice) =>
          voice.lang === "pl-PL" && voice.name.toLowerCase().includes("female")
      ) || voices.find((voice) => voice.lang === "pl-PL");

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = "pl-PL";
    if (femaleVoice) {
      currentUtterance.voice = femaleVoice;
    }

    speechSynthesis.speak(currentUtterance);
  } else {
    alert("Twoja przeglądarka nie obsługuje funkcji Text-to-Speech.");
  }
}
window.readDescription = readDescription;

function stopReading() {
  if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
  }
}
window.stopReading = stopReading;

async function openQuizWindow(pointName) {
  try {
    const response = await fetch("./points.json");
    const pointsData = await response.json();

    const point = pointsData.find((p) => p.name === pointName);

    if (point?.quiz) {
      const quiz = point.quiz;

      const quizWindow = document.createElement("div");
      quizWindow.id = "quiz-window";
      quizWindow.classList.add("modal", "fade");
      quizWindow.setAttribute("tabindex", "-1");
      quizWindow.setAttribute("aria-labelledby", "quizWindowLabel");
      quizWindow.setAttribute("aria-hidden", "true");

      quizWindow.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="quizWindowLabel">Quiz - ${
                point.name
              }</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <h4>${quiz.question}</h4>
              ${quiz.answers
                .map(
                  (answer, index) =>
                    `<button class="btn btn-outline-primary w-100 my-2" onclick="checkAnswer(${index}, ${quiz.correct})">
                      ${answer}
                    </button>`
                )
                .join("")}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Zamknij</button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(quizWindow);

      const modal = new bootstrap.Modal(quizWindow);
      modal.show();
    } else {
      alert("Brak quizu dla tego punktu.");
    }
  } catch (error) {
    console.error("Błąd podczas ładowania punktów:", error);
    alert("Wystąpił problem z ładowaniem danych quizu.");
  }
}
window.openQuizWindow = openQuizWindow;

function closeQuizWindow() {
  const quizWindow = document.getElementById("quiz-window");
  if (quizWindow) {
    quizWindow.remove();
  }
}
window.closeQuizWindow = closeQuizWindow;

function checkAnswer(selected, correct) {
  alert(
    selected === correct
      ? "Dobra odpowiedź!"
      : "Zła odpowiedź, spróbuj ponownie!"
  );
}
window.checkAnswer = checkAnswer;
