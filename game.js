document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");
  const howToPlay = document.getElementById("how-to-play-area");
  const game = document.getElementById("game-area");

  function startGame() {
    document.getElementById("start").addEventListener("click", () => {
      menu.style.display = "none";
      game.style.display = "block";
    });
  }

  function howToPlay() {
    document.getElementById("how-to-play-button").addEventListener("click", () => {
        menu.style.display = "none";
        howToPlay.style.display = "block";
      });
  }

  startGame();
  howToPlay();
});
