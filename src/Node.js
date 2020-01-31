let output = [];
let unclosedTags = 0;

class Node {
  children = [];

  constructor(value) {
    this.value = value;
    this.valueArray = value.split('');
  }

  addChildren(node) {
    this.children.push(node);
  }

  updateOutput(valueToPush) {
    if (unclosedTags === 0) output.push(valueToPush);
    else {
      output.splice(output.length - unclosedTags * 2, 0, valueToPush);
    }
  }

  addCharacter(character, speed = 90) {
    return new Promise(resolve =>
      setTimeout(async () => {
        this.updateOutput(character);
        resolve();
      }, speed)
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
      let currentCharacter;

      let intent = '';
      for (let i = 0; i < unclosedTags; i++) {
        intent += '    ';
      }

      await this.addCharacter(intent);

      for (let i = 0; i < this.valueArray.length; i++) {
        if (closingTag) {
          currentCharacter = intent + this.value.slice(i);
          await this.addCharacter('\r\n');
          // await this.addCharacter('\r\n');
        } else currentCharacter = this.valueArray[i];

        await this.addCharacter(currentCharacter);

        callback(output);

        if (closingTag) break;

        if (currentCharacter === '>') closingTag = true;
      }

      this.addCharacter('\r\n');

      resolve();
    });
  }
}

module.exports = Node;
