// Canvas要素の設定
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// ボールの設定
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var ballRadius = 10;

// パドルの設定
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

// キー操作の設定
var rightPressed = false;
var leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

// ブロックの設定
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// スコアの設定
var score = 0;

// ライフの設定
var lives = 3;

// ボール描画の関数
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// パドル描画の関数
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// ブロック描画の関数
function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// スコア描画の関数
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

// ライフ描画の関数
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width-65, 20);
}



// ブロックとボールの当たり判定の関数
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      // ブロックが表示されている場合のみ判定を行う
      if (b.status === 1) {
        // ボールの座標がブロックの座標範囲内にある場合は、ブロックが当たったとみなす
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert("You win! Congratulations!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function draw() {
  // Clear canvas before each frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ボールを描画
  drawBall();

  // パドルを描画
  drawPaddle();

  // スコアを描画
  drawScore();

  // ライフを描画
  drawLives();

  // ブロックを描画
  drawBricks();

  // ブロックとボールが当たったかどうかを判定
  collisionDetection();

  // Bounce off walls
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {if (lives > 1) {  // ライフ数が1以上の場合のみ処理を実行する
      lives--;
      x = canvas.width / 2;
      y = canvas.height - 30;
      dx = 3;
      dy = -3;
      paddleX = (canvas.width - paddleWidth) / 2;
    } else {
      alert("GAME OVER");
      document.location.reload();
      clearInterval(interval);
    }

    }
  }

  // Move paddle
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  // Move ball
  x += dx;
  y += dy;
}

// Start game loop
const interval = setInterval(draw, 10);

  
  // ゲームを描画する
  draw();