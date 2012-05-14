var _canvas = document.getElementById("canvas");
var _canvasBuffer = null;
var _canvasContext = null;
var _canvasBufferContext = null;

var height 	= 9;
var width  	= 36;
var size 	= 20;
var grid 	= Array(height * width);
var grid_n	= Array(height * width);

StateEnum = {
	DEAD:  0,
	ALIVE: 1,
};

ColorEnum = {

};

if (_canvas && _canvas.getContext) {
	_canvasContext = _canvas.getContext('2d');
	_canvasBuffer = document.createElement('canvas');
	_canvasBuffer.width = _canvas.width;
	_canvasBuffer.height = _canvas.height;
	_canvasBufferContext = _canvasBuffer.getContext('2d');
	initGrid();
	setInterval(gameLoop, 1000);
}

var x = 10;
var y = 10;

function initGrid(){
	var test = "\
000000000000000000000000100000000000\
000000000000000000000010100000000000\
000000000000110000001100000000000011\
000000000001000100001100000000000011\
110000000010000010001100000000000000\
110000000010001011000010100000000000\
000000000010000010000000100000000000\
000000000001000100000000000000000000\
000000000000110000000000000000000000\
		";
	var tmp = test.split("");
	for(var i = 0; i < width; i++) {
		for(var j = 0; j < height; j++) {
			if(tmp[j * width + i] == '1')
				grid[j * width + i] = StateEnum.ALIVE;
			else
				grid[j * width + i] = StateEnum.DEAD;	
		}
	}
}

function clearCanvas() {
	_canvasContext.clearRect(0, 0, width * size, height * size);
	_canvasBufferContext.clearRect(0, 0, width * size, height * size);
}

function drawGrid() {
	var size = 20;
	var display = _canvasBufferContext;
	display.fillStyle = "#000";
	display.fillRect(0,0, width * size, height * size);
	display.strokeStyle = "#666";
	for(var i = 0; i < width; i++) {
		for(var j = 0; j < height; j++) {
			if(grid[j * width + i] == StateEnum.ALIVE) {
				display.fillStyle = "#F00";
				display.fillRect(i * size, j * size, size, size);
			} else {
				display.strokeRect(i * size, j * size, size, size);
			}
		}
	}
}

function getCellState(x, y) {
	var cnt = 0 ;
	//Loop through world counting cells
	if(y > 0){
		if(x > 0)
			if(grid[y-1][x-1] == StateEnum.ALIVE) cnt++;
			if(grid[y-1][x] == StateEnum.ALIVE) cnt++;
		if(x<(width-1))
			if(grid[y-1][x+1] == StateEnum.ALIVE) cnt++;
	}

	if((x > 0) && (x < (width-1)))
		if(grid[y][x-1] == StateEnum.ALIVE) cnt++;
	if(x < (width-1))
		if(grid[y][x+1] == StateEnum.ALIVE) cnt++;

	if(y<(height-1)){
		if(x>0)
			if(grid[y+1][x-1] == StateEnum.ALIVE) cnt++;
			if(grid[y+1][x] == StateEnum.ALIVE) cnt++;
		if(x<(width-1))
			if(grid[y+1][x+1] == StateEnum.ALIVE) cnt++;
	}

//	state->neighbors = cnt;
//	state->status    = cworld[y][x];

  return cnt;
}

function updateWorld() {
	for(var i = 0; i < width; i++) {
		for(var j = 0; j < height; j++) {
			state = getCellState(i, j);
			
		}
	}
}
	
function gameLoop() {
	clearCanvas();
	drawGrid();
	updateWorld();
	
	/*
	_canvasBufferContext.fillStyle = "rgb(127,0,0)";
	_canvasBufferContext.fillRect(x, y, 20, 20);
	x += 20;
	y += 20;
	*/
	
	_canvasContext.drawImage(_canvasBuffer, 0, 0);
}
