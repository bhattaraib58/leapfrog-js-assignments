var BOX_HEIGHT = 10;
var BOX_WIDTH = 10;
var BOX_MOVE_SPEED = 1;
var GAME_ANIMATION_SPEED_FPS = 60;

(function () {

    //create the box container with styles
    (function () {
        var boxcontainer = document.getElementById('boxcontainer');
        boxcontainer.style.position = 'relative';
        boxcontainer.style.backgroundColor = 'black';
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
     * BOX Class
     *
     * @param {*} x
     * @param {*} y
     * @param {*} boxWidth
     * @param {*} boxHeight
     * @param {*} speed
     * @param {*} parentElement
     */
    function Box(x, y, boxWidth, boxHeight, speed, parentElement) {
        this.x = x;
        this.y = y;
        this.boxWidth = boxWidth || BOX_WIDTH;
        this.boxHeight = boxHeight || BOX_HEIGHT;

        this.speed = speed || BOX_MOVE_SPEED;

        this.boxElement = null;

        // boxHorizontalMoving true for left to right moving, 
        // boxHorizontalMoving false for right to left moving
        this.boxHorizontalMoving = true;

        // boxVerticalMoving true for top to down moving, 
        // boxVerticalMoving false for down to top moving
        this.boxVerticalMoving = true;


        /**
         *   Initialize the box 
         */
        this.init = function () {
            this.boxElement = document.createElement('div');
            this.boxElement.style.backgroundColor = `rgb(${getRandom(0, 255)}, ${getRandom(0, 255)}, ${getRandom(0, 255)})`;
            this.boxElement.style.height = this.boxHeight + 'px';
            this.boxElement.style.width = this.boxWidth + 'px';
            this.boxElement.style.borderRadius = '50%';
            this.boxElement.style.position = 'absolute';
            parentElement && parentElement.appendChild(this.boxElement);

        };

        /**
         *   Draw the box in X,Y Cordinate
         */
        this.draw = function () {
            this.boxElement.style.top = this.y + 'px';
            this.boxElement.style.left = this.x + 'px';
        };

        /**
         *  Move the box in x- axis or y-axis by provided increment values
         */
        this.move = function () {
            if (this.boxHorizontalMoving === true && this.boxVerticalMoving === true) {
                this.x += this.speed;
                this.y += this.speed;
            }

            if (this.boxHorizontalMoving === false && this.boxVerticalMoving === true) {
                this.x -= this.speed;
                this.y += this.speed;
            }

            if (this.boxHorizontalMoving === true && this.boxVerticalMoving === false) {
                this.x += this.speed;
                this.y -= this.speed;
            }

            if (this.boxHorizontalMoving === false && this.boxVerticalMoving === false) {
                this.x -= this.speed;
                this.y -= this.speed;
            }
            this.draw();
        };

        // get the four side coordinates of the box
        this.getBoxTop = function () { return this.y; };
        this.getBoxBottom = function () { return this.y + this.boxHeight; };
        this.getBoxLeft = function () { return this.x; };
        this.getBoxRight = function () { return this.x + this.boxWidth; };
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
        var boxes = [];
        fps = fps || GAME_ANIMATION_SPEED_FPS;
        var start = 0,
            frameDuration = 1000 / fps;

        this.init = function () {
            var parentHeight = parentElement.clientHeight;
            var parentWidth = parentElement.clientWidth;

            for (var i = 0; i < ballCount; i++) {
                var size = getRandom(10, 20);
                var speed = getRandom(1, 5);
                var x = getRandom(0, (parentWidth - (parentWidth * 3 / 100)));
                var y = getRandom(0, (parentHeight - (parentWidth * 3 / 100)));
                // create the box inside the parent
                var box = new Box(x, y, size, size, speed, parentElement);

                box.init();
                box.draw();
                boxes.push(box);
            }
            window.requestAnimationFrame(this.animate.bind(this));
        };

        this.animate = function (timestamp) {
            if (timestamp >= start) {
                var parentHeight = parentElement.clientHeight;
                var parentWidth = parentElement.clientWidth;

                for (var i = 0; i < ballCount; i++) {
                    var box = boxes[i];
                    this.CollisionDetection(box, parentWidth, parentHeight);
                }
                start = timestamp + frameDuration;
            }
            window.requestAnimationFrame(this.animate.bind(this));
        };

        this.CollisionDetection = function (box, parentWidth, parentHeight) {
            this.CollisionDetectionWithOtherMovingObjects(box);
            this.collessionDetectionWithParentContainer(box, parentWidth, parentHeight);
            box.move();
        };

        this.collessionDetectionWithParentContainer = function (box, parentWidth, parentHeight) {
            if (box.getBoxRight() >= parentWidth) {
                box.boxHorizontalMoving = false;
            }
            if (box.getBoxLeft() <= 0) {
                box.boxHorizontalMoving = true;
            }

            if (box.getBoxBottom() >= parentHeight) {
                box.boxVerticalMoving = false;
            }
            if (box.getBoxTop() <= 0) {
                box.boxVerticalMoving = true;
            }
        };

        this.CollisionDetectionWithOtherMovingObjects = function (box) {
            var currentIndex = boxes.indexOf(box);

            for (var i = 0; i < boxes.length; i++) {
                if (i != currentIndex) {
                    if (box.getBoxLeft() < boxes[i].getBoxRight() &&
                        box.getBoxRight() > boxes[i].getBoxLeft() &&
                        box.getBoxTop() < boxes[i].getBoxBottom() &&
                        box.getBoxBottom() > boxes[i].getBoxTop()) {
                        if (box.x > boxes[i].x) {
                            box.boxHorizontalMoving = true;
                            boxes[i].boxHorizontalMoving = false;
                        }
                        else {
                            box.boxHorizontalMoving = false;
                            boxes[i].boxHorizontalMoving = true;
                        }

                        if (box.y > boxes[i].y) {
                            box.boxVerticalMoving = true;
                            boxes[i].boxVerticalMoving = false;
                        }
                        else {
                            box.boxVerticalMoving = false;
                            boxes[i].boxVerticalMoving = true;
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
    var gameAnimation = new GameAnimation(200, 30, parentElement);

    //for now setted the box size also as random
    gameAnimation.init();
})();