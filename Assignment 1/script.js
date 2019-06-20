/**
 * Class Caraousel
 *
 * @param {*} carouselId
 * @param {*} transitionSpeed -in ms, how fast slide moves
 * @param {*} interval - in ms, time between new slides
 */

var DEFAULT_TRANSITION = 5;
var DEFAULT_INTERVAL = 1000;
function Carousel(carouselId, transitionSpeed, interval) {

    // get caraousel and set the values;
    // at 0 index children for carasoul
    var parentCarousel = document.getElementById(carouselId);
    var carousel = parentCarousel.children[0];
    carousel.style.position = 'absolute';
    carousel.style.zIndex = 10;
    carousel.style.overflow = 'hidden';
    carousel.style.width = '100%';
    carousel.style.height = '0px';
    carousel.style.paddingBottom = '100%';
    var carasouelWidth = carousel.clientWidth;
    //childrens of carousel
    var carouselChildren = carousel.children;

    // set transitionSpeed
    // check the transitionSpeed and put 5ms as default if null
    transitionSpeed = Math.abs(parseInt(transitionSpeed)) * -1 || -DEFAULT_TRANSITION;

    // sets interval between slides default as 1s
    interval = parseInt(interval) || DEFAULT_INTERVAL;

    // loop through children of caraousel to set them as absolute and distance to put them
    for (var i = 0; i < (carouselChildren.length); i++) {
        carouselChildren[i].style.width = 100 + '%';
        carouselChildren[i].style.height = 'auto';

        carouselChildren[i].style.position = 'absolute';
        carouselChildren[i].style.top = 0 + 'px';
        carouselChildren[i].style.left = (carasouelWidth * i) + 'px';
        carouselChildren[i].style.zIndex = '10';
    }

    // request animation value 
    var animationFrame = 0;
    var carasouelLeftSpace = 0;


    var controlElements = createControlElements();
    controlElements.style.width = '100%';
    controlElements.style.height = 0;
    controlElements.style.position = 'absolute';
    controlElements.style.top = 0;
    controlElements.style.left = 0;
    controlElements.style.zIndex = 20;

    parentCarousel.style.position = 'relative';
    parentCarousel.appendChild(controlElements);

    //call resize for checking the dom changes
    resize();

    // request animation frame for smooth animation 
    window.requestAnimationFrame(slideWindow);

    // add event listner in window for resizing of window
    window.addEventListener("resize", resize, { passive: true });

    function resize(event) {
        carasouelWidth = parseInt(document.getElementById(carouselId).clientWidth);
        var height = parseInt(window.getComputedStyle(carouselChildren[0]).height) + "px";
        carousel.style.paddingBottom = height;
        parentCarousel.style.paddingBottom = height;
        controlElements.style.paddingBottom = height;
    }

    //slideshow function
    function slideWindow() {
        carasouelLeftSpace = carasouelLeftSpace + transitionSpeed;

        // check if on end of slide or on first slide them move slide on new direction
        if ((carasouelLeftSpace > 0) ||
            (carasouelLeftSpace - carasouelWidth) < -(carasouelWidth * carouselChildren.length)) {
            transitionSpeed *= -1;
        }

        //change the image in moving position
        for (var i = 0; i < (carouselChildren.length); i++) {
            carouselChildren[i].style.left = (carasouelWidth * i) + carasouelLeftSpace + 'px';
        }

        //check if the slide is in frame
        if (Math.abs(carasouelLeftSpace) % carasouelWidth === 0) {
            setTimeout(function () {
                animationFrame = window.requestAnimationFrame(slideWindow);
            }, interval);
        }
        else {
            animationFrame = window.requestAnimationFrame(slideWindow);
        }
    }

    function createButton(buttonData) {
        var button = document.createElement('button');
        button.style.border = 'none';
        button.style.backgroundColor = 'transparent';
        button.innerHTML = buttonData;
        button.style.position = 'absolute';
        return button;
    }

    function createControlElements() {
        var controlElement = document.createElement('div');

        var leftButton = createButton(`
                            <svg viewBox="0 0 16000 16000">
                                <polyline class="a" points="11040,1920 4960,8000 11040,14080 "></polyline>
                            </svg>`);

        leftButton.style.top = '50%';
        leftButton.style.left = 0;

        leftButton.onclick = function () {
            var currentIndex = parseInt(Math.abs(carasouelLeftSpace) / carasouelWidth);
            carasouelLeftSpace = -((currentIndex) * carasouelWidth);
        };

        var rightButton = createButton(`
                            <svg viewBox="0 0 16000 16000">
                                <polyline class="a" points="4960,1920 11040,8000 4960,14080 "></polyline>
                            </svg>`);
        rightButton.style.right = 0;
        rightButton.style.top = '50%';

        rightButton.onclick = function () {
            var currentIndex = parseInt(Math.abs(carasouelLeftSpace) / carasouelWidth);
            carasouelLeftSpace = -((currentIndex + 1) * carasouelWidth);
        };

        controlElement.appendChild(leftButton);
        controlElement.appendChild(rightButton);

        for (var i = 0; i < carouselChildren.length; i++) {
            var indexButton = createButton(i + 1);
            indexButton.style.border = '1px solid black';
            indexButton.style.borderRadius=50+'%';
            indexButton.style.backgroundColor='gray';
            indexButton.style.color='white';
            indexButton.style.marginRight = 10 + 'px';
            indexButton.style.bottom = 0;
            indexButton.onclick = function (i) {
                return function () {
                    carasouelLeftSpace = -((i) * carasouelWidth);
                }
            }(i);

            indexButton.style.left = 50 + ((i + 1) * 10) + '%';
            controlElement.appendChild(indexButton);
        }
        return controlElement;
    }
}

var a = new Carousel('test1', 5, 200);
var b = new Carousel('test2', 1, 100);
var c = new Carousel('test3', 1, 1000);
var d = new Carousel('test4', 10, 1);