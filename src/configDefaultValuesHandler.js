const ConfigProperty = require('./enums/ConfigProperty');
const CursorOption = require('./enums/CursorOption');
const IncreasingPaceOption = require('./enums/IncreasingPaceOption');
const {
  CHAR_INTERVAL,
  DISPLAY_CURSOR,
  CHARACTERS_PER_TEXT_LINE,
  CURSOR_OPTIONS,
  PAUSE_BEFORE_TAG_OPEN,
  PAUSE_AFTER_TAG_CLOSE,
  INCREASING_PACE,
  ON_FINISH
} = ConfigProperty;

const { COLOR, ANIMATION_SPEED, IS_STATIC, CURSOR_STRING } = CursorOption;

const { USE, MULTIPLIER, MAXIMUM_TIMES_CHANGE } = IncreasingPaceOption;

// Handler to supply default values for missing properties in config object provided by a user

const defaultValuesHandlers = {
  main: {
    get: (target, name) => {
      const { cursorOptions, increasingPaceOptions } = defaultValuesHandlers;

      if (target.hasOwnProperty(name)) {
        switch (name) {
          case CURSOR_OPTIONS: {
            return new Proxy(target[name], cursorOptions);
          }

          case INCREASING_PACE: {
            return new Proxy(target[name], increasingPaceOptions);
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

          case CURSOR_OPTIONS: {
            return new Proxy({}, cursorOptions);
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

          case INCREASING_PACE: {
            return new Proxy({}, increasingPaceOptions);
          }

          case ON_FINISH: {
            return () => {};
          }
        }
      }
    }
  },
  increasingPaceOptions: {
    get: (target, name) => {
      if (target.hasOwnProperty(name)) {
        switch (name) {
          case MULTIPLIER: {
            return 1 - target[name] + 1;
          }
        }
        return target[name];
      } else {
        switch (name) {
          case USE: {
            return true;
          }

          case MULTIPLIER: {
            return 0.99;
          }

          case MAXIMUM_TIMES_CHANGE: {
            return 2.2;
          }
        }
      }
    }
  },
  cursorOptions: {
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
  }
};

module.exports = defaultValuesHandlers.main;
