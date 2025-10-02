document.addEventListener("DOMContentLoaded", () => {
  // Array to hold references to different sections of the game
  const sections = [
    document.getElementById("menu"),
    document.getElementById("how-to-play-area"),
    document.getElementById("game-area"),
  ];

  /**
   * function to hide all sections and show a specific section
   */

  function show(section) {
    sections.forEach((element) => (element.style.display = "none"));
    section.style.display = "flex";
  }

  // Start and How to Play buttons
  document
    .getElementById("start-btn")
    .addEventListener("click", () => show(sections[2]));
  document
    .getElementById("how-to-play-btn")
    .addEventListener("click", () => show(sections[1]));

  // Back buttons
  document.querySelectorAll("#back-btn").forEach((button) => {
    button.addEventListener("click", () => show(sections[0]));
  });

  // Show the menu first
  show(sections[0]);
});
