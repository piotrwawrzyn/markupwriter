const MarkupWriter = require('./MarkupWriter');

const htmlDumpElement = document.querySelector('#htmlDump');
const textDumpElement = document.querySelector('#textDump');

const htmlString = `
<div class="container">
  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
  <div class="comment">
    <a href="/adam.html">Adam</a>
    <p>Hi there!</p>
  </div>
  <br>
  <button>Add new comment</button>
</div>
`;

const config = {
  charInterval: 90,
  displayCursor: true,
  cursorCharacter: '|'
};

const markupWriter = new MarkupWriter(
  htmlDumpElement,
  textDumpElement,
  htmlString,
  config
);

markupWriter.start();
