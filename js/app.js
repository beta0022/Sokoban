const WALL = 'WALL'
const FLOOR = 'FLOOR'
const TARGET = 'TARGET'

const PLAYER = 'PLAYER'
const BOX = 'BOX'
const BOX_ON_TARGET = 'BOX_ON_TARGET'
const CLOCK = 'CLOCK'
const GOLD = 'GOLD'
const GLUE = 'GLUE'

const PLAYER_IMG = '<img src="img/player.png" />'
const BOX_IMG = '<img src="img/box.png" />'
const BOX_ON_TARGET_IMG = '<img src="img/box-on-target.png" />'
const CLOCK_IMG = '<img src="img/clock.png" />'
const GOLD_IMG = '<img src="img/gold.png" />'
const GLUE_IMG = '<img src="img/glue.png" />'

const VICTORY_SOUND = new Audio('sound/victory.wav')


var gBoard
var gPlayerPos
var gBoxPos
var gIDiff
var gJDiff
var gIsGameOn
var gIsTarget
var gTargetOnBoard
var gBoxOnTarget
var gScoreCounter
var scoreCounter = document.getElementById('score-counter')
var gIsGlue
var gIntervalClock
var gIntervalGold
var gIntervalGlue



function initGame() {
	gPlayerPos = { i: 1, j: 1 }
	gBoxPos = { i: 2, j: 2 }
	gBoard = buildBoard()
	renderBoard(gBoard)

	gIsGameOn = true
	gTargetOnBoard = 4
    gBoxOnTarget = 0
	gScoreCounter = 100
	var scoreCounter = document.getElementById('score-counter')
	scoreCounter.innerHTML = gScoreCounter
	gIsGlue = false

	gIntervalClock = setInterval(addClock, 10000)
	gIntervalGold = setInterval(addGold, 10000)
	gIntervalGlue = setInterval(addGlue, 10000)
}


function buildBoard() {
	// Create the Matrix
	var board = createMat(8, 9)

	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null }

			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL
			}

			// Add created cell to the game board
			board[i][j] = cell
		}
	}
	// Place walls inside the room
	board[3][1].type = WALL
	board[3][2].type = WALL
	board[3][3].type = WALL
	board[4][3].type = WALL
	board[1][6].type = WALL
	board[2][6].type = WALL

	// Place the player
	board[gPlayerPos.i][gPlayerPos.j].gameElement = PLAYER

	// Place boxes
	board[gBoxPos.i][gBoxPos.j].gameElement = BOX
	board[3][6].gameElement = BOX
	board[4][4].gameElement = BOX
	board[4][5].gameElement = BOX

	// Place targets locations
	board[2][5].type = TARGET
	board[1][7].type = TARGET
	board[4][1].type = TARGET
	board[6][7].type = TARGET

	return board
}


// Render the board to an HTML table
function renderBoard() {
	var strHTML = ''

	for (var i = 0; i < gBoard.length; i++) {
		strHTML += '<tr>\n'

		for (var j = 0; j < gBoard[0].length; j++) {
			
			var currCell = gBoard[i][j]

			var cellClass = getClassName({ i: i, j: j })

			if (currCell.type === FLOOR) {
				cellClass += ' floor'

			} else if (currCell.type === WALL) {
				cellClass += ' wall'

			} else if (currCell.type === TARGET) {
				cellClass += ' target'
			} 

			//Change to template string
			strHTML += '\t<td class="cell ' + cellClass +
				'"  onclick="moveTo(' + i + ',' + j + ')" >\n'

			// Change to switch case statement
			if (currCell.gameElement === PLAYER) {
				strHTML += PLAYER_IMG

			} else if (currCell.gameElement === BOX) {
				strHTML += BOX_IMG
			}

			strHTML += '\t</td>\n'
		}

		strHTML += '</tr>\n'
	}

	var elBoard = document.querySelector('.board')
	elBoard.innerHTML = strHTML
}


// Move the player to a specific location
function moveTo(i, j) {

	var currCell = gBoard[i][j]
	var nextCellCoords

	if (gIsGlue || !gIsGameOn) return

	else if (currCell.type != WALL) {

		// Calculate distance to make sure we are moving to a neighbor cell
		gIDiff = i - gPlayerPos.i //
		gJDiff = j - gPlayerPos.j


		var iAbsDiff = Math.abs(i - gPlayerPos.i)
		var jAbsDiff = Math.abs(j - gPlayerPos.j)

		// If the clicked cell is one of the four allowed
		if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

			// Move the box
			if (currCell.gameElement == BOX) {
				console.log('MOVE BOX')

				nextCellCoords = gBoard[i + gIDiff][j+ gJDiff]

				if (nextCellCoords.type == WALL || nextCellCoords.gameElement == BOX) {
					console.log('CANT MOVE THERE')
					return

				} else setBoxPos(i,j)

				isVictory ()	
			}

			
			// gives the player 10 free steps (not counted), and the color of the player's cell changes to green
			else if (currCell.gameElement == CLOCK) {
				console.log('CLOCK')
				gIsClock = true
				
				gScoreCounter+= 10

				var currCell = getClassName({ i: i, j: j })
				var elClockCell = document.getElementsByClassName(currCell)[0]
				elClockCell.style.backgroundColor = "#6eb16e"
				setTimeout(() => {
					elClockCell.style.backgroundColor = "#DED6AD"
					}, 3000)

			}

			
			// adds 100 Points to the player's score, and the color of the player's cell changes to green
			else if (currCell.gameElement == GOLD) {
				console.log('GOLD')
				gIsGold = true
				
				gScoreCounter+= 100
				scoreCounter.innerHTML = gScoreCounter
				
				var currCell = getClassName({ i: i, j: j })
				var elClockCell = document.getElementsByClassName(currCell)[0]
				elClockCell.style.backgroundColor = "#6eb16e"
				setTimeout(() => {
					elClockCell.style.backgroundColor = "#DED6AD"
				}, 3000)
			}


			// when stepped upon, player is stuck for 5 seconds and 5 steps are counted, and the color of the player's cell changes to red
			else if (currCell.gameElement == GLUE) {
				console.log('GLUE')
				gIsGlue = true
				
				gScoreCounter-= 5
				scoreCounter.innerHTML = gScoreCounter

				var currCell = getClassName({ i: i, j: j })
				var elClockCell = document.getElementsByClassName(currCell)[0]
				elClockCell.style.backgroundColor = "#c86a61"
				setTimeout(() => {
					elClockCell.style.backgroundColor = "#DED6AD"
					}, 5000)

				setTimeout(() => gIsGlue = false, 5000)
			}

			setPlayerPos(i,j)
			// Update score count
			gScoreCounter--
			scoreCounter.innerHTML--
			checkScore(gScoreCounter)
	
		} else console.log('CANT MOVE THERE')
	}
}


function setPlayerPos(i,j) {
	// Model:
	gBoard[gPlayerPos.i][gPlayerPos.j].gameElement = null
	// Dom:
	renderCell(gPlayerPos, '')
	// Moving to selected position
	// Model:
	gPlayerPos.i = i
	gPlayerPos.j = j

	gBoard[gPlayerPos.i][gPlayerPos.j].gameElement = PLAYER
	// DOM:
	renderCell(gPlayerPos, PLAYER_IMG)

}


function setBoxPos(i,j) {
	
	var currCell = gBoard[i][j]

	gBoxPos = { i: i, j: j}

	currCell.gameElement = null
	renderCell(gBoxPos, '')

	gBoxPos.i = i + gIDiff
	gBoxPos.j = j + gJDiff

	gBoard[gBoxPos.i][gBoxPos.j].gameElement = BOX
	renderCell(gBoxPos, BOX_IMG)

}


function addClock() {
	addElement(CLOCK, CLOCK_IMG)
}


function addGold() {
	addElement(GOLD, GOLD_IMG)
}


function addGlue() {
	addElement(GLUE, GLUE_IMG)
}


function addElement(gameElement, value) {
	var location = getEmptyCells()

	if (!location) return
	
    gBoard[location.i][location.j].gameElement = gameElement
    renderCell(location, value)

	setTimeout(removeElement, 5000,location)
}


function removeElement(location){
	if (gBoard[location.i][location.j].gameElement !== PLAYER) {
		gBoard[location.i][location.j].gameElement = null
		renderCell(location, '')
	}
}

function changeColor() {
	
}
// Check if win the game
function checkScore() {
	if (gScoreCounter === 0){
	console.log('GAME OVER')
	gameOver()
	}
}


function isVictory () {

	if (gBoard[gBoxPos.i][gBoxPos.j].type == TARGET) {
		gBoxOnTarget++

		gBoard[gBoxPos.i][gBoxPos.j].gameElement == BOX_ON_TARGET
		renderCell(gBoxPos, BOX_ON_TARGET_IMG)
		
		if (gTargetOnBoard === gBoxOnTarget) {
		VICTORY_SOUND.play()
		console.log('VICTORY')
		gameOver()
		}
	} 
}


// If the game is over
function gameOver() {
	gIsGameOn = false
	clearInterval(gIntervalClock)
	clearInterval(gIntervalGold)
	clearInterval(gIntervalGlue)

	var elContainer = document.querySelector('.btn-container')
	elContainer.classList.remove('hide')
}


// Click on button restar  game
function restarGame() {
    document.querySelector('.btn-container').classList.add('hide')
    initGame()
}


// Move the player by keyboard arrows
function handleKey(event) {

	var i = gPlayerPos.i
	var j = gPlayerPos.j
	
    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1)
            break;

        case 'ArrowRight':
            moveTo(i, j + 1)
            break;

        case 'ArrowUp':
            moveTo(i - 1, j)
            break;

        case 'ArrowDown':
            moveTo(i + 1, j)
            break;
    }
}