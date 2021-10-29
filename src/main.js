//@ts-check

//@ts-expect-error
paper(15);
//@ts-expect-error
const map = getMap('map');
//@ts-expect-error
pen(0);
let t = 0;
const maxBallNumber = 5;
const maxBallVelocity = 2;
const displayWidth = 168;
const displayHeight = 184;
const unsafeAreaLeftTopRight = 32;
const unsafeAreaBottom = 48;
let points = 0;
const gameStates = {
    TITLE: "title",
    RUNNING: "running",
    OVER: "over"
}
let gameState = gameStates.TITLE;

class Player {
    constructor() {
        this.width = 8;
        this.height = 8;
        this.dx = 1;
        this.dy = 1;
        this.x = displayWidth - unsafeAreaLeftTopRight - this.width;
        this.y = displayHeight - unsafeAreaBottom - this.height;
    }
    drawPlayer() {
        //@ts-expect-error
        sprite(177, this.x, this.y)
    }

    /**
     * 
     * @param {Ball} ball 
     * @returns 
     */
    collidesWith(ball) {
        if (this.x < ball.x + ball.width &&
            this.x + this.width > ball.x &&
            this.y < ball.y + ball.height &&
            this.y + this.width > ball.y) {
            return true;
        }
        return false;
    }
}

let player = new Player();

class Ball {
    /**
     * @param {Player} [player]
     */
    constructor(player) {
        this.width = 8;
        this.height = 8;
        this.safeCoords = getSafeBallSpawnCoordinates(player, this.width, this.height);
        this.x = this.safeCoords[0];
        this.y = this.safeCoords[1];
        this.dx = Math.random() + 0.01;
        this.dy = Math.random() + 0.01;
        this.sprite = 237;
        this.spriteRotation = 0;
        this.spriteDisplayOptions = [0, 0, 0];
        //@ts-expect-error
        this.ballRotationSpeed = random(10) + 5
    }
    drawBall() {
        // //@ts-expect-error
        // print(`x:${this.x} y:${this.y}`)
        if (t % this.ballRotationSpeed == 0) {
            switch (this.spriteRotation) {
                case 0:
                    this.spriteDisplayOptions = [0, 0, 0];
                    this.spriteRotation++;
                    break;
                case 1:
                    this.spriteDisplayOptions = [0, 0, 1];
                    this.spriteRotation++;
                    break;
                case 2:
                    this.spriteDisplayOptions = [1, 1, 0];
                    this.spriteRotation++;
                    break;
                case 3:
                    this.spriteDisplayOptions = [0, 1, 0];
                    this.spriteRotation = 0;
                    break;
            }
        }
        //@ts-expect-error
        sprite(236, this.x, this.y, this.spriteDisplayOptions[0], this.spriteDisplayOptions[1], this.spriteDisplayOptions[2]);
    }
}

/**
 * Returns a [x, y] pair with coordinates at which a ball
 * can safely spawn without being too close to the player.
 * @param {Player} player
 * @param {number} ballWidth
 * @param {number} ballHeight
 * @returns {number[]}
 */
function getSafeBallSpawnCoordinates(player, ballWidth, ballHeight) {
    if (player.x < displayWidth / 2) {
        if (player.y < displayWidth / 2) {
            // player is in top left quarter
            return [
                randomIntFromInterval(displayWidth / 2, displayWidth - unsafeAreaLeftTopRight - ballWidth),
                randomIntFromInterval(displayHeight / 2, displayHeight - unsafeAreaBottom - ballHeight)
            ];
        } else {
            // player is in bottom left quarter
            return [
                randomIntFromInterval(displayWidth / 2, displayWidth - unsafeAreaLeftTopRight - ballWidth),
                randomIntFromInterval(unsafeAreaLeftTopRight, displayHeight / 2)
            ];
        }
    } else {
        if (player.y < displayWidth / 2) {
            // player is in top right quarter
            return [
                randomIntFromInterval(unsafeAreaLeftTopRight, displayWidth / 2),
                randomIntFromInterval(displayHeight / 2, displayHeight - unsafeAreaBottom - ballHeight)
            ];
        } else {
            // player is in bottom right quarter
            return [
                randomIntFromInterval(unsafeAreaLeftTopRight, displayWidth / 2),
                randomIntFromInterval(unsafeAreaLeftTopRight, displayHeight / 2),
            ];
        }
    }
}

/**
 * @param {number} min
 * @param {number} max
 */
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

let balls = [];

export function update() {
    if (gameState == gameStates.RUNNING) {
        // creating a ball every 5 seconds
        if (t % 300 == 0 && balls.length < maxBallNumber) {
            balls.push(new Ball(player));
        }

        // clearing screen
        //@ts-expect-error
        cls();

        // drawing border
        map.draw(0, 0);

        // updating player position
        updatePlayer();

        player.drawPlayer();

        // updating balls position
        balls.forEach(ball => {
            updateBall(ball);
            ball.drawBall();
            if (player.collidesWith(ball)) {
                gameState = gameStates.OVER;
            }
        });


        // drawing score
        //@ts-expect-error
        print(`Points:${points}`, 2, 176)
        t++;
    } else if (gameState == gameStates.OVER) {
        //@ts-expect-error
        cls();
        map.draw(0, 0)
        player.drawPlayer();
        balls.forEach(ball => {
            ball.drawBall();
        });
        if (points == 1) {
            //@ts-expect-error
            print(`Game over. 1 point.`, 2, 169)
            //@ts-expect-error
            print(`Press LEFT + RIGHT to restart.`, 2, 177)
            // //@ts-expect-error
            // print(`to restart.`, 10, 26)
        } else {
            //@ts-expect-error
            print(`Game over. ${points} points.`, 2, 169)
            //@ts-expect-error
            print(`Press LEFT + RIGHT to restart.`, 2, 177)
            // //@ts-expect-error
            // print(`to restart.`, 2, 184)
        }
        //@ts-expect-error
        if (btn.left && btn.right) {
            resetGame();
        }
    } else if (gameState == gameStates.TITLE) {
        //@ts-expect-error
        cls();
        map.draw(0, 0)
        //@ts-expect-error
        print(`Welcome to the Steel Ball Run!`, 2, 169)
        //@ts-expect-error
        print(`Press UP to start.`, 2, 177)
        //@ts-expect-error
        if (btn.up) {
            gameState = gameStates.RUNNING
        }
    }
}

/**
 * @param {Ball} ball
 */
function updateBall(ball) {
    if (ball.x <= unsafeAreaLeftTopRight || ball.x + ball.width >= displayWidth - unsafeAreaLeftTopRight) {
        // push ball back to the wall if it clipped in
        if (ball.x < unsafeAreaLeftTopRight) {
            ball.x = unsafeAreaLeftTopRight + 1;
        }
        if (ball.x + ball.width > displayWidth - unsafeAreaLeftTopRight) {
            ball.x = displayWidth - unsafeAreaLeftTopRight - ball.width;
        }
        if (Math.abs(ball.dx) < maxBallVelocity) {
            ball.dx *= -1.05;
            points++;
        } else {
            ball.dx *= -1;
            points++;
        }
    }
    if (ball.y <= unsafeAreaLeftTopRight || ball.y + ball.height >= displayHeight - unsafeAreaBottom) {
        if (ball.y < unsafeAreaLeftTopRight) {
            ball.y = unsafeAreaLeftTopRight + 1;
        }
        if (ball.y + ball.height > displayHeight - unsafeAreaBottom) {
            ball.y = displayHeight - unsafeAreaBottom - ball.height;
        }
        if (Math.abs(ball.dy) < maxBallVelocity) {
            ball.dy *= -1.05;
            points++;
        } else {
            ball.dy *= -1;
            points++;
        }

    }
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function updatePlayer() {
    //@ts-expect-error
    if (btn.right) {
        if (player.x + player.width < displayWidth - unsafeAreaLeftTopRight) {
            player.x++
        }
    }
    //@ts-expect-error
    if (btn.left) {
        if (player.x > unsafeAreaLeftTopRight) {
            player.x--
        }
    }
    //@ts-expect-error
    if (btn.down) {
        if (player.y + player.height < displayHeight - unsafeAreaBottom) {
            player.y++
        }
    }
    //@ts-expect-error
    if (btn.up) {
        if (player.y > unsafeAreaLeftTopRight) {
            player.y--
        }
    }
}

function resetGame() {
    balls = [];
    player.x = displayWidth - unsafeAreaLeftTopRight - player.width;
    player.y = displayHeight - unsafeAreaBottom - player.height;
    points = 0;
    t = 0;
    gameState = gameStates.RUNNING;
}