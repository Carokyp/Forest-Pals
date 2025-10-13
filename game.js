document.addEventListener("DOMContentLoaded", () => {

  // Get references to buttons and sections
  const startBtn = document.getElementById("start-btn");
  const howToPlayBtn = document.getElementById("how-to-play-btn");
  const gameTitle = document.getElementById("game-title");
  const menu = document.getElementById("menu");

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

  /**
   * function that create a form so the user can enter their name and start the game
   */

  function createForm() {
    const form = document.createElement("form");
    form.setAttribute("id", "player-form");

    const paragraph = document.createElement("p");
    paragraph.setAttribute("id", "form-instruction");
    paragraph.textContent = "Enter your name to start the game!";

    const input = document.createElement("input");
    input.setAttribute("type", "text");

    const submit = document.createElement("input");
    submit.setAttribute("type", "submit");
    submit.setAttribute("value", "Start Game");

    const backBtn = document.createElement("button");
    backBtn.setAttribute("type", "button");
    backBtn.textContent = "Back";
    backBtn.classList.add("back-btn");
    
    backBtn.addEventListener("click", () => {
      startBtn.style.display = "block";
      howToPlayBtn.style.display = "block";
      gameTitle.style.display = "block";

      show(sections[0]);

      const form = document.getElementById("player-form");
      if (form) form.remove();
    });

    form.appendChild(paragraph);
    form.appendChild(input);
    form.appendChild(submit);
    form.appendChild(backBtn);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      show(sections[2]);
    });

    return form;
  }

  /**
   * function to show the form when start button is clicked
   */

  function showForm() {
    startBtn.addEventListener("click", () => {
      howToPlayBtn.style.display = "none";
      gameTitle.style.display = "none";
      startBtn.style.display = "none";

      const form = createForm();
      menu.appendChild(form);
    });
  }

  // Show the menu first
  show(sections[0]);

  // Show form when start button is clicked
  showForm();

  // How to Play and back buttons
  document
    .getElementById("how-to-play-btn")
    .addEventListener("click", () => show(sections[1]));

  document.querySelectorAll(".back-btn").forEach((button) => {
    button.addEventListener("click", () => {
      startBtn.style.display = "block";
      howToPlayBtn.style.display = "block";
      gameTitle.style.display = "block";

      show(sections[0]);

      const form = document.getElementById("player-form");
      if (form) form.remove();
    });
  });

});
