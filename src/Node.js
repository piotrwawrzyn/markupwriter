const { multiplyString } = require('./utils');

let htmlTextOutput = [];
let unclosedTags = 0;
const NUMBER_OF_CHARS_BEFORE_NEW_LINE_ATTEMPT = 50;

class Node {
  children = [];

  constructor(value, nodeType) {
    this.value = value;
    this.valueArray = value.split('');
    this.nodeType = nodeType;
  }

  addChildren(node) {
    this.children.push(node);
  }

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

  addCharacter(character) {
    const { charInterval } = Node.config;

    return new Promise(resolve =>
      setTimeout(async () => {
        const indexOfNewElement = this.updateOutput(character);
        resolve(indexOfNewElement);
      }, charInterval || defaultValues.charInterval)
    );
  }

  async renderWithChildren(callback) {
    await this.render(callback);

    for (const child of this.children) {
      unclosedTags++;
      await child.renderWithChildren(callback);
      unclosedTags--;
    }
  }

  async render(callback) {
    return new Promise(async resolve => {
      let closingTag = false;
      let newLineRequest = false;
      let charsInCurrentLine = 0;

      let currentCharacter;

      let intent = multiplyString('    ', unclosedTags);

      await this.addCharacter(intent);

      for (let i = 0; i < this.valueArray.length; i++) {
        if (closingTag) {
          currentCharacter = intent + this.value.slice(i);
          await this.addCharacter('\r\n');
        } else currentCharacter = this.valueArray[i];

        if (newLineRequest && currentCharacter === ' ') {
          newLineRequest = false;
          charsInCurrentLine = 0;

          currentCharacter =
            currentCharacter + '\r\n' + multiplyString('    ', unclosedTags);
        }

        const indexOfNewElement = await this.addCharacter(currentCharacter);

        callback(htmlTextOutput, indexOfNewElement);

        if (closingTag) break;

        if (currentCharacter === '>') closingTag = true;

        // New lines handling for blocks of text
        if (this.nodeType === 3) {
          if (charsInCurrentLine > NUMBER_OF_CHARS_BEFORE_NEW_LINE_ATTEMPT) {
            newLineRequest = true;
          } else {
            charsInCurrentLine++;
          }
        }
      }

      this.addCharacter('\r\n');

      resolve();
    });
  }
}

module.exports = Node;
