# Forest-Pals
<div align="center">
 
</div><br>

[Link to Live Website](https://carokyp.github.io/Forest-Pals/)

## About 

## Project structure

Top-level layout keeps production website code under `assets/` and moves non-website artifacts (like validation screenshots and wireframes) under `docs/`.

- assets/
   - css/ — site styles
   - js/ — site scripts
   - images/ — site images (backgrounds, cards, raccoon, favicon)
- docs/
   - validation/
      - css/ — CSS validator screenshots
      - html/ — HTML validator screenshots
- index.html — site entry point

## Index – Table of Contents
* [User Experience (UX)](#user-experience-ux)
   * [Strategy](#Strategy)
   * [Scope](#Scope)
   * [Skeleton](#Skeleton)
   * [Structure](#Structure)
   * [Surface](#Surface)

* [Features](#features)
* [Technologies Used](#technologies-used)
* [Testing](#testing)
* [Deployment](#deployment)
* [Credits](#credits)

## User Experience (UX)

### Strategy

#### Business goals of the website are:

#### The customer goals of this website are:

#### User stories

#### MVP Roadmap (Minimal Viable Product)

<p align="center">
</p>

### Scope

#### In scope Features:

#### Out of scope Features:

### Structure

**Level 1 - Home page**

**Level 2 - Navigation Page**

**Level 3 - Supporting Elements**

### Skeleton

### Wireframes

* __Home Page__  
  <p align="center">
  </p>

### Surface

#### Visual Style

#### Colors 

<p align="center" >
  
</p>

## Features

#### Future Features

## Technologies Used

__Languages Used__

* [CSS](https://en.wikipedia.org/wiki/CSS)
* [HTML5](https://en.wikipedia.org/wiki/HTML5)
* [Bootstrap5](https://getbootstrap.com/docs/5.0/getting-started/introduction/)
* [JavaScript](https://en.wikipedia.org/wiki/JavaScript)
  
__Frameworks, Libraries & Programs Used__

* [Google Fonts](https://fonts.google.com/): was used to import the 'Pacifico' and 'Onest' fonts into the style.css 
* [Font Awesome](https://fontawesome.com/): was used to add icons for aesthetic and UX purposes.
* [GitHub](https://github.com/): is used as the repository for the project's code after being pushed from Git.
* [Photoshop](https://www.adobe.com/uk/products/photoshop.html): was used for early design to help having a better idea of which color and image will suit the website it was also used to resize, edit picture but also creating the menus and the color palette
* [Visual Studio Git Source Control](https://learn.microsoft.com/en-us/visualstudio/version-control/git-with-visual-studio?view=vs-2022): was used to commit and push or pull those into GitHub 
* [Balsamiq](https://balsamiq.com/): was used to create the wireframes during the design process.
* [WAVE](https://wave.webaim.org/) & [Lighthouse](https://developer.chrome.com/docs/lighthouse) Used for accessibility testing to ensure that all content is readable and accessible to every user.
* [HTML Validator](https://validator.w3.org/#validate_by_input) Confirmed the HTML code is valid, with no errors detected.
* [CSS Validator](https://jigsaw.w3.org/css-validator/#validate_by_input) Verified the CSS code, with no errors detected.
* [JS-Beautify](https://beautifier.io/) Checked the formatting and structure of the HTML and CSS for consistency and readability.
* [Squoosh](https://squoosh.app) was used in this project to resize, compress, and optimise images for the web, ensuring they load quickly while maintaining visual quality

## Testing 

### Validator Testing 

[HTML Validator](https://validator.w3.org/)

[CSS Validator](https://jigsaw.w3.org/css-validator/)

#### CSS Warnings

## Test Cases and Results

### Functionality Testing

| Test Label | Test Action | Expected Outcome | Test Outcome | Notes |
|------------|-------------|------------------|--------------|-------|
| **MAIN MENU** |
| Main menu display | Load the game page | Main menu displays with "Forest Pals" title, "Start" button, "How to Play" button, and raccoon mascot image | PASS | |
| Start button functionality | Click on the "Start" button | Title and menu buttons hide, player form appears with name input field, "Start Game" button, "Back" button, and raccoon mascot | PASS | |
| How to Play button | Click on the "How to Play" button | "How to Play" screen displays with game instructions (5 numbered steps) and "Back" button | PASS | |
| Back button from How to Play | Click "Back" button on How to Play screen | Returns to main menu with all elements visible | PASS | |
| **PLAYER NAME FORM** |
| Player form display | Click "Start" from main menu | Form appears with instruction text, name input field, "Start Game" and "Back" buttons | PASS| |
| Empty name submission | Leave name field empty and click "Start Game" | Error message appears: "Please enter your name to start the game!" in a styled message box | PASS | |
| Valid name submission | Enter a name (e.g., "Alex") and click "Start Game" | Game area displays with HUD (score, timer, back button), 12 cards face down in grid | PASS |
| Back button from player form | Click "Back" button on player form | Returns to main menu, form is removed, all menu elements visible | PASS | |
| **GAME BOARD** |
| Game board generation | Submit valid player name | 12 cards (6 pairs) are displayed face down in a grid layout with gray backs | PASS | |
| Cards shuffled | Start game multiple times | Cards appear in different positions each time (shuffled using Fisher-Yates algorithm) | PASS | |
| HUD display | Game board loads | Top HUD shows: "Back" button (left), "Score: 0 / 6" and "Time: 00:00" (right) | PASS | |
| Timer starts automatically | Game board loads | Timer starts counting from 00:00 in mm:ss format, incrementing every second | PASS | |
| **CARD FLIPPING** |
| First card flip | Click on any face-down card | Card flips to reveal animal image| PASS | |
| Second card flip | Click on a second face-down card | Second card flips to reveal its animal image | PASS | |
| Third card blocked | Click on three cards rapidly | First two cards flip, third click is ignored (board is locked) | PASS | |
| Same card double-click | Click the same card twice | Second click is ignored, card stays flipped | PASS | |
| **MATCHING LOGIC** |
| Successful match | Flip two cards with the same animal | Cards remain face up, score increases by 1, speech bubble appears with congratulatory message specific to the animal | PASS | |
| Match score update | Match two cards | Score display updates to "Score: 1 / 6" (or appropriate number) | PASS | |
| Matched cards stay visible | Match two cards and continue playing | Matched cards remain face up and cannot be clicked again | PASS | |
| Raccoon speech variety | Match same animal type multiple times across games | Different congratulatory messages appear for the same animal (e.g., birds have 2 different messages) |PASS | |
| Failed match | Flip two cards with different animals | After a small delay, both cards flip back face down | PASS | |
| Board lock during mismatch | Flip two non-matching cards | Board is locked during the flip-back animation, preventing new clicks | PASS | |
| Board unlock after mismatch | Wait for non-matching cards to flip back | Board unlocks and new cards can be clicked | PASS | |
| **TIMER** |
| Timer format | Observe timer during gameplay | Timer displays as mm:ss (e.g., 00:05, 01:23) with leading zeros | PASS | |
| Timer increments | Play game for 65+ seconds | Timer correctly displays minutes and seconds (e.g., 01:05) | PASS | |
| Timer stops on completion | Match all 6 pairs | Timer stops counting when game is complete | PASS| |
| **GAME COMPLETION** |
| All pairs matched | Match all 6 pairs (score reaches 6/6) | Final speech bubble appears with personalized message: "You did it, [Player-Name]! You found all my friends!" | PASS | |
| End screen display | Complete the game (after 2-second delay) | End screen shows with: title "Well done, [Player-Name]!", player's final time, highscores list, "Retry" and "Main menu" buttons | PASS| |
| Player name on end screen | Complete game as "Alex" | End screen title shows "Well done, Alex!" | PASS | |
| Final time display | Complete game | Player's completion time is displayed in mm:ss format | PASS| |
| **HIGHSCORES** |
| Highscores list | Complete the game | Highscores list shows top 5 scores sorted by time (fastest first) | PASS| |
| New score added | Complete game with time not in top 5 | If score is in top 5, it's added and displayed; otherwise top 5 remains unchanged | PASS| |
| New top score | Complete game faster than all existing scores | New score appears at position 1, highlighted with special styling | PASS | |
| Score highlighting | Complete game with qualifying time | New score entry has "highlight" class applied for visual distinction |PASS | |
| Highscores persistence | Complete game, close browser, reopen | Highscores persist via localStorage and display on subsequent game completions | PASS | Scores persist until browser cache is cleared |
| Maximum 5 scores | Complete game 6+ times | Only top 5 fastest times are kept and displayed | PASS| |
| **END SCREEN BUTTONS** |
| Retry button | Click "Retry" button on end screen | Returns to game area with reset board (new shuffled cards), score at 0/6, timer at 00:00 |PASS | |
| Retry preserves player name | Click "Retry" | Player name is preserved, no need to re-enter name |PASS| |
| Main menu button | Click "Main menu" button on end screen | Returns to main menu, player name is reset (must enter name again for new game) |PASS| |
| Main menu full reset | Return to main menu from end screen | All elements visible (title, Start button, How to Play button, raccoon) | PASS| |
| **BACK BUTTON IN GAME** |
| Back button during game | Click "Back" button in top HUD while playing | Returns to main menu (timer stops, game is abandoned) | PASS | |
| **RESPONSIVE ELEMENTS** |
| Card grid layout - Large screens | View game on screens wider than 480px | Cards display in 4 columns x 3 rows grid layout | PASS | |
| Card grid layout - Small screens | View game on screens smaller than 480px | Cards display in 3 columns x 4 rows grid layout |PASS | |
| Raccoon mascot - Large screens | Game view on screens wider than 768px | Raccoon mascot image is visible on menu / form / game area | PASS| |
| Raccoon mascot - Small screens | Visible in Menu / form view on screens hidden in game view smaller than 768px | Raccoon mascot is hidden in the game view| PASS | |
| Speech bubble - Small screens | Match cards on screens smaller than 768px | Speech bubble appears at bottom of screen | PASS | |
| All images load | Load game and navigate through all screens | All images load correctly: card backs, card fronts (6 animals), raccoon mascot, background | PASS| |
| **ACCESSIBILITY & UX** |
| Prevent scrolling | Attempt to scroll page during game | Page doesn't scroll (overflow hidden on body) | PASS | |
| Prevent dragging | Try to drag elements | Elements cannot be dragged (dragstart prevented) | PASS| On Safari browser cards can be selected which highlight them in light blue color but won't be dragged or moved |
| Sections properly hidden | Navigate between sections | Only one section is visible at a time | PASS | |
| Speech bubble timeout | Match cards and wait | Speech bubble automatically disappears after 3 seconds | PASS | |

### Performance

### Testing User Stories

## Deployment

This project is hosted **on GitHub Pages**. Updates pushed to the main branch will automatically update the live site. **Please do not make changes directly to this repository**, since updates pushed to `main` will immediately update the live site. Use a fork or clone to make changes safely. Thank You!

1. Log into [my GitHub repository](https://carokyp.github.io/Forest-Pals/)
   
2. Click the "Settings" tab (top of the repository)
   
<div align="center">
<img width="661" height="68" alt="Image" src="https://github.com/user-attachments/assets/de5eca45-661b-42e5-8351-3aa99a6095cd" /><br>
</div>  

3. Click "Pages" from the left-hand side menu.
   
<div align="center">
<img width="635" height="262" alt="Image" src="https://github.com/user-attachments/assets/9a3a775f-4def-4ad1-a062-de6a37ef89be" /><br>
</div>

4. Under the source section, click the Branch dropdown, and switch the selection from ‘None’ to ‘Main’ and choose "/ (root)" folder
   
<div align="center">
<img width="556" height="275" alt="Image" src="https://github.com/user-attachments/assets/55aa0b35-8688-4eef-9cc6-bd82123b4ac6" />
</div>

5. Click "Save"
   
6. Wait 1-2 minutes for deployment, the site will be live at [https://carokyp.github.io/Doux-Matin](https://carokyp.github.io/Doux-Matin)

### Clone this repository

Cloning creates a local copy on your computer linked to the original repository. Any changes you push will be sent to the original repository, which will require approval.

#### Windows

1. Go to [this repository](https://carokyp.github.io/Forest-Pals/)on GitHub
2. Click Code, select HTTPS, and copy the link.

<div align="center">
<img width="542" height="264" alt="Image" src="https://github.com/user-attachments/assets/263a0239-080f-4d6f-8d5f-0db0600cde96" />
</div>
   
3. Open Git Bash.
4. Change the current working directory to the location where you want the cloned directory.
5. Type `git clone`, and then paste the URL you copied earlier.
6. `git clone https://github.com/Carokyp/Doux-Matin.git`
7. Press Enter to create your local clone.

#### Mac

Follow the same steps as Windows, but use Terminal instead of Git Bash.

1. Open Terminal
2. Change the current working directory to the location where you want the cloned directory.
3. Type `git clone`, and then paste the URL you copied earlier.
4. `git clone https://github.com/Carokyp/Doux-Matin.git`
5. Press Enter to create your local clone.

### Run a copy of this repository via Fork

Forking creates a separate copy of the repository under your own GitHub account.
	•	You can make changes freely.
	•	If the original repository is updated, GitHub will notify you, and you can pull updates into your fork.

__Create a new fork__  

1. First, set up Git [Download and install Git on your computer](https://git-scm.com/downloads)
   
2. Go to [[Doux-Matin](https://carokyp.github.io/Forest-Pals/) repository
   
3. Click the 'Fork' button on the upper right part of the page.
   
   <div align="center">
     <img width="332" height="106" alt="Image" src="https://github.com/user-attachments/assets/d75c5ad2-f974-4a87-bd1c-f090fefea16b" />
   </div>

4. You now have a fork of the Doux-Matin repository in your GitHub account. Go to your profile, open the forked repository, and upload the required files.
   
5. Above the list of forked files, click the 'Code' button.

<div align="center">
  <img width="314" height="244" alt="Image" src="https://github.com/user-attachments/assets/907cfcb2-eced-4b9b-8d48-d827a2ea020d" />
</div>

6. A drop-down menu will appear. Select the one which applies to your setup. Further details on completing the final step can be found on [GitHub Fork Documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repository).

**Making Changes and Pushing Updates**

1. Create a new branch for your change
* `git checkout -b my-feature-branch`
1. Make your changes in your local repository.
2. Stage and commit your changes:
* `git add .`
* `git commit -m "Describe your changes here"`
3. Push your changes to your remote repository: \
* `git push origin my-feature-branch`

**Pull Request Fork**
1. Go to your fork on GitHub.
   
   <div align="center">
     <img width="812" height="216" alt="Image" src="https://github.com/user-attachments/assets/cb53c34c-4020-4a9e-986f-b3afdf56c605" />  
   </div>
   
2. You’ll see a message: “Compare & pull request”. Click it.
   
   <div align="center">
<img width="848" height="158" alt="Image" src="https://github.com/user-attachments/assets/8382e78a-f05a-4f50-91b5-511241a6fa4e" />
   </div>
   
3. Ensure the pull request is set to merge from your fork/branch → into the original repo/main (or another branch).
   
4. Add a clear title and description of what you changed.
   
   <div align="center">
       <img width="707" height="453" alt="Image" src="https://github.com/user-attachments/assets/35dcac5c-e2c9-4b69-8983-1fbcb1cb442c" />
   </div>
   
5. Click Create Pull Request.

**Pull Request Cloned repo**
1. Open a Pull Request on GitHub (same as above).
2. **Important:** If you cloned and have write access, you can push directly and open a Pull Request. If you cloned but don’t have write access, you must fork first.


## Credits

I would like to thank my mentor, Brian, for the assistance and support he provided throughout this project.

### Code References

Some parts of the project required utility scripts and styling tweaks. I adapted solutions from the following resources, modifying them to fit the project’s needs.

