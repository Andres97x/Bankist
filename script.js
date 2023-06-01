'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WORKING WITH APP

///////////////////////////////////////
// MODAL WINDOW
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////////////
// IMPLEMENTING SMOOTH SCROLLING
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);

  // console.log(e.target.getBoundingClientRect());
  // console.log(this.getBoundingClientRect());

  console.log('Current scroll (x/y):', window.pageXOffset, window.pageYOffset);

  console.log(
    'Height and width of viewport:',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXoffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXoffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////////////////////
// EVENT DELEGATION: IMPLEMENTING PAGE NAVIGATION
// document.querySelectorAll('.nav__link').forEach(el =>
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     // console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   })
// );

// ----> Using Event Delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////////////////////
// BUILDING A TABBED COMPONENT
// tabs.forEach(tab => tab.addEventListener('click', () => console.log('TAB')));
// #f00 using for Each on every tab is bad practice, let's use delegation instead

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);
  // We had to use closest() method here beacuse there was other elements inside the buttons, and we wanted to especifically select the buttons

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabContent.forEach(con =>
    con.classList.remove('operations__content--active')
  );

  // Active tab
  clicked.classList.add('operations__tab--active');

  // Active content
  const active = document.querySelector(
    `.operations__content--${clicked.dataset.tab}`
  );
  // console.log(active);
  active.classList.add('operations__content--active');
});

///////////////////////////////////////////////////////
// PASSING ARGUMENTS TO EVENT HANDLERS

// ----> Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    // console.log(this, e.currentTarget);
    // the this keyword and the currentTarget are usually the same, but not in this case as we binded the this keyword manually to point to either 0.5 or 1 opacity. THIS WAS A CLEVER WAY FOR PASSING IN ARGUMENTS INTO AN EVENT HANDLER'S CALL BACK FUNCTION.

    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};

// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });

// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });

// ----> Pasing "arguments" into a handler
// The BIND method was so smart here because the event handler literally expects a function, not a value, so we know that .bind() returns a function, and we used the argument to point the this keyworkd not to an object as done in past lectures but to a fixed value instead (opacity value)
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

/*
///////////////////////////////////////////////////////
// IMPLEMENTING A STICKY NAVIGATION: THE SCROLL EVENT
const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords.top);

window.addEventListener('scroll', function () {
  // console.log(window.scrollY);
  if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
*/

///////////////////////////////////////////////////////
// A BETTER WAY: THE INTERSECTION OBSERVER API
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height;
const navHeight2 = Number.parseFloat(getComputedStyle(nav).height);
// console.log(navHeight, navHeight2);

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, // When 0% of the viewport is visible we want something to happen
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////////////////////
// REVEAL ELEMENTS ON SCROLL
// ----> Reveal sections
const allSections = document.querySelectorAll('.section');
// console.log(allSections);

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  // console.log(entry.target); // This points to each of the sections when the event occurs

  if (!entry.isIntersecting) return; // Guard clause!

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); // Each of the sections are being unobserved after work is done
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  section.classList.add('section--hidden'); //#2FC
  sectionObserver.observe(section);
});

///////////////////////////////////////////////////////
// LOADING LAZY IMAGES
const imgTargets = document.querySelectorAll('img[data-src]'); // images that have data src attribute

const lazyImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return; // Guard clause!

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(lazyImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

/////////////////////////////////////////////////////
// BUILDING A SLIDER COMPONENT
const slider = function () {
  // ----> Temporary
  // const slider = document.querySelector('.slider');
  // slider.style.overflow = 'visible';
  // slider.style.transform = `scale(0.5) translateX(-1400px)`;

  // Selecting elements
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const goToSlide = function (slide) {
    slides.forEach(
      (sl, i) => (sl.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
    // 0%, 100%, 200%, 300%
  };

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class = "dots__dot" data-slide = "${i}"></button>`
      );
    });
  };

  const activateDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide = "${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // ----> Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDots(curSlide);
  };

  // ----> Previous slide
  const previousSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDots(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDots(0);
  };
  init();

  // Event Handlers
  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', previousSlide);

  document.addEventListener('keydown', function (e) {
    // console.log(e);
    if (e.key === 'ArrowLeft') previousSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDots(slide);
    }
  });
};
slider();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WORKING WITH LECTURES

/*
///////////////////////////////////////////////////////
// SELECTING, CREATING AND DELETING ELEMENTS
// ----> Selecting elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

// ----> Creating and inserting elements
// .insertAdjecentHTML
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics';
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class = "btn btn--close-cookie">Got it!</button>';

// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// ----> Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
    // message.parentElement.removeChild(message);
  });

///////////////////////////////////////////////////////
// STYLES, ATTRIBUTES AND CLASSES
// ----> Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.height);
console.log(message.style.width);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 20 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

// ----> Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

logo.alt = 'Beautiful minimalistic logo';

// Non-standard attributes
console.log(logo.designer);
console.log(logo.getAttribute('designer'));

logo.setAttribute('company', 'Bankist');

console.log(logo.src); // absolute src
console.log(logo.getAttribute('src')); // relative src

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// ----> Data attributes
console.log(logo.dataset.versionNumber);

// ----> Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); // not .includes() like in arrays

// Do Not use this (this will overwrite what's already there and only allows to use 1 class)
logo.className = 'Jonas';
*/

/*
///////////////////////////////////////////////////////
// TYPE OF EVENTS AND EVENT HANDLERS

const h1 = document.querySelector('h1');
const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');

  // h1.removeEventListener('mouseenter', alertH1);
};

h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// h1.onmouseenter = function (e) {
//   alert('onmouseeneter: Great! You are reading the heading :D');
// };
*/

/*
///////////////////////////////////////////////////////
// EVENT PROPAGATION IN PRACTICE (BUBBLING AND CAPTURING)

// rgb(255,255,255)

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1));

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK:', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINKS:', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('NAV:', e.target, e.currentTarget);
  },
  false
);
*/

/*
///////////////////////////////////////////////////////
// DOM TRAVERSING
const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/

/*
///////////////////////////////////////////////////////
// LIFECYCLE DOM EVENTS
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded!', e);
});

// window.addEventListener('beforeunload', function (e) {
//   // e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });

///////////////////////////////////////////////////////
// EFFICIENT SCRIPT LOADING: DEFER AND ASYNC
*/
