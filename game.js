document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");
  const howToPlayArea = document.getElementById("how-to-play-area");
  const gameArea = document.getElementById("game-area");

  // Fonction pour démarrer le jeu
  function startGame() {
    document.getElementById("start").addEventListener("click", () => {
      menu.style.display = "none";
      gameArea.style.display = "block";
    });
  }

  function howToPlayButton() {
    document
      .getElementById("how-to-play-button")
      .addEventListener("click", () => {
        menu.style.display = "none";
        howToPlayArea.style.display = "flex";
      });
  }

  function backToMenu() {
    // Bouton back de How to Play
    document
      .getElementById("back-to-menu-howto")
      .addEventListener("click", () => {
        howToPlayArea.style.display = "none";
        menu.style.display = "flex";
      });

    // Bouton back de Game Area
    document
      .getElementById("back-to-menu-game")
      .addEventListener("click", () => {
        gameArea.style.display = "none";
        menu.style.display = "flex";
      });
  }

  // Initialiser tous les boutons
  startGame();
  howToPlayButton();
  backToMenu();
});
