module.exports = {
  /**
   *  Returns copy of supplied html node without any children
   * @param {HTMLElement} el - html element to remove the children from
   */
  removeAllChildren: el => {
    const copiedEl = el.cloneNode(true);

    while (copiedEl.firstChild) {
      copiedEl.removeChild(copiedEl.firstChild);
    }

    return copiedEl;
  },
  /**
   *  Converts string to HTML Element
   * @param {string} htmlString - valid html string representing single node
   */
  stringToElement(htmlString) {
    const wrapper = document.createElement('template');
    const trimmedHtmlString = htmlString.trim();
    wrapper.innerHTML = trimmedHtmlString;
    return wrapper.content.firstChild;
  },
  /**
   *  Converts HTML Element to a string
   * @param {HTMLElement} htmlElement
   */
  elementToString(htmlElement) {
    if (!htmlElement) return htmlElement;
    if (htmlElement.nodeType === Node.TEXT_NODE) return htmlElement.wholeText;
    return htmlElement.outerHTML;
  },
  /**
   * Wrap a string into 2 other strings
   * @param {string} string - string to be wrapped
   * @param {string} before - string before
   * @param {string} after - string after
   */
  wrapString(string, before, after) {
    return before + string + after;
  },
  /**
   * Turns html string into plain text string
   * @param {string} string htmlish string
   */
  plainTextify(string) {
    return string.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },
  multiplyString(string, times) {
    let multipliedString = '';

    for (let i = 0; i < times; i++) {
      multipliedString += string;
    }

    return multipliedString;
  },
  /**
   * Add styles to document head
   *
   * @param {string} styles CSS string
   */
  addStyles(styles) {
    const styleBlock = document.createElement('style');
    styleBlock.appendChild(document.createTextNode(styles));
    document.head.appendChild(styleBlock);
  },
  /**
   * Clears text content of a single element or all elements in an array
   * @param {HTMLElement | Array<HTMLElement>} toClear
   */
  clearTextContent(toClear) {
    if (toClear instanceof HTMLElement) return (toClear.textContent = '');
    else {
      // Should be an array
      for (const element of toClear) {
        element.textContent = '';
      }
    }
  },
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};
