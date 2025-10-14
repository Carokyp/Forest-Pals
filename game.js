document.addEventListener("DOMContentLoaded", () => {
  /** Prevent background scroll and drag on the whole page */
  document.body.style.overflow = "hidden";
  document.addEventListener("wheel", (e) => e.preventDefault(), {
    passive: false,
  });
  document.addEventListener("touchmove", (e) => e.preventDefault(), {
    passive: false,
  });
  document.addEventListener("dragstart", (e) => e.preventDefault());

  // Get references to buttons and sections
  const startBtn = document.getElementById("start-btn");
  const howToPlayBtn = document.getElementById("how-to-play-btn");
  const gameTitle = document.getElementById("game-title");
  const menu = document.getElementById("menu");

  /** Array to hold references to different sections of the game */
  const sections = [
    document.getElementById("menu"),
    document.getElementById("how-to-play-area"),
    document.getElementById("game-area"),
  ];

  /** Array of card objects, each with an id, name, and image path */
  const cards = [
    { id: 1, name: "bird", image: "images/cards/bird.png" },
    { id: 2, name: "deer", image: "images/cards/deer.png" },
    { id: 3, name: "fox", image: "images/cards/fox.png" },
    { id: 4, name: "hedgehog", image: "images/cards/hedgehog.png" },
    { id: 5, name: "rabbit", image: "images/cards/rabbit.png" },
    { id: 6, name: "squirrel", image: "images/cards/squirrel.png" },
  ];

  /**
   * function to hide all sections and show a specific section
   */
  function show(section) {
    sections.forEach((element) => (element.style.display = "none"));
    section.style.display = "flex";
  }

  /**
   * --- CREATE PLAYER FORM ---
   * Dynamically generates the form where the player enters their name
   * before starting the game.
   */

  function createForm() {
    const form = document.createElement("form");
    form.setAttribute("id", "player-form");

    // Text instruction
    const paragraph = document.createElement("p");
    paragraph.setAttribute("id", "form-instruction");
    paragraph.textContent = "Enter your name to start the game!";

    // Input field
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.classList.add("player-input");

    // Submit button
    const submit = document.createElement("input");
    submit.setAttribute("type", "submit");
    submit.setAttribute("value", "Start Game");
    submit.classList.add("submit-btn");

    // Back button
    const backBtn = document.createElement("button");
    backBtn.setAttribute("type", "button");
    backBtn.textContent = "Back";
    backBtn.classList.add("back-btn-form");

    // container both buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-row");
    buttonContainer.append(submit, backBtn);

    // Add elements to the form
    form.append(paragraph, input, buttonContainer);

    /**
     * Handles Back button click:
     * returns user to main menu and removes the form.
     */
    backBtn.addEventListener("click", () => {
      startBtn.style.display = "block";
      howToPlayBtn.style.display = "block";
      gameTitle.style.display = "block";
      show(sections[0]);

      const existingForm = document.getElementById("player-form");
      if (existingForm) existingForm.remove();
    });

    /**
     * Handles form submission:
     * - if input is empty → show message
     * - if name is entered → go to game area
     */
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (input.value.trim() === "") {
        let existingMsg = document.querySelector(".enterNameMsg");

        if (existingMsg) existingMsg.remove();

        // Show message to enter name
        const enterNameMsg = document.createElement("div");
        enterNameMsg.textContent = "Please enter your name to start the game!";
        enterNameMsg.classList.add("enterNameMsg");
        form.appendChild(enterNameMsg);
      } else {
        show(sections[2]);
      }
    });

    return form;
  }

  /**
   * Displays the player form when the Start button is clicked.
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

  // Enable form creation on Start button click
  showForm();

  // Show "How to Play" section
  document
    .getElementById("how-to-play-btn")
    .addEventListener("click", () => show(sections[1]));

  /**
   * --- BACK BUTTONS (GENERAL) ---
   * Allows any .back-btn element to return to the main menu.
   */
  document.querySelectorAll(".back-btn").forEach((button) => {
    button.addEventListener("click", () => {
      startBtn.style.display = "block";
      howToPlayBtn.style.display = "block";
      gameTitle.style.display = "block";

      show(sections[0]);

      const form = document.getElementById("player-form");
      if (form) form.remove();

      const grid = document.getElementById("grid-container");
      if (grid) grid.remove();
      generateBoard();
    });
  });

  /**
   * --- GAME BOARD GENERATION ---
   * Duplicates all cards to create pairs,
   * shuffles them, and displays them inside the grid container.
   */

  function generateBoard() {
    const gameArea = document.getElementById("game-area");

    const bottomHUD = document.createElement("div");
    bottomHUD.setAttribute("id", "bottom-hud");

    const scoreDisplay = document.createElement("div");
    scoreDisplay.setAttribute("id", "score");
    scoreDisplay.textContent = "Score: 0";
    bottomHUD.appendChild(scoreDisplay);

    const timerDisplay = document.createElement("div");
    timerDisplay.setAttribute("id", "timer");
    timerDisplay.textContent = "Time: 00:00";
    bottomHUD.appendChild(timerDisplay);

    gameArea.appendChild(bottomHUD);

    const gridContainer = document.createElement("div");
    gridContainer.setAttribute("id", "grid-container");
    gameArea.appendChild(gridContainer);

    const cardsPairs = [...cards, ...cards];

    // Shuffle card
    for (let i = cardsPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardsPairs[i], cardsPairs[j]] = [cardsPairs[j], cardsPairs[i]];
    }

    // Create card elements
    cardsPairs.forEach((cardData) => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");
      cardElement.setAttribute("data-id", cardData.id);

      const img = document.createElement("img");
      img.src = cardData.image;
      img.alt = cardData.name;
      img.classList.add("card-img");

      cardElement.appendChild(img);
      gridContainer.appendChild(cardElement);
    });
  }
  generateBoard();
});
