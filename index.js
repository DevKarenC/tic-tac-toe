(function () {
  const EMPTY = "";
  const O_SYMBOL = "O";
  const X_SYMBOL = "X";
  // Gameboard module created as an IIFE since there should only be one gameboard
  const Gameboard = (function () {
    /* gameboard is organized like this (number being the index of the array):
    [ 0, 1, 2,
      3, 4, 5,
      6, 7, 8 ]
    */
    let gameboard = [
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
    ];
    const getGameboard = () => gameboard;
    const addSymbolToGameboard = (gridNum, symbol) => {
      if (gameboard[gridNum] === EMPTY) {
        gameboard[gridNum] = symbol;
      }
    };
    const resetGameboard = () => {
      gameboard = [
        EMPTY,
        EMPTY,
        EMPTY,
        EMPTY,
        EMPTY,
        EMPTY,
        EMPTY,
        EMPTY,
        EMPTY,
      ];
    };
    return { getGameboard, addSymbolToGameboard, resetGameboard };
  })();

  // Player Factory Function since there can be multiple players in the game
  const Player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;
    const placeSymbol = (gridNum) => {
      return Gameboard.addSymbolToGameboard(gridNum, symbol);
    };
    return { getName, getSymbol, placeSymbol };
  };

  // Game module created as an IIFE
  const Game = (function () {
    const playerOne = Player("Player One", O_SYMBOL);
    const playerTwo = Player("Player Two", X_SYMBOL);

    const getSymbolCount = (symbol) => {
      return Gameboard.getGameboard().reduce(function (
        totalCount,
        currentGrid
      ) {
        if (currentGrid === symbol) {
          totalCount += 1;
        }
        return totalCount;
      },
      0);
    };

    const getCurrentPlayer = () => {
      // for the first turn, the default should be playerOne who goes first.
      if (getSymbolCount(O_SYMBOL) === getSymbolCount(X_SYMBOL)) {
        return playerOne;
      } else {
        return getSymbolCount(O_SYMBOL) > getSymbolCount(X_SYMBOL)
          ? playerTwo
          : playerOne;
      }
    };

    const determineWinner = (gameboard, symbol) => {
      const [b0, b1, b2, b3, b4, b5, b6, b7, b8] = [...gameboard];

      // if there are not enough pieces on the board, skip the win check
      if (getSymbolCount(O_SYMBOL) + getSymbolCount(X_SYMBOL) < 5) {
        return;
      }
      // check rows
      if (
        (b0 === symbol && b1 === symbol && b2 === symbol) ||
        (b3 === symbol && b4 === symbol && b5 === symbol) ||
        (b6 === symbol && b7 === symbol && b8 === symbol)
      ) {
        return symbol;
      }
      // check columns
      else if (
        (b0 === symbol && b3 === symbol && b6 === symbol) ||
        (b1 === symbol && b4 === symbol && b7 === symbol) ||
        (b2 === symbol && b5 === symbol && b8 === symbol)
      ) {
        return symbol;
      }
      // check diagonals
      else if (
        (b0 === symbol && b4 === symbol && b8 === symbol) ||
        (b2 === symbol && b4 === symbol && b6 === symbol)
      ) {
        return symbol;
      }
      // if the board is full and there is no winner, it's a tie
      else if (getSymbolCount(O_SYMBOL) + getSymbolCount(X_SYMBOL) === 9) {
        return false;
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
    /* BEGIN - Get the Elements */
    const title = document.querySelector("h1");
    const playWithBuddyButton = document.querySelector(".buddy");
    const startButton = document.querySelector(".start-button");
    const playAgainButton = document.querySelector(".play-again-button");
    const gameMessage = document.querySelector(".game-message");
    const playerBoxWrapper = document.querySelector(".player-box-wrapper");
    const playerOneBox = document.querySelector(".one");
    const playerTwoBox = document.querySelector(".two");
    const nav = document.querySelector("nav");
    const gameBoard = document.querySelector(".game-board");
    const gameBoardGrids = Array.from(gameBoard.querySelectorAll("div"));
    /* END - Get the Elements */

    /* BEGIN - Build out Functions */

    // callback function to handle play with buddy button
    function handlePlayWithBuddyButton() {
      title.style.transform = "translateY(0%)";
      playWithBuddyButton.classList.add("hidden");
      playerBoxWrapper.classList.add("visible");
      startButton.classList.add("visible");
    }

    // rendering player's choice on the grid DOM
    let checkSuccess = false;
    function renderGrid(gridNum) {
      if (gameBoardGrids[gridNum].textContent === EMPTY) {
        gameBoardGrids[gridNum].textContent = currentPlayer.getSymbol();
        checkSuccess = true;
      } else {
        checkSuccess = false;
      }
    }

    // add border around the next player box
    function toggleBorder() {
      if (checkSuccess) {
        if (currentPlayer.getSymbol() === X_SYMBOL) {
          playerOneBox.classList.add("current-player");
          playerTwoBox.classList.remove("current-player");
        } else {
          playerOneBox.classList.remove("current-player");
          playerTwoBox.classList.add("current-player");
        }
      }
    }

    // function to determine the winner for the game
    function determineWinner() {
      return (
        Game.determineWinner(
          Gameboard.getGameboard(),
          Game.playerOne.getSymbol()
        ) ||
        Game.determineWinner(
          Gameboard.getGameboard(),
          Game.playerTwo.getSymbol()
        )
      );
    }

    // disable the board after the game is over
    function disableGrid() {
      if (determineWinner()) {
        gameBoardGrids.forEach((grid) => {
          grid.style.pointerEvents = "none";
        });
      }
    }

    // display whose turn it is after every move
    function displayTurnMessage() {
      if (checkSuccess) {
        if (determineWinner() || determineWinner() === false) {
          displayGameOverMessage();
        } else {
          if (currentPlayer.getSymbol() === X_SYMBOL) {
            gameMessage.textContent = "Player 1's turn!";
          } else {
            gameMessage.textContent = "Player 2's turn!";
          }
        }
      } else {
        gameMessage.textContent =
          "This grid is taken! Please choose a different grid.";
      }
    }

    // display message for the winner or a tie
    function displayGameOverMessage() {
      if (determineWinner() === O_SYMBOL) {
        gameMessage.textContent = "Player 1 won! 🎉";
      } else if (determineWinner() === X_SYMBOL) {
        gameMessage.textContent = "Player 2 won! 🎉";
      } else if (determineWinner() === false) {
        gameMessage.textContent = "It's a tie. Play again?";
      }
      displayPlayAgainButton();
    }

    // display the play again button after game over
    function displayPlayAgainButton() {
      playAgainButton.classList.add("visible");
      playAgainButton.classList.remove("hidden");
    }

    // press the play again button to reset the game
    function resetGame() {
      playAgainButton.classList.remove("visible");
      playAgainButton.classList.add("hidden");
      playerOneBox.classList.add("current-player");
      playerTwoBox.classList.remove("current-player");
      Gameboard.resetGameboard();
      gameBoardGrids.forEach((grid) => {
        grid.textContent = EMPTY;
        grid.style.pointerEvents = "auto";
      });
      gameMessage.textContent = "Player 1's turn!";
    }

    /* END - Build out Functions */

    /* BEGIN - Attach Event Listeners */

    // player boxes appears after the player clicks on the play with buddy button
    playWithBuddyButton.addEventListener("click", handlePlayWithBuddyButton);

    // display grid after the player clicks on the start button
    startButton.addEventListener("click", function () {
      startButton.classList.add("hidden");
      gameBoard.classList.remove("hidden");
      gameMessage.classList.remove("hidden");
      gameMessage.textContent = "Player 1's turn!";
      nav.style.transform = "translateY(0%)";
      playerOneBox.classList.add("current-player");
      playerOneBox.querySelector("input").disabled = true;
      playerTwoBox.querySelector("input").disabled = true;
    });

    // add event listener to each grid for player's grid selection
    let currentPlayer;
    gameBoardGrids.forEach((grid) => {
      grid.addEventListener("click", function () {
        const gridNum = grid.dataset.gridNum;
        currentPlayer = Game.getCurrentPlayer();
        currentPlayer.placeSymbol(gridNum);
        renderGrid(gridNum);
        displayTurnMessage();
        toggleBorder();
        determineWinner();
        disableGrid();
      });
    });

    playAgainButton.addEventListener("click", resetGame);

    /* END - Attach Event Listeners */
  })();
})();
