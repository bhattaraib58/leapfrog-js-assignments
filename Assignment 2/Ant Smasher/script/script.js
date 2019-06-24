(function () {
    var ANT_HEIGHT = 10;
    var ANT_WIDTH = 10;
    var GAME_ANIMATION_SPEED_FPS = 60;
    var MIN_ANT_SIZE = 20;
    var MAX_ANT_SIZE = 40;
    //pixel per frame
    var MIN_ANT_SPEED = 1;
    var MAX_ANT_SPEED = 5;


    //create the box container with styles
    (function () {
        var boxcontainer = document.getElementById('boxcontainer');
        boxcontainer.style.position = 'relative';
        // boxcontainer.style.backgroundColor = 'black';
        boxcontainer.style.height = '100%';
        boxcontainer.style.width = '90%';
        boxcontainer.style.border = '1px solid black';
        boxcontainer.style.margin = '0px auto';
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

    function getRandomBoolean() {
        return Math.random() >= 0.5;
    }

    /**
     * ANT Class
     *
     * @param {*} x
     * @param {*} y
     * @param {*} antWidth
     * @param {*} antHeight
     * @param {*} speed
     * @param {*} parentElement
     */
    function Ant(x, y, antWidth, antHeight, speed, parentElement) {
        this.x = x;
        this.y = y;
        this.antWidth = antWidth || ANT_WIDTH;
        this.antHeight = antHeight || ANT_HEIGHT;

        this.speed = speed || MIN_ANT_SPEED;

        this.antElement = null;

        // antHorizontalMoving true for left to right moving, 
        // antHorizontalMoving false for right to left moving
        this.antHorizontalMoving = getRandomBoolean();

        // antVerticalMoving true for top to down moving, 
        // antVerticalMoving false for down to top moving
        this.antVerticalMoving = getRandomBoolean();
        this.antKilled = false;

        var that = this;
        this.clearAnt = function () {
            that.antElement.remove();
            that.antKilled = true;
            that.createSmashedBug();
        };

        /**
         *   Initialize the ant 
         */
        this.init = function () {
            this.antElement = document.createElement('div');

            this.antElement.style.backgroundImage = `url('./images/animated-ant.gif')`;
            this.antElement.style.backgroundRepeat = 'no-repeat';
            this.antElement.style.backgroundPosition = 'center';
            this.antElement.style.backgroundSize = '100% 100%';

            this.antElement.style.height = this.antHeight + 'px';
            this.antElement.style.width = this.antWidth + 'px';
            this.antElement.style.position = 'absolute';
            this.antElement.style.zIndex = 20;

            parentElement && parentElement.appendChild(this.antElement);

            this.antElement.addEventListener("click", this.clearAnt);
        };

        /**
         *   Draw the ant in X,Y Cordinate
         */
        this.draw = function () {
            this.antElement.style.top = this.y + 'px';
            this.antElement.style.left = this.x + 'px';
        };

        /**
         *  Move the ant in x- axis or y-axis by provided increment values
         */
        this.move = function () {
            if (this.antHorizontalMoving === true && this.antVerticalMoving === true) {
                this.x += this.speed;
                this.y += this.speed;
                this.antElement.style.transform = 'rotate(0deg)';
            }

            if (this.antHorizontalMoving === false && this.antVerticalMoving === true) {
                this.x -= this.speed;
                this.y += this.speed;
                this.antElement.style.transform = 'rotate(-50deg)';
            }

            if (this.antHorizontalMoving === true && this.antVerticalMoving === false) {
                this.x += this.speed;
                this.y -= this.speed;
                this.antElement.style.transform = 'rotate(50deg)';
            }

            if (this.antHorizontalMoving === false && this.antVerticalMoving === false) {
                this.x -= this.speed;
                this.y -= this.speed;
                this.antElement.style.transform = 'rotate(180deg)';
            }
            this.draw();
        };

        this.createSmashedBug = function () {
            var smashedBug = document.createElement('div');

            smashedBug.style.backgroundImage = `url('./images/smashed-bug.png')`;
            smashedBug.style.backgroundRepeat = 'no-repeat';
            smashedBug.style.backgroundPosition = 'center';
            smashedBug.style.backgroundSize = '100% 100%';

            smashedBug.style.height = this.antHeight + 'px';
            smashedBug.style.width = this.antWidth + 'px';
            smashedBug.style.position = 'absolute';
            smashedBug.style.top = this.y + 'px';
            smashedBug.style.left = this.x + 'px';
            smashedBug.style.zIndex = 10;

            setTimeout(function () {
                smashedBug.remove();
            }, 1000);

            parentElement && parentElement.appendChild(smashedBug);
        };

        // get the four side coordinates of the ant
        this.getAntTop = function () { return this.y; };
        this.getAntBottom = function () { return this.y + this.antHeight; };
        this.getAntLeft = function () { return this.x; };
        this.getAntRight = function () { return this.x + this.antWidth; };
    }



    /**
     *  Game Animation Class
     *  Note: FPS also limited by your display 
     *  30 fps sweet spot for 1000 ball tests
     *  120 or 60 fps best for smooth running but on less than 200 balls
     * 
     * @param {*} ballCount
     * @param {*} fps
     * @param {*} parentElement
     */
    function GameAnimation(ballCount, fps, parentElement) {
        var ants = [];
        fps = fps || GAME_ANIMATION_SPEED_FPS;
        var start = 0,
            frameDuration = 1000 / fps;
        var animationFrameVariable = 0;

        this.init = function (minAntSize, maxAntSize) {
            minAntSize = minAntSize || MIN_ANT_SIZE;
            maxAntSize = maxAntSize || MAX_ANT_SIZE;

            var parentHeight = parentElement.clientHeight;
            var parentWidth = parentElement.clientWidth;
            var parentWidthBoundaryForAntApperance = parentWidth;
            var parentHeightBoundaryForAntApperance = parentHeight;

            for (var i = 0; i < ballCount; i++) {
                var size = getRandom(minAntSize, maxAntSize);
                var speed = getRandom(MIN_ANT_SPEED, MAX_ANT_SPEED);

                parentWidthBoundaryForAntApperance = parentWidth - size;
                parentHeightBoundaryForAntApperance = parentHeight - size;

                var x = getRandom(0, parentWidthBoundaryForAntApperance);
                var y = getRandom(0, parentHeightBoundaryForAntApperance);

                // create the ant inside the parent
                var ant = new Ant(x, y, size, size, speed, parentElement);

                ant.init();
                ant.draw();
                ants.push(ant);
            }
            animationFrameVariable = window.requestAnimationFrame(this.animate.bind(this));
        };

        this.animate = function (timestamp) {
            if (timestamp >= start) {
                var parentHeight = parentElement.clientHeight;
                var parentWidth = parentElement.clientWidth;
                var newArray;
                for (var i = 0; i < ants.length; i++) {
                    var ant = ants[i];
                    if (ants[i].antKilled === true) {
                        newArray = ants.slice(0, i).concat(ants.slice(i + 1, ants.length))
                    }
                    else {
                        this.CollisionDetection(ant, parentWidth, parentHeight);
                    }
                }

                if (!!newArray) {
                    ants = newArray;
                }
                start = timestamp + frameDuration;
            }
            if (ants === undefined || ants.length == 0) {
                window.cancelAnimationFrame(animationFrameVariable);
                this.addCongratulationMessage();
            }
            if (ants.length != 0) {
                animationFrameVariable = window.requestAnimationFrame(this.animate.bind(this));
            }

        };

        this.addCongratulationMessage = function () {
            var congratsMsg = document.createTextNode('Congratulation You Have won the Game !!!');
            parentElement.style.fontSize = '40px';
            parentElement.appendChild(congratsMsg);
            parentElement.style.backgroundColor = 'black';
            parentElement.style.textAlign = 'center';
            parentElement.style.color = 'white';
        };

        this.CollisionDetection = function (ant, parentWidth, parentHeight) {
            this.CollisionDetectionWithOtherMovingObjects(ant);
            this.collessionDetectionWithParentContainer(ant, parentWidth, parentHeight);
            ant.move();
        };

        this.collessionDetectionWithParentContainer = function (ant, parentWidth, parentHeight) {
            if (ant.getAntRight() >= parentWidth) {
                ant.antHorizontalMoving = false;
            }
            if (ant.getAntLeft() <= 0) {
                ant.antHorizontalMoving = true;
            }

            if (ant.getAntBottom() >= parentHeight) {
                ant.antVerticalMoving = false;
            }
            if (ant.getAntTop() <= 0) {
                ant.antVerticalMoving = true;
            }
        };

        this.CollisionDetectionWithOtherMovingObjects = function (ant) {
            var currentIndex = ants.indexOf(ant);

            for (var i = 0; i < ants.length; i++) {
                if (i != currentIndex) {
                    if (ant.getAntLeft() < ants[i].getAntRight() &&
                        ant.getAntRight() > ants[i].getAntLeft() &&
                        ant.getAntTop() < ants[i].getAntBottom() &&
                        ant.getAntBottom() > ants[i].getAntTop()) {
                        if (ant.x > ants[i].x) {
                            ant.antHorizontalMoving = true;
                            ants[i].antHorizontalMoving = false;
                        }
                        else {
                            ant.antHorizontalMoving = false;
                            ants[i].antHorizontalMoving = true;
                        }

                        if (ant.y > ants[i].y) {
                            ant.antVerticalMoving = true;
                            ants[i].antVerticalMoving = false;
                        }
                        else {
                            ant.antVerticalMoving = false;
                            ants[i].antVerticalMoving = true;
                        }
                    }
                }
            }
        };
    }

    var parentElement = document.getElementById('boxcontainer');

    // ball count, fps speed are varaible
    // 30 fps sweet spot for 1000 ball tests
    // 120 fps best for smooth running but on less than 200 balls
    // Note: FPS also limited by your display 
    var gameAnimation = new GameAnimation(5, 120, parentElement);

    //give min and max ant size
    gameAnimation.init(40,40);
})();