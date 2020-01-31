const {
  removeAllChildren,
  stringToElement,
  elementToString
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

    const nodeObject = new Node(elementAsString);

    if (this.lastParent) this.lastParent.addChildren(nodeObject);
    else this.root = nodeObject;

    htmlElement.childNodes.forEach(child => {
      this.lastParent = nodeObject;

      if (child.nodeType !== 3 || child.textContent.trim()) {
        this.prepareRenderingStructure(child);
      }
    });
  }

  removeSeparator(string) {
    return string.replace(this.separator, '');
  }

  onChange(markupArray) {
    this.textDumpElement.textContent = markupArray.join('');
  }

  start() {
    const { htmlDumpElement, textDumpElement, htmlString } = this;
    const elementToRender = stringToElement(htmlString);
    this.prepareRenderingStructure(elementToRender);
    this.root.renderWithChildren(this.onChange);
  }
}

module.exports = MarkupWriter;
