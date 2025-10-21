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
    document.getElementById("end-screen"),
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

  // Raccoon speech lines for each animal
  // Each animal has an array of possible lines to choose from
  // when a match is found
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

  // Player name
  let playerName = "";

  // To track flipped cards
  let flippedCards = [];
  let lockBoard = false; // To prevent clicking more than 2 cards at a time

  // Player score
  let score = 0;

  // Timer variables
  let timerInterval = null; // interval for the timer
  let timeElapsed = 0; // time elapsed in seconds

  /**
   * function to hide all sections and show a specific section
   * Compatible with Bootstrap classes
   */
  function show(section) {
    // Hide all sections using Bootstrap classes
    sections.forEach((element) => {
      element.classList.add('d-none');
      element.classList.remove('d-flex');
      element.style.visibility = 'hidden';
    });

    // Show the selected section using Bootstrap classes
    section.classList.remove('d-none');
    section.classList.add('d-flex');
    section.style.visibility = 'visible';
  }

  /**
   * --- CREATE PLAYER FORM ---
   * Dynamically generates the form where the player enters their name
   * before starting the game.
   */

  function createForm() {

    const form = document.createElement("form");
    form.setAttribute("id", "player-form");
    // Add Bootstrap classes to the form
    form.classList.add("container", "my-4", "p-4", "rounded-4");

    // Text instruction
    const paragraph = document.createElement("p");
    paragraph.setAttribute("id", "form-instruction");
    paragraph.textContent = "Enter your name to start the game!";
    // Add Bootstrap classes for the text
    paragraph.classList.add("text-center", "fw-bold", "mb-3");

    // Input field
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.classList.add("player-input", "rounded-3", "mb-3", "px-2");
    // Add Bootstrap classes for the input
    input.classList.add("form-control", "form-control-lg", "rounded-2", "mb-3");
    input.setAttribute("placeholder", "Your Name...");

    // Submit button
    const submit = document.createElement("input");
    submit.setAttribute("type", "submit");
    submit.setAttribute("value", "Start Game");
    submit.classList.add("submit-btn");
    // Add Bootstrap classes for the submit button
    submit.classList.add("btn","btn-secondary","py-2","px-3","fw-bold");

    // Back button
    const backBtn = document.createElement("button");
    backBtn.setAttribute("type", "button");
    backBtn.textContent = "Back";
    backBtn.classList.add("back-btn-form", "back-btn");
    // Classes Bootstrap pour le bouton back
    backBtn.classList.add("btn","btn-secondary","py-2","px-3","fw-bold");

    // Container for both buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-row");
    // Classes Bootstrap pour le container des boutons
    buttonContainer.classList.add("d-flex","justify-content-center", "gap-3", "mb-2");
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
        msgWrapper.classList.add("d-flex", "justify-content-center", "mt-3", "mb-0");

        const enterNameMsg = document.createElement("div");
        enterNameMsg.textContent = "Please enter your name to start the game!";
        enterNameMsg.classList.add("enterNameMsg", "px-3", "py-2", "text-center", "rounded-2", "fw-medium");
        
        msgWrapper.appendChild(enterNameMsg);
        form.appendChild(msgWrapper);
      } else {
        playerName = input.value.trim();
        show(sections[2]);
        resetGame();
      }
    });

    return form;
  }

  // Show the menu first
  show(sections[0]);

  // Universal click handler for all buttons using event delegation
  document.addEventListener('click', (e) => {
    // Start Game button
    if (e.target && e.target.id === 'start-btn') {
      console.log("Start button clicked!");
      howToPlayBtn.style.display = "none";
      gameTitle.style.display = "none";
      startBtn.style.display = "none";

      const form = createForm();
      menu.appendChild(form);
    }
    
    // How to Play button
    if (e.target && e.target.id === 'how-to-play-btn') {
      console.log("How to Play button clicked!");
      show(sections[1]); // Show how-to-play section
    }
    
    // Back buttons 
    if (e.target && e.target.classList.contains('back-btn')) {
      console.log("Back button clicked!");
      startBtn.style.display = "block";
      howToPlayBtn.style.display = "block";
      gameTitle.style.display = "block";
      show(sections[0]); // Go to main menu
      
      // If it's a form back button, also remove the form
      if (e.target.classList.contains('back-btn-form')) {
        const existingForm = document.getElementById("player-form");
        if (existingForm) existingForm.remove();
      }
    }
    
    // End screen buttons, retry and main menu
    if (e.target && e.target.id === 'retry-btn') {
      console.log("Retry button clicked!");
      show(sections[2]); // Go to game area
      resetGame();
    }
    
    if (e.target && e.target.id === 'main-menu-btn') {
      console.log("Main menu button clicked!");
      // Restore menu button visibility
      startBtn.style.display = "block";
      howToPlayBtn.style.display = "block";
      gameTitle.style.display = "block";
      show(sections[0]); // Go to main menu
      playerName = ""; // Reset player name
    }
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

    // Timer display
    const timerDisplay = document.createElement("div");
    timerDisplay.setAttribute("id", "timer");
    timerDisplay.textContent = "Time: 00:00";
    bottomHUD.appendChild(timerDisplay);

    gameArea.appendChild(bottomHUD);

    // Grid container for cards avec Bootstrap
    const gridContainer = document.createElement("div");
    gridContainer.setAttribute("id", "grid-container");
    gridContainer.classList.add("container-fluid");
    gameArea.appendChild(gridContainer);

    // Row Bootstrap pour contenir les cartes
    const row = document.createElement("div");
    row.classList.add("row", "g-2");
    gridContainer.appendChild(row);

    const cardsPairs = [...cards, ...cards];

    // Shuffle card
    for (let i = cardsPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardsPairs[i], cardsPairs[j]] = [cardsPairs[j], cardsPairs[i]];
    }

    // Create card elements
    cardsPairs.forEach((cardData) => {
      // Create a Bootstrap column for each card
      const colElement = document.createElement("div");

      // Responsivity mobile (3x4), tablet and laptop(4x3)
      colElement.classList.add("col-4", "col-md-3", "col-lg-3"); 

      // Create card element
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
      
      // Add the card to the column and then to the row
      colElement.appendChild(cardElement);
      row.appendChild(colElement);

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
    // Lock the board while checking
    lockBoard = true;

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

      setTimeout(() => {
        showEndScreen();
      }, 2000); // Wait that the speech bubble disappears
    }
  }

  function raccoonSpeech(message) {
    const gameArea = document.getElementById("game-area");
    // Remove existing speech bubble if any
    const existingBubble = document.getElementById("speech-bubble");
    if (existingBubble) existingBubble.remove();
    
    // Create speech bubble with Bootstrap classes
    const speechBubble = document.createElement("div");
    speechBubble.setAttribute("id", "speech-bubble");
    speechBubble.textContent = message;
    
    // Base Bootstrap classes for styling
    speechBubble.classList.add(
      "alert", // Bootstrap alert component with success styling
      "text-center", "fw-bold", // Center text and make it bold
      "mx-1", "my-3", 
      "rounded-pill", // Rounded pill shape
      "shadow-sm", // Subtle shadow
      "border-0" // Remove default border
    );
    
    // Add responsive width control
    speechBubble.style.width = "fit-content";

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

  function showEndScreen() {
    console.log("showEndScreen() function called!");
    
    // Get the final time BEFORE removing the timer element
    const finalTime = document.getElementById("timer")
      ? document.getElementById("timer").textContent.replace("Time: ", "")
      : "00:00";
    
    console.log("Final time captured:", finalTime);

    // Hide the game board and HUD
    const grid = document.getElementById("grid-container");
    if (grid) grid.remove();
    const hud = document.getElementById("bottom-hud");
    if (hud) hud.remove();

    // Grab end screen elements
    const endScreen = document.getElementById("end-screen");
    // Show end screen
    show(sections[3]);

    const playerNameElement = document.getElementById("player-name");
    const playerTimeElement = document.getElementById("player-time");
    const highscoresList = document.getElementById("highscores-list");

    playerNameElement.textContent = playerName; // Player name
    playerTimeElement.textContent = finalTime; // Player Time
    
    console.log("Player name set to:", playerName);
    console.log("Player time set to:", finalTime);

    const existingScores = Array.from(
      highscoresList.querySelectorAll("li")
    ).map((li) => {
      const name = li.querySelector(".hs-name").textContent;
      const time = li.querySelector(".hs-time").textContent;
      return { name, time };
    });

    //Add Player Score
    existingScores.push({ name: playerName, time: finalTime });

    // Convert time to seconds for sorting
    const toSeconds = (t) => {
      const [m, s] = t.split(":").map(Number);
      return m * 60 + s;
    };
    
    // Sort scores by time (fastest first)
    existingScores.sort((a, b) => toSeconds(a.time) - toSeconds(b.time));
    
    // Keep top 5 scores only AFTER sorting
    const top5 = existingScores.slice(0, 5);

    // rewriting the highscores list
    highscoresList.innerHTML = "";
    top5.forEach((entry, index) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="hs-name">${entry.name}</span> — <span class="hs-time">${entry.time}</span>`;
      
      // Highlight the current player's score
      if (entry.name === playerName && entry.time === finalTime) {
        li.classList.add("highlight");
      }
      
      highscoresList.appendChild(li);
      console.log(`Position ${index + 1}: ${entry.name} - ${entry.time}`);
    });
    


     // Save to localStorage
    localStorage.setItem("forestPalsHighscores", JSON.stringify(top5));
  }
});
