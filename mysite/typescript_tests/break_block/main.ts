//IDからjavascriptを適用する要素を取得(documentは現在のウェブページ全体の内容を表す)
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;//as(アサーション)で戻り値の型を保証

//nullチェック
if(!canvas){
    throw new Error("Canvasが見つかりません");
}

// canvasの要素を2dで描画するための描画コンテキストを取得
const ctx = canvas.getContext("2d")!;

if(!ctx){
    throw new Error("2D描画コンテキストが見つかりません");
}

//パドルの大きさ
const paddleHeight = 10;
const paddleWidth = 75;
//パドルの初期X座標
let paddleX = (canvas.width - paddleWidth) / 2;

//入力
let rightPressed = false;
let leftPressed = false;

//初期座標
let x = canvas.width / 2;
let y = canvas.height - 30;

//移動量
let dx = 2;
let dy = -2;

//ボールの大きさ
const ballRadius = 10;

//ブロックの設定
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

//ライフ
let lives = 3;

type Brick ={
    x:number;
    y:number;
    status:number;
};

const bricks:Brick[][] = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//スコア
let score = 0;

//ブロックを描画
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
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

//ボールを描画する
function drawBall() {
    ctx.beginPath();
    //円を描画
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

//パドルを描画する
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

//描画処理
function draw() {
    //キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ブロックを描画
    drawBricks();
    //ボールを描画
    drawBall();
    //パドルを描画
    drawPaddle();
    //スコアを表示
    drawScore();
    //ライフを表示
    drawLives();
    //ブロックとの当たり判定
    collisionDetection();

    //壁で反射
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    //天井で反射
    if (y + dy < ballRadius) {
        dy = -dy;

    }
    else if (y + dy > canvas.height - ballRadius) {
        //パドルに当たったら反射
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        //底に当たったときの処理
        else {
            //残機を減らす
            lives--;
            //ライフが尽きたらゲームオーバー
            if (!lives) {
                //ゲームオーバーのアラートを出す
                alert("GAME OVER");
                //ページを再読み込み
                document.location.reload();
            }
            //仕切り直し処理
            else {
                //ボールをリスポーンさせる
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                //パドルを初期位置に移動
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    //移動させる
    x += dx;
    y += dy;

    //パドルを移動させる
    if (rightPressed) {
        //画面外に出ないようにする(Math.minは与えられた引数で小さい方を返す)
        paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
    } else if (leftPressed) {
        paddleX = Math.max(paddleX - 7, 0);
    }

    //draw関数を再帰的に呼び出す
    //この関数を用いることでブラウザ側に画面の更新を合わせることができる
    requestAnimationFrame(draw);
}

//キー入力を監視
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//マウスを監視
document.addEventListener("mousemove", mouseMoveHandler, false);

//キーが押されたとき(eにはイベントの情報が入っている)
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

//キーが離されたとき
function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

//マウスが動いたとき
function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

//ブロックとの当たり判定と付随する処理
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

//スコアを描画する
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

//ライフを描画する
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

//ゲーム全体を描画する
draw();
