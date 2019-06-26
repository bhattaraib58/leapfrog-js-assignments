(function () {
    var GAME_ANIMATION_SPEED_FPS = 60;
    var CONTAINER_WIDTH = 288;
    var CONTAINER_HEIGHT = 512;
    var MOVING_SPACE = CONTAINER_HEIGHT - 112
    var GAME_SPEED = 1;

    var AccelerationY = 0;
    var GRAVITY = 0.3;
    var BIRD_SPEED_LIMIT = 3;

    var BIRD_HEIGHT = 24;
    var BIRD_WIDTH = 34;
    var BIRD_DEFAULT_X_POSITION = 50;
    var BIRD_DEFAULT_Y_POSITION = CONTAINER_HEIGHT / 2 / 2;

    var dieAudio = new Audio('./assets/audio/die.wav');
    var pointAudio = new Audio('./assets/audio/point.wav');
    var swooshAudio = new Audio('./assets/audio/swoosh.wav');
    var wingAudio = new Audio('./assets/audio/wing.wav');

    var OBSTACLE_BETWEEN_SPACE = 2 * BIRD_HEIGHT;

    var PIPE_WIDTH = 52;
    var PIPE_HEIGHT = 320;

    var OBSTACLES = [
        './assets/sprites/pipe-green.png',
        './assets/sprites/pipe-red.png',
    ];

    var GAME_MODES = [
        './assets/sprites/background-day.png',
        './assets/sprites/background-night.png',
    ];

    var BIRDS_IMAGE_ARRAY = [
        './assets/sprites/bluebird.gif',
        './assets/sprites/redbird.gif',
        './assets/sprites/yellowbird.gif',
    ];


    //create the  container with styles
    (function () {
        var containerBackground = document.getElementById('containerBackground');
        containerBackground.style.height = CONTAINER_HEIGHT + 'px';
        containerBackground.style.width = CONTAINER_WIDTH + 'px';

        var gameBackground = GAME_MODES[getRandom(0, 1)];
        containerBackground.style.backgroundImage = 'url(' + gameBackground + ')';
        containerBackground.style.margin = 'auto auto';
        containerBackground.style.backgroundSize = '100% 100%';
        containerBackground.style.backgroundRepeat = 'repeat-x';
        containerBackground.style.position = 'relative';
        containerBackground.style.overflow = 'hidden';

        var containerRoad = document.getElementById('containerRoad');
        containerRoad.style.position = 'absolute';
        containerRoad.style.height = CONTAINER_HEIGHT + 'px';
        containerRoad.style.width = CONTAINER_WIDTH + 'px';
        containerRoad.style.backgroundImage = 'url(\'./assets/sprites/base.png\')';
        containerRoad.style.backgroundSize = '100%';
        containerRoad.style.backgroundRepeat = 'repeat-x';
        containerRoad.style.backgroundPosition = 'bottom';
        containerRoad.style.zIndex = 20;
    }());


    /**
     * Get Random Value between min and max provided
     *
     * @param {*} min
     * @param {*} max
     * @returns
     */
    function getRandom(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     *  BIRD Class
     *
     * @param {*} x
     * @param {*} y
     * @param {*} parentElement
     */
    function BIRD(parentElement) {
        this.x = BIRD_DEFAULT_X_POSITION;
        this.y = BIRD_DEFAULT_Y_POSITION;
        this.vx = 0;
        this.vy = 0;
        this.angle = 0;
        this.accelerationY = AccelerationY;
        this.gravity = GRAVITY;

        this.speedLimit = BIRD_SPEED_LIMIT;

        this.birdElement = null;

        this.init = function () {
            this.birdElement = document.createElement('div');
            var birdImage = BIRDS_IMAGE_ARRAY[getRandom(0, BIRDS_IMAGE_ARRAY.length - 1)];
            this.birdElement.style.backgroundImage = 'url(' + birdImage + ')';
            this.birdElement.style.backgroundRepeat = 'no-repeat';
            this.birdElement.style.backgroundPosition = 'center';
            this.birdElement.style.backgroundSize = '100% 100%';

            this.birdElement.style.height = BIRD_HEIGHT + 'px';
            this.birdElement.style.width = BIRD_WIDTH + 'px';
            this.birdElement.style.position = 'absolute';
            this.birdElement.style.transform = 'rotate(' + this.angle + 'deg)';
            this.birdElement.style.zIndex = 30;

            parentElement && parentElement.appendChild(this.birdElement);
        };

        /**
         *   Draw the bird in X,Y Cordinate
         */
        this.draw = function () {
            this.birdElement.style.top = this.y + 'px';
            this.birdElement.style.left = this.x + 'px';
            this.birdElement.style.transform = 'rotate(' + this.angle + 'deg)';
        };

        /**
         * Move the bird by incrment/decrement values
         *
         * @param {*} xInc
         * @param {*} yInc
         */
        this.move = function (xInc, yInc) {
            this.y = this.y + yInc;
            this.x = this.x + xInc;
            this.draw();
        };

        // get the four side coordinates of the bird
        this.getBirdTop = function () { return this.y; };
        this.getBirdBottom = function () { return this.y + BIRD_HEIGHT; };
        this.getBirdLeft = function () { return this.x; };
        this.getBirdRight = function () { return this.x + BIRD_WIDTH; };
    }



    /**
     *  PIPE Class
     *
     * @param {*} x
     * @param {*} y
     * @param {*} parentElement
     */
    function PIPE(parentElement) {
        this.x = 0;
        this.y = 0;

        this.pipeElement = null;
        this.pipeRemoved = false;

        var that = this;
        this.clearPipe = function () {
            that.pipeElement.remove();
            that.pipeRemoved = true;
        };

        /**
         *   Initialize the pipe 
         *   @param {*} pipeImage
         */
        this.init = function (pipeImage) {
            this.pipeElement = document.createElement('div');

            this.pipeElement.style.backgroundImage = 'url(' + pipeImage + ')';
            this.pipeElement.style.backgroundRepeat = 'no-repeat';
            this.pipeElement.style.backgroundPosition = 'center';
            this.pipeElement.style.backgroundSize = '100% 100%';

            this.pipeElement.style.height = PIPE_HEIGHT + 'px';
            this.pipeElement.style.width = PIPE_WIDTH + 'px';
            this.pipeElement.style.position = 'absolute';
            this.pipeElement.style.zIndex = 10;

            parentElement && parentElement.appendChild(this.pipeElement);
        };

        /**
         *   Draw the pipe in X,Y Cordinate
         */
        this.draw = function () {
            this.pipeElement.style.top = this.y + 'px';
            this.pipeElement.style.left = this.x + 'px';
        };

        /**
         * Move the pipe by incrment/decrement values
         *
         * @param {*} xInc
         * @param {*} yInc
         */
        this.move = function (xInc, yInc) {
            this.y = this.y + yInc;
            this.x = this.x + xInc;
            this.draw();
        };

        // get the four side coordinates of the pipe
        this.getPipeTop = function () { return this.y; };
        this.getPipeBottom = function () { return this.y + PIPE_HEIGHT; };
        this.getPipeLeft = function () { return this.x; };
        this.getPipeRight = function () { return this.x + PIPE_WIDTH; };
    }


    /**
     *  Game Animation Class
     *
     * @param {*} fps
     * @param {*} parentElement
     */
    function GameAnimation(fps, parentElement) {
        var obstacles = [];
        var bird = null;
        var birdCollision = false;

        var obstacleImage = OBSTACLES[getRandom(0, 1)];

        var score = 0;
        var distanceTravelled = 0;
        var highScore = localStorage.getItem("highScore") || 0;

        var keyPressed = false;
        var keyPressedCounter = 0;
        var keyPressedId = 0;

        fps = fps || GAME_ANIMATION_SPEED_FPS;
        var start = 0,
            frameDuration = 1000 / fps;
        var animationFrameVariable = 0;
        var gameSpeed = gameSpeed || GAME_SPEED;

        this.init = function () {
            this.gameReset();

            bird = new BIRD(parentElement);
            bird.init();
            bird.draw();

            this.generateObstacle();

            animationFrameVariable = window.requestAnimationFrame(this.animate.bind(this));
        };

        this.gameReset = function () {
            obstacles = [];
            bird = null;
            birdCollision = false;

            var gameBackground = GAME_MODES[getRandom(0, 1)];
            parentElement.style.backgroundImage = 'url(' + gameBackground + ')';

            obstacleImage = OBSTACLES[getRandom(0, 1)];

            score = 0;
            distanceTravelled = 0;
            highScore = localStorage.getItem("highScore") || 0;

            keyPressed = false;
            keyPressedCounter = 0;
            keyPressedId = 0;

            start = 0;
            animationFrameVariable = 0;

            var playRestartElement = parentElement.firstElementChild;
            parentElement.innerHTML = '';
            parentElement.appendChild(playRestartElement);

            document.getElementById("highScore").innerHTML = '';
            document.getElementById("score").innerHTML = '';
            document.getElementById("message").innerHTML = '';
        };


        this.animate = function (timestamp) {
            if (!birdCollision) {
                // for limiting fps
                if (timestamp >= start) {
                    this.createObstacles();
                    this.moveBird();
                    this.MoveBackgroundImageAndObstacles();
                    DisplayScoreAndInfo(highScore, score);

                    if (bird.y > MOVING_SPACE || bird.y < -60) {
                        birdCollision = true;
                    }

                    //for fps limitation
                    start = timestamp + frameDuration;
                }
                animationFrameVariable = window.requestAnimationFrame(this.animate.bind(this));
            }
            if (birdCollision) {
                dieAudio.play();
                window.cancelAnimationFrame(animationFrameVariable);
                setHighScoreIfHighest(highScore, score);
                pauseRestartButton.style.display = 'block';
            }
        };

        this.createObstacles = function () {
            // check if last pipe is greater than on distance of objectGenerationRate
            if (obstacles.length != 0) {
                var lastPipe = obstacles[obstacles.length - 1];
                if (lastPipe.x < PIPE_WIDTH * 3) {
                    this.generateObstacle();
                }
            }
        };

        /**
         * Generates Pipe Obstacle
         *
         */
        this.generateObstacle = function () {
            var top = getRandom(0, MOVING_SPACE - OBSTACLE_BETWEEN_SPACE);
            var bottom = MOVING_SPACE + OBSTACLE_BETWEEN_SPACE - top;
            var initialPipeGenerationArea = CONTAINER_WIDTH + PIPE_WIDTH + 10;

            var pipe1 = new PIPE(parentElement);
            pipe1.init(obstacleImage);
            pipe1.move(initialPipeGenerationArea, -top);
            pipe1.pipeElement.style.transform = 'rotate(180deg)';
            obstacles.push(pipe1);

            var pipe2 = new PIPE(parentElement);
            pipe2.init(obstacleImage);
            pipe2.move(initialPipeGenerationArea, bottom);
            obstacles.push(pipe2);
        };

        this.MoveBackgroundImageAndObstacles = function () {
            //decrease distance travelled for move of background image
            distanceTravelled -= gameSpeed;
            // move background image
            parentElement.children[0].style.backgroundPositionX = distanceTravelled + 'px';

            var isPipeOutOfBoundary = false;
            //move the obstacles 
            for (var i = 0; i < obstacles.length; i++) {
                obstacles[i].x -= gameSpeed;
                obstacles[i].draw();

                //collision detection
                if (bird.getBirdLeft() < obstacles[i].getPipeRight() &&
                    bird.getBirdRight() > obstacles[i].getPipeLeft() &&
                    (bird.getBirdTop()) < obstacles[i].getPipeBottom() &&
                    bird.getBirdBottom() > obstacles[i].getPipeTop()) {
                    birdCollision = true;
                }

                //set score when bird passes the pipe
                if (bird.getBirdLeft() >= obstacles[i].getPipeRight() && obstacles[i].getPipeRight() >= BIRD_DEFAULT_X_POSITION) {
                    score += 0.5;
                    pointAudio.play();
                }

                // if obstacles out of container remove them
                if (obstacles[i].x < -(PIPE_WIDTH * 2)) {
                    obstacles[i].clearPipe();
                    isPipeOutOfBoundary = true;
                }
            }

            // remove pipe from array if out of boundary
            // check filter only if pipe out of boundary set true as
            // filter expensive computaion so check and only apply
            if (isPipeOutOfBoundary) {
                obstacles = obstacles.filter(function (obstacle) {
                    return !obstacle.pipeRemoved;
                });
            }
        };

        this.moveBird = function () {
            //Set the bird's acceleration if the keys are being pressed
            if (keyPressed) {
                bird.accelerationY = -5;
                wingAudio.play();
            }

            //Set the bird's acceleration to zero and gravity to default 
            //  if none of the keys are being pressed
            if (!keyPressed) {
                bird.accelerationY = 0;
                bird.gravity = 0.3;
            }

            swooshAudio.play();

            //Apply the acceleration
            bird.vy += bird.accelerationY;

            //Apply gravity
            bird.vy += bird.gravity;

            //Limit the speed
            if (bird.vy > bird.speedLimit * 2) {
                bird.vy = bird.speedLimit * 2;
            }
            if (bird.vy < -bird.speedLimit) {
                bird.vy = -bird.speedLimit;
            }

            //previous y value
            var ty = bird.y;

            //Move the bird
            bird.y += bird.vy;

            // if previous y greater than new y value move angle up
            //moving up
            if (ty > bird.y) {
                // as if bird is moving is downward angle is higher so set angle to 0 when moving down
                if (bird.angle > 0) {
                    bird.angle = 0;
                }
                // dont go higher than 17 degree angles
                if (!(bird.angle < -17)) {
                    bird.angle -= 100 * Math.PI / 180;
                }
            }
            else {
                //dont go lower than 90 degree when falling
                if (!(bird.angle > 90)) {
                    bird.angle += 100 * Math.PI / 180;
                }
            }

            bird.draw();
        };

        this.getUserTapInputPressed = function (event) {

            // check if key is being continiously pressed without removing
            if (keyPressedCounter === 0) {
                keyPressed = true;

                //set timeout for clearing the key pressed
                keyPressedId = setTimeout(function () {
                    keyPressed = false;
                }, 200);
            }
            //set key pressed to false on if key is not removed
            else {
                keyPressed = false;
            }
            keyPressedCounter++;
        };

        this.getUserTapInputPressedRemoved = function () {
            clearTimeout(keyPressedId);
            keyPressed = false;
            keyPressedCounter = 0;
        };
    }

    /**
     *  Display Score And Info
     *
     * @param {*} highScore
     * @param {*} score
     */
    function DisplayScoreAndInfo(highScore, score) {
        // set values in dom
        document.getElementById("highScore").innerHTML = highScore;
        document.getElementById("score").innerHTML = score;
    }

    /**
     * Set High Score if higher than preious High Score
     *
     * @param {*} highScore
     * @param {*} userScore
     */
    function setHighScoreIfHighest(highScore, userScore) {
        if (userScore > highScore) {
            localStorage.setItem("highScore", userScore);
            document.getElementById("message").innerHTML = 'Congratulations You have Got High Score';
        }
    }


    var parentElement = document.getElementById('containerBackground');
    var gameAnimation = new GameAnimation(120, parentElement);

    window.addEventListener("keydown", gameAnimation.getUserTapInputPressed, true);
    window.addEventListener("keyup", gameAnimation.getUserTapInputPressedRemoved, false);

    window.addEventListener("mousedown", gameAnimation.getUserTapInputPressed, true);
    window.addEventListener("mouseup", gameAnimation.getUserTapInputPressedRemoved, false);

    window.addEventListener("ontouchstart", gameAnimation.getUserTapInputPressed, true);
    window.addEventListener("ontouchend", gameAnimation.getUserTapInputPressedRemoved, false);

    var pauseRestartButton = document.getElementById('game-restart-play');
    pauseRestartButton.style.height = CONTAINER_HEIGHT + 'px';
    pauseRestartButton.style.width = CONTAINER_WIDTH + 'px';
    pauseRestartButton.style.backgroundImage = 'url(\'./assets/sprites/message.png\')';
    pauseRestartButton.style.backgroundSize = '100%';
    pauseRestartButton.style.zIndex = 20;

    pauseRestartButton.addEventListener("click", playRestart);
    pauseRestartButton.addEventListener("ontouchstart", playRestart);

    function playRestart() {
        pauseRestartButton.style.display = 'none';
        gameAnimation.init();
    }
})();