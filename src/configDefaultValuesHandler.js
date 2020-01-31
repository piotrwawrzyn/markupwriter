const ConfigProperties = require('./enums/ConfigProperties');
const { CHAR_INTERVAL, DISPLAY_CURSOR, CURSOR_CHARACTER } = ConfigProperties;

// Handler to supply default values for missing properties in config object provided by a user

const defaultValuesHandler = {
  get: (target, name) => {
    if (target.hasOwnProperty(name)) {
      return target[name];
    } else {
      switch (name) {
        case CHAR_INTERVAL: {
          return 90;
        }

        case DISPLAY_CURSOR: {
          return true;
        }

        case CURSOR_CHARACTER: {
          return '|';
        }
      }
    }
  }
};

module.exports = defaultValuesHandler;
