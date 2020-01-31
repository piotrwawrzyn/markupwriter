const MarkupWriter = require('./MarkupWriter');

const htmlDumpElement = document.querySelector('#htmlDump');
const textDumpElement = document.querySelector('#textDump');

const htmlString = `
<div class="container">
  <div class="comment">
    <a href="/adam.html">Adam</a>
    <p>Hi there!</p>
  </div>
  <br>
  <button>Add new comment</button>
</div>
`;

const markupWriter = new MarkupWriter(
  htmlDumpElement,
  textDumpElement,
  htmlString
);

markupWriter.start();
