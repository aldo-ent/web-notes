// --- Éléments de la page ---
const deckSelect = document.getElementById("deck-select");
const directionBtn = document.getElementById("direction-btn");
const cardEl = document.getElementById("card");
const cardFace = document.getElementById("card-face");
const progressText = document.getElementById("progress-text");
const answerButtons = document.getElementById("answer-buttons");
const btnAgain = document.getElementById("btn-again");
const btnKnow = document.getElementById("btn-know");

// --- État ---
let decks = [];
let currentDeck = null; // { id, title, cards }
let queue = [];         // ordre de passage des cartes (mélangé)
let currentIndex = 0;
let showingFront = true;
let direction = "kana-to-romaji"; // ou "romaji-to-kana"

// --- Stockage local de la progression (par appareil, pas synchronisé) ---
function progressKey(deckId) {
  return `flashcards-progress-${deckId}`;
}

function loadProgress(deckId) {
  try {
    const raw = localStorage.getItem(progressKey(deckId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(deckId, progress) {
  try {
    localStorage.setItem(progressKey(deckId), JSON.stringify(progress));
  } catch (e) {
    console.warn("Impossible de sauvegarder la progression :", e);
  }
}

// --- Chargement des decks disponibles ---
async function init() {
  const res = await fetch("../data/decks/index.json");
  decks = await res.json();

  deckSelect.innerHTML = decks
    .map((d) => `<option value="${d.id}">${d.title}</option>`)
    .join("");

  deckSelect.addEventListener("change", () => loadDeck(deckSelect.value));
  await loadDeck(decks[0].id);
}

async function loadDeck(deckId) {
  const meta = decks.find((d) => d.id === deckId);
  const res = await fetch(`../data/${meta.file}`);
  const data = await res.json();
  currentDeck = { id: meta.id, title: meta.title, cards: data.cards };

  buildQueue();
  currentIndex = 0;
  showingFront = true;
  renderCard();
}

// Priorise les cartes marquées "à revoir" en les remettant plus souvent dans la pile
function buildQueue() {
  const progress = loadProgress(currentDeck.id);
  const cards = [...currentDeck.cards];

  // mélange simple (Fisher-Yates)
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  // les cartes jamais sues passent en premier
  cards.sort((a, b) => (progress[a.id]?.known ? 1 : 0) - (progress[b.id]?.known ? 1 : 0));

  queue = cards;
}

function renderCard() {
  if (!queue.length) return;

  if (currentIndex >= queue.length) {
    buildQueue();
    currentIndex = 0;
  }

  const card = queue[currentIndex];
  const front = direction === "kana-to-romaji" ? card.front : card.back;
  const back = direction === "kana-to-romaji" ? card.back : card.front;

  cardEl.dataset.front = front;
  cardEl.dataset.back = back;
  cardFace.textContent = front;
  showingFront = true;
  answerButtons.hidden = true;

  const progress = loadProgress(currentDeck.id);
  const knownCount = currentDeck.cards.filter((c) => progress[c.id]?.known).length;
  progressText.textContent = `${knownCount} / ${currentDeck.cards.length} sues — carte ${currentIndex + 1}/${queue.length}`;
}

function flipCard() {
  showingFront = !showingFront;
  cardFace.textContent = showingFront ? cardEl.dataset.front : cardEl.dataset.back;
  answerButtons.hidden = showingFront;
}

function markCard(known) {
  const card = queue[currentIndex];
  const progress = loadProgress(currentDeck.id);
  progress[card.id] = { known };
  saveProgress(currentDeck.id, progress);

  currentIndex++;
  renderCard();
}

// --- Événements ---
cardEl.addEventListener("click", flipCard);
cardEl.addEventListener("keydown", (e) => {
  if (e.key === " " || e.key === "Enter") flipCard();
});

btnAgain.addEventListener("click", () => markCard(false));
btnKnow.addEventListener("click", () => markCard(true));

directionBtn.addEventListener("click", () => {
  direction = direction === "kana-to-romaji" ? "romaji-to-kana" : "kana-to-romaji";
  directionBtn.textContent =
    direction === "kana-to-romaji" ? "Sens : Kana → Romaji" : "Sens : Romaji → Kana";
  renderCard();
});

// --- Enregistrement du service worker (comme sur la page d'accueil) ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("../service-worker.js").catch(console.error);
  });
}

init();
