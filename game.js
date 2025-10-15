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

  const raccoonLines = {
    bird: [
      "You found the birds what a sweet tune!",
      "Tweet tweet! You matched the birds!",
    ],
    deer: [
      "Oh Deer! What a graceful match!",
      "You did it! My Deer friends found each other!",
    ],
    fox: [
      "Swift and smart the Fox is back together!",
      "Quick as a flash! You found the Foxes!",
    ],
    hedgehog: [
      "Aww! The Hedgehogs are rolling together again!",
      "Watch your paws! The Hedgehogs are hugging again!",
    ],
    rabbit: [
      "Hop hop hooray! The Rabbits are reunited!",
      "Carrots for everyone! The Rabbits are home!",
    ],
    squirrel: [
      "The Squirrels are nuts about this match!",
      "The acorn team, the Squirrels are back together!",
    ],
  };

  // Player name
  let playerName = "";

  // To track flipped cards
  let flippedCards = [];
  let lockBoard = false; // To prevent clicking more than 2 cards at a time

  // player score
  let score = 0;

  // Timer variables
  let timerInterval = null; // interval for the timer
  let timeElapsed = 0; // time elapsed in seconds

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
        playerName = input.value.trim();
        show(sections[2]);
        resetGame();
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
    });
  });

  /**
   * --- GAME BOARD GENERATION ---
   * Duplicates all cards to create pairs,
   * shuffles them, and displays them inside the grid container.
   */

  function generateBoard() {
    const gameArea = document.getElementById("game-area");
    // Bottom HUD for score and timer
    const bottomHUD = document.createElement("div");
    bottomHUD.setAttribute("id", "bottom-hud");
    // Score and timer display
    const scoreDisplay = document.createElement("div");
    scoreDisplay.setAttribute("id", "score");
    scoreDisplay.textContent = "Score: 0 / 6";
    bottomHUD.appendChild(scoreDisplay);

    const timerDisplay = document.createElement("div");
    timerDisplay.setAttribute("id", "timer");
    timerDisplay.textContent = "Time: 00:00";
    bottomHUD.appendChild(timerDisplay);

    gameArea.appendChild(bottomHUD);

    // Grid container for cards
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

      // Front and back images
      const front = document.createElement("img");
      front.src = cardData.image;
      front.alt = cardData.name;
      front.classList.add("card-front");

      const back = document.createElement("img");
      back.src = "images/cards/back.png";
      back.alt = "Card back";
      back.classList.add("card-back");

      cardElement.appendChild(front);
      cardElement.appendChild(back);
      gridContainer.appendChild(cardElement);

      // Add flip effect on click
      cardElement.addEventListener("click", () => handleCardClick(cardElement));
    });

    startTimer();
  }
  generateBoard();

  /**
   * --- CARD FLIPPING LOGIC ---
   * Manages the flipping of cards, checking for matches,
   * and resetting unmatched cards after a delay.
   */

  function handleCardClick(cardElement) {
    // Prevent clicking more than 2 cards or clicking the same card
    if (lockBoard || cardElement.classList.contains("flipped")) {
      return;
    }
    // Prevent flipping more than 2 cards
    if (flippedCards.length === 2) {
      return;
    }
    cardElement.classList.add("flipped");
    // Add card to flippedCards array
    flippedCards.push(cardElement);

    // If two cards are flipped, check for a match
    if (flippedCards.length === 2) {
      checkForMatch();
    }
  }

  function checkForMatch() {
    const [firstCard, secondCard] = flippedCards;
    const isMatch = firstCard.dataset.id === secondCard.dataset.id;

    lockBoard = true; // Lock the board while checking

    if (isMatch) {
      score++;
      const scoreDisplay = document.getElementById("score");
      scoreDisplay.textContent = `Score: ${score} / 6`;
      // Show raccoon speech bubble with a random line for the matched animal
      const animalName = firstCard.querySelector(".card-front").alt;

      // Get a random line for the matched animal
      const lines = raccoonLines[animalName];
      const randomLine = lines[Math.floor(Math.random() * lines.length)];

      raccoonSpeech(randomLine);

      // It's a match - disable further clicks
      firstCard.style.pointerEvents = "none";
      secondCard.style.pointerEvents = "none";

      flippedCards = []; // Reset for next turn
      setTimeout(() => {
        lockBoard = false;
      }, 300);
    } else {
      // Not a match - flip cards back after a short delay
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        flippedCards = []; // Reset for next turn
        lockBoard = false;
      }, 600); // 0.6s delay
    }

    if (score === 6) {
      stopTimer();
      raccoonSpeech(`You did it, ${playerName}! You found all my friends!`);
    }
  }

  function raccoonSpeech(message) {
    const gameArea = document.getElementById("game-area");
    // Remove existing speech bubble if any
    const existingBubble = document.getElementById("speech-bubble");
    if (existingBubble) existingBubble.remove();
    // Create speech bubble
    const speechBubble = document.createElement("div");
    speechBubble.setAttribute("id", "speech-bubble");
    speechBubble.textContent = message;

    gameArea.appendChild(speechBubble);

    // Remove speech bubble after 3 seconds
    setTimeout(() => {
      speechBubble.remove();
    }, 3000);
  }

  function startTimer() {
    const timerDisplay = document.getElementById("timer");
    timeElapsed = 0; // reset time elapsed

    if (timerInterval) clearInterval(timerInterval); // clear any existing interval

    timerInterval = setInterval(() => {
      timeElapsed++;
      const minutes = Math.floor(timeElapsed / 60);
      const seconds = timeElapsed % 60;
      timerDisplay.textContent = `Time: ${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function resetGame() {
    const grid = document.getElementById("grid-container");
    if (grid) grid.remove();

    const hud = document.getElementById("bottom-hud");
    if (hud) hud.remove();

    const speech = document.getElementById("speech-bubble");
    if (speech) speech.remove();

    const form = document.getElementById("player-form");
    if (form) form.remove();

    flippedCards = [];
    lockBoard = false;
    score = 0;
    stopTimer();
    timeElapsed = 0;
    generateBoard();
  }
});
