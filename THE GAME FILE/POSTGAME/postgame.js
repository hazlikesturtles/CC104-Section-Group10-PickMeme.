const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const won = params.get("result") === "win";
const left = params.get("left") || 0;

document.body.classList.add(won ? "win" : "lose");
$("title").textContent = won ? "Congratulations!" : "Better luck next time!";
$("detail").textContent = won
  ? `You found every pair with ${left}s to spare.`
  : "Time ran out before you found every pair.";

// Play Again? Yes -> back to Difficulty Selection
$("btn-yes").addEventListener("click", () => {
  location.href = "../pregame/pregame.html?step=difficulty";
});

// No -> Exit / END
$("btn-no").addEventListener("click", () => {
  $("screen-result").hidden = true;
  $("screen-exit").hidden = false;
  window.close();
});
