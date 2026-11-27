// 6 values x 2 = 12 cards (4 x 3 grid). dito niyo i rereplace yung mga emojis into memes
// e.g. '<img src="memes/doge.png" alt="Doge">'
const MEMES = [
    '<img src="../Assets/67.jpg" alt="67">',
    '<img src="../Assets/Alamano.png" alt="Alamano">',
    '<img src="../Assets/Andito%20na%20si%20bong%20revilia.jpg" alt="Andito na si bong revilia">',
    '<img src="../Assets/Anlala.jpg" alt="Anlala">',
    '<img src="../Assets/Aray%20ko.jpg" alt="Aray ko">',
    '<img src="../Assets/Baka%20renejay%20to.png" alt="Baka renejay to">',
    '<img src="../Assets/Batang%20pasawayyyy.jpg" alt="Batang pasawayyyy">',
    '<img src="../Assets/Bigyan%20ng%20jacket%20yan.jpg" alt="Bigyan ng jacket yan">',
    '<img src="../Assets/Bulalord.png" alt="Bulalord">',
    '<img src="../Assets/Burst%20fade%20parin%20to%20ya.png" alt="Burst fade parin to ya">',
    '<img src="../Assets/Caloocan%20boy.jpg" alt="Caloocan boy">',
    '<img src="../Assets/Coke%20tota%20tola.png" alt="Coke tota tola">',
    '<img src="../Assets/Depende%20kung%203%20yan.jpg" alt="Depende kung 3 yan">',
    '<img src="../Assets/HOY!%20Walang%20kaninboseng.png" alt="HOY! Walang kaninboseng">',
    '<img src="../Assets/Happy%20New%20year%20Ibriwan.jpg" alt="Happy New year Ibriwan">'
];

// CHANGED: Added the number of pairs per difficulty
const DIFFICULTIES = {
    easy: { pairs: 9, time: 90 },
    normal: { pairs: 12, time: 60 },
    hard: { pairs: 15, time: 40 }
};

const params = new URLSearchParams(location.search);
const diff = DIFFICULTIES[params.get("d")] ? params.get("d") : "normal";

// NEW: Get selected difficulty settings
const settings = DIFFICULTIES[diff];
const gameMemes = MEMES.slice(0, settings.pairs);

const total = settings.time;

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

  // CHANGED: Generate cards based on selected difficulty
const deck = shuffle([...gameMemes, ...gameMemes]);

// NEW: Set the correct board layout
board.className = diff;
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
   // CHANGED: Check pairs based on selected difficulty
if (found === gameMemes.length) finish("win");
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
  // CHANGED: Display the correct number of matching pairs
pairsEl.textContent = `${found} / ${gameMemes.length} pairs`;
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
