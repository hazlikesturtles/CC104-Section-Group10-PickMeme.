// 6 values x 2 = 12 cards (4 x 3 grid). dito niyo i rereplace yung mga emojis into memes
// e.g. '<img src="memes/doge.png" alt="Doge">'
const MEMES = ["🐸", "🐶", "😹", "🗿", "💀", "🔥"];
const TIMERS = { easy: 90, normal: 60, hard: 40 }; // seconds

const params = new URLSearchParams(location.search);
const diff = TIMERS[params.get("d")] ? params.get("d") : "normal";
const total = TIMERS[diff];

const board = document.getElementById("board");
const timeEl = document.getElementById("time");
const pairsEl = document.getElementById("pairs");
const triesEl = document.getElementById("tries");
const fill = document.getElementById("bar-fill");
document.getElementById("level").textContent = diff[0].toUpperCase() + diff.slice(1);

// Game state
let first = null;      // first selected card
let locked = false;    // blocks a third card while two are being compared
let found = 0;         // matched pairs
let attempts = 0;      // each pair of revealed cards = 1 attempt
let remaining = total;
let ended = false;
let tick = null;

// Fisher-Yates shuffle (unbiased, in place)
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Build a fresh, reshuffled, face-down board and reset everything
function startGame() {
  clearInterval(tick);
  first = null; locked = false; found = 0; attempts = 0; remaining = total; ended = false;
  board.innerHTML = "";

  const deck = shuffle([...MEMES, ...MEMES]);
  deck.forEach((meme) => {
    const card = document.createElement("button");
    card.className = "card";
    card.dataset.meme = meme;
    card.setAttribute("aria-label", "Hidden card");
    card.innerHTML = `<div class="inner"><div class="face back"></div><div class="face front">${meme}</div></div>`;
    card.addEventListener("click", () => pick(card));
    board.appendChild(card);
  });

  updateHud();
  tick = setInterval(() => {
    if (ended) return;
    remaining--;
    updateHud();
    if (remaining <= 0) finish("lose");   // timer runs out
  }, 1000);
}

// Player selects a card / second card
function pick(card) {
  // Block: third card, same card twice, already matched card
  if (locked || ended || card === first || card.classList.contains("matched")) return;
  card.classList.add("flipped");

  if (!first) { first = card; return; }

  locked = true;
  const second = card;
  attempts++;

  if (first.dataset.meme === second.dataset.meme) {
    // Pair found: cards stay revealed
    [first, second].forEach((c) => { c.classList.remove("flipped"); c.classList.add("matched"); });
    found++;
    first = null; locked = false;
    updateHud();
    if (found === MEMES.length) finish("win");
  } else {
    // No match: hide both after a short delay
    updateHud();
    setTimeout(() => {
      first.classList.remove("flipped");
      second.classList.remove("flipped");
      first = null; locked = false;
    }, 800);
  }
}

function updateHud() {
  timeEl.textContent = remaining + "s";
  pairsEl.textContent = `${found} / ${MEMES.length} pairs`;
  triesEl.textContent = `${attempts} tries`;
  fill.style.width = (remaining / total) * 100 + "%";
  fill.classList.toggle("low", remaining <= 10);
}

// Go to Post-Game
function finish(result) {
  ended = true;
  clearInterval(tick);
  setTimeout(() => {
    location.href = `../postgame/postgame.html?result=${result}&d=${diff}&left=${Math.max(remaining, 0)}&tries=${attempts}`;
  }, 700);
}

document.getElementById("restart").addEventListener("click", startGame);
startGame();
