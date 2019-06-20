/**
 * Class Box
 * Sets the Box as Relative
 * and sets height and width as 100% for responsiveness
 */
function Box() {
    this.boxHeight = 100;
    this.boxWidth = 100;
    this.box = document.getElementById('box');
    this.box.style.position = 'relative';
    this.box.style.backgroundColor = 'black';
    this.box.style.height = '100%';
    this.box.style.width = '100%';
    this.box.style.border = '1px solid black';
    this.box.style.margin = '0px auto';
}

/**
 * Class Circle
 * @param {*} parentElement -parent box object for reference to keep the circle
 * @param {*} circleHeight
 * @param {*} circleWidth
 * @param {*} circleBackgroundColor
 * @param {*} x -for as x-cordinate to start from 
 * @param {*} y -for as y-cordinate to start from 
 */
function Circle(parentElement, circleHeight, circleWidth, circleBackgroundColor, x, y) {
    // recheck if height and width are integer
    this.circleHeight = parseInt(circleHeight);
    this.circleWidth = parseInt(circleWidth);

    this.x = x;
    this.y = y;

    // create circle and add to parent box
    this.circle = document.createElement('div');
    this.circle.style.backgroundColor = circleBackgroundColor;
    this.circle.style.height = this.circleHeight + 'px';
    this.circle.style.width = this.circleWidth + 'px';
    this.circle.style.borderRadius = 50 + '%';
    this.circle.style.position = 'absolute';
    this.circle.style.top = this.y + 'px';
    this.circle.style.left = this.x + 'px';
    parentElement.box.appendChild(this.circle);

    // that reference for circle
    var that = this;

    // flag1 true for top to down moving, flag false for down to top moving
    var flag1 = true;
    // flag2 true for left to right moving, flag false for right to left moving
    var flag2 = true;

    // move the circle in defined interval
    setInterval(function () {
        that.circle.style.top = that.y + 'px';
        that.circle.style.left = that.x + 'px';

        if (flag1 === true && flag2 === true) {
            that.y++;
            that.x++;
        }
        if (flag1 === true && flag2 === false) {
            that.y++;
            that.x--;
        }
        if (flag1 === false && flag2 === true) {
            that.y--;
            that.x++;
        }
        if (flag1 === false && flag2 === false) {
            that.y--;
            that.x--;
        }
        collessionDetection();
    },1000/60);

    // collession Detection for circle with parent
    function collessionDetection() {
        if (that.y > (parentElement.boxHeight - circleHeight)) {
            flag1 = false;
        }
        if (that.y === 0) {
            flag1 = true;
        }

        if (that.x > (parentElement.boxWidth - circleWidth)) {
            flag2 = false;
        }
        if (that.x === 0) {
            flag2 = true;
        }
    }
}


var box = new Box();
var element1 = new Circle(box, 50, 50, 'red', 220, 505);
var element2 = new Circle(box, 100, 100, 'pink', 50, 200);
var element3 = new Circle(box, 75, 75, 'purple', 5, 20);
var element4 = new Circle(box, 35, 35, 'blue', 10, 50);

// for checking the event of resize of window

// call resize function for getting initial height and width
resize();

// add event listner in window for resizing of window
window.addEventListener("resize", resize, { passive: true });
function resize(event) {
    box.boxHeight = parseInt(document.getElementById('box').clientHeight);
    box.boxWidth = parseInt(document.getElementById('box').clientWidth);
}


// todo collision detection between two moving objects
// Circle.prototype = {
//     // get the four side coordinates of the circle
//     get top() { return this.y; },
//     get bottom() { return this.y + this.circleHeight; },
//     get left() { return this.x; },
//     get right() { return this.x + this.circleWidth; },

//     testCollision: function (circle) {
//         if (this.top > circle.bottom) {
//             console.log(1);
//             this.x--;
//             this.y--;
//         }
//         if (this.right > circle.left) {
//             console.log(2);
//             this.x--;
//             this.y++;
//         }
//         if (this.bottom < circle.top) {
//             console.log(3);
//             this.x++;
//             this.y++;
//         }
//         if (this.left > circle.right) {
//             console.log(4);
//             this.x--;
//             this.y++;
//         }
//     }
// }