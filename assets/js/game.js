/**
 * Initializes the Forest Pals memory game once the DOM is fully loaded.
 * 
 * This callback function:
 * - Declares game configuration, constants, and shared state
 * - Defines all UI and game-logic functions
 * - Wires up global event listeners
 * - Shows the initial menu screen
 * 
 * @listens document#DOMContentLoaded
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", () => {

  // ============================================================================
  // CONFIGURATION & CONSTANTS
  // ============================================================================

  /** Array of card objects, each with an id, name, and image path */
  const CARDS = [
    { id: 1, name: "bird", image: "assets/images/cards/bird.png" },
    { id: 2, name: "deer", image: "assets/images/cards/deer.png" },
    { id: 3, name: "fox", image: "assets/images/cards/fox.png" },
    { id: 4, name: "hedgehog", image: "assets/images/cards/hedgehog.png" },
    { id: 5, name: "rabbit", image: "assets/images/cards/rabbit.png" },
    { id: 6, name: "squirrel", image: "assets/images/cards/squirrel.png" },
  ];

  /**
   * Raccoon speech lines for each time the player makes a match.
   * Different lines are shown depending on the animal matched.
   * @type {Object.<string, string[]>}
   */
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

  /** @type {number} Total number of card pairs to match */
  const TOTAL_PAIRS = 6;
  /** @type {number} Delay in ms before handling a successful match */
  const MATCH_DELAY = 300;
  /** @type {number} Delay in ms before flipping cards back on mismatch */
  const NO_MATCH_DELAY = 600;
  /** @type {number} Duration in ms to display raccoon speech bubbles */
  const SPEECH_DURATION = 3000;
  /** @type {number} Delay in ms before showing end screen */
  const END_SCREEN_DELAY = 2000;
  /** @type {number} Maximum number of highscores to store */
  const MAX_HIGHSCORES = 5;

  // ============================================================================
  // DOM REFERENCES
  // ============================================================================

  const startBtn = document.getElementById("start-btn");
  const howToPlayBtn = document.getElementById("how-to-play-btn");
  const gameTitle = document.getElementById("game-title");

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

  /** @type {string} Current player's name */
  let playerName = "";
  /** @type {HTMLElement[]} Array of currently flipped card elements */
  let flippedCards = [];
  /** @type {boolean} Flag to prevent card interactions during evaluation */
  let lockBoard = false;
  /** @type {number} Number of pairs matched so far */
  let score = 0;
  /** @type {number|null} Interval ID for the game timer */
  let timerInterval = null;
  /** @type {number} Total seconds elapsed in the current game */
  let timeElapsed = 0;

  // ============================================================================
  // EVENT LISTENER REGISTRATION
  // ============================================================================
  // Global event delegation for buttons/controls
  document.addEventListener("click", handleButtonClick);
  // Prevent background scroll/drag interactions across the app
  document.addEventListener("wheel", (e) => e.preventDefault(), {
    passive: false,
  });
  document.addEventListener("touchmove", (e) => e.preventDefault(), {
    passive: false,
  });
  document.addEventListener("dragstart", (e) => e.preventDefault());

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Shows one section and hides the rest.
   *
   * Behavior:
   * - Applies Bootstrap-compatible hiding (adds d-none) and also sets
   *   inline style properties (visibility/display) to ensure sections are
   *   completely hidden from layout and accessibility trees.
   * - Displays the requested section as a CSS grid to match the layout.
   *
   * @param {HTMLElement} sectionEl - The section element to show.
   * @returns {void}
   */
  function showSection(sectionEl) {
    sections.forEach((element) => {
      element.classList.add("d-none");
      element.style.visibility = "hidden";
      element.style.display = "none";
    });

    sectionEl.classList.remove("d-none");
    sectionEl.style.visibility = "visible";
    sectionEl.style.display = "grid";
  }

  // ============================================================================
  // FORM CREATION
  // ============================================================================

  /**
   * Creates and returns the player-name form UI.
   *
   * Structure:
   * - Instruction text, a text input for the player's name,
   *   and two action buttons (Start, Back).
   *
   * Submission behavior:
   * - Empty input → injects a friendly inline message prompting for a name.
   * - Non-empty input → stores the name, navigates to the game area,
   *   and triggers a fresh game via resetGame().
   *
   * @returns {HTMLFormElement} The newly created player form element (detached).
   */
  function createPlayerNameForm() {
    const playerNameForm = document.createElement("form");
    playerNameForm.setAttribute("id", "player-form");
    playerNameForm.classList.add("p-4", "rounded-4");

    // Instruction text above the input
    const nameInstructionParagraph = document.createElement("p");
    nameInstructionParagraph.setAttribute("id", "form-instruction");
    nameInstructionParagraph.textContent = "Enter your name to start the game!";
    nameInstructionParagraph.classList.add("text-center", "fw-bold", "mb-3");

    // Player name input field
    const playerNameInput = document.createElement("input");
    playerNameInput.setAttribute("type", "text");
    playerNameInput.classList.add("player-input", "rounded-3", "px-2");
    playerNameInput.classList.add(
      "form-control",
      "form-control-lg",
      "rounded-2",
      "mb-3"
    );
    playerNameInput.setAttribute("placeholder", "Your Name...");

    // Start button (submit)
    const startGameSubmitInput = document.createElement("input");
    startGameSubmitInput.setAttribute("type", "submit");
    startGameSubmitInput.setAttribute("value", "Start Game");
    startGameSubmitInput.classList.add("submit-btn");
    startGameSubmitInput.classList.add(
      "btn",
      "btn-secondary",
      "py-2",
      "px-3",
      "fw-bold"
    );

    // Back to menu button
    const backToMenuButton = document.createElement("button");
    backToMenuButton.setAttribute("type", "button");
    backToMenuButton.textContent = "Back";
    backToMenuButton.classList.add("back-btn-form", "back-btn");
    backToMenuButton.classList.add(
      "btn",
      "btn-secondary",
      "py-2",
      "px-3",
      "fw-bold"
    );

    // Row container for action buttons
    const formButtonsRow = document.createElement("div");
    formButtonsRow.classList.add("button-row");
    formButtonsRow.classList.add(
      "d-flex",
      "justify-content-center",
      "gap-3",
      "mb-2"
    );
    formButtonsRow.append(startGameSubmitInput, backToMenuButton);

    // Compose the form
    playerNameForm.append(
      nameInstructionParagraph,
      playerNameInput,
      formButtonsRow
    );

    /**
     * Handle player-name form submission.
     * - Validates input; shows inline prompt if empty.
     * - On success, stores player name and transitions to game screen.
     *
     * @param {SubmitEvent} event - The form submission event.
     * @returns {void}
     */
    playerNameForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (playerNameInput.value.trim() === "") {
        const existingEnterNameMessage =
          document.querySelector(".enterNameMsg");

        if (existingEnterNameMessage) existingEnterNameMessage.remove();

        // Show message prompting the player to enter a name
        const enterNameMessageWrapper = document.createElement("div");
        enterNameMessageWrapper.classList.add(
          "d-flex",
          "justify-content-center",
          "mb-0"
        );

        const enterNameMessage = document.createElement("div");
        enterNameMessage.textContent =
          "Please enter your name to start the game!";
        enterNameMessage.classList.add(
          "enterNameMsg",
          "px-3",
          "mb-3",
          "py-2",
          "text-center",
          "rounded-2",
          "fw-medium"
        );

        enterNameMessageWrapper.appendChild(enterNameMessage);
        playerNameForm.insertBefore(enterNameMessageWrapper, formButtonsRow);
      } else {
        playerName = playerNameInput.value.trim();
        showSection(sections[3]);
        resetGame();
      }
    });

    return playerNameForm;
  }

  // ============================================================================
  // GAME BOARD GENERATION
  // ============================================================================

  /**
   * Builds the in-game UI (HUD, grid, raccoon mascot) and renders a shuffled deck.
   *
   * Steps:
   * 1) Clears the game area and adds a top HUD with a Back button, score, and timer.
   * 2) Duplicates the base card set to create pairs and shuffles them using the Fisher–Yates algorithm.
   * 3) Renders each card tile into the grid and wires up click handlers.
   * 4) Starts the game timer from 00:00.
   *
   * @returns {void}
   */
  function generateBoard() {
    const gameAreaEl = document.getElementById("game-area");

    gameAreaEl.innerHTML = "";

    // --- TOP HUD ---
    const topHudContainer = document.createElement("div");
    topHudContainer.setAttribute("id", "top-hud");

    // --- LEFT side (back button) ---
    const leftHud = document.createElement("div");
    leftHud.classList.add("left-hud");

    const backButton = document.createElement("button");
    backButton.classList.add("back-btn", "btn", "btn-secondary", "fw-bold");
    backButton.textContent = "Back";

    leftHud.appendChild(backButton);

    // --- RIGHT side (score + timer) ---
    const rightHud = document.createElement("div");
    rightHud.classList.add("right-hud");

    const scoreDisplayEl = document.createElement("div");
    scoreDisplayEl.setAttribute("id", "score");
    scoreDisplayEl.textContent = "Score: 0 / 6";

    const timerDisplayEl = document.createElement("div");
    timerDisplayEl.setAttribute("id", "timer");
    timerDisplayEl.textContent = "Time: 00:00";

    // ajoute score et timer à la partie droite
    rightHud.append(scoreDisplayEl, timerDisplayEl);

    // assemble tout dans le HUD principal
    topHudContainer.append(leftHud, rightHud);
    gameAreaEl.appendChild(topHudContainer);

    // Grid container for cards using CSS Grid
    const cardsGridContainer = document.createElement("div");
    cardsGridContainer.setAttribute("id", "grid-container");
    gameAreaEl.appendChild(cardsGridContainer);

    /** Raccoon mascot image element */
    const raccoonImage = document.createElement("img");
    raccoonImage.id = "raccoon-game-area";
    raccoonImage.src = "assets/images/raccoon/raccoon-1.png";
    raccoonImage.alt =
      "Raccoon wearing glasses waving cheerfully to the player";
    raccoonImage.classList.add("img-fluid");
    gameAreaEl.appendChild(raccoonImage);

    /** Create deck by duplicating card array for pairs */
    const shuffledCards = [...CARDS, ...CARDS];

    // Shuffle cards using Fisher-Yates algorithm
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [
        shuffledCards[j],
        shuffledCards[i],
      ];
    }

    // Create card elements
    shuffledCards.forEach((cardData) => {
      // Create card element directly (no Bootstrap classes needed)
      const cardTile = document.createElement("div");
      cardTile.classList.add("game-card");
      cardTile.setAttribute("data-id", cardData.id);

      // Front and back images
      const cardFrontImg = document.createElement("img");
      cardFrontImg.src = cardData.image;
      cardFrontImg.alt = cardData.name;
      cardFrontImg.classList.add("card-front");

      const cardBackImg = document.createElement("img");
      cardBackImg.src = "assets/images/cards/back.png";
      cardBackImg.alt = "Card back";
      cardBackImg.classList.add("card-back");

      cardTile.appendChild(cardFrontImg);
      cardTile.appendChild(cardBackImg);

      // Add the card directly to the CSS grid container
      cardsGridContainer.appendChild(cardTile);

      // Add flip effect on click
      cardTile.addEventListener("click", () => handleCardClick(cardTile));
    });

    startTimer();
  }

  // ============================================================================
  // CARD FLIPPING LOGIC
  // ============================================================================

  /**
   * Handles a click on a single card tile.
   *
   * Rules:
   * - Ignores clicks while the board is locked or on already flipped cards.
   * - Flips up to two cards, when two are flipped, evaluates for a match.
   *
   * @param {HTMLElement} cardElement - The clicked card tile element (.game-card).
   * @returns {void}
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

  /**
   * Checks if the two currently flipped cards match and handles the result.
   * @returns {void}
   */
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

  /**
   * Resolves a successful match between two cards.
   *
   * Effects:
   * - Increments the score and updates the HUD display.
   * - Selects a random raccoon congratulatory line for the matched animal and shows it.
   * - Disables pointer events on the matched cards to keep them revealed.
   * - Releases the board lock shortly after, readying it for the next turn.
   *
   * @param {HTMLElement} firstCard - First matched card element.
   * @param {HTMLElement} secondCard - Second matched card element.
   * @returns {void}
   */
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

  /**
   * Resolves a failed match attempt.
   *
   * Effects:
   * - After a brief delay, un-flips both cards and clears the selection.
   * - Unlocks the board to allow further interaction.
   *
   * @param {HTMLElement} firstCard - First non-matching card element.
   * @param {HTMLElement} secondCard - Second non-matching card element.
   * @returns {void}
   */
  function handleNoMatch(firstCard, secondCard) {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      flippedCards = [];
      lockBoard = false;
    }, NO_MATCH_DELAY);
  }

  /**
   * Finalizes the game flow when all pairs are matched.
   *
   * Effects:
   * - Stops the timer.
   * - Shows a raccoon celebration line personalized with the player's name.
   * - After a short delay, transitions to the end screen.
   *
   * @returns {void}
   */
  function completeGame() {
    stopTimer();
    showRaccoonSpeech(`You did it, ${playerName}! You found all my friends!`);

    setTimeout(() => {
      showEndScreen();
    }, END_SCREEN_DELAY);
  }

  // ============================================================================
  // RACCOON SPEECH BUBBLES
  // ============================================================================

  /**
   * Displays a temporary raccoon speech bubble within the game area.
   *
   * Behavior:
   * - Ensures a single speech-bubble container exists, then injects content.
   * - Automatically removes the bubble after SPEECH_DURATION milliseconds.
   *
   * @param {string} message - The text to display inside the bubble.
   * @returns {void}
   */
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

  /**
   * Starts or restarts the game timer at 00:00 and updates the HUD every second.
   *
   * Details:
   * - Clears a previous interval if present, then schedules a new setInterval.
   * - Updates the #timer textContent in mm:ss format.
   * - Tracks elapsed seconds in the shared timeElapsed variable.
   *
   * @returns {void}
   */
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

  /**
   * Stops the running timer interval if any and clears the handle.
   *
   * @returns {void}
   */
  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  // ============================================================================
  // GAME RESET & END SCREEN
  // ============================================================================

  /**
   * Resets transient game state and rebuilds the board.
   *
   * Steps:
   * - Removes the current grid, any speech bubble, and a stray player form (if present).
   * - Resets flipped/lock/score/time variables and stops the timer.
   * - Calls generateBoard() to create a fresh round.
   *
   * @returns {void}
   */
  function resetGame() {
    const grid = document.getElementById("grid-container");
    if (grid) grid.remove();

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

  /**
   * Transitions to the end screen, shows the player's name and time, and updates highscores.
   *
   * Steps:
   * - Reads the final time from the HUD timer.
   * - Removes the grid, shows the end screen section, and populates name/time fields.
   * - Ensures a highscores list element exists, then saves and renders top scores.
   *
   * @returns {void}
   */
  function showEndScreen() {
    const finalTime = (
    document.getElementById("timer") ?
      document.getElementById("timer").textContent.replace("Time: ", "")
      : "00:00"
    );

    const grid = document.getElementById("grid-container");
    if (grid) grid.remove();
    // Show end screen first
    showSection(sections[4]);

    const playerNameElement = document.getElementById("player-name");
    const playerTimeElement = document.getElementById("player-time");
    let highscoresList = document.getElementById("highscores-list");

    playerNameElement.textContent = playerName || "";
    playerTimeElement.textContent = finalTime;

    if (!highscoresList) {
      // If the highscores list is missing, create a fallback container to avoid crashes
      highscoresList = document.createElement("ol");
      highscoresList.id = "highscores-list";
      const highscoreWrapper = document.querySelector("#highscores");
      if (highscoreWrapper) highscoreWrapper.appendChild(highscoresList);
    }

    saveAndDisplayHighscores(playerName, finalTime, highscoresList);
  }

  /**
   * Initializes localStorage with default highscores if none exist.
   * This ensures the highscores list is never empty on first load.
   *
   * @returns {void}
   */
  function initializeDefaultHighscores() {
    const savedScores = localStorage.getItem("forestPalsHighscores");
    if (!savedScores) {
      const defaultScores = [
        { name: "Caro", time: "00:30" },
        { name: "Ethan", time: "00:50" },
        { name: "Luna", time: "01:20" },
        { name: "Martin", time: "01:30" },
        { name: "Sam", time: "01:40" }
      ];
      localStorage.setItem("forestPalsHighscores", JSON.stringify(defaultScores));
    }
  }

  /**
   * Saves the provided score, re-renders the highscores list, and persists to localStorage.
   *
   * Input contract:
   * - name: player's display name.
   * - time: mm:ss formatted string (e.g., "01:23").
   * - highscoresList: reference to the <ol> that will be populated.
   *
   * Behavior:
   * - Loads existing scores from localStorage (if any exist).
   * - Adds the new entry and sorts ascending by time using a mm:ss → seconds converter.
   * - Keeps only the fastest MAX_HIGHSCORES entries and re-renders the list.
   * - Highlights the just-added score in the DOM and persists the top list in localStorage.
   *
   * @param {string} name
   * @param {string} time
   * @param {HTMLOListElement|HTMLElement} highscoresList
   * @returns {void}
   */
  function saveAndDisplayHighscores(name, time, highscoresList) {
    if (!highscoresList) {
      return;
    }
    
    // Load existing scores from localStorage
    let existingScores = [];
    const savedScores = localStorage.getItem("forestPalsHighscores");
    if (savedScores) {
      try {
        existingScores = JSON.parse(savedScores);
      } catch (e) {
        existingScores = [];
      }
    }

    existingScores.push({ name, time });

    /**
     * Converts a mm:ss time string into total seconds.
     * @param {string} t - A time string like "03:07"
     * @returns {number} Total seconds (e.g., 187)
     */
    const toSeconds = (t) => {
      const [m, s] = t.split(":").map(Number);
      return m * 60 + s;
    };

    existingScores.sort((a, b) => toSeconds(a.time) - toSeconds(b.time));

    const top5 = existingScores.slice(0, MAX_HIGHSCORES);

    // Render the top 5 highscores to the DOM
    highscoresList.innerHTML = "";
    top5.forEach((entry, index) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="hs-name">${entry.name}</span> — <span class="hs-time">${entry.time}</span>`;

      // Highlight the current player's new score
      if (entry.name === name && entry.time === time) {
        li.classList.add("highlight");
      }

      highscoresList.appendChild(li);
    });

    // Persist the updated top 5 to localStorage
    localStorage.setItem("forestPalsHighscores", JSON.stringify(top5));
  }

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Universal click handler using event delegation.
   *
   * Handles:
   * - Start button: hides menu header items, builds and shows the player form.
   * - How To Play button: navigates to instructional section.
   * - Back buttons (from form/HUD): returns to main menu and cleans up form if needed.
   * - End screen buttons: Retry (restarts game) and Main Menu (resets UI/state).
   *
   * @param {MouseEvent} e - The click event captured at the document level.
   * @returns {void}
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
      showSection(sections[3]);
      resetGame();
    }

    if (e.target && e.target.id === "main-menu-btn") {
      startBtn.style.display = "block";
      howToPlayBtn.style.display = "block";
      gameTitle.style.display = "block";
      showSection(sections[0]);
      playerName = "";
    }
  }

  // ============================================================================
  // INITIALIZATION (NAKED CODE)
  // ============================================================================

  // Initialize default highscores in localStorage if none exist
  initializeDefaultHighscores();
  
  // Prevent background scroll and drag on the whole page
  document.body.style.overflow = "hidden";
  // Show initial menu and prepare a board (board remains hidden until shown)
  showSection(sections[0]);
  generateBoard();
});
