var _canvas = document.getElementById("canvas");
var _canvasBuffer = null;
var _canvasContext = null;
var _canvasBufferContext = null;
var size = 20;
var world = new World();

var test = "\
00000000000000000000000000000000000000\
00000000000000000000000000000000000000\
00000000000000000000000000000000000000\
00000000000000000000000000000000000000\
00000000000000000000000000000000000000\
00000000000000000000000000000000000000\
00000000000000000000000001000000000000\
00000000000000000000000101000000000000\
00000000000001100000011000000000000110\
00000000000010001000011000000000000110\
01100000000100000100011000000000000000\
01100000000100010110000101000000000000\
00000000000100000100000001000000000000\
00000000000010001000000000000000000000\
00000000000001100000000000000000000000\
00000000000000000000000000000000000000\
00000000000000000000000000000000000000\
00000000000000000000000000000000000000\
00000000000000000000000000000000000000\
00000000000000000000000000000000000000\
00000000000000000000000000000000000000\
";

StateEnum = {
    DEAD:  0,
    ALIVE: 1,
};

ColorEnum = {
	UNDERPOPULATED: "#F00",
	SUSTAINED: 		"#FF0",
	OVERCROWDED: 	"#00F",
	REPRODUCED: 	"#0F0",
};

if (_canvas && _canvas.getContext) {
    _canvasBuffer = document.createElement('canvas');
    _canvasBuffer.width = _canvas.width;
    _canvasBuffer.height = _canvas.height;
    _canvasContext = _canvas.getContext('2d');
    _canvasBufferContext = _canvasBuffer.getContext('2d');
    world.init(test);
    setInterval(loop, 50);
}

function World() {
    
    this.worlds  = Array(2);
    this.current = 0;
    this.height  = 21;
    this.width   = 38;
    
    this.init = function(str) {
        this.worlds[0] = Array(this.height * this.width);
        this.worlds[1] = Array(this.height * this.width);
        var world = this.worlds[this.current];
        var tmp = str.split("");
        for(var i = 0; i < this.height; i++) {
            for(var j = 0; j < this.width; j++) {
                if(tmp[i * this.width + j] == 1) {
                    world[i * this.width + j] = StateEnum.ALIVE;
                } else {
                    world[i * this.width + j] = StateEnum.DEAD;    
                }
            }
        }
    };
    
    this.getWorld = function() {
        return this.worlds[this.current];
    };
    
    this.updateCellState = function(x, y) {
        var cnt = 0 ;
        var grid = this.worlds[this.current];
        var next = this.worlds[(this.current + 1) % 2]
        
        // Check the row above the current cell
        if(y > 0){
            // Top left
            if(x > 0) {
                if(grid[((y-1) * this.width) + (x-1)] == StateEnum.ALIVE) cnt++;            
            }
            
            // Top middle
            if((grid[((y-1) * this.width) + x]) == StateEnum.ALIVE) cnt++;
            
            // Top right
            if(x < (this.width - 1)) {
                if(grid[((y-1) * this.width) + (x+1)] == StateEnum.ALIVE) cnt++;    
            }
        }
        
        // Check the left side
        if((x > 0) && (x < (this.width-1))) {
            if(grid[(y * this.width) + (x-1)] == StateEnum.ALIVE) cnt++;
        }
        
        // Check the right side
        if(x < (this.width - 1)) {
            if(grid[(y * this.width) + (x+1)] == StateEnum.ALIVE) cnt++;
        }
        
        // Check the row below the current cell
        if(y < (this.height - 1)){
            if(x>0) {
                if(grid[((y+1) * this.width) + (x-1)] == StateEnum.ALIVE) cnt++;
            }
            
            if(grid[((y+1) * this.width) + x] == StateEnum.ALIVE) cnt++;
            
            if(x < (this.width - 1)) {
                if(grid[((y+1) * this.width) + (x+1)] == StateEnum.ALIVE) cnt++;
            }
        }

        switch(cnt) {
            case 0:
            case 1:
                next[(y * this.width) + x] = StateEnum.DEAD;
                break;
            case 2:
            case 3:
                if(grid[(y * this.width) + x] == StateEnum.DEAD && cnt == 3) {
                    next[(y * this.width) + x] = StateEnum.ALIVE;
                } else {
                    next[(y * this.width) + x] = grid[(y * this.width) + x];
                }
                break;
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
                next[(y * this.width) + x] = StateEnum.DEAD;
                break;
        }
    };
    
    this.update = function() {
        for(var i = 0; i < this.height; i++) {
            for(var j = 0; j < this.width; j++) {
                this.updateCellState(j, i);
            }
        }
        this.current = (this.current + 1) % 2;
    };
}

function clearCanvas() {
    _canvasContext.clearRect(0, 0, world.width * size, world.height * size);
    _canvasBufferContext.clearRect(0, 0, world.width * size, world.height * size);
}

function drawGrid() {
    var size = 20;
    var grid = world.getWorld();
    var display = _canvasBufferContext;
    display.fillStyle = "#000";
    display.fillRect(0,0, world.width * size, world.height * size);
    display.strokeStyle = "#666";
    for(var i = 0; i < world.width; i++) {
        for(var j = 0; j < world.height; j++) {
            if(grid[j * world.width + i] == StateEnum.ALIVE) {
                display.fillStyle = "#F00";
                display.fillRect(i * size, j * size, size, size);
            } else {
                display.strokeRect(i * size, j * size, size, size);
            }
        }
    }
}

function loop() {
    clearCanvas();
    drawGrid();
    world.update();
    _canvasContext.drawImage(_canvasBuffer, 0, 0);
}