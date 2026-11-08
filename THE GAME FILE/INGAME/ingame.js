// Replace these emojis with your meme images, e.g. '<img src="memes/doge.png" alt="Doge">'
const MEMES = ["🐸", "🐶", "😹", "🗿", "💀", "🔥", "🤡", "👽"];
const TIMERS = { easy: 90, normal: 60, hard: 40 }; // seconds

const params = new URLSearchParams(location.search);
const diff = TIMERS[params.get("d")] ? params.get("d") : "normal";
const total = TIMERS[diff];

const board = document.getElementById("board");
const timeEl = document.getElementById("time");
const pairsEl = document.getElementById("pairs");
const fill = document.getElementById("bar-fill");
document.getElementById("level").textContent = diff[0].toUpperCase() + diff.slice(1);

let first = null;      // first selected card
let locked = false;    // blocks input while two cards are being compared
let found = 0;
let remaining = total;
let ended = false;

// Game starts: cards face down
const deck = [...MEMES, ...MEMES].sort(() => Math.random() - 0.5);
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

// Player selects a card / second card
function pick(card) {
  if (locked || ended || card === first || card.classList.contains("matched")) return;
  card.classList.add("flipped");

  if (!first) { first = card; return; }

  locked = true;
  const second = card;
  if (first.dataset.meme === second.dataset.meme) {
    // Pair found: cards stay revealed
    [first, second].forEach((c) => { c.classList.remove("flipped"); c.classList.add("matched"); });
    found++;
    updateHud();
    first = null; locked = false;
    if (found === MEMES.length) finish("win");
  } else {
    // No match: cards flip back over
    setTimeout(() => {
      first.classList.remove("flipped");
      second.classList.remove("flipped");
      first = null; locked = false;
    }, 800);
  }
}

// Timer runs out? -> lose
const tick = setInterval(() => {
  if (ended) return;
  remaining--;
  updateHud();
  if (remaining <= 0) finish("lose");
}, 1000);

function updateHud() {
  timeEl.textContent = remaining + "s";
  pairsEl.textContent = `${found} / ${MEMES.length} pairs`;
  fill.style.width = (remaining / total) * 100 + "%";
  fill.classList.toggle("low", remaining <= 10);
}

// Go to Post-Game
function finish(result) {
  ended = true;
  clearInterval(tick);
  setTimeout(() => {
    location.href = `../postgame/postgame.html?result=${result}&d=${diff}&left=${Math.max(remaining, 0)}`;
  }, 700);
}
