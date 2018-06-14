window.onload = function(){

//INTERNAL LOGIC
//global values for gameboard dimensions and symbols
var minesweeperRows = 10;
var minesweeperColumns = 10;
var bombText = ":("
var emptySpace = " "

var minesweeperValues = createVirtualBoard(minesweeperColumns,minesweeperRows);

//creates the gameboard
function populateRow(rowLength){
  var rowArray = [];
  for (var i = 0; i < rowLength; i++){
    rowArray.push(emptySpace);
  }
  return rowArray;
}

//creates array for a row in the gameboard
function createVirtualBoard(columns, rows){
  var board = [];
  for (var i = 0; i < columns; i++){
    board.push(populateRow(rows));
  }
  return board;
}

//places bombs and adds neighbor values
function placeMine (arrayOfArrays, numberOfMines){
  var count = 0;
  while (count < numberOfMines){
    var randomX = Math.floor(Math.random() * arrayOfArrays[0].length);
    var randomY = Math.floor(Math.random() * arrayOfArrays.length);
    if (arrayOfArrays[randomY][randomX] === emptySpace){
      placeNeighborValues(arrayOfArrays, randomX, randomY);
      arrayOfArrays[randomY][randomX] = bombText;
      count ++;
    }
  }
}  

//function to add proximity value to bombs' neighbors
function placeNeighborValues(array, x, y){
  var startY = (y - 1) >= 0 ? y - 1 : 0;
  var endY = (y + 1) < array.length ? y + 1 : array.length - 1;
  var startX = (x - 1) >= 0 ? x - 1 : 0;
  var endX = (x + 1) < array[0].length ? x + 1 : array.length - 1;
  for (var i = startY; i <= endY; i++){
    for (var j = startX; j <= endX; j++){
      if (array[i][j] === emptySpace){
        array[i][j] = 0;
      }
      array[i][j] += 1;
    }
  }
}

placeMine(minesweeperValues, 10);
console.log(minesweeperValues);



//INTERACTIVE LOGIC

//create interactive gameboard

function createInteractiveBoard (columns, rows){
  var gameboard = document.querySelector("#gameboard");
  gameboard.oncontextmenu = function(){
    return false;
  }
  for (var y = 0; y < columns; y++){
    var gameboardRow = document.createElement("div");
    gameboardRow.setAttribute("class", y);
      for (var x = 0; x < rows; x++){
        var gameboardCell = document.createElement("button");
        gameboardCell.setAttribute("id", x + "," + y);
        gameboardCell.onauxclick = guessCellContent;
        gameboardCell.onclick = revealCell
        gameboard.appendChild(gameboardCell);
      }
     gameboard.appendChild(gameboardRow); 
  }
}
createInteractiveBoard(minesweeperColumns, minesweeperRows);

//
function revealCell (event){
  var row = parseInt(event.target.getAttribute("id").split(",")[1]);
  var column = parseInt(event.target.getAttribute("id").split(",")[0]);
  console.log(column + "," + row);
  event.target.innerText = minesweeperValues[row][column];
  if (minesweeperValues[row][column] === bombText){
    event.target.style["background-color"] = "#FF1654";
    event.target.style["color"] = "white";
    endGame("You lose!");
  } else if (minesweeperValues[row][column] === emptySpace){
    revealBlank(minesweeperValues, column, row, 0);
    event.target.style["background-color"] = "#B2DBBF";
    console.log(isWin());
    if (isWin()){
      endGame("Congratulations! You win!");
    }
  } else {
    event.target.style["background-color"] = "#B2DBBF";
    event.target.style["color"] = "black";
    console.log(isWin());
    if (isWin()){
      endGame("Congratulations! You win!");
    } 
  }
}  

function guessCellContent (event){
  event.target.innerText = "?"
  event.target.style["color"] = "white";
  event.target.style["font-weight"] = "bold";
}

function revealBlank (array, x, y, distanceFromEmpty){
  var currentCell = document.getElementById(x + "," + y);
  if (typeof array[y][x] === "number"){
    distanceFromEmpty ++;
  }else {
    distanceFromEmpty = 0;
  }
  if (currentCell.style["background-color"] === "rgb(178, 219, 191)" || array[y][x] === bombText || distanceFromEmpty > 1){
        return;
      }
  currentCell.style["background-color"] = "rgb(178, 219, 191)";
  currentCell.innerText = minesweeperValues[y][x];
  var startY = (y - 1) >= 0 ? y - 1 : 0;
  var endY = (y + 1) < array.length ? y + 1 : array.length - 1;
  var startX = (x - 1) >= 0 ? x - 1 : 0;
  var endX = (x + 1) < array[0].length ? x + 1 : array.length - 1;
  for (var i = startY; i <= endY; i++){
    for (var j = startX; j <= endX; j++){
      var currentCell = document.getElementById(j + "," + i);
        revealBlank(array, j, i, distanceFromEmpty); 
    }
  }
}

function endGame (message){
  var text = document.querySelector("#message");
  text.innerText = message;
  text.style["font-family"] = "Arial";
  text.style["color"] = "#247BA0";
  text.style["font-size"] = "16px"
  var resetButton = document.createElement("button");
  resetButton.innerText = "play again?";
  resetButton.onclick = function(){
    window.location.reload(true);
  }
  text.appendChild(resetButton);
  var allTheButtons = document.querySelectorAll("#gameboard button");
  allTheButtons.forEach(function(button){
    button.setAttribute("disabled", true);
  });
 }
}

function isWin (){
  for (var i = 0; i < minesweeperRows; i++){
    for(var j = 0; j < minesweeperColumns; j++){
      var currentCell = document.getElementById(j + "," + i);
      console.log(currentCell)
      if (currentCell.style["background-color"] != "rgb(178, 219, 191)" && minesweeperValues[i][j] != bombText){
        return false;
      }  
    }
  }
  return true;
}
