/*
RULES:
1. Players place marks on the board in turns
2. The game board should always have atleast 3 empty cells on each side
3. When player gets 5 sequential marks on table player wins and the game ends.
*/

let tableHeight, tableWidth, activePlayer, boardArray, backdrop, modal;

const initGame = () => {
  tableHeight = 30;
  tableWidth = 50;
  activePlayer = "X";
  backdrop = document.querySelector(".backdrop");
  modal = document.querySelector(".modal");
  backdrop.style.display = "none";
  modal.style.display = "none";
  //Initialize empty board array
  boardArray = new Array(tableWidth * tableHeight).fill("");

  renderBoardToDOM();
  dragNavigating();
};

const dragNavigating = () => {
  //this function implements navigating on the tictactoe board by click and drag
  const gameBoard = document.querySelector(".game-container");
  let isDown = false;
  let startX, stratY, scrollLeft, scrollTop;
  gameBoard.addEventListener("mousedown", e => {
    e.preventDefault();
    isDown = true;
    startX = e.pageX - gameBoard.offsetLeft;
    startY = e.pageY - gameBoard.offsetTop;
    scrollLeft = gameBoard.scrollLeft;
    scrollTop = gameBoard.scrollTop;
  });
  gameBoard.addEventListener("mouseup", e => {
    e.preventDefault();
    isDown = false;
  });
  gameBoard.addEventListener("mouseleave", e => {
    e.preventDefault();
    isDown = false;
  });
  gameBoard.addEventListener("mousemove", e => {
    e.preventDefault();
    if (!isDown) return;
    const x = e.pageX - gameBoard.offsetLeft;
    const y = e.pageY - gameBoard.offsetTop;
    const walkX = (x - startX) * 2;
    gameBoard.scrollLeft = scrollLeft - walkX;
    const walkY = (y - startY) * 2;
    gameBoard.scrollTop = scrollLeft - walkY;
  });
};

const renderBoardToDOM = () => {
  let tableChildTags = "";
  for (let i = 0; i < tableHeight; i++) {
    let td = "";
    for (let k = 0; k < tableWidth; k++) {
      td = `${td}<td onClick="handleCellClick(${k + i * tableWidth})"><p>${
        boardArray[k + i * tableWidth]
      }</p></td>`;
    }
    tableChildTags = `${tableChildTags}<tr>${td}</tr>`;
  }
  document.querySelector(
    ".game-container"
  ).innerHTML = `<table>${tableChildTags}</table>`;
};

const checkWinCondition = (id, row, col) => {
  //If sequential marks is 5 or over, win condition is met and this function returns true, else it returns false
  //every possible win condition is checked by checking sequential marks around the placed mark

  //horizontal win condition
  {
    let sequentialMarks = 1;
    //check sequential marks on the right side
    for (let i = col, checkPos = id; i < tableWidth - 1; i++) {
      checkPos++;
      activePlayer === boardArray[checkPos]
        ? sequentialMarks++
        : (i = tableWidth - 2);
    }
    //check sequential marks on the left side
    for (let i = col, checkPos = id; i > 0; i--) {
      checkPos--;
      activePlayer === boardArray[checkPos] ? sequentialMarks++ : (i = 0);
    }
    if (sequentialMarks >= 5) {
      return true;
    }
  }

  //Vertical win condition
  {
    let sequentialMarks = 1;
    //check sequential marks above
    for (let i = row, checkPos = id; i > 0; i--) {
      checkPos -= tableWidth;
      activePlayer === boardArray[checkPos] ? sequentialMarks++ : (i = 0);
    }

    //check sequential marks below
    for (let i = row, checkPos = id; i < tableHeight - 1; i++) {
      checkPos += tableWidth;
      activePlayer === boardArray[checkPos]
        ? sequentialMarks++
        : (i = tableHeight - 2);
    }
    if (sequentialMarks >= 5) {
      return true;
    }
  }

  //Down diagonal condition
  {
    let sequentialMarks = 1;
    //check sequential marks above
    for (let i = row, j = col, checkPos = id; i > 0 && j > 0; i--, j--) {
      checkPos = checkPos - tableWidth - 1;
      activePlayer === boardArray[checkPos] ? sequentialMarks++ : (i = 0);
    }
    //check sequential marks below
    for (
      let i = row, j = col, checkPos = id;
      i < tableHeight - 1 && j < tableWidth - 1;
      i++, j++
    ) {
      checkPos = checkPos + tableWidth + 1;
      activePlayer === boardArray[checkPos]
        ? sequentialMarks++
        : (i = tableHeight - 2);
    }
    if (sequentialMarks >= 5) {
      return true;
    }
  }

  //Up diagonal condition
  {
    let sequentialMarks = 1;
    //check sequential marks above
    for (
      let i = row, j = col, checkPos = id;
      i > 0 && j < tableWidth - 1;
      i--, j++
    ) {
      checkPos = checkPos - tableWidth + 1;
      activePlayer === boardArray[checkPos] ? sequentialMarks++ : (i = 0);
    }
    //check sequential marks below
    for (
      let i = row, j = col, checkPos = id;
      i < tableHeight - 1 && j > 0;
      i++, j--
    ) {
      checkPos = checkPos + tableWidth - 1;
      activePlayer === boardArray[checkPos] ? sequentialMarks++ : (j = 0);
    }
    if (sequentialMarks >= 5) {
      return true;
    }
  }

  return false;
};

const expandBoard = (id, row, col) => {
  //If the distance from edge is 3 or less board expands
  let distanceFromTop = row;
  let distanceFromBottom = tableHeight - 1 - row;
  let distanceFromLeft = col;
  let distanceFromRight = tableWidth - 1 - col;
  //Expand top
  //add as many new empty items to the beginning of the board array that the table has width + increment table height
  for (distanceFromTop; distanceFromTop < 3; distanceFromTop++) {
    tableHeight++;
    //if board expands on top move scrolling of the table container to (height of cell)+(padding)=62
    //this makes the cursor to stay on the same spot as the placed mark
    document.querySelector(".game-container").scrollTop += 62;
    for (let i = tableWidth; i > 0; i--) {
      boardArray.unshift("");
    }
  }
  //Expand bottom
  //add items to the end of the array
  for (distanceFromBottom; distanceFromBottom < 3; distanceFromBottom++) {
    tableHeight++;
    for (let i = tableWidth; i > 0; i--) {
      boardArray.push("");
    }
  }
  //Expand left
  //increase table width and add new items to array at the indexes where a new row begins(column = 0)
  for (distanceFromLeft; distanceFromLeft < 3; distanceFromLeft++) {
    tableWidth++;
    document.querySelector(".game-container").scrollLeft += 62;
    for (let i = 0; i < tableHeight; i++) {
      boardArray.splice(i * tableWidth, 0, "");
    }
  }
  //Expand right
  //Add items at the end of rows(column = tablewidth - 1)
  for (distanceFromRight; distanceFromRight < 3; distanceFromRight++) {
    tableWidth++;
    for (let i = 1; i <= tableHeight; i++) {
      boardArray.splice(i * tableWidth - 1, 0, "");
    }
  }
};

const handleCellClick = id => {
  //Calculate on which row and column the clicked cell is
  const row = Math.trunc(id / tableWidth);
  const col = id - Math.trunc(id / tableWidth) * tableWidth;
  //1. Check if there is no mark already
  if (boardArray[id] === "") {
    //2. Update the mark on board array
    boardArray[id] = activePlayer;
    //3. Update the DOM with the new mark
    renderBoardToDOM();
    //4. Check for win
    if (checkWinCondition(id, row, col)) {
      document.querySelector(
        ".modal__title"
      ).innerText = `PLAYER ${activePlayer} WON!`;
      backdrop.style.display = "block";
      modal.style.display = "block";
      document
        .querySelector(".modal__action")
        .addEventListener("click", initGame);
    }
    //5. Check for board expansion
    expandBoard(id, row, col);
    renderBoardToDOM();
    //6. Switch activePlayer
    activePlayer = activePlayer === "X" ? "O" : "X";
  }
};

initGame();
