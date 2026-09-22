// ⚠️ IMPORTANT : change ce numéro de version à CHAQUE fois que tu modifies
// l'app (html/css/js). C'est ce qui force le téléphone à télécharger
// la nouvelle version au lieu de garder l'ancienne en cache.
const CACHE_NAME = "mon-app-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

// Étape 1 : à l'installation, on télécharge et on stocke tous les fichiers
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting(); // force le nouveau service worker à prendre le relais tout de suite
});

// Étape 2 : à l'activation, on supprime les anciens caches (anciennes versions)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Étape 3 : pour chaque requête, on sert le cache si dispo, sinon le réseau
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
