var BOX_HEIGHT = 10;
var BOX_WIDTH = 10;
var BOX_ANIMATION_SPEED = 10;

(function () {

    //create the box container styles
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
        min = min || 0;
        max = max || 1;
        var random = Math.floor(Math.random() * max + 1);
        if (random < min) {
            random = min;
        }
        if (random > max) {
            random = max;
        }

        return random;
    }


    /**
     * BOX Class
     *
     * @param {*} x
     * @param {*} y
     * @param {*} boxWidth
     * @param {*} boxHeight
     * @param {*} parentElement
     */
    function Box(x, y, boxWidth, boxHeight, parentElement) {
        this.x = x;
        this.y = y;
        this.boxWidth = boxWidth || BOX_WIDTH;
        this.boxHeight = boxHeight || BOX_HEIGHT;

        this.boxElement = null;

        // boxHorizontalMoving true for left to right moving, 
        // boxHorizontalMoving false for right to left moving
        this.boxHorizontalMoving = true;

        // boxVerticalMoving true for top to down moving, 
        // boxVerticalMoving false for down to top moving
        this.boxVerticalMoving = true;


        /**
         *   Initialize the box 
         *
         */
        this.init = function () {
            this.boxElement = document.createElement('div');
            // this.boxElement.style.backgroundColor = 'blue';
            this.boxElement.style.backgroundColor = `rgb(${getRandom(0, 255)}, ${getRandom(0, 255)}, ${getRandom(0, 255)})`;
            this.boxElement.style.height = this.boxHeight + 'px';
            this.boxElement.style.width = this.boxWidth + 'px';
            this.boxElement.style.borderRadius = '50%';
            this.boxElement.style.position = 'absolute';
            parentElement && parentElement.appendChild(this.boxElement);

        };

        /**
         *   Draw the box in X,Y Cordinate
         *
         */
        this.draw = function () {
            this.boxElement.style.top = this.y + 'px';
            this.boxElement.style.left = this.x + 'px';
        };

        /**
         *  Move the box in x- axis or y-axis by provided increment values
         *
         * @param {*} xInc
         * @param {*} yInc
         */
        this.move = function (xInc, yInc) {
            this.x = this.x + xInc;
            this.y = this.y + yInc;
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
     *
     * @param {*} ballCount
     * @param {*} boxAnimationSpeed
     * @param {*} parentElement
     */
    function GameAnimation(ballCount, boxAnimationSpeed, parentElement) {
        var boxes = [];
        boxAnimationSpeed = boxAnimationSpeed || BOX_ANIMATION_SPEED;

        this.init = function (boxHeight, boxWidth) {
            for (var i = 0; i < ballCount; i++) {

                // create the box inside the parent
                var box = new Box(getRandom(0,
                    parentElement.clientWidth - (parentElement.clientWidth / 100)),
                    getRandom(0, parentElement.clientHeight - (parentElement.clientWidth / 100)),
                    15, 15, parentElement);

                box.init();
                box.draw();
                boxes.push(box);
            }
            window.requestAnimationFrame(this.animate.bind(this));
        };

        this.animate = function () {
            for (var i = 0; i < ballCount; i++) {
                var box = boxes[i];
                this.collessionDetection(box);
            }
            window.requestAnimationFrame(this.animate.bind(this));
        };

        // collession Detection for circle with parent 
        this.collessionDetection = function (box) {
            if (box.getBoxRight() >= parentElement.clientWidth) {
                box.boxHorizontalMoving = false;
            }
            if (box.getBoxLeft() <= 0) {
                box.boxHorizontalMoving = true;
            }


            if (box.getBoxBottom() >= parentElement.clientHeight) {
                box.boxVerticalMoving = false;
            }
            if (box.getBoxTop() <= 0) {
                box.boxVerticalMoving = true;
            }


            if (box.boxHorizontalMoving === true && box.boxVerticalMoving === true) {
                box.move(boxAnimationSpeed, boxAnimationSpeed);
            }

            if (box.boxHorizontalMoving === false && box.boxVerticalMoving === true) {
                box.move(-boxAnimationSpeed, boxAnimationSpeed);
            }

            if (box.boxHorizontalMoving === true && box.boxVerticalMoving === false) {
                box.move(boxAnimationSpeed, -boxAnimationSpeed);
            }

            if (box.boxHorizontalMoving === false && box.boxVerticalMoving === false) {
                box.move(-boxAnimationSpeed, -boxAnimationSpeed);
            }
        }
    }

    var parentElement = document.getElementById('boxcontainer');

    var gameAnimation = new GameAnimation(10,5, parentElement);
    gameAnimation.init(15, 15);
})();