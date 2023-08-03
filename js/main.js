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
const EMPTY = ''

var gBoard
var gLives = 3
var gBombsToFind = 2
var cellsClicked = 0
var timerInterval
var gTimer = 0



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
    clearInterval(timerInterval)
    gLives = 3
    gTimer = 0
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = gTimer + 's'
    gGame.showncCount = 0
    gGame.markedCount = 0
    var elEmote = document.querySelector('.restartBtn')
    elEmote.innerText = '😀'
    var elLives = document.querySelector('h3 span')
    elLives.innerText = gLives
    cellsClicked = 0
}
function changeLevel(difficulty) {
    if (difficulty === 'Easy') {
        gLevel.SIZE = 4
        gLevel.MINES = 2
    }
    if (difficulty === 'Hard') {
        gLevel.SIZE = 8
        gLevel.MINES = 14
    }
    if (difficulty === 'Extreme') {
        gLevel.SIZE = 12
        gLevel.MINES = 32
    }
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
                onclick="onCellClicked(this,${i}, ${j})"
                oncontextmenu="onRightClick(this,${i}, ${j})">
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
    if (gGame.isOver) return
    var currCell = gBoard[i][j]
    elCell.classList.remove('hidden')
    currCell.isShown = true
    if (cellsClicked < 1) {
        timerInterval = setInterval(timer, 1000)
        currCell.isFirstClicked = true
        currCell.isMine = false
        gGame.showncCount++;
        elCell.classList.add('empty')
        createMines()
        cellsClicked++
    }
    if (!currCell.isMine) {
        elCell.classList.add('empty')
        if (currCell.minesAroundCount > 0) {
            elCell.innerText = currCell.minesAroundCount
        }
    }
    if (!currCell.isMine && !currCell.isNeighbor) {
        openNegs(i, j)
        elCell.classList.add('empty')
        if (currCell.minesAroundCount === 0) {
            checkNeighborEmptyCells(i, j)
        }
        if (currCell.minesAroundCount > 0) {
            elCell.innerText = currCell.minesAroundCount
        }
    }
    if (currCell.isMine) {
        elCell.innerHTML = MINE
        checkLose()
    }
    checkWin()
}
function checkNeighborEmptyCells(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue;
            if (j < 0 || j >= gBoard[0].length) continue;
            console.log("gBoard[i][j]", gBoard[i][j]);
            var currCell = gBoard[i][j];
            if (!currCell.isMine && !currCell.isNeighbor) {
                const elCell = document.querySelector('.' + getClassName(i, j)
                )
                elCell.classList.remove('hidden')
            }
        }
    }
    return

}
function checkLose() {
    gLives--
    const elLives = document.querySelector('h3 span')
    elLives.innerText = gLives
    if (gLives === 1) {
        const elRestart = document.querySelector('.restartBtn')
        elRestart.innerText = '😨'
    }
    if (gLives === 0) {
        clearInterval(timerInterval)
        gGame.isOn = false
        const elModalText = document.querySelector('.modal h2')
        elModalText.innerText = "You Lost,\n You can hit the button below if you want to play again"
        const elModal = document.querySelector('.modal')
        elModal.classList.remove('hide')
        const elRestart = document.querySelector('.restartBtn')
        elRestart.innerText = '🙁'
        gGame.isOver = true

    }
}
function createMines() {
    for (var k = 0; k < gLevel.MINES; k++) {
        var i = getRandomInt(0, gLevel.SIZE)
        var j = getRandomInt(0, gLevel.SIZE)
        if (!gBoard[i][j].isFirstClicked) {
            gBoard[i][j].isMine = true
        }
        else { i-- }
    }
    renderBoard()
}

function getClassName(i, j) {
    var cellClass = 'cell-' + i + '-' + j;
    console.log(cellClass)
    return cellClass;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
    // The maximum is exclusive and the minimum is inclusive
}

function openNegs(i, j) {
    console.log('hey')
    const cellNegs = getCellNegs(i, j)
    console.log(cellNegs);
    for (var k = 0; k < cellNegs.length; k++) {
        var currCell = cellNegs[k]
        if (gBoard[currCell.i][currCell.j].isNeighbor) {
            gBoard[currCell.i][currCell.j].isShown = true
            const elNeighborCell = document.querySelector((`.cell-${currCell.i}-${currCell.j}`))
            elNeighborCell.classList.remove('hidden')
            elNeighborCell.classList.add('empty')
            elNeighborCell.innerText = gBoard[currCell.i][currCell.j].minesAroundCount
        }
        else if (!gBoard[currCell.i][currCell.j].isNeighbor && !gBoard[currCell.i][currCell.j].isMine) {
            gBoard[currCell.i][currCell.j].isShown = true
            const elEmptyCell = document.querySelector((`.cell-${currCell.i}-${currCell.j}`))
            elEmptyCell.classList.remove('hidden')
            elEmptyCell.classList.add('empty')
        }
    }
}
function getCellNegs(i, j) {
    const cellNegs = []
    for (var k = i - 1; k <= i + 1; k++) {
        if (k < 0 || k >= gBoard.length) continue
        for (var l = j - 1; l <= j + 1; l++) {
            if (l < 0 || l >= gBoard.length) continue
            if (k === i && l === j) continue
            cellNegs.push({ i: k, j: l })
        }
    }
    return cellNegs
}

function onRightClick(elCell, i, j) {
    addEventListener("contextmenu", (e) => {e.preventDefault()});
    console.log('hey')
    const cell = gBoard[i][j]
    if (!cell.isShown) {
        elCell.innerHTML = FLAG
        if (cell.isMarked) {
            elCell.innerHTML = EMPTY
            cell.isMarked = false
        } else {
            cell.isMarked = true
        }
    }
    if (cell.isMine) gBombsToFind--
    checkWin()
}
function checkWin() {
    var shownCells = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            const cell = gBoard[i][j]
            if (cell.isShown === true) shownCells++
            console.log(shownCells)

        }
    }
    if (shownCells === Math.pow(gLevel.SIZE, 2) - 2 && gBombsToFind === 0) {
        clearInterval(timerInterval)
        const elModalText = document.querySelector('.modal h2')
        elModalText.innerText = "You WON!!!!\n You can hit the button below if you want to play again"
        const elRestart = document.querySelector('.restartBtn')
        elRestart.innerText = '🤩'
        const elModal = document.querySelector('.modal')
        elModal.classList.remove('hide')
        gGame.isOver = true
    }
}
function timer() {
    gTimer++
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = gTimer + 's'
    if (gTimer > 60) {
        elTimer.innerText = Math.round(gTimer / 60) + 'm ' + gTimer % 60 + 's'
    }
}
function restartGame() {
    location.reload()
}