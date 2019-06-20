/**
 * Box Class
 * 
 *
 * @param {*} box
 * @param {*} height
 * @param {*} width
 */
function Box(box, height, width) {
    this.box = box;
    this.box.style.position = 'relative';
    this.box.style.height = height + 'px';
    this.box.style.width = width + 'px';
    this.box.style.border = '1px solid black';

    /**
     * Create points element 
     *
     * @param {*} points array
     */

    this.createPointCircleFromPointArray = function (points) {
        /**
         * Create point element for box
         * @param {*} pointHeight
         * @param {*} pointWidth
         * @param {*} x
         * @param {*} y
         * @returns point element
         */
        function createPointElement(pointHeight, pointWidth, x, y) {
            var element = document.createElement('div');
            element.style.backgroundColor = 'blue';
            element.style.height = pointHeight + 'px';
            element.style.width = pointWidth + 'px';
            element.style.borderRadius = 50 + '%';
            element.style.position = 'absolute';
            element.style.top = x + 'px';
            element.style.left = y + 'px';

            element.onclick = function (event) {
                element.remove();
            };

            return element;
        }
        for (var i = 0; i < (points.length - 1); i++) {
            var element = createPointElement(20, 20, points[i].x, points[i].y);
            box.appendChild(element);
        }
    }
}

var boxRef = document.getElementById('box');
var box = new Box(boxRef, 500, 500);

var points = [
    { x: 10, y: 20 },
    { x: 40, y: 40 },
    { x: 60, y: 20 },
    { x: 80, y: 100 },
    { x: 60, y: 20 },
    { x: 120, y: 100 },
    { x: 120, y: 400 },
    { x: 80, y: 200 },
];

box.createPointCircleFromPointArray(points);