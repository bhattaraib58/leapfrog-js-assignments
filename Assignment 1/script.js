/**
 * Class Caraousel
 *
 * @param {*} carouselId
 * @param {*} transitionSpeed -in px per frame speed, how fast slide moves
 * @param {*} interval - in ms, time between new slides
 */

var DEFAULT_TRANSITION = 5;
var DEFAULT_INTERVAL = 1000;
function Carousel(carouselId, transitionSpeed, interval) {

    // get caraousel wrapper and set the value relative for positioning
    var parentCarousel = document.getElementById(carouselId);
    parentCarousel.style.position = 'relative';

    //get main carasouel
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
    var animationFrame = '';
    var carasouelLeftSpace = 0;

    //add control elements e.g:- left, right, circles- indexes
    var controlElement = createControlElements();
    parentCarousel.appendChild(controlElement);
    setSliderIndicatorColor();

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
        controlElement.style.paddingBottom = height;
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
            window.cancelAnimationFrame(animationFrame);
            setSliderIndicatorColor();

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
        return button;
    }

    function setSliderIndicatorColor() {
        var indexWrapper = controlElement.children[2];

        for (var i = 0; i < indexWrapper.childElementCount; i++) {
            indexWrapper.children[i].style.backgroundColor = 'gray';
            if (i === getSliderIndex()) {
                indexWrapper.children[getSliderIndex()].style.backgroundColor = 'red';
            }
        }
    }

    function getSliderIndex() {
        return parseInt(Math.abs(carasouelLeftSpace) / carasouelWidth);
    }

    function createControlElements() {
        // create main controlElement parent
        var controlElement = document.createElement('div');
        controlElement.style.width = '100%';
        controlElement.style.height = 0;
        controlElement.style.position = 'absolute';
        controlElement.style.top = 0;
        controlElement.style.left = 0;
        controlElement.style.zIndex = 20;

        //left button create and function for transition
        var leftButton = createButton(`
                            <svg viewBox="0 0 16000 16000">
                                <polyline class="a" points="11040,1920 4960,8000 11040,14080 "></polyline>
                            </svg>`);

        leftButton.style.top = '50%';
        leftButton.style.left = 0;
        leftButton.style.position = 'absolute';

        leftButton.onclick = function () {
            if (!(carasouelLeftSpace > 0)) {
                carasouelLeftSpace = -(getSliderIndex() * carasouelWidth);
            }
        };

        //right button create and function for transition
        var rightButton = createButton(`
                            <svg viewBox="0 0 16000 16000">
                                <polyline class="a" points="4960,1920 11040,8000 4960,14080 "></polyline>
                            </svg>`);
        rightButton.style.right = 0;
        rightButton.style.top = '50%';
        rightButton.style.position = 'absolute';

        rightButton.onclick = function () {
            if (!((carasouelLeftSpace - carasouelWidth) < -(carasouelWidth * carouselChildren.length))) {
                var currentIndex = parseInt(Math.abs(carasouelLeftSpace) / carasouelWidth);
                carasouelLeftSpace = -((currentIndex + 1) * carasouelWidth);
            }
        };

        //add left button and right button to control element
        controlElement.appendChild(leftButton);
        controlElement.appendChild(rightButton);

        var indexWidth = 7;
        var indexHeight = 7;
        var indexMarginBetween = 2;

        var indexWrapper = document.createElement('div');
        indexWrapper.style.position = 'absolute';
        indexWrapper.style.bottom = 0;
        indexWrapper.style.left = 50 + '%';
        indexWrapper.style.marginLeft = -(carouselChildren.length * (indexWidth + indexMarginBetween)) / 2 + 'px';

        //create array of below navigation buttons
        for (var i = 0; i < carouselChildren.length; i++) {
            var indexButton = createButton(i + 1);
            indexButton.style.border = '1px solid black';
            indexButton.style.borderRadius = 50 + '%';
            indexButton.style.backgroundColor = 'gray';
            indexButton.style.color = 'white';
            indexButton.style.marginRight = indexMarginBetween + 'px';
            indexButton.style.width = indexWidth + 'px';
            indexButton.style.height = indexHeight + 'px';
            indexButton.style.fontSize = (indexHeight - 4) + 'px';
            indexButton.style.textAlign = 'center';
            indexButton.style.bottom = 0;
            indexButton.onclick = function (i) {
                return function () {
                    setSliderIndicatorColor();
                    carasouelLeftSpace = -((i) * carasouelWidth);
                }
            }(i);

            indexButton.style.left = 50 + ((i + 1) * 10) + '%';
            indexWrapper.appendChild(indexButton);
        }
        controlElement.appendChild(indexWrapper);


        return controlElement;
    }
}

//carasouel object based on the transition interval and carasoul object
var a = new Carousel('test1', 15, 2000);
var b = new Carousel('test2', 1, 1000);
var c = new Carousel('test3', 5, 1000);
var d = new Carousel('test4', 10, 4000);