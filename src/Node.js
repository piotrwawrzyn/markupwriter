import { multiplyString, sleep } from './utils';
import VisibleNodeType from './enums/VisibleNodeType';
import {
  isStillWorthToSplit,
  isSplitFriendlyCharacter
} from './utils/lineSpliting';

let htmlStateArray = [];
let unclosedTags = 0;

class Node {
  children = [];

  constructor(nodeString, nodeType) {
    this.nodeString = nodeString;
    this.nodeStringArray = nodeString.split('');
    this.nodeType = nodeType;

    if (nodeType === VisibleNodeType.TEXT_NODE) {
      this.shiftAndPopWhitespaces();
    }

    // Set initial interval between characters as per config
    const { charInterval } = Node.config;
    this.currentCharacterInterval = charInterval;
  }

  /**
   * Remove all whitespaces from the beginning and end of the Node
   * 1st iteration - use shift until non whitespace character is met
   * 2nd iteration - use pop until non whitespace character is met
   */
  shiftAndPopWhitespaces() {
    const { nodeString, nodeStringArray } = this;
    const nodeStringArrayDouble = nodeString.split('');

    for (let i = 0; i < 2; i++) {
      for (const element of nodeStringArrayDouble) {
        // If whitespace OR new line character then shift or pop depending on the current iteration
        if (element.trim() === '' || element === '\n') {
          if (!i) nodeStringArray.shift();
          else nodeStringArray.pop();
        } else {
          break;
        }
      }

      nodeStringArrayDouble.reverse();
    }
  }

  /**
   * Add new child to the array of children
   * @param {Node} node
   */
  addChildren(node) {
    this.children.push(node);
  }

  /**
   * Updates array with new character / string
   * @param {string} valueToPush - character / string to be added to builded array
   */
  updateHtmlStateArray(valueToPush) {
    if (unclosedTags === 0) {
      htmlStateArray.push(valueToPush);

      return htmlStateArray.length - 1;
    } else {
      const indexToPushAt = htmlStateArray.length - unclosedTags * 2;
      htmlStateArray.splice(indexToPushAt, 0, valueToPush);

      return indexToPushAt;
    }
  }

  addCharacter(character, callback, isValidHtml) {
    const {
      increasingPace: { use, multiplier, maximumTimesChange },
      charInterval
    } = Node.config;

    // Handle possible usage of increasing pace effect
    if (use) {
      if (
        this.currentCharacterInterval > charInterval / maximumTimesChange &&
        this.currentCharacterInterval < charInterval * maximumTimesChange
      )
        this.currentCharacterInterval =
          this.currentCharacterInterval * multiplier;
    }

    const update = () => {
      const indexOfNewElement = this.updateHtmlStateArray(character);
      callback(htmlStateArray, indexOfNewElement, isValidHtml);

      return indexOfNewElement;
    };

    // If set to finish instantly don't use promise at all
    if (Node.buildToEnd) return update();
    return new Promise(resolve =>
      setTimeout(async () => {
        resolve(update());
      }, this.currentCharacterInterval)
    );
  }

  /**
   * Builds current Node and all children recursively
   * @param {funcion} callback - function called when there is a change in the generated output
   */
  async buildWithChildren(callback) {
    await this.build(callback);

    const { children } = this;

    for (const child of children) {
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
      charactersPerLine,
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
      if (htmlStateArray.length) {
        // Add new line with necessary intent
        await this.addCharacter('\r\n' + intent, callback);

        // Sleep before tag opens
        if (!Node.buildToEnd) await sleep(pauseBeforeTagOpen);
      }

      for (let i = 0; i < this.nodeStringArray.length; i++) {
        if (closingTag) {
          // Next string pushed to the array is the whole closing tag
          currentCharacter = this.nodeString.slice(i);

          if (this.children.length)
            await this.addCharacter('\r\n' + intent, callback);
        } else currentCharacter = this.nodeStringArray[i];

        if (newLineRequest) {
          const splitFriendlyChar = isSplitFriendlyCharacter(
            currentCharacter,
            this.nodeType,
            this.nodeStringArray,
            i
          );

          const stillWorth = isStillWorthToSplit(
            i,
            this.nodeStringArray.length
          );

          if (splitFriendlyChar && stillWorth) {
            newLineRequest = false;
            charsInCurrentLine = 0;

            currentCharacter =
              currentCharacter + '\r\n' + multiplyString('    ', unclosedTags);
          }
        }

        const isValidHtml =
          this.nodeType === VisibleNodeType.TEXT_NODE ||
          closingTag ||
          (currentCharacter === '>' && i === this.nodeStringArray.length - 1);

        await this.addCharacter(currentCharacter, callback, isValidHtml);

        // Sleep after tag closes
        if (closingTag && !Node.buildToEnd) await sleep(pauseAfterTagClose);

        if (closingTag) break;

        if (currentCharacter === '>') closingTag = true;

        // New lines handling for blocks of text
        if (charsInCurrentLine > charactersPerLine) {
          newLineRequest = true;
        } else {
          charsInCurrentLine++;
        }
      }

      resolve();
    });
  }
}

export default Node;
