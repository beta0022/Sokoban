// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j
	return cellClass
}


// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector)
	elCell.innerHTML = value
}


function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}


function getEmptyCells(){
	var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {

        for (var j = 0; j < gBoard[i].length; j++) {
			
            if (gBoard[i][j].gameElement === null && gBoard[i][j].type === FLOOR)
			emptyCells.push({ i, j })
        }
    }

    return emptyCells[getRandomInt(0, emptyCells.length)]
}


function createMat(ROWS, COLS) {
    var mat = []

    for (var i = 0; i < ROWS; i++) {
        var row = []

        for (var j = 0; j < COLS; j++) {
            row.push('')
        }

        mat.push(row)
    }

    return mat
}