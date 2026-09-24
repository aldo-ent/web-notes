// Rendu markdown via markdown-it (hébergé localement dans lib/), puis
// détection et rendu des formules LaTeX ($...$ et $$...$$) via KaTeX.
const md = window.markdownit();

async function loadNotes(filePath, targetId) {
  const target = document.getElementById(targetId);
  try {
    const res = await fetch(filePath);
    const text = await res.text();
    target.innerHTML = md.render(text);

    renderMathInElement(target, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
      throwOnError: false,
    });
  } catch (e) {
    target.innerHTML = "<p>Impossible de charger les notes.</p>";
    console.error(e);
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("../service-worker.js").catch(console.error);
  });
}
