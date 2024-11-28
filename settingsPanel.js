const devButton = document.getElementById("devButton");
const panel = document.getElementById("panel");
const panelClose = document.getElementById("panelClose");

devButton.addEventListener("click", () => {
  panel.classList.add("open");
});

panelClose.addEventListener("click", () => {
  panel.classList.remove("open");
});
