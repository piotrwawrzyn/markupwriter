const ConfigProperty = require('./enums/ConfigProperty');
const CursorOption = require('./enums/CursorOption');
const {
  CHAR_INTERVAL,
  DISPLAY_CURSOR,
  CHARACTERS_PER_TEXT_LINE,
  CURSOR_OPTIONS,
  PAUSE_BEFORE_TAG_OPEN,
  PAUSE_AFTER_TAG_CLOSE
} = ConfigProperty;

const { COLOR, ANIMATION_SPEED, IS_STATIC, CURSOR_STRING } = CursorOption;

// Handler to supply default values for missing properties in config object provided by a user

const configDefaultValuesHandler = {
  get: (target, name) => {
    if (target.hasOwnProperty(name)) {
      switch (name) {
        case CURSOR_OPTIONS: {
          return new Proxy(target[name], cursorOptionsDefaultValuesHandler);
        }

        default: {
          return target[name];
        }
      }
    } else {
      switch (name) {
        case CHAR_INTERVAL: {
          return 90;
        }

        case DISPLAY_CURSOR: {
          return true;
        }

        case CHARACTERS_PER_TEXT_LINE: {
          return 50;
        }

        case PAUSE_BEFORE_TAG_OPEN: {
          return 500;
        }

        case PAUSE_AFTER_TAG_CLOSE: {
          return 180;
        }
      }
    }
  }
};

const cursorOptionsDefaultValuesHandler = {
  get: (target, name) => {
    if (target.hasOwnProperty(name)) {
      return target[name];
    } else {
      switch (name) {
        case CURSOR_STRING: {
          return '<span class="markupwriter-cursor">|</span>';
        }

        case COLOR: {
          return 'rgb(252, 186, 3)';
        }

        case ANIMATION_SPEED: {
          return 1;
        }

        case IS_STATIC: {
          return false;
        }
      }
    }
  }
};

module.exports = configDefaultValuesHandler;
