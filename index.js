(function () {
  // Gameboard module created as an IIFE since there should only be one gameboard
  const Gameboard = (function () {
    let gameboard = ["", "", "", "", "", "", "", "", ""];
    const getGameboard = () => gameboard;
    const checkGameboard = (gridNum, symbol) => {
      if (gameboard[gridNum] === "") {
        gameboard[gridNum] = symbol;
      }
    };
    const resetGameboard = () => {
      gameboard = ["", "", "", "", "", "", "", "", ""];
    };
    return { getGameboard, checkGameboard, resetGameboard };
  })();

  // Player Factory Function since there can be multiple players in the game
  const Player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;
    const placeSymbol = (grid, symbol) => {
      return Gameboard.checkGameboard(grid, symbol);
    };
    return { getName, getSymbol, placeSymbol };
  };

  // Game module created as an IIFE
  const Game = (function () {
    const playerOne = Player("Player One", "O");
    const playerTwo = Player("Player Two", "X");

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
      if (getSymbolCount("O") === getSymbolCount("X")) {
        return playerOne;
      } else {
        return getSymbolCount("O") > getSymbolCount("X")
          ? playerTwo
          : playerOne;
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
        return winningSymbol;
      }
      // check diagonals
      else if (
        (b0 === symbol && b4 === symbol && b8 === symbol) ||
        (b2 === symbol && b4 === symbol && b6 === symbol)
      ) {
        haveWinner = true;
        winningSymbol = symbol;
        return winningSymbol;
      }
      // if the board is full and there is no winner, it's a tie
      else if (
        getSymbolCount("O") + getSymbolCount("X") === 9 &&
        haveWinner === false
      ) {
        return haveWinner;
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
    /* Get the Elements */
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

    /* Build out Functions */

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
      if (gameBoardGrids[gridNum].textContent === "") {
        gameBoardGrids[gridNum].textContent = currentPlayer.getSymbol();
        checkSuccess = true;
      } else {
        checkSuccess = false;
      }
    }

    // add border around the next player box
    function toggleBorder() {
      if (checkSuccess) {
        if (currentPlayer.getSymbol() === "X") {
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
          if (currentPlayer.getSymbol() === "X") {
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
      if (determineWinner() === "O") {
        gameMessage.textContent = "Player 1 won! 🎉";
      } else if (determineWinner() === "X") {
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
        grid.textContent = "";
        grid.style.pointerEvents = "auto";
      });
      gameMessage.textContent = "Player 1's turn!";
    }

    /* Attach Event Listeners */

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
        currentPlayer.placeSymbol(gridNum, currentPlayer.getSymbol());
        renderGrid(gridNum);
        displayTurnMessage();
        toggleBorder();
        determineWinner();
        disableGrid();
      });
    });

    playAgainButton.addEventListener("click", resetGame);
  })();
})();
