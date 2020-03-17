import {
  isClosingQuotationMark,
  isSplitFriendlyCharacter,
  isStillWorthToSplit
} from '../lineSpliting';
import VisibleNodeType from '../../enums/VisibleNodeType';

it('detects a closing quotation mark in an html node string correctly', () => {
  const quotationMark = `"`;

  expect(
    isClosingQuotationMark('<', '<div class="abc"></div>'.split(''), 0)
  ).toBeFalsy();

  expect(
    isClosingQuotationMark(
      quotationMark,
      '<div class="abc"></div>'.split(''),
      11
    )
  ).toBeFalsy();

  expect(
    isClosingQuotationMark(
      quotationMark,
      '<div class="abc"></div>'.split(''),
      15
    )
  ).toBeTruthy();
});

it('recognizes split character in a text node', () => {
  expect(isSplitFriendlyCharacter(' ', VisibleNodeType.TEXT_NODE)).toBeTruthy();
  expect(
    isSplitFriendlyCharacter('\n', VisibleNodeType.TEXT_NODE)
  ).toBeTruthy();
  expect(isSplitFriendlyCharacter('a', VisibleNodeType.TEXT_NODE)).toBeFalsy();
});

it('does not decide when little characters left', () => {
  expect(isStillWorthToSplit(1, 3)).toBeFalsy();
  expect(isStillWorthToSplit(50, 52)).toBeFalsy();
});

it('does decide to split when plenty characters left', () => {
  expect(isStillWorthToSplit(1, 20)).toBeTruthy();
  expect(isStillWorthToSplit(50, 60)).toBeTruthy();
});
