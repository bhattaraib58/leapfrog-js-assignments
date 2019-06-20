/**
 * Class Caraousel
 *
 * @param {*} carouselId
 * @param {*} transitionSpeed -in ms
 * @param {*} interval - in ms
 */
function Carousel(carouselId, transitionSpeed, interval) {

    // Set get caraousel and set the values;
    var carousel = document.getElementById(carouselId);
    carousel.style.position = 'relative';
    carousel.style.overflow = 'hidden';
    carousel.style.width = '100%';
    carousel.style.height = '0px';
    carousel.style.paddingBottom = '100%';
    var carasouelWidth = carousel.clientWidth;

    // set transitionSpeed
    // check the transitionSpeed and put 5ms as default if null
    transitionSpeed = Math.abs(parseInt(transitionSpeed)) * -1 || -5;

    // sets interval between slides default as 1s
    interval = parseInt(interval) || 1000;
    //childrens of carousel
    var carouselChildren = carousel.children;
    // add event listner in window for resizing of window
    window.addEventListener("resize", resize, { passive: true });
    function resize(event) {
        carasouelWidth = parseInt(document.getElementById(carouselId).clientWidth);
        carousel.style.paddingBottom = parseInt(window.getComputedStyle(carouselChildren[0]).height) + "px";
    }

    // loop through children of caraousel to set them as absolute and distance to put them
    for (var i = 0; i < (carouselChildren.length); i++) {
        carouselChildren[i].style.width = 100 + '%';
        carouselChildren[i].style.height = 'auto';

        carouselChildren[i].style.position = 'absolute';
        carouselChildren[i].style.top = 0 + 'px';
        carouselChildren[i].style.left = (carasouelWidth * i) + 'px';
    }


    // request animation value 
    var animationFrame = 0;
    var carasouelLeftSpace = 0;

    //slideshow function
    function slideWindow() {
        carasouelLeftSpace = carasouelLeftSpace + transitionSpeed;

        // check if on end of slide or on first slide
        if ((Math.abs(carasouelLeftSpace) + carasouelWidth) >= (carasouelWidth * carouselChildren.length) ||
            Math.abs(carasouelLeftSpace) <= 0) {
            transitionSpeed *= -1;
        }

        //change the image in moving position
        for (var i = 0; i < (carouselChildren.length); i++) {
            carouselChildren[i].style.left = (carasouelWidth * i) + carasouelLeftSpace + 'px';
        }

        if (Math.abs(carasouelLeftSpace) % carasouelWidth === 0) {
            setTimeout(function () {
                animationFrame = window.requestAnimationFrame(slideWindow);
            }, interval);
        }
        else {
            animationFrame = window.requestAnimationFrame(slideWindow);
        }
    }
    //call resize for checking the dom changes
    resize();
    // request animation frame for smooth animation 
    window.requestAnimationFrame(slideWindow);
    console.log(carousel);
}

var a = new Carousel('test1', 5, 200);
var b = new Carousel('test2', 1, 100);

var c = new Carousel('test3', 1, 1000);
var d = new Carousel('test4', 10, 1);