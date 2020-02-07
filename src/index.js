const MarkupWriter = require('./MarkupWriter');
const Node = require('./Node');

const htmlDumpElement = document.querySelector('#htmlDump');
const textDumpElement = document.querySelector('#textDump');

const htmlString = `
<div class="container">
  <header>
    <img class="logo" src="/resources/logo.png" />
    <h1>
      <span>Animate</span>
      <span>your markup</span>
      <span>with ease!</span>
    </h1>
    <div class="wave"></div>
  </header>
</div>
`;

const closeTopBar = () => {
  const notificationBar = document.querySelector('#notification-bar');
  notificationBar.style.display = 'none';

  const container = document.querySelector('.container');
  container.style.height = '100vh';
  textDumpElement.style.height = '100vh';
};

const config = {
  charInterval: 60,
  displayCursor: true,
  // charactersPerTextLine: 100,
  pauseAfterTagClose: 180,
  onFinish: () => {
    const headerText = document.querySelector('header h1');
    headerText.classList.add('pop');
    closeTopBar();
  }

  // cursorOptions: {
  //   animationSpeed: 1,
  //   isStatic: true,
  //   color: 'pink',
  //   cursorString: `<svg height="10" width="20"><circle cx="8" cy="5" r="4" stroke="transparent" stroke-width="3" fill="black" /></svg>`
  // },
  // increasingPace: { multiplier: 1.007, maximumTimesChange: 2.5 }
};

const markupWriter = new MarkupWriter(
  htmlDumpElement,
  textDumpElement,
  htmlString,
  config
);

const skipButton = document.querySelector('.button-skip');
skipButton.addEventListener('click', () => {
  markupWriter.renderToEnd();
  closeTopBar();
});

const iconClose = document.querySelector('.icon-close');
iconClose.addEventListener('click', closeTopBar);

markupWriter.start();
