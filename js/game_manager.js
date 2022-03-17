var maxscore = 2;

function GameManager(size, InputManager, Actuator, ScoreManager) {
  this.size         = size; // Size of the grid
  this.inputManager = new InputManager;
  this.scoreManager = new ScoreManager;
  this.actuator     = new Actuator;

  this.startTiles   = 2;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("save", this.save.bind(this));
  this.inputManager.on("load", this.load.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  this.setup();
}

// Restart the game
GameManager.prototype.restart = function () {
  maxscore = 2;
  this.actuator.continue();
  this.setup();
};

function fillZero(number, digits){ 
    var length = number.length;  
	var nummix = parseInt(number.substring(length-1, length),35);
    if(number.length<digits){    
        number = "z"+number;  
        for(var i=0;i<digits-length-1;i++){  
            number = parseInt((nummix *(i+3)+i)%34, 10).toString(35)+number;  
        }  
    }  
    return number;  
} 

function zpos(number) {
	var ipos;
	ipos = number.indexOf("z");
	return number.substring(ipos+1,number.length);
}

// Save the game
GameManager.prototype.save = function () {
  var savelog = "";
  var savelogful = "";
  var savelogful36 = "";
  var cell, tile;
  var self = this;
  var mul = [13,11,17,23,19];
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      if (tile) {
		switch (tile.value)
		{
		case 2: savelog += "a"; break;
		case 4: savelog += "3"; break;
		case 8: savelog += "b"; break;
		case 16: savelog += "5"; break;
		case 32: savelog += "c"; break;
		case 64: savelog += "7"; break;
		case 128: savelog += "d"; break;
		case 256: savelog += "9"; break;
		case 512: savelog += "2"; break;
		case 1024: savelog += "6"; break;
		case 2048: savelog += "1"; break;
		case 4096: savelog += "g"; break;
		case 8192: savelog += "4"; break;
		case 16384: savelog += "f"; break;
		case 32768: savelog += "8"; break;
		case 65536: savelog += "h"; break;
		case 131072: savelog += "0"; break;
		}
	  }
	  else
      savelog += "e";
    }
	savelogful = savelogful + savelog + "-";
	savelogful36 = savelogful36 + fillZero((parseInt(savelog,18)*mul[x]).toString(35),5);
	savelog = "";
  }
  
  var savesc = fillZero((parseInt(this.score,10)*parseInt(savelogful36.substring(17,18),36)+12417).toString(35),7);
  savelogful36 += savesc;
  var savelogfin = savelogful36.substring(0, 4);
  for (var x = 1; x < 8; x++) {
	savelogfin = savelogfin + "-" +savelogful36.substring(x*4, x*4+4);
  }
  document.getElementById("savell").value = savelogfin;
  document.getElementById("savellshow").innerHTML = "档案已保存，请全选复制上方的32位存档码。下次打开网页或在其它设备上打开时，在“读档”框中输入存档码，按“读档”按钮即可继续游戏；也可以把存档码发送给朋友继续游戏。电脑上按W/A/S/D键可能会触发游戏界面，请尽量使用复制的形式输入。<br>档案仅保留按下存档按钮之前的局面情况，<font color='#F00'>如果后续继续游戏，请再点击“存档”按钮。</font><a onClick='javascript: hideSaveShow();'>我知道了</a>";
};


// Save the game
GameManager.prototype.load = function () {
  var loadlog;	
  loadlog=document.getElementById("loadll").value;
  loadlog = loadlog.replace(/-/g, "");
  var mul = [13,11,17,23,19];
  
  var self = this;
  var templog = "", templog2;
  var valid = 0;
  for (var x = 0; x < this.size; x++) {
      templog = zpos(loadlog.substring(x*this.size,x*this.size+this.size));
	  if(parseInt(templog,35)%mul[x] == 0)
	    valid ++;
	}
	
      templog = zpos(loadlog.substring(26,32));
	  if((parseInt(templog,35)-12417)%parseInt(loadlog.substring(17,18),36) == 0)
	    valid ++;
	if(valid < 6)
  document.getElementById("loadllshow").innerHTML = "<font color='#F00'>存档码有误（应为32位），请重试。</font>";
	else
	{
  for (var x = 0; x < this.size; x++) {
  
      templog = zpos(loadlog.substring(x*this.size,x*this.size+this.size));
	  templog2 = (parseInt(templog,35)/mul[x]).toString(18);
    for (var y = 0; y < this.size; y++) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);
	  if(templog2[y] == "e")
	  {
	  if(tile!=null)
		self.grid.removeTile(tile);
		}
	  else
      {
	    if(tile==null && templog2[y] != "e")
		{
	      tile = new Tile(cell, 2);
	}
		switch (templog2[y])
		{
		case "a": tile.value = 2; break;
		case "3": tile.value = 4; break;
		case "b": tile.value = 8; break;
		case "5": tile.value = 16; break;
		case "c": tile.value = 32; break;
		case "7": tile.value = 64; break;
		case "d": tile.value = 128; break;
		case "9": tile.value = 256; break;
		case "2": tile.value = 512; break;
		case "6": tile.value = 1024; break;
		case "1": tile.value = 2048; break;
		case "g": tile.value = 4096; break;
		case "4": tile.value = 8192; break;
		case "f": tile.value = 16384; break;
		case "8": tile.value = 32768; break;
		case "h": tile.value = 65536; break;
		case "0": tile.value = 131072; break;
		}
		
		this.grid.insertTile(tile);
		}
	  }
	  }
	  
      templog = zpos(loadlog.substring(26,32));
	  this.score = (parseInt(templog,35)-12417)/parseInt(loadlog.substring(17,18),36);
	  
  this.actuate();
  document.getElementById("loadllshow").innerHTML = "存档已载入，请继续游戏。<a onClick='javascript: hideLoadShow();'>好的，关闭提示</a>";
  }
};



// Keep playing after winning
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continue();
};

GameManager.prototype.isGameTerminated = function () {
  if (this.over || (this.won && !this.keepPlaying)) {
    return true;
  } else {
    return false;
  }
};

// Set up the game
GameManager.prototype.setup = function () {
  this.grid        = new Grid(this.size);

  this.score       = 0;
  this.over        = false;
  this.won         = false;
  this.keepPlaying = false;

  // Add the initial tiles
  this.addStartTiles();

  // Update the actuator
  this.actuate();
};

// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    var value = Math.random() < 0.9 ? 2 : 4;
    var tile = new Tile(this.grid.randomAvailableCell(), value);

    this.grid.insertTile(tile);
  }
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  if (this.scoreManager.get() < this.score) {
    this.scoreManager.set(this.score);
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  this.scoreManager.get(),
    terminated: this.isGameTerminated()
  });

};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
  // 0: up, 1: right, 2:down, 3: left
  var self = this;

  if (this.isGameTerminated()) return; // Don't do anything if the game's over

  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          self.score += merged.value;

          if (merged.value > maxscore)
            maxscore = merged.value;

          // The mighty 131072 tile
          if (merged.value === 131072) self.won = true;
        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    this.addRandomTile();

    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }

    this.actuate();
  }
};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // up
    1: { x: 1,  y: 0 },  // right
    2: { x: 0,  y: 1 },  // down
    3: { x: -1, y: 0 }   // left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = self.grid.cellContent(cell);

          if (other && other.value === tile.value) {
            return true; // These two tiles can be merged
          }
        }
      }
    }
  }

  return false;
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
