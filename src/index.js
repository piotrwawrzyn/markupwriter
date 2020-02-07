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

  if (!notificationBar) return;

  notificationBar.style.display = 'none';
  textDumpElement.style.height = '100vh';
};

const config = {
  charInterval: 60,
  displayCursor: true,
  pauseAfterTagClose: 180,
  onFinish: () => {
    const headerText = document.querySelector('header h1');
    headerText.classList.add('pop');
    closeTopBar();
  }
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
