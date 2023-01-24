/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

var WIDTH = 7;
var HEIGHT = 6;

var currPlayer = 1; // active player: 1 or 2
var board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array
  for(let h=0; h<HEIGHT; h++){
    board.push([]);
    for(let w=0; w<WIDTH; w++){
      board[board.length-1].push([]);
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector("#board");

  // create head cells at the top of the board where players can click to make their move
  var top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (var x = 0; x < WIDTH; x++) {
    var headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // build rows of cells for the rest of the board; ids are numbered like array index (first value is 0, second is 1, etc.)
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return empty y (null if filled) */

function findSpotForCol(x) {
  for(let boardRow=board.length-1; boardRow>-1; boardRow--){
    if(board[boardRow][x].length === 0){  //found first empty cell from bottom
      return boardRow;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  //make a div and insert into correct table cell
  let divToPlace = document.createElement('div');
  divToPlace.classList.add('piece','player' + currPlayer);
  document.querySelector(`#${CSS.escape(y)}-${CSS.escape(x)}`).append(divToPlace);
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);

  //fill board to prevent further moves after endGame alert
  for(let bCol = 0; bCol<WIDTH; bCol++){
    while(findSpotForCol(bCol)){
      board[findSpotForCol(bCol)][bCol] = "0";
    }
  }

  //add reset game button
  if(document.querySelector('#reset')){
    document.querySelector('#reset').classList.remove('hide');
  }else{
    let resetBtn = document.createElement('button');
    resetBtn.setAttribute('id','reset');
    resetBtn.innerText = "Start Over";
    resetBtn.addEventListener('click',function(resetEvt){
      document.querySelector("#board").remove();

      let newHtmlBoard = document.createElement('table');
      newHtmlBoard.setAttribute('id','board');
      document.querySelector('#game').append(newHtmlBoard)

      board = [];
      makeBoard();
      makeHtmlBoard();

      resetBtn.classList.add('hide');
    });
    document.querySelector('body').append(resetBtn);
  }
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  var x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  var y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie -- check if all cells in board are filled; if so call, call endGame
  //let boardFilled = board => board.every(filledRow => filledRow.every(filledVal && filledVal > 0));
  let boardFilled = true;
  for(let b=0; b<board.length; b++){
    for(let bc=0; bc<board[b].length; bc++){
      if(board[b][bc].length == 0){
        boardFilled = false;
        break;
      }
    }
    if(!boardFilled){ 
      break; 
    }
  }
  if(boardFilled){
    endGame("Tie game!");
  }

  // switch players
  currPlayer = currPlayer > 1 ? 1 : 2;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  //iterates through each cell checking if there are three more adjacent with the same player number 
  //in any of the following configurations: horizontal, vertical, diagonal right, diagonal left
  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];   //horizontal win; this cell and the next three to the right
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];    //vertical win; this cell and the next three down
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];  //diagonal right win; this cell and the next three down-1 and right-1
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];  //diagonal left win; this cell and the next three down-1 and left-1

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();