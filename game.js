document.addEventListener("DOMContentLoaded", () => {
  // ============================================================================
  // CONFIGURATION & CONSTANTS
  // ============================================================================

  /** Array of card objects, each with an id, name, and image path */
  const CARDS = [
    { id: 1, name: "bird", image: "images/cards/bird.png" },
    { id: 2, name: "deer", image: "images/cards/deer.png" },
    { id: 3, name: "fox", image: "images/cards/fox.png" },
    { id: 4, name: "hedgehog", image: "images/cards/hedgehog.png" },
    { id: 5, name: "rabbit", image: "images/cards/rabbit.png" },
    { id: 6, name: "squirrel", image: "images/cards/squirrel.png" },
  ];

  /** Raccoon speech lines for each animal */
  const RACCOON_LINES = {
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
      "Aww! The Hedgehogs are rolling together",
      "The Hedgehogs are hugging again!",
    ],
    rabbit: [
      "Hop hop hooray! The Rabbits are reunited!",
      "Carrots for everyone! The Rabbits are home!",
    ],
    squirrel: [
      "The Squirrels are nuts about this match!",
      "The acorn team, the Squirrels are here!",
    ],
  };

  const TOTAL_PAIRS = 6;
  const MATCH_DELAY = 300;
  const NO_MATCH_DELAY = 600;
  const SPEECH_DURATION = 30000;
  const END_SCREEN_DELAY = 2000;
  const MAX_HIGHSCORES = 5;

  // ============================================================================
  // DOM REFERENCES
  // ============================================================================

  const startBtn = document.getElementById("start-btn");
  const howToPlayBtn = document.getElementById("how-to-play-btn");
  const gameTitle = document.getElementById("game-title");
  const menu = document.getElementById("menu");

  /** Array to hold references to different sections of the game */
  const sections = [
    document.getElementById("menu"),
    document.getElementById("how-to-play-area"),
    document.getElementById("player-form-area"),
    document.getElementById("game-area"),
    document.getElementById("end-screen"),
  ];

  // ============================================================================
  // STATE VARIABLES
  // ============================================================================

  let playerName = "";
  let flippedCards = [];
  let lockBoard = false;
  let score = 0;
  let timerInterval = null;
  let timeElapsed = 0;

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Hide all sections and show a specific section
   * Compatible with Bootstrap classes
   */
  function showSection(section) {
    sections.forEach((element) => {
      element.classList.add("d-none");
      element.style.visibility = "hidden";
      element.style.display = "none";
    });

    section.classList.remove("d-none");
    section.style.visibility = "visible";
    section.style.display = "grid";
  }

  // ============================================================================
  // FORM CREATION
  // ============================================================================

  /**
   * Dynamically generates the form where the player enters their name
   * before starting the game.
   */
  function createPlayerNameForm() {
    const form = document.createElement("form");
    form.setAttribute("id", "player-form");
    form.classList.add("p-4", "rounded-4");

    // Text instruction
    const paragraph = document.createElement("p");
    paragraph.setAttribute("id", "form-instruction");
    paragraph.textContent = "Enter your name to start the game!";
    paragraph.classList.add("text-center", "fw-bold", "mb-3");

    // Input field
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.classList.add("player-input", "rounded-3", "px-2");
    input.classList.add("form-control", "form-control-lg", "rounded-2", "mb-3");
    input.setAttribute("placeholder", "Your Name...");

    // Submit button
    const submit = document.createElement("input");
    submit.setAttribute("type", "submit");
    submit.setAttribute("value", "Start Game");
    submit.classList.add("submit-btn");
    submit.classList.add("btn", "btn-secondary", "py-2", "px-3", "fw-bold");

    // Back button
    const backBtn = document.createElement("button");
    backBtn.setAttribute("type", "button");
    backBtn.textContent = "Back";
    backBtn.classList.add("back-btn-form", "back-btn");
    backBtn.classList.add("btn", "btn-secondary", "py-2", "px-3", "fw-bold");

    // Container for both buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-row");
    buttonContainer.classList.add(
      "d-flex",
      "justify-content-center",
      "gap-3",
      "mb-2"
    );
    buttonContainer.append(submit, backBtn);

    // Add elements to the form
    form.append(paragraph, input, buttonContainer);

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
        const msgWrapper = document.createElement("div");
        msgWrapper.classList.add("d-flex", "justify-content-center", "mb-0");

        const enterNameMsg = document.createElement("div");
        enterNameMsg.textContent = "Please enter your name to start the game!";
        enterNameMsg.classList.add(
          "enterNameMsg",
          "px-3",
          "mb-3",
          "py-2",
          "text-center",
          "rounded-2",
          "fw-medium"
        );

        msgWrapper.appendChild(enterNameMsg);
        form.insertBefore(msgWrapper, buttonContainer);
      } else {
        playerName = input.value.trim();
        showSection(sections[3]);
        resetGame();
      }
    });

    return form;
  }

  // ============================================================================
  // GAME BOARD GENERATION
  // ============================================================================

  /**
   * Duplicates all cards to create pairs,
   * shuffles them, and displays them inside the grid container.
   */
  function generateBoard() {
    const gameArea = document.getElementById("game-area");

    gameArea.innerHTML = "";

    // --- TOP HUD ---
    const topHUD = document.createElement("div");
    topHUD.setAttribute("id", "top-hud");

    // --- LEFT side (back button) ---
    const leftHUD = document.createElement("div");
    leftHUD.classList.add("left-hud");

    const backBtn = document.createElement("button");
    backBtn.classList.add("back-btn", "btn", "btn-secondary", "fw-bold");
    backBtn.textContent = "Back";

    // ajoute le bouton dans la partie gauche
    leftHUD.appendChild(backBtn);

    // --- RIGHT side (score + timer) ---
    const rightHUD = document.createElement("div");
    rightHUD.classList.add("right-hud");

    const scoreDisplay = document.createElement("div");
    scoreDisplay.setAttribute("id", "score");
    scoreDisplay.textContent = "Score: 0 / 6";

    const timerDisplay = document.createElement("div");
    timerDisplay.setAttribute("id", "timer");
    timerDisplay.textContent = "Time: 00:00";

    // ajoute score et timer à la partie droite
    rightHUD.append(scoreDisplay, timerDisplay);

    // assemble tout dans le HUD principal
    topHUD.append(leftHUD, rightHUD);
    gameArea.appendChild(topHUD);

    // Grid container for cards using CSS Grid
    const gridContainer = document.createElement("div");
    gridContainer.setAttribute("id", "grid-container");
    gridContainer.classList.add("card-grid");
    gameArea.appendChild(gridContainer);

    const raccoon = document.createElement("img");
    raccoon.id = "raccoon-game-area";
    raccoon.src = "images/raccoon/raccoon1.png";
    raccoon.alt = "Raccoon wearing glasses waving cheerfully to the player";
    raccoon.classList.add("img-fluid");
    gameArea.appendChild(raccoon);

    const cardsPairs = [...CARDS, ...CARDS];

    // Shuffle card
    for (let i = cardsPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardsPairs[i], cardsPairs[j]] = [cardsPairs[j], cardsPairs[i]];
    }

    // Create card elements
    cardsPairs.forEach((cardData) => {
      // Create card element directly (no Bootstrap classes needed)
      const cardElement = document.createElement("div");
      cardElement.classList.add("game-card");
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

      // Add the card directly to the CSS grid container
      gridContainer.appendChild(cardElement);

      // Add flip effect on click
      cardElement.addEventListener("click", () => handleCardClick(cardElement));
    });

    startTimer();
  }

  // ============================================================================
  // CARD FLIPPING LOGIC
  // ============================================================================

  /**
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
    
    lockBoard = true;

    if (isMatch) {
      handleMatch(firstCard, secondCard);
    } else {
      handleNoMatch(firstCard, secondCard);
    }

    if (score === TOTAL_PAIRS) {
      completeGame();
    }
  }

  function handleMatch(firstCard, secondCard) {
    score++;
    const scoreDisplay = document.getElementById("score");
    scoreDisplay.textContent = `Score: ${score} / ${TOTAL_PAIRS}`;

    const animalName = firstCard.querySelector(".card-front").alt;
    const lines = RACCOON_LINES[animalName];
    const randomLine = lines[Math.floor(Math.random() * lines.length)];

    showRaccoonSpeech(randomLine);

    firstCard.style.pointerEvents = "none";
    secondCard.style.pointerEvents = "none";

    flippedCards = [];
    setTimeout(() => {
      lockBoard = false;
    }, MATCH_DELAY);
  }

  function handleNoMatch(firstCard, secondCard) {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      flippedCards = [];
      lockBoard = false;
    }, NO_MATCH_DELAY);
  }

  function completeGame() {
    stopTimer();
    showRaccoonSpeech(`You did it, ${playerName}! You found all my friends!`);

    setTimeout(() => {
      showEndScreen();
    }, END_SCREEN_DELAY);
  }

  // ============================================================================
  // RACCOON SPEECH BUBBLE
  // ============================================================================

  function showRaccoonSpeech(message) {
    const gameArea = document.getElementById("game-area");

    let bubbleContainer = document.querySelector(".speech-bubble-container");
    if (!bubbleContainer) {
      bubbleContainer = document.createElement("div");
      bubbleContainer.className = "speech-bubble-container";
      gameArea.appendChild(bubbleContainer);
    }

    bubbleContainer.innerHTML = "";

    const speechBubble = document.createElement("div");
    speechBubble.id = "speech-bubble";
    speechBubble.textContent = message;
    speechBubble.classList.add(
      "alert",
      "text-center",
      "fw-bold",
      "rounded-pill",
      "shadow-sm",
      "border-0"
    );

    bubbleContainer.appendChild(speechBubble);

    setTimeout(() => {
      speechBubble.remove();
    }, SPEECH_DURATION);
  }

  // ============================================================================
  // TIMER FUNCTIONS
  // ============================================================================

  function startTimer() {
    const timerDisplay = document.getElementById("timer");
    timeElapsed = 0;

    if (timerInterval) clearInterval(timerInterval);

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

  // ============================================================================
  // GAME RESET & END SCREEN
  // ============================================================================

  function resetGame() {
    const grid = document.getElementById("grid-container");
    if (grid) grid.remove();

    const hud = document.querySelector(".end-buttons");
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

  function showEndScreen() {
    const finalTime = document.getElementById("timer")
      ? document.getElementById("timer").textContent.replace("Time: ", "")
      : "00:00";

    const grid = document.getElementById("grid-container");
    if (grid) grid.remove();
    
    const hud = document.getElementsByClassName("end-buttons");
    if (hud) hud.remove();

    showSection(sections[4]);

    const playerNameElement = document.getElementById("player-name");
    const playerTimeElement = document.getElementById("player-time");
    const highscoresList = document.getElementById("highscores-list");

    playerNameElement.textContent = playerName;
    playerTimeElement.textContent = finalTime;

    console.log("Player name set to:", playerName);
    console.log("Player time set to:", finalTime);

    saveAndDisplayHighscores(playerName, finalTime, highscoresList);
  }

  function saveAndDisplayHighscores(name, time, highscoresList) {
    const existingScores = Array.from(
      highscoresList.querySelectorAll("li")
    ).map((li) => {
      const name = li.querySelector(".hs-name").textContent;
      const time = li.querySelector(".hs-time").textContent;
      return { name, time };
    });

    existingScores.push({ name, time });

    const toSeconds = (t) => {
      const [m, s] = t.split(":").map(Number);
      return m * 60 + s;
    };

    existingScores.sort((a, b) => toSeconds(a.time) - toSeconds(b.time));

    const top5 = existingScores.slice(0, MAX_HIGHSCORES);

    highscoresList.innerHTML = "";
    top5.forEach((entry, index) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="hs-name">${entry.name}</span> — <span class="hs-time">${entry.time}</span>`;

      if (entry.name === name && entry.time === time) {
        li.classList.add("highlight");
      }

      highscoresList.appendChild(li);
      console.log(`Position ${index + 1}: ${entry.name} - ${entry.time}`);
    });

    localStorage.setItem("forestPalsHighscores", JSON.stringify(top5));
  }

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Universal click handler for all buttons using event delegation
   */
  function handleButtonClick(e) {
    // Start Game button
    if (e.target && e.target.id === "start-btn") {
      howToPlayBtn.style.display = "none";
      gameTitle.style.display = "none";
      startBtn.style.display = "none";

      const form = createPlayerNameForm();
      const playerFormArea = document.getElementById("player-form-area");
      const raccoon = document.getElementById("raccoon");

      const existingForm = document.getElementById("player-form");
      if (existingForm) existingForm.remove();
      
      if (raccoon && playerFormArea.contains(raccoon)) {
        playerFormArea.insertBefore(form, raccoon);
      } else {
        playerFormArea.appendChild(form);
      }
      showSection(sections[2]);
    }

    // How to Play button
    if (e.target && e.target.id === "how-to-play-btn") {
      console.log("How to Play button clicked!");
      showSection(sections[1]);
    }

    // Back buttons
    if (e.target && e.target.classList.contains("back-btn")) {
      startBtn.style.display = "block";
      howToPlayBtn.style.display = "block";
      gameTitle.style.display = "block";
      showSection(sections[0]);

      if (e.target.classList.contains("back-btn-form")) {
        const existingForm = document.getElementById("player-form");
        if (existingForm) existingForm.remove();
      }
    }

    // End screen buttons
    if (e.target && e.target.id === "retry-btn") {
      console.log("Retry button clicked!");
      showSection(sections[3]);
      resetGame();
    }

    if (e.target && e.target.id === "main-menu-btn") {
      console.log("Main menu button clicked!");
      startBtn.style.display = "block";
      howToPlayBtn.style.display = "block";
      gameTitle.style.display = "block";
      showSection(sections[0]);
      playerName = "";
    }
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /** Prevent background scroll and drag on the whole page */
  document.body.style.overflow = "hidden";
  document.addEventListener("wheel", (e) => e.preventDefault(), {
    passive: false,
  });
  document.addEventListener("touchmove", (e) => e.preventDefault(), {
    passive: false,
  });
  document.addEventListener("dragstart", (e) => e.preventDefault());

  /** Event Listeners */
  document.addEventListener("click", handleButtonClick);

  /** Initialize game */
  showSection(sections[0]);
  generateBoard();
});
