import React from 'react';
import {
  Badge,
  Col,
  Container,
  Row,
} from 'reactstrap';
import PropTypes from 'prop-types';
import CardSummary from './cardSummary.js';
import cardPropType from '../cardSchema.js';
import { isMastered } from '../utils.js';

const PAGE_SIZE = 50;

class CardList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
    }
  }

  goToPage(pageNumber) {
    pageNumber = Math.max(1, Math.min(pageNumber, this.lastPageNumber()));
    this.setState({
      currentPage: pageNumber,
    });
  }

  lastPageNumber() {
    return Math.ceil(this.props.cards.length / PAGE_SIZE);
  }


  render() {
    const totalSize = this.props.cards.length;
    const rows = this.props.cards
      .map(record => {
        return (
          <CardSummary
            key={record.cardId}
            card={record.card}
            onClick={() => this.props.onCardClick(record.cardId)}
            isMastered={isMastered(record.card, this.props.quizType)}
          />
        );
      });
    const refreshed = new Date(this.props.lastRefreshed);
    return (
      <Container>
        <Row>
          <h5>
            {totalSize} cards
            {' '}
            <Badge color='danger'>
              {this.props.showSavingAlert ? ' Saving...' : null }
            </Badge>
          </h5>
        </Row>
        <Row>
          Last refreshed:{' '}
          {`${refreshed.getMonth() + 1}/${refreshed.getDate()} @ `}
          {`${refreshed.getHours()}:` + `${refreshed.getMinutes()}`.padStart(2, '0')}
        </Row>
        <hr/>
        <Row>
          {rows}
        </Row>
      </Container>
    );
  }
}

CardList.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      cardId: PropTypes.string.isRequired,
      card: cardPropType.isRequired,
    }),
  ).isRequired,
  quizType: PropTypes.string.isRequired,
  onCardClick: PropTypes.func.isRequired,
  showSavingAlert: PropTypes.bool.isRequired,
};

export default CardList;
