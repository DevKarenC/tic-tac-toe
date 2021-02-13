// Goal: No global variables!
// Unsure of whether properties should be private or public?
// Make them all private first, and if needed, change them to public.

// Gameboard module created as an IIFE since there should only be one gameboard
const Gameboard = (function () {
  const gameboard = ["", "", "", "", "", "", "", "", ""];
  const getGameboard = () => gameboard;
  const checkGameboard = (gridNum, symbol) => {
    if (gameboard[gridNum] === "") {
      gameboard[gridNum] = symbol;
    } else {
      console.log("This grid is taken! Please choose a different grid.");
    }
  };
  return { getGameboard, checkGameboard };
})();

// Player Factory Function since there can be multiple players in the game
const Player = (name, symbol) => {
  const getName = () => name;
  const getSymbol = () => symbol;
  // I can move the placeSymbol method into the player's prototype (since it's a shared method)
  const placeSymbol = (grid, symbol) => {
    Gameboard.checkGameboard(grid, symbol);
  };
  return { getName, getSymbol, placeSymbol };
};

// Game module created as an IIFE
const Game = (function () {
  const playerOne = Player("Player One", "O");
  const playerTwo = Player("Player Two", "X");

  const getSymbolCount = (symbol) => {
    return Gameboard.getGameboard().reduce(function (totalCount, currentGrid) {
      if (currentGrid === symbol) {
        totalCount += 1;
      }
      return totalCount;
    }, 0);
  };

  const getCurrentPlayer = () => {
    // for the first turn, the default should be playerOne who goes first.
    if (getSymbolCount("O") === getSymbolCount("X")) {
      return playerOne;
    } else {
      return getSymbolCount("O") > getSymbolCount("X") ? playerTwo : playerOne;
    }
  };

  const determineWinner = (gameboard, symbol) => {
    let haveWinner = false;
    let winningSymbol;
    const [b0, b1, b2, b3, b4, b5, b6, b7, b8] = [...gameboard];

    // if there are not enough pieces on the board, skip the win check
    if (getSymbolCount("O") + getSymbolCount("X") < 5) {
      return;
    }
    // check rows
    if (
      (b0 === symbol && b1 === symbol && b2 === symbol) ||
      (b3 === symbol && b4 === symbol && b5 === symbol) ||
      (b6 === symbol && b7 === symbol && b8 === symbol)
    ) {
      haveWinner = true;
      winningSymbol = symbol;
      console.log(`We have a winner! ${winningSymbol} has won the game.`);
      return winningSymbol;
    }
    // check columns
    else if (
      (b0 === symbol && b3 === symbol && b6 === symbol) ||
      (b1 === symbol && b4 === symbol && b7 === symbol) ||
      (b2 === symbol && b5 === symbol && b8 === symbol)
    ) {
      haveWinner = true;
      winningSymbol = symbol;
      console.log(`We have a winner! ${winningSymbol} has won the game.`);
      return winningSymbol;
    }
    // check diagonals
    else if (
      (b0 === symbol && b4 === symbol && b8 === symbol) ||
      (b2 === symbol && b4 === symbol && b6 === symbol)
    ) {
      haveWinner = true;
      winningSymbol = symbol;
      console.log(`We have a winner! ${winningSymbol} has won the game.`);
      return winningSymbol;
    }
    // if the board is full and there is no winner, it's a tie
    else if (
      getSymbolCount("O") + getSymbolCount("X") === 9 &&
      haveWinner === false
    ) {
      console.log("It's a tie. Play again?");
      return;
    }
  };

  return {
    playerOne,
    playerTwo,
    getCurrentPlayer,
    determineWinner,
  };
})();

// ControlDisplay module created as an IIFE
const ControlDisplay = (function () {
  // caching DOM elements
  const title = document.querySelector("h1");
  const playWithBuddyButton = document.querySelector(".buddy");
  const playWithComputerButton = document.querySelector(".computer");
  const startButton = document.querySelector(".start-button");
  const playerBoxWrapper = document.querySelector(".player-box-wrapper");
  const playerOneBox = document.querySelector(".one");
  const playerTwoBox = document.querySelector(".two");
  const playerOneName = playerOneBox.querySelector(".player-name");
  const playerTwoName = playerTwoBox.querySelector(".player-name");
  const gameBoard = document.querySelector(".game-board");
  const gameBoardGrids = Array.from(gameBoard.querySelectorAll("div"));

  // player boxes appears after the player decided to play with buddy or computer
  playWithBuddyButton.addEventListener("click", function () {
    title.style.transform = "translateY(0%)";
    playWithBuddyButton.classList.add("hidden");
    playWithComputerButton.classList.add("hidden");
    playerBoxWrapper.classList.add("visible");
    startButton.classList.add("visible");
  });

  // display grid after the player clicks on the start button
  startButton.addEventListener("click", function () {
    startButton.classList.add("hidden");
    gameBoard.classList.remove("hidden");
    playerOneBox.classList.add("current-player");
  });

  // add event listener to each grid for player's grid selection
  let currentPlayer;
  gameBoardGrids.forEach((grid) => {
    grid.addEventListener("click", function () {
      const gridNum = grid.dataset.gridNum;
      currentPlayer = Game.getCurrentPlayer();
      currentPlayer.placeSymbol(gridNum, currentPlayer.getSymbol());
      renderGrid(gridNum);
      toggleBorder();
      determineWinner();
      disableGrid();
    });
  });

  // add border around the next player box
  function toggleBorder() {
    if (currentPlayer.getSymbol() === "X") {
      playerOneBox.classList.add("current-player");
      playerTwoBox.classList.remove("current-player");
    } else {
      playerOneBox.classList.remove("current-player");
      playerTwoBox.classList.add("current-player");
    }
  }

  const renderGrid = function (gridNum) {
    if (gameBoardGrids[gridNum].textContent === "") {
      gameBoardGrids[gridNum].textContent = currentPlayer.getSymbol();
    }
  };

  const determineWinner = function () {
    return (
      Game.determineWinner(
        Gameboard.getGameboard(),
        Game.playerOne.getSymbol()
      ) ||
      Game.determineWinner(Gameboard.getGameboard(), Game.playerTwo.getSymbol())
    );
  };

  // disable the board after a winner or tie
  const disableGrid = function () {
    if (determineWinner()) {
      gameBoardGrids.forEach((grid) => {
        grid.style.pointerEvents = "none";
      });
    }
  };
})();
