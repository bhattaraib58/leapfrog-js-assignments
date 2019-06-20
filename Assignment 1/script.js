function Carousel(carouselId) {
    carousel = document.getElementById(carouselId);
    carousel.style.position = 'relative';
    carousel.style.overflow = 'hidden';
    carasouelWidth = carousel.clientWidth;
    carasouelHeight = carousel.clientHeight;

    var carasouelLeftSpace = 0;

    carouselChildren = carousel.children;

    for (var i = 0; i < (carouselChildren.length); i++) {
        console.log(carouselChildren[i]);
        carouselChildren[i].style.width = carasouelWidth + 'px';
        carouselChildren[i].style.height = carasouelHeight + 'px';

        carouselChildren[i].style.position = 'absolute';
        carouselChildren[i].style.top = 0 + 'px';
        carouselChildren[i].style.left = (carasouelWidth * i) + carasouelLeftSpace + 'px';
    }
    var interval = -5;
    var animationFrame = 0;

    function slideWindow() {
        carasouelLeftSpace = carasouelLeftSpace + interval;

        for (var i = 0; i < (carouselChildren.length); i++) {
            carouselChildren[i].style.left = (carasouelWidth * i) + carasouelLeftSpace + 'px';

            if ((Math.abs(carasouelLeftSpace) + carasouelWidth) === (carasouelWidth * carouselChildren.length)
                || (carasouelLeftSpace === 0)) {
                interval *= -1;
            }
        }
        animationFrame = window.requestAnimationFrame(slideWindow);
    }
    window.requestAnimationFrame(slideWindow);
    console.log(carouselChildren);
}


new Carousel('test');

var carousel = document.getElementById('test');
// carousel.clientWidth


var a = [1, 2, 3, 4, 5, 6];
console.log(a);
var temp = a.splice(0, 1);
console.log(temp);
console.log(a);
a.push(temp);
