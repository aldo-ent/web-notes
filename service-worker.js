// ⚠️ IMPORTANT : change ce numéro de version à CHAQUE fois que tu modifies
// l'app (html/css/js). C'est ce qui force le téléphone à télécharger
// la nouvelle version au lieu de garder l'ancienne en cache.
const CACHE_NAME = "mon-app-v6";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./pages/flashcards.html",
  "./pages/japonais.html",
  "./pages/allemand.html",
  "./css/style.css",
  "./js/app.js",
  "./js/flashcards.js",
  "./js/notes.js",
  "./js/markdown-it.min.js",
  "./js/katex.min.js",
  "./js/auto-render.min.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./data/decks/index.json",
  "./data/decks/kana-hiragana.json",
  "./data/decks/kana-katakana.json",
  "./data/decks/kanji-base.json",
  "./data/notes/japonais-grammaire.md",
  "./data/notes/allemand-grammaire.md",
  "./lib/katex/katex.min.css",
  "./lib/katex/fonts/KaTeX_AMS-Regular.woff2",
  "./lib/katex/fonts/KaTeX_Caligraphic-Bold.woff2",
  "./lib/katex/fonts/KaTeX_Caligraphic-Regular.woff2",
  "./lib/katex/fonts/KaTeX_Fraktur-Bold.woff2",
  "./lib/katex/fonts/KaTeX_Fraktur-Regular.woff2",
  "./lib/katex/fonts/KaTeX_Main-Bold.woff2",
  "./lib/katex/fonts/KaTeX_Main-BoldItalic.woff2",
  "./lib/katex/fonts/KaTeX_Main-Italic.woff2",
  "./lib/katex/fonts/KaTeX_Main-Regular.woff2",
  "./lib/katex/fonts/KaTeX_Math-BoldItalic.woff2",
  "./lib/katex/fonts/KaTeX_Math-Italic.woff2",
  "./lib/katex/fonts/KaTeX_SansSerif-Bold.woff2",
  "./lib/katex/fonts/KaTeX_SansSerif-Italic.woff2",
  "./lib/katex/fonts/KaTeX_SansSerif-Regular.woff2",
  "./lib/katex/fonts/KaTeX_Script-Regular.woff2",
  "./lib/katex/fonts/KaTeX_Size1-Regular.woff2",
  "./lib/katex/fonts/KaTeX_Size2-Regular.woff2",
  "./lib/katex/fonts/KaTeX_Size3-Regular.woff2",
  "./lib/katex/fonts/KaTeX_Size4-Regular.woff2",
  "./lib/katex/fonts/KaTeX_Typewriter-Regular.woff2",
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
