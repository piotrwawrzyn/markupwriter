import VisibleNodeType from '../enums/VisibleNodeType';

/**
 * Checks if character is a closing quotation mark in a html node
 * @param {string} character - character suspected to be a quotation mark
 * @param {string[]} nodeStringArray - whole node splited character by character
 * @param {number} index - index of where character was found in the array
 */
export const isClosingQuotationMark = (character, nodeStringArray, index) => {
  const quotationMark = `"`;
  if (character !== quotationMark) return false;

  const contextSubArray = nodeStringArray.slice(0, index + 1);
  const quotationMarkCount = contextSubArray.filter(el => el === quotationMark)
    .length;
  return quotationMarkCount !== 0 && quotationMarkCount % 2 === 0;
};

/**
 * Decides where character is a good one to split the line on
 * @param {string} character
 * @param {VisibleNodeType} nodeType
 * @param {string[]} nodeStringArray
 * @param {number} index
 */
export const isSplitFriendlyCharacter = (
  character,
  nodeType,
  nodeStringArray,
  index
) => {
  if (nodeType === VisibleNodeType.TEXT_NODE) {
    const splitFriendlyCharacters = ['\n', ' '];
    if (splitFriendlyCharacters.indexOf(character) !== -1) return true;
  } else {
    return isClosingQuotationMark(character, nodeStringArray, index);
  }

  return false;
};

export const isStillWorthToSplit = (characterIndex, arrayLength) => {
  const minCharsToBeWorth = 5;
  const charactersForNextLine = arrayLength - characterIndex;

  return charactersForNextLine >= minCharsToBeWorth;
};
