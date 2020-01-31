const {
  removeAllChildren,
  stringToElement,
  elementToString,
  plainTextify
} = require('./utils');

const Node = require('./Node');

class CodeWriter {
  separator = '|';
  root = null;

  /**
   * Constructor
   * @param {HTMLElement} htmlDumpElement - container for html part of animation
   * @param {HTMLElement} textDumpElement - container for text part of animation
   * @param {string} htmlString - valid html string representing single node
   */
  constructor(htmlDumpElement, textDumpElement, htmlString) {
    this.htmlDumpElement = htmlDumpElement;
    this.textDumpElement = textDumpElement;
    this.htmlString = htmlString;

    this.onChange = this.onChange.bind(this);

    this.textDumpElement.style.whiteSpace = 'pre';
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
    console.log(markupArray);
    this.textDumpElement.textContent = markupArray.join('');
  }

  start() {
    const { htmlDumpElement, textDumpElement, htmlString } = this;
    const elementToRender = stringToElement(htmlString);
    this.prepareRenderingStructure(elementToRender);
    this.root.renderWithChildren(this.onChange);
  }
}

module.exports = CodeWriter;
