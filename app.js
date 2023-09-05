
const body = document.querySelector("body");
body.style.boxSizing = "border-box";
body.style.margin = "0";
body.style.padding = "0";
const container = document.createElement('div');
container.className = "container";
const topScoresButton = document.createElement('button');
topScoresButton.className = "button button__top-scores";
let topScoreSpan = document.createElement('span');
const topScoreSpanText = document.createTextNode("Top 10 Results");
topScoreSpan.appendChild(topScoreSpanText);
topScoresButton.appendChild(topScoreSpan);
const controlsBox = document.createElement('div');
controlsBox.className = "controls";
const newGameButton = document.createElement('button');
newGameButton.className = "button button__new-game";
let buttonSpan = document.createElement('span');
const spanText = document.createTextNode("New Game");
buttonSpan.appendChild(spanText);
newGameButton.appendChild(buttonSpan);
controlsBox.appendChild(newGameButton);
const sound = document.createElement('button');
sound.className = "button button__sound sound-on"
sound.innerHTML = "Sound: ON";
controlsBox.appendChild(sound);
const sizeBox = document.createElement('div');
sizeBox.className = "size-box";
for (let i = 0; i < 6; i++) {
  let sizeButton = document.createElement('button');
  sizeButton.className = (`size-button size-button-${i + 3}x${i + 3}`);
  let sizeSpan = document.createElement('span');
  sizeSpan.className = "size-text";
  const sizeSpanText = document.createTextNode(`${i + 3}x${i + 3}`);
  sizeBox.appendChild(sizeButton);
  sizeSpan.appendChild(sizeSpanText);
  sizeButton.appendChild(sizeSpan);
  sizeButton.setAttribute('data-value',`${i + 3}`);
};

const scoresWindow = document.createElement('div');
scoresWindow.className = "scoresWindow";
const scoresClose = document.createElement('button');
scoresClose.className = 'scoresClose';
scoresClose.innerHTML = "x";
const scoresTable = document.createElement('table');
scoresTable.className = "scoresTable";
const scoresTitleRow = document.createElement('tr');
scoresTitleRow.className = "scoresTitleRow";
const scoresName = document.createElement('td');
scoresName.innerHTML = 'Name';
const scoresMoves = document.createElement('td');
scoresMoves.innerHTML = 'Moves';
const scoresTime = document.createElement('td');
scoresTime.innerHTML = 'Time';
const scoresSize = document.createElement('td');
scoresSize.innerHTML = 'Board';
const scoresDate = document.createElement('td');
scoresDate.innerHTML = 'Date';
const overlay = document.createElement('div');
overlay.className = 'overlay';

scoresWindow.appendChild(scoresTable);
scoresWindow.appendChild(scoresClose);
scoresWindow.appendChild(overlay);
scoresTable.appendChild(scoresTitleRow);
scoresTitleRow.appendChild(scoresName);
scoresTitleRow.appendChild(scoresMoves);
scoresTitleRow.appendChild(scoresTime);
scoresTitleRow.appendChild(scoresSize);
// scoresTitleRow.appendChild(scoresDate);

overlay.addEventListener('click',() => {
  scoresWindow.classList.toggle('shown');
  overlay.style.display = 'none';
})

scoresClose.addEventListener('click',(e) => {
  // setTimeout(() => {
  scoresWindow.classList.toggle('shown');
  overlay.style.display = 'none';
  // }, 0.01);
});

let winnersList = [];
let listBySize = [];

const renderWinnersList = (gameSize) => {
  if (localStorage.length) {
    winnersList = (JSON.parse(localStorage.getItem('winnersList')));
    listBySize = winnersList.filter(function (array) {
      return array.size[0] * array.size[2] - 1 === newPuzzle.gameSize;
    });
    // console.log(listBySize, newPuzzle.gameSize);
    listBySize.sort((a,b) => a.moves - b.moves);
    while (listBySize.length > 10) {
      listBySize.pop();
      console.log('popped');
    };
    for (let i = 0; i < listBySize.length; i++) {
      let scoresNewRow = document.createElement('tr');
      scoresNewRow.className = "scoresNewRow";
      for (const property in listBySize[i]) {
        // console.log(`${winnersList[i][property]}`);
        let scoresNewData = document.createElement('td');
        scoresNewData.className = 'scoresNewData';
        scoresNewData.innerHTML = `${listBySize[i][property]}`;
        scoresNewRow.appendChild(scoresNewData);
      }
      scoresTable.appendChild(scoresNewRow);
    }
  };
};


body.appendChild(container);
container.appendChild(controlsBox);
controlsBox.appendChild(topScoresButton);
container.appendChild(sizeBox);
body.appendChild(scoresWindow);

topScoresButton.addEventListener('click',() => {
  scoresWindow.classList.toggle('shown');
  overlay.style.display = 'block';
  while (scoresTitleRow.nextSibling) {
    scoresTable.removeChild(scoresTitleRow.nextSibling);
  };
  // console.log(newPuzzle.gameSize);
  renderWinnersList(newPuzzle.gameSize);
});

let sizeButtons = Array.from(document.querySelectorAll('.size-button'));
sizeButtons[1].classList.add('size-selected');

const moves = document.createElement('span');
moves.className = "span move-count";
const spanMoves = document.createElement('span');
spanMoves.className = "span moves";
spanMoves.innerHTML = "Moves: ";
moves.innerHTML = `${0}`;
spanMoves.appendChild(moves);

const spanTime = document.createElement('span');
spanTime.className = "span time";

const movesAndTime = document.createElement('div');
movesAndTime.className = 'moves-and-time-box';
container.appendChild(movesAndTime);
movesAndTime.appendChild(spanMoves);
movesAndTime.appendChild(spanTime);

let soundButton = document.querySelector(".button__sound");
soundButton.addEventListener("click",function () {
  if (soundButton.classList.contains("sound-on")) {
    newPuzzle.audio.volume = 0;
    soundButton.innerHTML = "Sound: OFF";
    soundButton.classList.remove("sound-on")
  } else {
    newPuzzle.audio.volume = 0.2;
    soundButton.innerHTML = "Sound: ON";
    soundButton.classList.add("sound-on")
  }
});

soundButton.addEventListener("touchstart",function () {
  if (soundButton.classList.contains("sound-on")) {
    newPuzzle.audio.volume = 0;
    soundButton.innerHTML = "Sound: OFF";
    soundButton.classList.remove("sound-on")
  } else {
    newPuzzle.audio.volume = 0.2;
    soundButton.innerHTML = "Sound: ON";
    soundButton.classList.add("sound-on")
  }
})

function createBoard(gameSize) {
  const gameboard = document.createElement('div');
  gameboard.className = "gameboard";
  container.appendChild(gameboard);
  for (let i = 0; i < gameSize; i++) {
    let tile = document.createElement('button');
    tile.className = `tile tile-${i}`;
    tile.setAttribute('draggable',true);
    gameboard.appendChild(tile);
    if (window.innerWidth < 500) {
      gameboard.style.width = `${window.innerWidth * 0.8}px`;
      gameboard.style.height = `${window.innerWidth * 0.8}px`;
    } else if (window.innerWidth >= 500 && window.innerWidth < 1000) {
      gameboard.style.width = `${window.innerWidth * 0.5}px`;
      gameboard.style.height = `${window.innerWidth * 0.5}px`;
    } else if (window.innerWidth >= 1000 && window.innerWidth < 1500) {
      gameboard.style.width = `${window.innerWidth * 0.4}px`;
      gameboard.style.height = `${window.innerWidth * 0.4}px`;
    } else if (window.innerWidth >= 1500 && window.innerWidth < 1900) {
      gameboard.style.width = `${window.innerWidth * 0.3}px`;
      gameboard.style.height = `${window.innerWidth * 0.3}px`;
    } else {
      gameboard.style.width = `${window.innerWidth * 0.25}px`;
      gameboard.style.height = `${window.innerWidth * 0.25}px`;
    }
    boardWidth = gameboard.style.width.slice(0,-2);
    tile.style.width = `${boardWidth / Math.sqrt(gameSize + 1)}px`;
    tile.style.height = tile.style.width;
    let span = document.createElement('span');
    span.className = "tile-text";
    const spanText = document.createTextNode(`${i + 1}`);
    span.appendChild(spanText);
    tile.appendChild(span);
  }
}

class Puzzle {

  start(gameSize) {
    this.gameSize = gameSize;
    this.cols = (Math.sqrt(this.gameSize + 1));
    this.rows = this.cols;
    this.emptyTileCoords = [this.rows - 1,this.cols - 1];
    this.indices = [];
    this.numberOfTiles = this.cols * this.rows;
    this.tiles = Array.from(document.querySelectorAll(".tile"));
    this.sizeButtons = Array.from(document.querySelectorAll(".size-button"));
    this.timer = null;
    this.audio = new Audio();
    this.audio.src = "./assets/tile-move.mp3";
    this.audio.volume = 0.3;

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let tileIndex = x + y * this.cols;
        if (tileIndex + 1 >= this.numberOfTiles) break;
        let tile = this.tiles[tileIndex];
        this.positionTileAtCoord(tileIndex,x,y);
        //position the tiles on the board by changing the tile.style.left and tile.style.top;

        tile.addEventListener('click',() => {
          this.onClickOnTile(tileIndex);
          let movesCount = document.querySelector(".move-count")
          movesCount.innerHTML++;
        });

        tile.addEventListener("dragstart",dragStart);  //click an image to drag
        tile.addEventListener("dragover",dragOver);    //moving image around while clicked
        tile.addEventListener("dragenter",dragEnter);  //dragging image onto another one
        tile.addEventListener("dragleave",dragLeave);  //dragged image leaving anohter image
        tile.addEventListener("drop",dragDrop);        //drag an image over another image, drop the image
        tile.addEventListener("dragend",dragEnd);      //after drag drop, swap the two tiles

        this.indices.push(tileIndex);
      }
    }

    this.indices.push(this.numberOfTiles - 1);
    let shuffleTimes = 40 + newPuzzle.gameSize * 2;
    this.shuffle(shuffleTimes);

    const timeCount = document.createElement('span');
    timeCount.classList = "span time-count"
    spanTime.innerHTML = "Time: "
    timeCount.innerHTML = "00:00"
    spanTime.appendChild(timeCount);
    this.timer = setInterval(showTime,1000);
    let seconds = 0;
    function showTime() {
      seconds++;
      let hours = Math.floor(seconds / 3600);
      let mins = Math.floor(seconds / 60) - (hours * 60);
      let secs = Math.floor(seconds % 60);
      let output = [];
      output.push(
        // hours.toString().padStart(2, '0'),
        mins.toString().padStart(2,'0'),
        secs.toString().padStart(2,'0'));
      return timeCount.innerHTML = output.join(":")
    }
  }

  positionTileAtCoord(tileIndex,x,y) {
    let tile = this.tiles[tileIndex];
    tile.style.left = `${(x * tile.offsetWidth)}px`;
    tile.style.top = `${(y * tile.offsetWidth)}px`;
  }

  shuffle(numOfShuffles) {
    for (let i = 0; i < numOfShuffles; i++) {
      let randomTileIndex = Math.floor(Math.random() * (this.numberOfTiles - 1));
      let moved = this.moveTile(randomTileIndex);
      if (!moved) i--;
    }
  }

  moveTile(tileIndex) {
    let tile = this.tiles[tileIndex];
    let tileCoords = this.canMoveTile(tile);
    if (tileCoords != null) {
      this.positionTileAtCoord(tileIndex,this.emptyTileCoords[0],this.emptyTileCoords[1]);
      this.indices[this.emptyTileCoords[0] + this.emptyTileCoords[1] * this.cols] = this.indices[tileCoords[0] + tileCoords[1] * this.cols];
      this.emptyTileCoords[0] = tileCoords[0];
      this.emptyTileCoords[1] = tileCoords[1];
      return true;
    }
    return false;
  }

  moveTileArrow(tileIndex) {
    let tile = this.tiles[tileIndex];
    let tileCoords = this.canMoveTile(tile);
    if (tileCoords != null) {
      this.positionTileAtCoord(tileIndex,this.emptyTileCoords[0],this.emptyTileCoords[1]);
      this.indices[this.emptyTileCoords[0] + this.emptyTileCoords[1] * this.cols] = this.indices[tileCoords[0] + tileCoords[1] * this.cols];
      this.emptyTileCoords[0] = tileCoords[0];
      this.emptyTileCoords[1] = tileCoords[1];
      this.audio.play();
      return true;
    }
    return false;
  }

  canMoveTile(tile) {
    let tilePos = [parseInt(tile.style.left),parseInt(tile.style.top)];
    let tileWidth = tile.offsetWidth;
    let tileCoords = [tilePos[0] / tileWidth,tilePos[1] / tileWidth];
    let diff = [Math.abs(tileCoords[0] - this.emptyTileCoords[0]),Math.abs(tileCoords[1] - this.emptyTileCoords[1])];
    let canMove = (diff[0] == 1 && diff[1] == 0) || (diff[0] == 0 && diff[1] == 1);
    if (canMove) return tileCoords;
    else return null;
  }

  ifWon = () => {
    let movesCount = document.querySelector(".move-count").innerHTML;
    let timeCount = document.querySelector(".time-count").innerHTML;
    alert(`Hooray! You solved the puzzle in ${timeCount} and ${movesCount} moves!`);
    let playerName = prompt('Please, enter your name:','Player');
    if (playerName) {
      let playerInfo = {
        name: playerName,
        moves: movesCount,
        time: timeCount,
        size: `${Math.sqrt(newPuzzle.gameSize + 1)}x${Math.sqrt(newPuzzle.gameSize + 1)}`,
        // date: (new Date()).toString().split(' ').splice(1,3).join(' ')
      };
      winnersList.push(playerInfo);
      winnersList.sort((a,b) => a.moves - b.moves);
      while (winnersList.length > 100) {
        winnersList.pop();
      };
      localStorage.setItem('winnersList',JSON.stringify(winnersList));
      console.log(localStorage.winnersList);
      while (scoresTitleRow.nextSibling) {
        scoresTable.removeChild(scoresTitleRow.nextSibling);
      };
      renderWinnersList(newPuzzle.gameSize);
    }
  };

  onClickOnTile(tileIndex) {
    this.audio.play();
    if (this.moveTile(tileIndex)) {
      if (this.checkPuzzleSolved()) {
        clearInterval(this.timer);
        let body = document.querySelector("body");
        body.style.backgroundImage = "url('./assets/fireworks.jpeg')";
        body.style.backgroundSize = "cover";
        setTimeout(() => { this.ifWon() },500);
      }
    }
  };

  onArrowPress(arrowTileIndex) {
    if (this.moveTileArrow(arrowTileIndex)) {
      if (this.checkPuzzleSolved()) {
        clearInterval(this.timer);
        let body = document.querySelector("body");
        body.style.backgroundImage = "url('./assets/fireworks.jpeg')";
        body.style.backgroundSize = "cover";
        setTimeout(() => { this.ifWon() },500);
      }
    }
  };

  checkPuzzleSolved() {
    for (let i = 0; i < this.indices.length; i++) {
      if (i == this.emptyTileCoords[0] + this.emptyTileCoords[1] * this.cols) continue;
      if (this.indices[i] != i) return false;
    }
    return true;
  }

  changeSize(gameSize) {
    this.start(gameSize);
  }

  dragTile(tileIndex) {
    let tile = this.tiles[tileIndex];
    if (this.canMoveTile()) {
      console.log(tile);
    }
  }
}
var currTile;
var otherTile;

function dragStart() {
  currTile = this;
  //this refers to the img tile being dragged
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
  otherTile = this;
  //this refers to the img tile being dropped on
}

function dragEnd() {
  // if (newPuzzle.canMoveTile()) {
  //   newPuzzle.moveTile();
  // }
  // let currCoords = currTile.id.split("-"); //ex) "0-0" -> ["0", "0"]
  // let r = parseInt(currCoords[0]);
  // let c = parseInt(currCoords[1]);

  // let otherCoords = otherTile.id.split("-");
  // let r2 = parseInt(otherCoords[0]);
  // let c2 = parseInt(otherCoords[1]);

  // let moveLeft = r == r2 && c2 == c - 1;
  // let moveRight = r == r2 && c2 == c + 1;

  // let moveUp = c == c2 && r2 == r - 1;
  // let moveDown = c == c2 && r2 == r + 1;

  // let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

  // if (isAdjacent) {
  //   let currImg = currTile.src;
  //   let otherImg = otherTile.src;

  //   currTile.src = otherImg;
  //   otherTile.src = currImg;

  //   turns += 1;
  //   document.getElementById("turns").innerText = turns;
  // }
}

const canMoveWithArrow = (arrayDiffRule) => {
  let arrowTile = {
    compare: arrayDiffRule,
    array: [],
    arrowDiff: null,
    arrowTileIndex: null,
  }

  for (let i = 0; i < newPuzzle.tiles.length; i++) {
    let array = [];
    let tile = newPuzzle.tiles[i];
    let tileCoords;
    let tilePos = [parseInt(tile.style.left),parseInt(tile.style.top)];
    let tileWidth = tile.offsetWidth;
    tileCoords = [tilePos[0] / tileWidth,tilePos[1] / tileWidth];
    let arrowDiff = [(tileCoords[0] - newPuzzle.emptyTileCoords[0]),(tileCoords[1] - newPuzzle.emptyTileCoords[1])];
    let arrowTileIndex = newPuzzle.tiles.indexOf(tile);
    if (arrowDiff[0] == arrowTile.compare[0] && arrowDiff[1] == arrowTile.compare[1]) {
      array.push(arrowTileIndex);
    }
    arrowTile.array = array;
    arrowTile.arrowDiff = arrowDiff;
    arrowTile.arrowTileIndex = arrowTileIndex;
    if (array.length == 1) break;
  }
  return arrowTile;
}

document.addEventListener('keydown',function (e) {
  e.preventDefault();
  let arrowTile;
  let arrowTileIndex;
  let diff;
  let movesCount = document.querySelector(".move-count");
  let key = e.key;

  switch (key) {
    case "ArrowLeft":
      e.preventDefault();
      diff = [1,0];
      arrowTile = canMoveWithArrow(diff);
      arrowDiff = arrowTile.arrowDiff;
      arrowTileIndex = arrowTile.arrowTileIndex;
      newPuzzle.onArrowPress(arrowTileIndex);
      movesCount.innerHTML++;
      if (arrowTile.array.length == 1) break;
      break;

    case "ArrowRight":
      diff = [-1,0]
      arrowTile = canMoveWithArrow(diff);
      arrowDiff = arrowTile.arrowDiff;
      arrowTileIndex = arrowTile.arrowTileIndex;
      e.preventDefault();
      newPuzzle.onArrowPress(arrowTileIndex);
      movesCount.innerHTML++;
      if (arrowTile.array.length == 1) break;
      break;

    case "ArrowUp":
      diff = [0,1]
      arrowTile = canMoveWithArrow(diff);
      arrowDiff = arrowTile.arrowDiff;
      arrowTileIndex = arrowTile.arrowTileIndex;
      newPuzzle.onArrowPress(arrowTileIndex);
      movesCount.innerHTML++;
      if (arrowTile.array.length == 1) break;
      break;

    case "ArrowDown":
      diff = [0,-1]
      arrowTile = canMoveWithArrow(diff);
      arrowDiff = arrowTile.arrowDiff;
      arrowTileIndex = arrowTile.arrowTileIndex;
      newPuzzle.onArrowPress(arrowTileIndex);
      movesCount.innerHTML++;
      if (arrowTile.array.length == 1) break;
      break;
  }

});

newGameButton.addEventListener("click",function () {
  document.querySelector(".gameboard").remove();
  let gameSize;
  sizeButtons.forEach(sizeSelected => {
    if (sizeSelected.classList.contains('size-selected')) {
      gameSize = (sizeSelected.getAttribute('data-value') ** 2) - 1
    };
  });
  clearInterval(this.timer);
  let movesCount = document.querySelector(".move-count");
  movesCount.innerHTML = `${0}`;
  createBoard(gameSize);
  newPuzzle.start(gameSize);
  body.style.background = "none";
  body.style.backgroundColor = "black";
})

sizeButtons.forEach(sizeButton => {
  sizeButton.addEventListener('click',function () {
    sizeButtons.forEach(sizeButton => {
      sizeButton.classList.remove('size-selected');
    })
    sizeButton.classList.add('size-selected');
    document.querySelector(".gameboard").remove();
    let gameSize = (sizeButton.getAttribute('data-value')) ** 2 - 1;
    newPuzzle.gameSize = gameSize;
    console.log(newPuzzle.gameSize);
    clearInterval(this.timer);
    let movesCount = document.querySelector(".move-count");
    movesCount.innerHTML = `${0}`;
    createBoard(newPuzzle.gameSize);
    newPuzzle.start(newPuzzle.gameSize);
    body.style.background = "none";
  })
});

sizeButtons.forEach(sizeSelected => {
  if (sizeSelected.classList.contains('size-selected')) {
    gameSize = (sizeSelected.getAttribute('data-value') ** 2) - 1
  };
});


createBoard(gameSize);
let newPuzzle = new Puzzle(gameSize);
newPuzzle.start(gameSize);

