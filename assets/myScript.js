"use strict";


var myCan = document.getElementById("myGame");
var myCtx = myCan.getContext("2d");
var dX = 2;
var dY = -2;
var ballRadius = 10;
var framesPerSec = 30;
var paddleH = 10;
var paddleW = 75;
var paddleX = (myCan.width - paddleW) / 2;
var rightPressed = false;
var leftPressed = false;
var paddleMove = 7;
var brickColumns = 5;
var brickRows = 3;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var brickPadding = 10;
var brickWidth = 75;
var brickHeight = 20;
var score = 0;
var x = determineX(); 
var y = determineY(); 
var lives = 3;

var bricks = [];

for (let c = 0; c < brickColumns; ++c) {
    bricks[c] = [];
    
    for (let r = 0; r < brickRows; ++r) {
    bricks[c][r] = {x: 0, y: 0, statusB: 1};          
    }    
}
 
function determineX() {
    let max = myCan.width - ballRadius - dX;
    let min = ballRadius + dX;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function determineY() {
    let max = myCan.height - (3 * paddleH);
    let min = (brickOffsetTop + (brickPadding + brickHeight) * brickRows); 
    return Math.floor(Math.random() * (max - min + 1)) + min;   
}

function collisionDetection() {
    for (let c = 0; c < brickColumns; ++c) {
        for (let r = 0; r < brickRows; ++r) {
            var b = bricks[c][r];
            if (b.statusB === 1) {
                if ((x + ballRadius + dX) > b.x && (x - ballRadius - dX) < (b.x + brickWidth) && (y + ballRadius + dY) > b.y && (y - ballRadius - dY) < (b.y + brickHeight)) { //ballul intra in bricks rau!!! -- I kindda fixed it :) mai testeaza tu!!!                  
                   dY = -dY; 
                   b.statusB = 0;
                   ++score;
                if (score === brickRows * brickColumns) {
                    alert("You won: CONGRATULATIONS!!!");
                    document.location.reload();
                }
                }
            }
        }
    }    
}

function drawLives()  {
    myCtx.font = "16px Arial";
    myCtx.fillStyle = "#0095DD";
    myCtx.fillText("Lives: " + lives, myCan.width - 65, 20);  
}

function drawScore() {
    myCtx.font = "16px Arial";
    myCtx.fillStyle = "#0095DD";
    myCtx.fillText(`Score:  ${score}`, 8, 20);   
}

function drawBricks() {
    for(let c = 0; c < brickColumns; ++c) {
        for(let r = 0; r < brickRows; ++r){
            if(bricks[c][r].statusB === 1) {
                myCtx.fillStyle = "#0095DD";
                var brickX = ((brickPadding + brickWidth) * c) + brickOffsetLeft;
                var brickY = ((brickPadding + brickHeight) * r) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                myCtx.fillRect(brickX, brickY, brickWidth, brickHeight);
            }   
        }
    }
}

function drawBall() {
    myCtx.fillStyle = "#0095dd";
    myCtx.beginPath();
    myCtx.arc(x, y, ballRadius, 0, Math.PI * 2);
    myCtx.fill();
    myCtx.closePath();
}

function drawPaddle() {
    myCtx.fillStyle = "#0095dd";
    myCtx.fillRect( paddleX, (myCan.height - paddleH), paddleW, paddleH); 
}

(function drawAll() {    
    myCtx.clearRect(0, 0, myCan.width, myCan.height);
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();
    drawLives();
    requestAnimationFrame(drawAll);
})(); 

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(event) {
    if (event.keyCode === 39) {
        rightPressed = true;
    } else if (event.keyCode === 37) {
        leftPressed = true;
    } 
}

function keyUpHandler(event) {
    if(event.keyCode === 39) {
        rightPressed = false;
    } else if (event.keyCode === 37) {
        leftPressed = false;
    }
}

(function moveAll() {
        
    if ( (x + dX > myCan.width - ballRadius) || (x + dX < ballRadius) ) {
        dX = -dX;       
    } 
    
    if (y + dY < ballRadius) {
        dY = -dY;
    }
    
    if (y + dY > myCan.height - ballRadius - paddleH) {
        if (x + dX > paddleX && x + dX < paddleX + paddleW)
            dY = -dY;
    }
    
    if (y - ballRadius - dY > myCan.height) {
        --lives;
        
        if (!lives) {
            alert("GAME OVER");
            document.location.reload();   
        } else {
            x = determineX(); 
            y = determineY(); 
            paddleX = (myCan.width - paddleW) / 2;
            dX = 2;
            dY = -2;
        }
    }  
    
    if (rightPressed && ( paddleX < myCan.width - paddleW) ) {
            paddleX += paddleMove;
    }
    
    if (leftPressed && ( paddleX > 0) ) {
            paddleX -= paddleMove;       
    }
    
    x += dX;
    y += dY;
    requestAnimationFrame(moveAll);
})();

document.addEventListener("mousemove", mouseMoveHandler);   

function mouseMoveHandler(event) {
    let mouseX = event.clientX - myCan.offsetLeft;
    let mouseY= event.clientY - myCan.offsetTop;
    if (mouseX > (paddleW / 2) && mouseX < myCan.width - (paddleW / 2)) {
        if (mouseY > 0 && mouseY < myCan.height)
        paddleX = mouseX - (paddleW / 2);
    }
}

