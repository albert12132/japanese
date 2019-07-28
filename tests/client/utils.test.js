import React from 'react';
import renderer from 'react-test-renderer';
import { isMastered } from '../../client/utils.js';
import { CARD } from '../constants.js';
import CardSummary from '../../client/presenters/cardSummary.js';

test('cool', () => {
  const card = {
    successes: {
      foo: 4
    }
  };
  expect(isMastered(card, 'foo')).toBe(true);
});

test('react', () => {
  const tree = renderer
    .create(
      <CardSummary
        isMastered={false}
        onClick={() => conole.log('hi')}
        card={CARD}
      />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
