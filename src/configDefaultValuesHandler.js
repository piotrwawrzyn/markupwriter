const ConfigProperties = require('./enums/ConfigProperties');
const { CHAR_INTERVAL } = ConfigProperties;

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
      }
    }
  }
};

module.exports = defaultValuesHandler;
