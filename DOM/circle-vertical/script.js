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
function Circle(parentElement, circleHeight, circleWidth,circleBackgroundColor, x, y) {
    // recheck if height and width are integer
    this.circleHeight = parseInt(circleHeight);
    this.circleWidth = parseInt(circleWidth);

    // create circle and add to parent box
    this.circle = document.createElement('div');
    this.circle.style.backgroundColor = circleBackgroundColor;
    this.circle.style.height = this.circleHeight + 'px';
    this.circle.style.width = this.circleWidth + 'px';
    this.circle.style.borderRadius = 50 + '%';
    this.circle.style.position = 'absolute';
    this.circle.style.top = y + 'px';
    this.circle.style.left = x + 'px';
    parentElement.box.appendChild(this.circle);

    // that reference for circle
    var that = this;

    // flag true for up to down moving, flag false for down to up moving
    var flag = true;

    // move the circle in defined interval
    setInterval(function () {
        that.circle.style.top = y + 'px';

        if (flag === true) {
            y++;
        }
        else {
            y--;
        }
        collessionDetection();
    },1);

    // collession Detection for circle with parent
    function collessionDetection() {
        if (y > (parentElement.boxHeight - circleHeight)) {
            flag = false;
        }
        if (y === 0) {
            flag = true;
        }
    }
}

var box = new Box();
var element1 = new Circle(box, 50, 50,'red', 220, 505);
var element2 = new Circle(box, 100, 100,'pink', 50, 200);

// for checking the event of resize of window

// call resize function for getting initial height and width
resize();

// add event listner in window for resizing of window
window.addEventListener("resize", resize, { passive: true });
function resize(event) {
    box.boxHeight = parseInt(document.getElementById('box').clientHeight);
    box.boxWidth = parseInt(document.getElementById('box').clientWidth);
}