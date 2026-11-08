const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const won = params.get("result") === "win";
const left = params.get("left") || 0;
const tries = params.get("tries") || 0;

document.body.classList.add(won ? "win" : "lose");
$("title").textContent = won ? "Congratulations!" : "Better luck next time!";
$("detail").textContent = won
  ? `You found every pair in ${tries} attempts with ${left}s to spare.`
  : `Time ran out after ${tries} attempts.`;

//  back to Difficulty Selection
$("btn-yes").addEventListener("click", () => {
  location.href = "../pregame/pregame.html?step=difficulty";
});

// Exit 
$("btn-no").addEventListener("click", () => {
  $("screen-result").hidden = true;
  $("screen-exit").hidden = false;
  window.close();
});
