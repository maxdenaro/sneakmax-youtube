function disableScroll() {
  let pagePosition = window.scrollY;
  document.body.classList.add('disable-scroll');
  document.body.dataset.position = pagePosition;
  document.body.style.top = -pagePosition + 'px';
}

function enableScroll() {
  let pagePosition = parseInt(document.body.dataset.position, 10);
  document.body.style.top = 'auto';
  document.body.classList.remove('disable-scroll');
  window.scroll({
    top: pagePosition,
    left: 0
  });
  document.body.removeAttribute('data-position');
}


const burger = document.querySelector('.burger');
const menu = document.querySelector('.header__nav');

burger.addEventListener('click', () => {
  burger.classList.toggle('burger--active');
  menu.classList.toggle('header__nav--active');

  if (burger.classList.contains('burger--active')) {
    disableScroll();
  } else {
    enableScroll();
  }
});
