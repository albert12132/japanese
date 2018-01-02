import React from 'react';
import ReactDOM from 'react-dom';
import { OrderedMap, Set } from 'immutable';

import Review from './review.js';
import Quiz from './quiz.js';
import AppClient from './client.js';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import {
  Button,
  Col,
  Container,
  Row,
} from 'reactstrap';

import QUIZ_TYPES from './quiz_types.js';
import { needsReview } from './utils.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verified: false,
      cards: new OrderedMap(),
      tags: new Set(),
      quizEnabled: false,

      quizType: QUIZ_TYPES[0].value,
      tagsToFilter: new Set(),
    }
    this.client = new AppClient();

    this.addNewCard = this.addNewCard.bind(this);
    this.updateCard = this.updateCard.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    this.toggleQuizEnabled = this.toggleQuizEnabled.bind(this);
    this.getFilteredCards = this.getFilteredCards.bind(this);
    this.updateQuizType = this.updateQuizType.bind(this);
    this.updateTagsToFilter = this.updateTagsToFilter.bind(this);

    this.client.loadCards((cards) => {
      const cardMap = new OrderedMap(cards);
      this.setState({
        verified: true,
        cards: cardMap,
        tags: cardMap.toSet().flatMap((card) => card.tags),
      });
    });
  }

  addNewCard(card) {
    this.client.addNewCard(
      card,
      (card) => {
        this.setState((prevState) => {
          return {
            cards: prevState.cards.set(card.card_id, card),
            tags: prevState.tags.union(card.tags),
          };
        });
      });
  }

  updateCard(card) {
    this.client.updateCard(
      card.card_id,
      card,
      () => {
        this.setState((prevState) => {
          return {
            cards: prevState.cards.set(card.card_id, card),
            tags: prevState.tags.union(card.tags),
          };
        });
      });
  }

  deleteCard(card_id) {
    this.client.deleteCard(card_id, () => {
      this.setState((prevState) => {
        return {
          cards: prevState.cards.delete(card_id),
        };
      });
    });
  }

  toggleQuizEnabled() {
    this.setState({
      quizEnabled: !this.state.quizEnabled,
    });
  }

  updateQuizType(quizType) {
    this.setState({
      quizType: quizType,
    });
  }

  updateTagsToFilter(newTags) {
    this.setState({
      tagsToFilter: newTags,
    });
  }

  getFilteredCards() {
    return this.state.cards.filter((card) => {
      return this.state.tagsToFilter.isEmpty() || !this.state.tagsToFilter.intersect(card.tags).isEmpty();
    });
  }

  getQuizCards() {
    return this.getFilteredCards().toList().filter((card) => {
      return needsReview(card, this.state.quizType);
    }).sortBy(Math.random);
  }

  render() {
    if (this.state.quizEnabled) {
      return (
        <Quiz
          onStopQuiz={this.toggleQuizEnabled}
          updateCard={this.updateCard}
          cards={this.getQuizCards()}
          quizType={this.state.quizType}
        />
      );
    } else {
      return (
        <Review
          onStartQuiz={this.toggleQuizEnabled}
          addNewCard={this.addNewCard}
          updateCard={this.updateCard}
          deleteCard={this.deleteCard}
          cards={this.getFilteredCards()}
          tags={this.state.tags}
          tagsToFilter={this.state.tagsToFilter}
          updateTagsToFilter={this.updateTagsToFilter}
          updateQuizType={this.updateQuizType}
          quizType={this.state.quizType}
        />
      );
    }
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

