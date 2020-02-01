const { multiplyString, sleep } = require('./utils');
const VisibleNodeType = require('./enums/VisibleNodeType');

let htmlTextOutput = [];
let unclosedTags = 0;

class Node {
  children = [];

  constructor(nodeString, nodeType) {
    this.nodeString = nodeString;
    this.nodeStringArray = nodeString.split('');
    this.nodeType = nodeType;
  }

  addChildren(node) {
    this.children.push(node);
  }

  /**
   * Updates array with new character / string
   * @param {string} valueToPush - character / string to be added to builded array
   */
  updateOutput(valueToPush) {
    if (unclosedTags === 0) {
      htmlTextOutput.push(valueToPush);

      return htmlTextOutput.length - 1;
    } else {
      const indexToPushAt = htmlTextOutput.length - unclosedTags * 2;
      htmlTextOutput.splice(indexToPushAt, 0, valueToPush);

      return indexToPushAt;
    }
  }

  addCharacter(character, callback, longWait) {
    const { charInterval } = Node.config;
    const interval = longWait ? charInterval * 4 : charInterval;

    return new Promise(resolve =>
      setTimeout(async () => {
        const indexOfNewElement = this.updateOutput(character);
        callback(htmlTextOutput, indexOfNewElement);

        resolve(indexOfNewElement);
      }, interval)
    );
  }

  /**
   * Builds current Node and all children recursively
   * @param {funcion} callback - function called when there is a change in the generated output
   */
  async buildWithChildren(callback) {
    await this.build(callback);

    for (const child of this.children) {
      unclosedTags++;
      await child.buildWithChildren(callback);
      unclosedTags--;
    }
  }

  /**
   * Builds current Node
   * @param {function} callback - function called when there is a change in the generated output
   */
  async build(callback) {
    const {
      charactersPerTextLine,
      pauseBeforeTagOpen,
      pauseAfterTagClose
    } = Node.config;
    return new Promise(async resolve => {
      let closingTag = false;
      let newLineRequest = false;
      let charsInCurrentLine = 0;

      let currentCharacter;

      let intent = multiplyString('    ', unclosedTags);

      // If not a root node
      if (htmlTextOutput.length) {
        // Add new line with necessary intent
        await this.addCharacter('\r\n' + intent, callback);

        // Sleep before tag opens
        await sleep(pauseBeforeTagOpen);
      }

      for (let i = 0; i < this.nodeStringArray.length; i++) {
        if (closingTag) {
          // Next string pushed to the array is the whole closing tag
          currentCharacter = this.nodeString.slice(i);

          await this.addCharacter('\r\n' + intent, callback);
        } else currentCharacter = this.nodeStringArray[i];

        if (newLineRequest && currentCharacter === ' ') {
          newLineRequest = false;
          charsInCurrentLine = 0;

          currentCharacter =
            currentCharacter + '\r\n' + multiplyString('    ', unclosedTags);
        }

        await this.addCharacter(currentCharacter, callback);

        // Sleep after tag closes
        if (closingTag) await sleep(pauseAfterTagClose);

        if (closingTag) break;

        if (currentCharacter === '>') closingTag = true;

        // New lines handling for blocks of text
        if (this.nodeType === VisibleNodeType.TEXT_NODE) {
          if (charsInCurrentLine > charactersPerTextLine) {
            newLineRequest = true;
          } else {
            charsInCurrentLine++;
          }
        }
      }

      resolve();
    });
  }
}

module.exports = Node;
