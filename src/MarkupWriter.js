const {
  removeAllChildren,
  stringToElement,
  elementToString,
  plainTextify
} = require('./utils');

const Node = require('./Node');

const defaultValuesHandler = require('./configDefaultValuesHandler');

class MarkupWriter {
  separator = '|';
  root = null;

  /**
   * Constructor
   * @param {HTMLElement} htmlDumpElement - container for html part of animation
   * @param {HTMLElement} textDumpElement - container for text part of animation
   * @param {string} htmlString - valid html string representing single node
   * @param {object} config - configuration object
   * @param {number} config.charInterval - interval between each character in ms
   */
  constructor(htmlDumpElement, textDumpElement, htmlString, config = {}) {
    this.htmlDumpElement = htmlDumpElement;
    this.textDumpElement = textDumpElement;
    this.htmlString = htmlString;
    this.config = new Proxy(config, defaultValuesHandler);

    this.onChange = this.onChange.bind(this);

    this.textDumpElement.style.whiteSpace = 'pre';

    // Pass config to Node class
    Node.config = this.config;
  }

  changeLastChildren(parent, newChildren) {
    if (!parent.childNodes[0]) {
      parent.appendChild(newChildren);
    } else {
      parent.removeChild(parent.lastChild);
      parent.appendChild(newChildren);
    }

    return parent;
  }

  /**
   *
   * @param {HTMLElement} htmlElement
   */
  prepareRenderingStructure(htmlElement) {
    if (!htmlElement) return;

    const element = removeAllChildren(htmlElement);
    const elementAsString = elementToString(element);

    const nodeObject = new Node(elementAsString, element.nodeType);

    if (this.lastParent) this.lastParent.addChildren(nodeObject);
    else this.root = nodeObject;

    htmlElement.childNodes.forEach(child => {
      this.lastParent = nodeObject;

      if (child.nodeType !== 3 || child.textContent.trim()) {
        this.prepareRenderingStructure(child);
      }
    });
  }

  displayHtmlText(htmlTextArray, newElementIndex) {
    if (this.config.displayCursor) {
      const { cursorCharacter } = this.config;
      const cursorCode = `<span>${cursorCharacter}</span>`;

      const beforeCursorArr = htmlTextArray.slice(1, newElementIndex + 1);
      const afterCursorArr = htmlTextArray.slice(newElementIndex + 1);

      const code =
        plainTextify(beforeCursorArr.join('')) +
        cursorCode +
        plainTextify(afterCursorArr.join(''));

      this.textDumpElement.insertAdjacentHTML('beforeend', `<p>${code}</p>`);
    } else {
      this.textDumpElement.textContent = '';
      this.textDumpElement.insertAdjacentHTML(
        'beforeend',
        htmlTextArray.join('')
      );
    }
  }

  onChange(htmlTextArray, newElementIndex) {
    this.textDumpElement.textContent = '';
    this.displayHtmlText(htmlTextArray, newElementIndex);
  }

  start() {
    const { htmlDumpElement, textDumpElement, htmlString } = this;
    const elementToRender = stringToElement(htmlString);
    this.prepareRenderingStructure(elementToRender);
    this.root.renderWithChildren(this.onChange);
  }
}

module.exports = MarkupWriter;
