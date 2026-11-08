const $ = (id) => document.getElementById(id);
const screens = ["screen-start", "screen-difficulty", "screen-exit"];

function show(id) {
  screens.forEach((s) => ($(s).hidden = s !== id));
}

// Play Again from the post-game screen lands straight on difficulty selection
if (new URLSearchParams(location.search).get("step") === "difficulty") {
  show("screen-difficulty");
}

$("btn-play").addEventListener("click", () => show("screen-difficulty"));
$("btn-exit").addEventListener("click", () => {
  show("screen-exit");
  window.close(); // only works if the tab was opened by a script
});

document.querySelectorAll(".diff").forEach((btn) => {
  btn.addEventListener("click", () => {
    location.href = `../ingame/ingame.html?d=${btn.dataset.diff}`;
  });
});
