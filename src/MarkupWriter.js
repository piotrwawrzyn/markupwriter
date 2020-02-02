const {
  removeAllChildren,
  stringToElement,
  elementToString,
  plainTextify,
  addStyles,
  clearTextContent
} = require('./utils');

const Node = require('./Node');

const defaultValuesHandler = require('./configDefaultValuesHandler');

class MarkupWriter {
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

    // Inject needed styles
    const {
      cursorOptions: { color, animationSpeed }
    } = this.config;

    addStyles(
      `@keyframes blinking-cursor {
        from, to { color: transparent }
        50% { color: ${color} }
      } .markupwriter-cursor {animation: blinking-cursor ${animationSpeed}s step-end infinite reverse; font-weight: bold } `
    );
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

  /**
   * Sets up a cursor that is rendered in the dom just once (only left and right hand of it rerenders constantly)
   */
  prepareStaticCursor(cursorString) {
    const { textDumpElement } = this;

    const beforeCursorClass = 'markupwriter-before-cursor';
    const afterCursorClass = 'markupwriter-after-cursor';

    textDumpElement.insertAdjacentHTML(
      'beforeend',
      `<span class="${beforeCursorClass}"></span>`
    );

    textDumpElement.insertAdjacentHTML('beforeend', cursorString);

    textDumpElement.insertAdjacentHTML(
      'beforeend',
      `<span class="${afterCursorClass}"></span>`
    );

    this.beforeCursorElement = document.querySelector(`.${beforeCursorClass}`);
    this.afterCursorElement = document.querySelector(`.${afterCursorClass}`);

    this.staticCursorReady = true;
  }

  renderHtmlText(htmlTextArray, newElementIndex) {
    const { textDumpElement } = this;

    if (this.config.displayCursor) {
      const {
        cursorOptions: { cursorString, isStatic }
      } = this.config;

      const beforeCursorArr = htmlTextArray.slice(0, newElementIndex + 1);
      const afterCursorArr = htmlTextArray.slice(newElementIndex + 1);
      const leftHand = plainTextify(beforeCursorArr.join(''));
      const rightHand = plainTextify(afterCursorArr.join(''));

      if (isStatic) {
        if (!this.staticCursorReady) this.prepareStaticCursor(cursorString);

        const { beforeCursorElement, afterCursorElement } = this;

        clearTextContent([beforeCursorElement, afterCursorElement]);

        beforeCursorElement.insertAdjacentHTML('beforeend', leftHand);
        afterCursorElement.insertAdjacentHTML('beforeend', rightHand);
      } else {
        clearTextContent(textDumpElement);
        textDumpElement.insertAdjacentHTML(
          'beforeend',
          leftHand + cursorString + rightHand
        );
      }
    } else {
      // No cursor needed, just join the array and dump it
      clearTextContent(textDumpElement);
      textDumpElement.insertAdjacentHTML(
        'beforeend',
        plainTextify(htmlTextArray.join(''))
      );
    }
  }

  onChange(htmlTextArray, newElementIndex) {
    this.renderHtmlText(htmlTextArray, newElementIndex);
  }

  start() {
    const { htmlString } = this;
    const elementToRender = stringToElement(htmlString);
    this.prepareRenderingStructure(elementToRender);
    this.root.buildWithChildren(this.onChange);
  }
}

module.exports = MarkupWriter;
