import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
} from 'reactstrap';
import PropTypes from 'prop-types';
import cardPropType from '../cardSchema.js';
import { isMastered, successes } from '../utils.js';

const CardSummary = props => {
  let color = props.isMastered ? 'green' : 'red';
  return (
    <Col>
      <Card className={color}>
        <button
          onClick={props.onClick}>
          <CardBody className='text-nowrap'>
            <CardTitle>{props.card.kanji}</CardTitle>
            <CardSubtitle>{props.card.hiragana}</CardSubtitle>
            <CardText>{props.card.meaning}</CardText>
          </CardBody>
        </button>
      </Card>
    </Col>
  );
};

CardSummary.propTypes = {
  isMastered: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  card: cardPropType.isRequired,
};

export default CardSummary;
