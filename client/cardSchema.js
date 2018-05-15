import PropTypes from 'prop-types';

const cardPropType = PropTypes.shape({
  kanji: PropTypes.string.isRequired,
  hiragana: PropTypes.string.isRequired,
  meaning: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  successes: PropTypes.shape({
    reading: PropTypes.number,
    listening: PropTypes.number,
    translating: PropTypes.number,
  }),
  lastAttempts: PropTypes.shape({
    reading: PropTypes.number,
    listening: PropTypes.number,
    translating: PropTypes.number,
  }),
});


export default cardPropType;
