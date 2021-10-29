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
const displayWidth = 128;
let points = 0;
const gameStates = {
    TITLE: "title",
    RUNNING: "running",
    OVER: "over"
}
let gameState = gameStates.TITLE;

class Player {
    constructor() {
        this.x = 112;
        this.y = 112;
        this.width = 8;
        this.height = 8;
        this.dx = 1;
        this.dy = 1;
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
        this.safeCoords = getSafeBallSpawnCoordinates(player);
        this.x = this.safeCoords[0];
        this.y = this.safeCoords[1];
        this.dx = Math.random() + 0.01;
        this.dy = Math.random() + 0.01;
        this.width = 8;
        this.height = 8;
        this.sprite = 237;
        this.spriteRotation = 0;
        this.spriteDisplayOptions = [0, 0, 0];
        //@ts-expect-error
        this.ballRotationSpeed = random(10) + 5
    }
    drawBall() {
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
 * @param {Player} player
 */
function getSafeBallSpawnCoordinates(player) {
    if (player.x < displayWidth / 2) {
        if (player.y < displayWidth / 2) {
            // player is in top left quarter
            return [randomIntFromInterval(displayWidth / 2, displayWidth - 16), randomIntFromInterval(displayWidth / 2, displayWidth - 16)];
        } else {
            // player is in bottom left quarter
            return [randomIntFromInterval(displayWidth / 2, displayWidth - 16), randomIntFromInterval(16, displayWidth / 2)];
        }
    } else {
        if (player.y < displayWidth / 2) {
            // player is in top right quarter
            return [randomIntFromInterval(8, displayWidth / 2), randomIntFromInterval(displayWidth / 2, displayWidth - 16)];
        } else {
            // player is in bottom right quarter
            return [randomIntFromInterval(8, displayWidth / 2), randomIntFromInterval(16, displayWidth / 2)];
        }
    }
}

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
        print(`Points:${points}`, 2, 2)
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
            print(`Game over. 1 point.`, 2, 2)
            //@ts-expect-error
            print(`Press LEFT + RIGHT`, 10, 18)
            //@ts-expect-error
            print(`to restart.`, 10, 26)
        } else {
            //@ts-expect-error
            print(`Game over. ${points} points.`, 2, 2)
            //@ts-expect-error
            print(`Press LEFT + RIGHT`, 10, 18)
            //@ts-expect-error
            print(`to restart.`, 10, 26)
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
        print(`Welcome. Press UP to start.`, 2, 2)
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
    if (ball.x <= 8 || ball.x + ball.width >= 120) {
        // push ball back to the wall if it clipped in
        if (ball.x < 8) {
            ball.x = 9;
        }
        if (ball.x + ball.width > 120) {
            ball.x = 111;
        }
        if (Math.abs(ball.dx) < maxBallVelocity) {
            ball.dx *= -1.05;
            points++;
        } else {
            ball.dx *= -1;
            points++;
        }
    }
    if (ball.y <= 16 || ball.y + ball.height >= 120) {
        if (ball.y < 16) {
            ball.y = 17;
        }
        if (ball.y + ball.height > 120) {
            ball.y = 111;
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
        if (player.x + player.width < 120) {
            player.x++
        }
    }
    //@ts-expect-error
    if (btn.left) {
        if (player.x > 8) {
            player.x--
        }
    }
    //@ts-expect-error
    if (btn.down) {
        if (player.y + player.height < 120) {
            player.y++
        }
    }
    //@ts-expect-error
    if (btn.up) {
        if (player.y > 16) {
            player.y--
        }
    }
}

function resetGame() {
    balls = [];
    player.x = 112;
    player.y = 112;
    points = 0;
    t = 0;
    gameState = gameStates.RUNNING;
}