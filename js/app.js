// --- Enregistrement du Service Worker ---
// C'est ce qui permet le mode hors-ligne et l'installation sur l'écran d'accueil.
const statusEl = document.getElementById("status");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then(() => {
        statusEl.textContent = "Prêt (mode hors-ligne activé)";
      })
      .catch((err) => {
        console.error("Échec de l'enregistrement du service worker :", err);
      });
  });
} else {
  statusEl.textContent = "Service worker non supporté sur ce navigateur";
}
