var board;
var canvas = document.getElementById("board");
var screen = canvas.getContext("2d");
var turn = "blue";
var log = $("#log");
var starting = true;
var turns = 1;
var help = $("#help");
var gameFinish = false;

function initialize(){
    board = new Array(7);
    for (var i = 0;i < board.length; i ++){
        board[i] = new Array(7);
    }
    for (var i = 0;i < board.length; i ++){
        for (var i2 = 0;i2 < board.length; i2 ++){
            board[i][i2] = {attr:"empty", cannon:0, x:i*50+25, y:i2*50+25, side:"none", truex:i, truey:i2};
        }
    }
    canvas.width = 350;
    canvas.height = 350;
    render();
}
initialize();

function drawLine(){
    //drawLine(color,start x, start y, end x, end y, go through x, go through y)
    screen.lineWidth = 1;
    screen.strokeStyle = "black";
    if (arguments[0] === "red"){
        screen.strokeStyle = "orange";
    } else if (arguments[0] === "blue"){
        screen.strokeStyle = "purple";
    }
    screen.beginPath();
    if (arguments.length >= 5){
        screen.moveTo(arguments[1],arguments[2]);
    }
    for (var i = 5; i < arguments.length - 1; i += 2){
        if (arguments[i+1] !== undefined){
            screen.lineTo(arguments[i],arguments[i+1]);
        }
    }
    screen.lineTo(arguments[3],arguments[4]);
    screen.stroke();
}

function fillColor(a,b,c,d,e){
    //fillColor(start x, start y, end x, end y, color in string)
    screen.beginPath();
    screen.rect(a, b, c, d);
    screen.fillStyle = e;
    screen.fill();
}

function Circle(a,b,c,color){
    //Circle(x,y,radius,color)
    screen.beginPath();
    screen.arc(a,b,c,0,2*Math.PI);
    screen.strokeStyle = "black";
    if (color === "red"){
        screen.strokeStyle = "orange";
    } else if (color === "blue"){
        screen.strokeStyle = "purple";
    }
    screen.stroke();
}

function Rectangle(x1,y1,x2,y2,color){
    screen.strokeStyle = color;
    screen.rect(x1,y1,Math.abs(x2 - x1),Math.abs(y2 - y1));
    screen.stroke();
}

function Arc(x,y,r,sa,ea,color){
    //Arc(x,y,radius,starting angle,ending angle,color)
    //east 0 | south 0.5pi | west 1pi | north 1.5 pi 
    //clockwise
    screen.beginPath();
    screen.strokeStyle = color;
    screen.arc(x,y,r,sa,ea);
    screen.stroke();
}

function isAdjacent(tile1,tile2){
    if (Math.abs(tile1.x - tile2.x) <= 1 && tile1.y - tile2.y === 0){
        return true;
    }
    if (Math.abs(tile1.y - tile2.y) <= 1 && tile1.x - tile2.y === 0){
        return true;
    }
    return false;
}

function getAdjacent(tile){
    var array = [];
    var x = (tile.x - 25) / 50;
    var y = (tile.y - 25) / 50;
    if (x - 1 >= 0){
        array.push(board[x - 1][y]);
    }
    if (x + 1 < board.length){
        array.push(board[x + 1][y]);
    }
    if (y - 1 >= 0){
        array.push(board[x][y - 1]);
    }
    if (y + 1 < board.length){
        array.push(board[x][y + 1]);
    }
    return array;
}

function render(){
    screen.clearRect(0, 0, canvas.width, canvas.height);
    //draw the sides
    fillColor(0,0,350,100,"blue");
    fillColor(0,250,350,350,"red");
    //draw the lines
    for (var i = 1; i <= 6; i += 1){
        drawLine("black",0,i*50,350,i*50);
        drawLine("black",i*50,0,i*50,350);
    }
    //draw the objects inside the board
    for (var i = 0;i < board.length; i ++){
        for (var i2 = 0;i2 < board.length; i2 ++){
            var tile = board[i][i2];
            
            // draw a circle if border on it
            if (tile.attr === "border"){
                Circle(tile.x,tile.y,10,tile.side);
            }
            
            // draw a rectangle if cannon is larger than 1
            if (tile.cannon >= 1){
                if (tile.side === "red"){
                    Rectangle(tile.x-6,tile.y-18,tile.x+6,tile.y,"orange");
                }
                if (tile.side === "blue"){
                    Rectangle(tile.x-6,tile.y,tile.x+6,tile.y+18,"purple");
                }
            }
            
            // draw an arc if cannon is 2
            if (tile.cannon >= 2){
                if (tile.side === "red"){
                    Arc(tile.x,tile.y,22,1.25*Math.PI,1.75*Math.PI,"orange");
                }
                if (tile.side === "blue"){
                    Arc(tile.x,tile.y,22,0.25*Math.PI,0.75*Math.PI,"purple");
                }
            }
            
            //draw a cross if tile is destroyed
            if (tile.attr === "destroy"){
                drawLine("green",tile.x-25,tile.y-25,tile.x+25,tile.y+25);
                drawLine("green",tile.x+25,tile.y-25,tile.x-25,tile.y+25);
            }
            
            //check if this and adjacent tile is border if yes, draw line
            if (tile.attr === "border"){
                if (i - 1 >= 0){
                    if (board[i - 1][i2].attr === "border" && board[i - 1][i2].side === tile.side){
                        drawLine(tile.side,board[i][i2].x,board[i][i2].y,board[i - 1][i2].x,board[i - 1][i2].y);
                    }
                }
                if (i + 1 < board.length){
                    if (board[i + 1][i2].attr === "border" && board[i + 1][i2].side === tile.side){
                        drawLine(tile.side,board[i][i2].x,board[i][i2].y,board[i + 1][i2].x,board[i + 1][i2].y);
                    }
                }
                if (i2 - 1 >= 0){
                    if (board[i][i2 - 1].attr === "border" && board[i][i2 - 1].side === tile.side){
                        drawLine(tile.side,board[i][i2].x,board[i][i2].y,board[i][i2 - 1].x,board[i][i2 - 1].y);
                    }
                }
                if (i2 + 1 < board.length){
                    if (board[i][i2 + 1].attr === "border" && board[i][i2 + 1].side === tile.side){
                        drawLine(tile.side,board[i][i2].x,board[i][i2].y,board[i][i2 + 1].x,board[i][i2 + 1].y);
                    }
                }
            }
        }
    }
}

$(document).keydown(function(key){
    if (gameFinish === true && key.key.toLowerCase() === "r"){
        initialize();
    }
});

$(document).click(function(evt){
    // check for mouse click
    var x = evt.pageX - $("#board").offset().left;
    var y = evt.pageY - $("#board").offset().top;
    console.log("X coords: " + x + ", Y coords: " + y);
    // set tile to the tile that mouse clicked
    if (Math.ceil(x/50) - 1 >= 0 && 
        Math.ceil(x/50) - 1 < board.length && 
        Math.ceil(y/50) - 1 >= 0 &&
        Math.ceil(y/50) - 1 <= board.length && gameFinish === false){
        //add stuffs inside here
        //store the tile
        var tile = board[Math.ceil(x/50) - 1][Math.ceil(y/50) - 1];
        console.log(tile);
        //add a point on to the empty space
        //check if the tile is next to a tile you have
        //get adjacent tiles
        var adj = getAdjacent(tile);
        //loop through all adjacent tiles
        for (var i = 0; i < adj.length; i ++){
            //check if adjacent tile is owned by the side that the turn is running, also check if tile belongs to none
            if ((adj[i].side === turn && tile.side === "none" && adj[i].attr !== "destroy")
                || turns <= 2){
                //if first two turns, check if blue's turn
                if ((turns <= 2 && ( (turn === "blue" && tile.truey <= 1) || (turn === "red" && tile.truey >= 5) ) ) || turns > 2){
                    //render instruction
                    //set tile to border
                    tile.attr = "border";
                    tile.side = turn;
                    changeTurn(tile);
                    break;
                }
            }
        }
        //set up a cannon
        //if click on a tile that has a point on it own by the side
        if (tile.side === turn && tile.attr === "border" && tile.cannon < 2){
            //increase cannon count by 1 
            tile.cannon ++;
            //if cannon count is 2, fire it
            if (tile.cannon === 2){
                //if red, fire up, else fire down
                if (tile.side === "red"){
                    //check from bottom to top
                    for (var i = tile.truey; i >= 0; i --){
                        var checkTile = board[tile.truex][i];
                        //if the tile that is checking has a different side and the tile is not destroy, destroy the tile
                        if (checkTile.side === "blue" && checkTile.attr !== "destroy"){
                            checkTile.attr = "destroy";
                            break;
                        }
                    }
                } else {
                    //check from top to bottom
                    for (var i = tile.truey; i < board.length; i ++){
                        var checkTile = board[tile.truex][i];
                        //if the tile that is checking has a different side and the tile is not destroy, destroy the tile
                        if (checkTile.side === "red" && checkTile.attr !== "destroy"){
                            checkTile.attr = "destroy";
                            break;
                        }
                    }
                }
            }
            changeTurn(tile);
        }
    }
    //render the canvas
    render();
    //render the instruction
    if (turns === 1){
        help.text("Player 1 (Blue), please choose a point on your zone to start");
    } else if (turns === 2){
        help.text("Player 2 (Red), please choose a point on your zone to start");
    } else if (turns % 2 === 1){
        help.text("Player 1 (Blue)'s turn to move!");
    } else {
        help.text("Player 2 (Red)'s turn to move!");
    }
    //check if a player wins
    checkWin();
});

function changeTurn(tile){
    //change turn
    if (turn === "red"){
        turn = "blue";
        log.text("Player 1's Turn (Blue)");
    } else {
        turn = "red";
        log.text("Player 2's Turn (Red)");
    }
    //add a turns
    turns ++;
}

function checkWin(){
    var win = false;
    var side = "none";
    var redZoneTile = 0;
    var blueZoneTile = 0;
    for (var i = 0; i < board.length; i ++){
        for (var i2 = 0; i2 < board.length; i2 ++){
            //get the tile
            var tile = board[i][i2];
            //check if a player make it to the other side
            if ((tile.side === "red" && tile.truey <= 1) ||
                (tile.side === "blue" && tile.truey >= 5)){
                var win = true;
                var side = tile.side;
            }
            //check if a tile in a zone is destroy
            if (tile.attr === "destroy"){
                if (tile.truey <= 1){
                    blueZoneTile ++;
                }
                if (tile.truey >= 5){
                    redZoneTile ++;
                }
            }
        }
    }
    //check if make it to the other side
    if (win === true){
        Win(side);
    }
    //check if tile is more than 7
    if (blueZoneTile >= 7){
        Win("red");
    }
    if (redZoneTile >= 7){
        Win("blue");
    }
}

function Win(side){
    gameFinish = true;
    log.text("Restart by pressing R");
    help.text("The "+side+" side has won the game!");
}







