module.exports = {
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
  wrapString(string, before, after) {
    return before + string + after;
  },
  /**
   * Turns html string into plain text string
   * @param {string} string htmlish string
   */
  plainTextify(string) {
    return string.replace('<', '&lt;').replace('>', '&gt;');
  }
};
