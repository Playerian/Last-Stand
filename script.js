var board;
var square = 8;
var canvas = document.getElementById("board");
var screen = canvas.getContext("2d");
var turn = "blue";
var log = $("#log");
var starting = true;
var turns = 1;
var help = $("#help");
var gameFinish = false;
var blueColor = "purple";
var redColor = "green";
var direction = "up";
var isMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4));


function initialize(){
    turn = "blue";
    turns = 1;
    gameFinish = false;
    log.text("Player 1's Turn (Blue)");
    help.text("Player 1 (Blue), please choose a point on your zone to start");
    board = [];
    board.length = square;
    for (var i = 0;i < board.length; i ++){
        board[i] = [];
        board[i].length = square;
    }
    for (var i = 0;i < board.length; i ++){
        for (var i2 = 0;i2 < board.length; i2 ++){
            board[i][i2] = {attr:"empty", cannon:0, cannonDirection: "", x:i*50+25, y:i2*50+25, side:"none", color:"none", truex:i, truey:i2};
        }
    }
    canvas.width = square * 50;
    canvas.height = square * 50;
    render();
    renderButton();
}
initialize();

function drawLine(){
    //drawLine(color,start x, start y, end x, end y, go through x, go through y)
    screen.lineWidth = 1;
    screen.strokeStyle = "black";
    if (arguments[0] === "red"){
        screen.strokeStyle = redColor;
    } else if (arguments[0] === "blue"){
        screen.strokeStyle = blueColor;
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
        screen.strokeStyle = redColor;
    } else if (color === "blue"){
        screen.strokeStyle = blueColor;
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
    screen.globalAlpha=0.3;
    fillColor(0,0,square*50,100,"blue");
    fillColor(0,square*50-100,square*50,square*50,"red");
    screen.globalAlpha=1;
    //draw the lines
    for (var i = 1; i < board.length; i += 1){
        drawLine("black",0,i*50,board.length*50,i*50);
        drawLine("black",i*50,0,i*50,board.length*50);
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
            if (tile.cannon >= 1 && tile.attr !== "destroy"){
                //check direction
                if (tile.cannonDirection === "up"){
                    Rectangle(tile.x-6, tile.y-18, tile.x+6, tile.y, tile.color);
                } else if (tile.cannonDirection === "down"){
                    Rectangle(tile.x-6, tile.y, tile.x+6, tile.y+18, tile.color);
                } else if (tile.cannonDirection === "left"){
                    Rectangle(tile.x-18, tile.y-6, tile.x, tile.y+6, tile.color);
                } else if (tile.cannonDirection === "right"){
                    Rectangle(tile.x, tile.y-6, tile.x+18, tile.y+6, tile.color);
                }
            }
            
            // draw an arc if cannon is 2
            if (tile.cannon >= 2 && tile.attr !== "destroy"){
                if (tile.cannonDirection === "up"){
                    Arc(tile.x, tile.y, 22, 1.25*Math.PI, 1.75*Math.PI, tile.color);
                } else if (tile.cannonDirection === "down"){
                    Arc(tile.x, tile.y, 22, 0.25*Math.PI, 0.75*Math.PI, tile.color);
                } else if (tile.cannonDirection === "left"){
                    Arc(tile.x, tile.y, 22, 0.75*Math.PI, 1.25*Math.PI, tile.color);
                } else if (tile.cannonDirection === "right"){
                    Arc(tile.x, tile.y, 22, 1.75*Math.PI, 0.25*Math.PI, tile.color);
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

function renderButton(){
    $(".button").attr("class","button");
    $("#"+direction).addClass("active");
}

function setDirection(arg){
    direction = arg;
    renderButton();
}

$(".button").on(isMobile ? 'touchend' : 'click', function(){
    setDirection($(this).attr("id"));
});

$('#restart').on(isMobile ? 'touchend' : 'click', function(){
    initialize();
});

$(document).keydown(function(key){
    if (gameFinish === true && key.key.toLowerCase() === "r"){
        initialize();
    }
});

$(document).on(isMobile ? 'touchend' : 'click', function(evt){
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
                if ((turns <= 2 && ( (turn === "blue" && tile.truey <= 1) || (turn === "red" && tile.truey >= square - 2) ) ) || turns > 2){
                    //render instruction
                    //set tile to border
                    tile.attr = "border";
                    tile.side = turn;
                    if (turn === "red"){
                        tile.color = redColor;
                    } else {
                        tile.color = blueColor;
                    }
                    changeTurn(tile);
                    break;
                }
            }
            //check if adjecent tile is destroy and is owned by the side
            if (adj[i].side === turn && tile.attr === "destroy"){
                tile.attr = "empty";
                tile.cannon = 0;
                tile.side = "none";
                changeTurn(tile);
                break;
            }
        }
        //set up a cannon
        //if click on a tile that has a point on it own by the side
        if (tile.side === turn && tile.attr === "border" && tile.cannon < 2){
            //increase cannon count by 1 
            tile.cannon ++;
            //set cannon direction if it just got setted up
            if  (tile.cannon === 1){
                tile.cannonDirection = direction;
            }
            //if cannon count is 2, fire it
            if (tile.cannon === 2){
                //check firing direction
                if (tile.cannonDirection === "up"){
                    //check from bottom to top
                    for (var i = tile.truey; i >= 0; i --){
                        var checkTile = board[tile.truex][i];
                        //if the tile that is checking has a different side and the tile is not destroy, destroy the tile
                        if (checkTile.side !== tile.side && checkTile.side !== "none" && checkTile.attr !== "destroy"){
                            checkTile.attr = "destroy";
                            break;
                        }
                    }
                } else if (tile.cannonDirection === "down"){
                    //check from top to bottom
                    for (var i = tile.truey; i < board.length; i ++){
                        var checkTile = board[tile.truex][i];
                        //if the tile that is checking has a different side and the tile is not destroy, destroy the tile
                        if (checkTile.side !== tile.side && checkTile.side !== "none" && checkTile.attr !== "destroy"){
                            checkTile.attr = "destroy";
                            break;
                        }
                    }
                } else if (tile.cannonDirection === "left"){
                    //check from right to left
                    for (var i = tile.truex; i >= 0; i --){
                        var checkTile = board[i][tile.truey];
                        //if the tile that is checking has a different side and the tile is not destroy, destroy the tile
                        if (checkTile.side !== tile.side && checkTile.side !== "none" && checkTile.attr !== "destroy"){
                            checkTile.attr = "destroy";
                            break;
                        }
                    }
                } else if (tile.cannonDirection === "right"){
                    //check from right to left
                    for (var i = tile.truex; i < board.length; i ++){
                        var checkTile = board[i][tile.truey];
                        //if the tile that is checking has a different side and the tile is not destroy, destroy the tile
                        if (checkTile.side !== tile.side && checkTile.side !== "none" && checkTile.attr !== "destroy"){
                            checkTile.attr = "destroy";
                            break;
                        }
                    }
                }
            }
            changeTurn(tile);
        }
    }
    //render the canvas if after the second turn
    if (turns >= 3){
        render();
    }
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
        setDirection("down");
    } else {
        turn = "red";
        log.text("Player 2's Turn (Red)");
        setDirection("up");
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
                (tile.side === "blue" && tile.truey >= square - 2)){
                var win = true;
                var side = tile.side;
            }
            //check if a tile in a zone is destroy
            if (tile.attr === "destroy"){
                if (tile.truey <= 1){
                    blueZoneTile ++;
                }
                if (tile.truey >= square - 2){
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
    render();
    gameFinish = true;
    log.text("Restart by pressing R");
    help.text("The "+side+" side has won the game!");
}





