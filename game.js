document.addEventListener("DOMContentLoaded", () => {

  // Prevent background scroll and drag
  document.body.style.overflow = "hidden";
  document.addEventListener("wheel", e => e.preventDefault(), { passive: false });
  document.addEventListener("touchmove", e => e.preventDefault(), { passive: false });
  document.addEventListener("dragstart", e => e.preventDefault());

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
    input.classList.add("player-input");

    const submit = document.createElement("input");
    submit.setAttribute("type", "submit");
    submit.setAttribute("value", "Start Game");
    submit.classList.add("submit-btn");

    const backBtn = document.createElement("button");
    backBtn.setAttribute("type", "button");
    backBtn.textContent = "Back";
    backBtn.classList.add("back-btn-form");

    // container for buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-row");
    buttonContainer.append(submit, backBtn);

    // Add elements in the correct order
    form.append(paragraph, input, buttonContainer);

    // Manage back button
    backBtn.addEventListener("click", () => {
      startBtn.style.display = "block";
      howToPlayBtn.style.display = "block";
      gameTitle.style.display = "block";
      show(sections[0]);

      const existingForm = document.getElementById("player-form");
      if (existingForm) existingForm.remove();
    });

    // manage form submission
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
        
      }else {
        show(sections[2]);
      }
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
