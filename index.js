// Goal: No global variables!
//

// Gameboard module created as an IIFE
const Gameboard = (function () {
  const gameboard = ["", "", "", "", "", "", "", "", ""];
  //   const gameboard = ["O", "X", "O", "", "", "", "", "", ""];
  const getGameboard = () => gameboard;
  const checkGameboard = (gridNum, symbol) => {
    if (gameboard[gridNum] === "") {
      fillGrid(gridNum, symbol);
    } else {
      console.log("This grid is taken! Please choose a different grid.");
    }
  };
  const fillGrid = (gridNum, symbol) => {
    gameboard[gridNum] = symbol;
  };
  return { getGameboard, checkGameboard };
})();

// Player Factory Function
const Player = (name, symbol) => {
  const getName = () => name;
  const getSymbol = () => symbol;
  const placeSymbol = (grid, symbol) => {
    Gameboard.checkGameboard(grid, symbol);
  };
  return { getName, getSymbol, placeSymbol };
};

const playerOne = Player("Me", "O");
const playerTwo = Player("You", "X");

// Game module created as an IIFE
const Game = (function () {
  const getSymbolCount = (symbol) => {
    return Gameboard.getGameboard().reduce(function (acc, cur) {
      if (cur === symbol) {
        return acc + 1;
      }
      return acc;
    }, 0);
  };

  const getCurrentPlayer = () => {
    if (playerOne.getSymbol() === "O") {
      return getSymbolCount("O") > getSymbolCount("X") ? playerTwo : playerOne;
    } else {
      return getSymbolCount("X") > getSymbolCount("O") ? playerTwo : playerOne;
    }
  };
  const currentPlayerName = getCurrentPlayer().getName();
  const currentPlayerSymbol = getCurrentPlayer().getSymbol();

  return { currentPlayerName, currentPlayerSymbol };
})();

// ControlDisplay module created as an IIFE
const ControlDisplay = (function () {
  const playWithBuddyButton = document.querySelector(".buddy");
  const playWithComputerButton = document.querySelector(".computer");
  const gameBoard = document.querySelector("#game-board");
  const gameBoardGrids = Array.from(gameBoard.querySelectorAll("div"));

  // add event listener to each grid for player's grid selection
  gameBoardGrids.forEach((grid) => {
    grid.addEventListener("click", function () {
      const gridNum = grid.dataset.gridNum;
      playerOne.placeSymbol(gridNum, playerOne.getSymbol());
      renderGrid(gridNum);
    });
  });

  const renderGrid = function (gridNum) {
    gameBoardGrids[gridNum].textContent = playerOne.getSymbol();
  };
})();
