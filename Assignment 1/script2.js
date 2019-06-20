function Carousel(carouselCaontainerId) {
    carousel = document.getElementById(carouselCaontainerId);
    carousel.style.position = 'relative';
    carousel.style.overflow = 'hidden';
    carasouelWidth = carousel.clientWidth;
    carasouelHeight = carousel.clientHeight;
    
    var carasouelLeftSpace = 0;

    carouselChildren = carousel.children[0].children;
    for (var i = 0; i < (carouselChildren.length); i++) {
        console.log(carouselChildren[i]);
        carouselChildren[i].style.width = carasouelWidth + 'px';
        carouselChildren[i].style.height = carasouelHeight + 'px';

        carouselChildren[i].style.position = 'absolute';
        carouselChildren[i].style.top = 0 + 'px';
        carouselChildren[i].style.left = (carasouelWidth * i) + carasouelLeftSpace + 'px';
    }
}