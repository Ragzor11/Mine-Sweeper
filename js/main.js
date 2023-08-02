'use strict'
// Step1 – the seed app:✅✅
// 1. Create a 4x4 gBoard Matrix containing Objects. ✅
// 2. Set 2 of them to be mines ✅
// 3. Present the mines using renderBoard() function. ✅
// Step2 – counting neighbors:✅✅
// 1. Create setMinesNegsCount() and store the numbers ✅
// 2. Update the renderBoard() function to also display the
// neighbor count and the mines ✅
// 3. Add a console.log – to help you with debugging✅
// Step3 – click to reveal:✅✅
// 1. When clicking a cell, call the onCellClicked() function.✅
// 2. Clicking a safe cell reveals the minesAroundCount of this cell✅
// Step4 – randomize mines' location:✅
// 1. Add some randomicity for mines location✅
// 2. After you have this functionality working– its best to comment
// the code and switch back to static location to help you focus✅
// during the development phase
// Step5 –
// 1. Add a footer with your name✅
// 2. Upload to git


const MINE = '💣'
const FLAG = '🚩'
const hidden = '🧱'

var gBoard
var gLives = 3
var gBombsToFind = 2
var cellsClicked = 0

var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: false,
    showncCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function onInit() {
    gBoard = createBoard(gLevel.SIZE)
    renderBoard()
}


function createBoard(size) {
    const board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isNeighbor: false,
                isFirstClicked: false,
            }
            board[i][j] = cell
        }
    }
    return board
}
function renderBoard() {
    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr class="board-row" >\n`
        for (var j = 0; j < gBoard[0].length; j++) {
            const cell = gBoard[i][j]
            var className = `cell-${i}-${j}`
            className += ' hidden'
            if (cell.isMine) {
                className = `mine-${i}-${j}`
                className += ' hidden'
            }
            if (cell.isNeighbor) {
                className = `neighbor-${i}-${j}`
                className += ' hidden'
            }
            const title = `Cell: ${i}, ${j}`
            strHTML += `\t<td  
                title="${title}" class="${className}"  
                onclick="onCellClicked(this,${i}, ${j})" >
                </td>\n`

        }
        strHTML += `</tr>\n`
    }
    const elCells = document.querySelector('.board-cells')
    elCells.innerHTML = strHTML
    setMinesNegsCount(gBoard)
    console.log(gBoard)
}
function setMinesNegsCount(board) {
    const boardIdxs = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            boardIdxs.push({ i, j })
        }
    }
    for (var x = 0; x < boardIdxs.length; x++) {
        var rowIdx = boardIdxs[x].i
        var colIdx = boardIdxs[x].j
        var minesCount = 0
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i >= board.length) continue;
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (i === rowIdx && j === colIdx) continue;
                if (j < 0 || j >= board[0].length) continue;
                if (board[i][j].isMine) minesCount++
            }
        }
        board[rowIdx][colIdx].minesAroundCount = minesCount
        if (board[rowIdx][colIdx].isMine === false
            && minesCount > 0) {
            board[rowIdx][colIdx].isNeighbor = true
        }
        minesCount = 0
    }
}
function onCellClicked(elCell, i, j) {
    ++cellsClicked
    console.log(cellsClicked)
    if (!gBoard[i][j].isMine) console.log(gBoard[i][j].minesAroundCount)
    if (cellsClicked === 1) {
        gBoard[i][j].isFirstClicked = true
        createMines()
    }
    if(gBoard[i][j].isMine) checkLose()
}
function checkLose(){
    gLives-- 
    
}
function createMines() {
    for (var k = 0; k < gLevel.MINES; k++) {
        var i = getRandomInt(0, gLevel.SIZE)
        var j = getRandomInt(0, gLevel.SIZE)
        if(!gBoard[i][j].isFirstClicked){
            gBoard[i][j].isMine = true
        }
        else{i--}
    }
    renderBoard()
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
    // The maximum is exclusive and the minimum is inclusive
}
