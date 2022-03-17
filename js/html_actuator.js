function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  this.sharingContainer = document.querySelector(".score-sharing");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continue = function () {
  if (typeof ga !== "undefined") {
    ga("send", "event", "game", "restart");
  }

  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var text=new Array(18);
  text[0] = " ";
  text[1] = "杨岛主";
  text[2] = "火星鱼";
  text[3] = "早培黄仓";
  text[4] = "恶委";
  text[5] = "搞委";
  text[6] = "举委";
  text[7] = "卦委";
  text[8] = "蜘蛛纸牌";
  text[9] = "Snape";
  text[10] = "YY";
  text[11] = "FQD";
  text[12] = "雨茗结弦";
  text[13] = "卖炭翁";
  text[14] = "Lucas Brown";
  text[15] = "演员";
  text[16] = "颜造假";
  text[17] = "遛猴杰";
  var self = this;
  var text2 = function (n) { var r = 0; while (n > 1) r++, n >>= 1; return r; }

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 131072) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  inner.innerHTML = text[text2(tile.value)];

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var mytxt=new Array(14);

  var text3 = function (m) { var r = 0; while (m > 1) r++, m >>= 1; return r; }
  var type    = won ? "game-won" : "game-over";
  var message = won ? "中华人民共和国万岁！" : mytxt[text3(maxscore)-3];
  
  var newtitle="我在2048朝代版(5x5)获得了"+this.score+"分，"+message;	
    document.getElementById("share-weibo").href = "http://service.weibo.com/share/share.php?url=http%3a%2f%2foprilzeng.com%2f2048%2ffull%2f&title="+encodeURIComponent(newtitle)+"%e3%80%902048%e6%9c%9d%e4%bb%a3%e7%89%88+-+5x5+Version%ef%bc%88%e6%94%af%e6%8c%81%e8%b7%a8%e8%ae%be%e5%a4%87%e5%ad%98%e6%a1%a3%ef%bc%89%e3%80%91&pic=http://oprilzeng.com/2048/meta/apple-touch-icon.png&searchPic=false";

 var ua = window.navigator.userAgent.toLowerCase(); 
	if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
	document.title = newtitle;
var ifr = document.createElement('iframe');   
ifr.src = 'http://oprilzeng.com/2048/full/n.php?wd='+encodeURIComponent(newtitle);
ifr.width = 0;
ifr.height = 0;   
document.body.appendChild(ifr);   
}
else
document.title = newtitle;

  if (typeof ga !== "undefined") {
    ga("send", "event", "game", "end", type, this.score);
  }

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;

  this.clearContainer(this.sharingContainer);
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};

HTMLActuator.prototype.scoreTweetButton = function () {
  var tweet = document.createElement("a");
  tweet.classList.add("twitter-share-button");
  tweet.setAttribute("href", "https://twitter.com/share");
  tweet.setAttribute("data-via", "oprilzeng");
  tweet.setAttribute("data-url", "http://oprilzeng.github.io/2048/full");
  tweet.setAttribute("data-counturl", "http://oprilzeng.github.io/2048/full/");
  tweet.textContent = "Tweet";

  var text = "I scored " + this.score + " points at PRC2048-Full edition, a game where you " +
             "join numbers to score high! #PRC2048";
  tweet.setAttribute("data-text", text);

  return tweet;
};
