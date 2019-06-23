(function () {
    var BOX_HEIGHT = 10;
    var BOX_WIDTH = 10;
    var BOX_MOVE_SPEED = 1;
    var GAME_ANIMATION_SPEED_FPS = 60;


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

    function getAngleBetweenTwoPoints(cx, cy, ex, ey) {
        var dy = ey - cy;
        var dx = ex - cx;
        var theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        if (theta < 0) theta = 360 + theta; // range [0, 360)
        return theta;
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
        this.boxHorizontalMoving = false;

        // boxVerticalMoving true for top to down moving, 
        // boxVerticalMoving false for down to top moving
        this.boxVerticalMoving = false;
        this.antKilled = false;

        var vector = 0;
        var angle = 160;

        this.getAngleWithRespectToParent = function () {
            var parentHeight = parentElement.clientHeight;
            var parentWidth = parentElement.clientWidth;
            var angle = getAngleBetweenTwoPoints(this.x, this.y, parentWidth, parentHeight);
            return angle;
        }

        var that = this;
        this.clearBox = function () {
            that.boxElement.remove();
            that.antKilled = true;
            that.createSmashedBug();
        };


        /**
         *   Initialize the box 
         */
        this.init = function () {
            this.boxElement = document.createElement('div');

            this.boxElement.style.backgroundImage = `url('./images/animated-ant.gif')`;
            this.boxElement.style.backgroundRepeat = 'no-repeat';
            this.boxElement.style.backgroundPosition = 'center';
            this.boxElement.style.backgroundSize = '100% 100%';

            this.boxElement.style.height = this.boxHeight + 'px';
            this.boxElement.style.width = this.boxWidth + 'px';
            this.boxElement.style.position = 'absolute';
            this.boxElement.style.zIndex = 20;

            parentElement && parentElement.appendChild(this.boxElement);

            this.boxElement.addEventListener("click", this.clearBox);
        };

        /**
         *   Draw the box in X,Y Cordinate
         */
        this.draw = function () {
            this.boxElement.style.top = this.y + 'px';
            this.boxElement.style.left = this.x + 'px';
            // this.boxElement.style.transform = 'rotate(150deg)';
        };

        /**
         *  Move the box in x- axis or y-axis by provided increment values
         */
        this.move = function () {
            // angle = this.getAngleWithRespectToParent();
            // this.boxElement.style.transform = 'rotate(' + angle + 'deg)';

            if (this.boxHorizontalMoving === true && this.boxVerticalMoving === true) {
                this.x += this.speed;
                this.y += this.speed;
                this.boxElement.style.transform = 'rotate(0deg)';
            }

            if (this.boxHorizontalMoving === false && this.boxVerticalMoving === true) {
                this.x -= this.speed;
                this.y += this.speed;
                this.boxElement.style.transform = 'rotate(-50deg)';
            }

            if (this.boxHorizontalMoving === true && this.boxVerticalMoving === false) {
                this.x += this.speed;
                this.y -= this.speed;
                this.boxElement.style.transform = 'rotate(50deg)';
            }

            if (this.boxHorizontalMoving === false && this.boxVerticalMoving === false) {
                this.x -= this.speed;
                this.y -= this.speed;
                this.boxElement.style.transform = 'rotate(180deg)';
            }
            this.draw();
        };


        this.createSmashedBug = function () {
            var smashedBug = document.createElement('div');

            smashedBug.style.backgroundImage = `url('./images/smashed-bug.png')`;
            smashedBug.style.backgroundRepeat = 'no-repeat';
            smashedBug.style.backgroundPosition = 'center';
            smashedBug.style.backgroundSize = '80% 80%';

            smashedBug.style.height = this.boxHeight + 'px';
            smashedBug.style.width = this.boxWidth + 'px';
            smashedBug.style.position = 'absolute';
            smashedBug.style.top = this.y + 'px';
            smashedBug.style.left = this.x + 'px';
            smashedBug.style.zIndex = 10;

            setTimeout(function () {
                smashedBug.remove();
            }, 1000);

            parentElement && parentElement.appendChild(smashedBug);
        };

        // get the four side coordinates of the box
        this.getBoxTop = function () { return this.y; };
        this.getBoxBottom = function () { return this.y + this.boxHeight; };
        this.getBoxLeft = function () { return this.x; };
        this.getBoxRight = function () { return this.x + this.boxWidth; };


        this.centerX = function () { return this.x + this.halfWidth(); };

        this.centerY = function () { return this.y + this.halfHeight(); };

        this.halfWidth = function () { return this.boxWidth / 2; };
        this.halfHeight = function () { return this.boxHeight / 2; };
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
        var animationFrameVariable = 0;
        this.init = function () {
            var parentHeight = parentElement.clientHeight;
            var parentWidth = parentElement.clientWidth;

            for (var i = 0; i < ballCount; i++) {
                var speed = getRandom(1, 5);
                var x = getRandom(0, (parentWidth - (parentWidth * 3 / 100)));
                var y = getRandom(0, (parentHeight - (parentWidth * 3 / 100)));
                // create the box inside the parent
                var box = new Box(x, y, 40, 40, speed, parentElement);

                box.init();
                box.draw();
                boxes.push(box);
            }
            animationFrameVariable = window.requestAnimationFrame(this.animate.bind(this));
        };

        this.animate = function (timestamp) {
            if (timestamp >= start) {
                var parentHeight = parentElement.clientHeight;
                var parentWidth = parentElement.clientWidth;
                var newArray;
                for (var i = 0; i < boxes.length; i++) {
                    var box = boxes[i];
                    if (boxes[i].antKilled === true) {
                        newArray = boxes.slice(0, i).concat(boxes.slice(i + 1, boxes.length))
                    }
                    else {
                        this.CollisionDetection(box, parentWidth, parentHeight);
                    }
                }

                if (!!newArray) {
                    boxes = newArray;
                }
                start = timestamp + frameDuration;
            }
            if (boxes === undefined || boxes.length == 0) {
                window.cancelAnimationFrame(animationFrameVariable);
                this.addCongratulationMessage();
            }
            if (boxes.length != 0) {
                animationFrameVariable = window.requestAnimationFrame(this.animate.bind(this));
            }

        };

        this.addCongratulationMessage = function () {
            var congratsMsg = document.createTextNode('Congratulation You Have won the Game !!!');
            parentElement.appendChild(congratsMsg);
            parentElement.style.color = '#ffffff';
            parentElement.style.textAlign = 'center';

            setTimeout(function () {
                parentElement.style.backgroundImage = `url('./images/siperman-smashing-bug.gif')`;
                parentElement.style.backgroundRepeat = 'no-repeat';
                parentElement.style.backgroundPosition = 'center';
                parentElement.style.backgroundSize = '50% 50%';
            }, 500);
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
    var gameAnimation = new GameAnimation(50, 30, parentElement);

    //for now setted the box size also as random
    gameAnimation.init();








    // function hitTest(box1, box2) {

    //     // console.log(box1);
    //     // console.log(box2);

    //     // calculate vector between circles
    //     var vx = box1.centerX() - box2.centerX(),
    //         vy = box1.centerY() - box2.centerY();

    //     // find the distance between circles
    //     var magnitude = Math.sqrt(vx * vx + vy * vy);

    //     // add box total radii to get distance if close
    //     var combinedHalfWidths = box1.halfWidth() + box2.halfWidth();


    //     if (magnitude < combinedHalfWidths) {
    //         // find out how much circle is overlaping
    //         var overlap = combinedHalfWidths - magnitude;

    //         // calculate direction
    //         var dx = vx / magnitude;
    //         var dy = vy / magnitude;

    //         // now set circle value to move out of collision
    //         box1.x += overlap * dx;
    //         box1.y += overlap * dy;

    //         console.log('======================');
    //         console.log('Kala HIT');
    //         console.log('======================');
    //         console.log('Hit Test::' + hit);
    //         console.log('vx:' + vx);
    //         console.log('vy:' + vy);
    //         console.log('magnitude:' + magnitude);
    //         console.log('totalRadii:' + totalRadii);
    //         console.log('overlap:' + overlap);
    //         console.log('dx:' + dx);
    //         console.log('dy:' + dy);
    //         console.log('add x:' + box1.x + overlap * dx);
    //         console.log('add y:' + box1.y + overlap * dy);
    //     }
    //     else
    //     {
    //         box1.move();
    //     }

    //     // sets hit to true if the distance between circle is less than totalradii
    //     var hit = magnitude < totalRadii;

    //     // box1.move(dx, dy);




    //     return hit;
    // }
})();