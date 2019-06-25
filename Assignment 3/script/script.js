(function () {
    var CAR_HEIGHT = 100;
    var CAR_WIDTH = 55;
    var GAME_ANIMATION_SPEED_FPS = 60;
    var CONTAINER_WIDTH = 300;
    var CONTAINER_HEIGHT = 650;
    var GAME_SPEED = 1;

    var OBSTACLES = [
        './images/Cars/pitstop_car_2.png',
        './images/Cars/pitstop_car_3.png',
        './images/Cars/pitstop_car_4.png',
        './images/Cars/pitstop_car_5.png',
        './images/Cars/pitstop_car_6.png',
        './images/Cars/pitstop_car_7.png',
        './images/Cars/pitstop_car_8.png',
        './images/Cars/pitstop_car_9.png',
        './images/Cars/pitstop_car_10.png',
    ];

    var ROAD_LANES =
    {
        'firstLane': 25,
        'middleLane': 130,
        'lastLane': 225
    };

    var ROAD_LANES_VALUES = Object.values(ROAD_LANES);


    //create the  container with styles
    (function () {
        var containerLane = document.getElementById('containerLane');
        containerLane.style.height = CONTAINER_HEIGHT + 'px';
        containerLane.style.width = CONTAINER_WIDTH + 'px';
        containerLane.style.backgroundColor = '#444444';
        containerLane.style.overflow = 'hidden';


        var containerStrips = document.getElementById('containerStrips');
        containerStrips.style.position = 'relative';
        containerStrips.style.height = '100%';
        containerStrips.style.width = '100%';
        containerStrips.style.backgroundImage = `url('./images/stripe.png')`;
        containerStrips.style.backgroundSize = '100%';
        containerStrips.style.backgroundRepeat = 'repeat-y';
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
     *  CAR Class
     *
     * @param {*} x
     * @param {*} y
     * @param {*} parentElement
     */
    function CAR(x, y, parentElement) {
        this.x = x;
        this.y = y;

        this.carElement = null;
        this.carRemoved = false;

        var that = this;
        this.clearCar = function () {
            that.carElement.remove();
            that.carRemoved = true;
        };

        /**
         *   Initialize the Car 
         *   @param {*} carImage
         */
        this.init = function (carImage) {
            this.carElement = document.createElement('div');

            this.carElement.style.backgroundImage = 'url(' + carImage + ')';
            this.carElement.style.backgroundRepeat = 'no-repeat';
            this.carElement.style.backgroundPosition = 'center';
            this.carElement.style.backgroundSize = '100% 100%';

            this.carElement.style.height = CAR_HEIGHT + 'px';
            this.carElement.style.width = CAR_WIDTH + 'px';
            this.carElement.style.position = 'absolute';

            parentElement && parentElement.appendChild(this.carElement);
        };

        /**
         *   Draw the car in X,Y Cordinate
         */
        this.draw = function () {
            this.carElement.style.top = this.y + 'px';
            this.carElement.style.left = this.x + 'px';
        };

        /**
         * Move the car by incrment/decrement values
         *
         * @param {*} xInc
         * @param {*} yInc
         */
        this.move = function (xInc, yInc) {
            this.y = this.y + yInc;
            this.x = this.x + xInc;
            this.draw();
        };


        /**
         * Move the player car in position values
         *
         * @param {*} position
         *
         */
        this.moveUserCar = function (position) {
            this.x = position;
            this.draw();
        };

        // get the four side coordinates of the car
        this.getCarTop = function () { return this.y; };
        this.getCarBottom = function () { return this.y + CAR_HEIGHT; };
        this.getCarLeft = function () { return this.x; };
        this.getCarRight = function () { return this.x + CAR_WIDTH; };
    }



    /**
     *  Game Animation Class
     *
     * @param {*} fps
     * @param {*} parentElement
     */
    function GameAnimation(fps, parentElement) {
        var obstacleCars = [];
        var userCar = null;
        var carCollision = false;
        // current lane 1 as in middle
        var currentLane = 1;
        var score = 0;
        var objectGenerationRate = CAR_HEIGHT * 3 + 20;
        var distanceTravelled = 0;
        var highScore = localStorage.getItem("highScore") || 0;
        var longestDistanceTravelled = localStorage.getItem("longestDistanceTravelled") || 0;

        fps = fps || GAME_ANIMATION_SPEED_FPS;
        var start = 0,
            frameDuration = 1000 / fps;
        var animationFrameVariable = 0;
        var speedIntervalVariable = 0;
        var gameSpeed = gameSpeed || GAME_SPEED;

        this.init = function () {
            this.gameReset();
            this.generateUserCar();
            this.gameStart();
        };

        this.gameReset = function () {
            obstacleCars = [];
            userCar = null;
            carCollision = false;
            currentLane = 1;
            score = 0;
            objectGenerationRate = CAR_HEIGHT * 3 + 20;
            distanceTravelled = 0;
            highScore = localStorage.getItem("highScore") || 0;
            longestDistanceTravelled = localStorage.getItem("longestDistanceTravelled") || 0;
            gameSpeed = GAME_SPEED;
            var playRestartElement = parentElement.firstElementChild;
            parentElement.innerHTML = '';
            parentElement.appendChild(playRestartElement);

            document.getElementById("highscore").innerHTML = '';
            document.getElementById("longestdistance").innerHTML = '';
        };

        this.generateUserCar = function () {
            var xAxis = ROAD_LANES_VALUES[currentLane];
            //max user car inside boundary
            var yAxis = CONTAINER_HEIGHT - CAR_HEIGHT - 10;
            userCar = new CAR(xAxis, yAxis, parentElement);

            //initialized with default image
            userCar.init('./images/Cars/pitstop_car_1.png');
            userCar.draw();
        };

        this.gameStart = function () {
            //speed up game speed every 1 sec 
            speedIntervalVariable = setInterval(function () {
                gameSpeed += 0.1;
            }, 1000);

            //generate obstacle after 1.2 sec
            setTimeout(function () {
                var carObstacle = generateObstacle(parentElement);
                obstacleCars.push(carObstacle);
            }, 1200);

            //start animation
            animationFrameVariable = window.requestAnimationFrame(this.animate.bind(this));
        };

        this.animate = function (timestamp) {
            if (!carCollision) {
                // for limiting fps
                if (timestamp >= start) {
                    this.createObstacles();
                    this.MoveBackgroundImageAndObstacles();
                    DisplayScoreAndInfo(highScore, longestDistanceTravelled, score, distanceTravelled, gameSpeed);

                    //for fps limitation
                    start = timestamp + frameDuration;
                }
                animationFrameVariable = window.requestAnimationFrame(this.animate.bind(this));
            }
            if (carCollision) {
                window.cancelAnimationFrame(animationFrameVariable);
                clearInterval(speedIntervalVariable);

                setHighScoreIfHighest(highScore, score, longestDistanceTravelled, distanceTravelled);

                pauseRestartButton.parentNode.style.display = 'block';
                pauseRestartButton.innerHTML = 'Restart';
            }
        };

        this.createObstacles = function () {
            //check if last car is greater than on distance of objectGenerationRate
            // default objectGenerationRate= 3*car height
            if (obstacleCars.length != 0) {
                var lastCar = obstacleCars[obstacleCars.length - 1];
                if (lastCar.y > objectGenerationRate) {
                    var carObstacle = generateObstacle(parentElement);
                    obstacleCars.push(carObstacle);
                }
            }

            //generate objects on per 2* car height for 5000 distance
            if (distanceTravelled > 5000) {
                objectGenerationRate = CAR_HEIGHT * 2 + 20;
            }
        }

        this.MoveBackgroundImageAndObstacles = function () {
            distanceTravelled += gameSpeed;
            // move background image
            parentElement.style.backgroundPositionY = distanceTravelled + 'px';

            var isCarOutOfBoundary = false;
            //move the obstacles 
            for (var i = 0; i < obstacleCars.length; i++) {
                obstacleCars[i].y += gameSpeed;
                obstacleCars[i].draw();

                //collision detection
                if (userCar.getCarLeft() < obstacleCars[i].getCarRight() &&
                    userCar.getCarRight() > obstacleCars[i].getCarLeft() &&
                    (userCar.getCarTop() + 10) < obstacleCars[i].getCarBottom() &&
                    userCar.getCarBottom() - 10 > obstacleCars[i].getCarTop()) {
                    carCollision = true;
                }

                // if obstacles out of container remove them
                if (obstacleCars[i].y > CONTAINER_HEIGHT) {
                    obstacleCars[i].clearCar();
                    isCarOutOfBoundary = true;
                    score += 1;
                }
            }

            // remove cars from array if out of boundary
            // check filter only if car out of boundary set true as
            // filter expensive computaion
            if (isCarOutOfBoundary) {
                obstacleCars = obstacleCars.filter(function (obstacle) {
                    return !obstacle.carRemoved;
                });
            }
        };

        this.moveCar = function (event) {
            //stop moving car if collision occured
            if (!carCollision) {
                if (event.code == "KeyA" || event.code == "ArrowLeft") {
                    if (currentLane > 0) {
                        if (userCar.x <= ROAD_LANES_VALUES[currentLane]) {
                            currentLane--;
                            userCar.x = ROAD_LANES_VALUES[currentLane];
                            userCar.draw();
                        }
                    }
                }
                if (event.code == "KeyD" || event.code == "ArrowRight") {
                    if (currentLane < (ROAD_LANES_VALUES.length - 1)) {
                        if (userCar.x <= ROAD_LANES_VALUES[currentLane]) {
                            currentLane++;
                            userCar.x = ROAD_LANES_VALUES[currentLane];
                            userCar.draw();
                        }
                    }
                }
            }
        };
    }


    /**
     * Generates Car Obstacle
     *
     * @param {*} parentElement
     * @returns
     */
    function generateObstacle(parentElement) {
        var obstacleImagePosition = getRandom(0, (OBSTACLES.length - 1));
        var obstacleImage = OBSTACLES[obstacleImagePosition];
        var lane = getRandom(0, ROAD_LANES_VALUES.length - 1);

        var car = new CAR(ROAD_LANES_VALUES[lane], 0, parentElement);
        car.init(obstacleImage);
        car.draw();
        return car;
    }



    /**
     * Display Score And Info
     *
     * @param {*} highScore
     * @param {*} longestDistanceTravelled
     * @param {*} score
     * @param {*} distanceTravelled
     * @param {*} gameSpeed
     */
    function DisplayScoreAndInfo(highScore, longestDistanceTravelled, score, distanceTravelled, gameSpeed) {
        // get whole number
        highScore = Math.floor(highScore);
        longestDistanceTravelled = Math.floor(longestDistanceTravelled);
        distanceTravelled = Math.floor(distanceTravelled);
        //Get Speed in 2 digits after decimal  as whole number multiplied by 100
        speed = Math.round(gameSpeed * 100);

        // set values in dom
        document.getElementById("highScore").innerHTML = highScore;
        document.getElementById("longestDistanceTravelled").innerHTML = longestDistanceTravelled;
        document.getElementById("score").innerHTML = score;
        document.getElementById("distanceTravelled").innerHTML = distanceTravelled;
        document.getElementById("speed").innerHTML = speed;
    }


    /**
     * Set High Score if higher than preious High Score
     *
     * @param {*} highScore
     * @param {*} userScore
     * @param {*} longestDistanceTravelled
     * @param {*} distanceTravelled
     */
    function setHighScoreIfHighest(highScore, userScore, longestDistanceTravelled, distanceTravelled) {
        if (userScore > highScore) {
            localStorage.setItem("highScore", userScore);
            document.getElementById("highscore").innerHTML = 'Congratulations You have Got High Score';
        }

        if (distanceTravelled > longestDistanceTravelled) {
            localStorage.setItem("longestDistanceTravelled", distanceTravelled);
            document.getElementById("longestdistance").innerHTML = 'Congratulations You have Travelled Longest Distance';
        }
    }




    var parentElement = document.getElementById('containerStrips');
    var gameAnimation = new GameAnimation(120, parentElement);

    // window.addEventListener("keypress", gameAnimation.moveCar);
    window.addEventListener("keydown", gameAnimation.moveCar);

    var pauseRestartButton = document.getElementById('play-restart');
    pauseRestartButton.addEventListener("click", playRestart);

    function playRestart() {
        pauseRestartButton.parentNode.style.display = 'none';
        gameAnimation.init();
    }
})();