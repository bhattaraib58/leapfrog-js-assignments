var COLORS = ['red', 'blue', 'green'];

var box = document.getElementById('box');
box.style.width = 400 + 'px';
box.style.height = 400 + 'px';
box.style.backgroundColor = COLORS[0];
var i = 1;
box.onclick = function () {
    box.style.backgroundColor = COLORS[i];
    i++;
    if (i > (COLORS.length - 1)) {
        i = 0;
    }
}