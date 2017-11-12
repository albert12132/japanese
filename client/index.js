import React from 'react';
import ReactDOM from 'react-dom';
import { OrderedMap, Set } from 'immutable';

import Auth from './auth.js';
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
import CreateCard from './create_card.js';
import Header from './header.js';
import QuizClient from './quiz_client.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verified: false,
      cards: new OrderedMap(),
      tags: new Set(),
      quizEnabled: false,
      tagsToFilter: new Set(),
    }
    this.client = new AppClient();
    this.quizClient = new QuizClient(this.client);

    this.addNewCard = this.addNewCard.bind(this);
    this.updateCard = this.updateCard.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    this.verifyLogin = this.verifyLogin.bind(this);
    this.toggleQuizEnabled = this.toggleQuizEnabled.bind(this);
    this.updateTagFilter = this.updateTagFilter.bind(this);
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

  verifyLogin(phrase, failure) {
    this.client.verifyLogin(phrase, () => {
      this.client.loadCards((cards) => {
        this.quizClient.loadSuccessRates(cards);

        const cardMap = new OrderedMap(cards).map(card => {
          card.successes = undefined;
          return card;
        });
        this.setState({
          verified: true,
          cards: cardMap,
          tags: cardMap.toSet().flatMap((card) => card.tags),
        });
      });
    }, failure);
  }

  toggleQuizEnabled() {
    this.setState({
      quizEnabled: !this.state.quizEnabled,
    });
  }

  updateTagFilter(newTags) {
    this.setState({
      tagsToFilter: newTags,
    });
  }

  getFilteredCards() {
    if (this.state.tagsToFilter.isEmpty()) {
      return this.state.cards;
    } else {
      return this.state.cards.filter(card => {
        return !this.state.tagsToFilter.intersect(card.tags).isEmpty();
      });
    }
  }

  render() {
    if (!this.state.verified) {
      return (
        <Auth verify={(phrase, failure) => this.verifyLogin(phrase, failure)}/>
      );
    } else {
      const header = (
        <Header
          toggleQuizEnabled={this.toggleQuizEnabled}
          quizEnabled={this.state.quizEnabled}
          addNewCard={this.addNewCard}
          tags={this.state.tags}
          tagsToFilter={this.state.tagsToFilter}
          updateTagFilter={this.updateTagFilter}
        />
      );

      let body;
      if (this.state.quizEnabled) {
        body = (
          <Quiz
            cards={this.getFilteredCards()}
            quizClient={this.quizClient}
          />
        );
      } else {
        body = (
          <Review
            updateCard={this.updateCard}
            deleteCard={this.deleteCard}
            cards={this.getFilteredCards()}
            tags={this.state.tags}
          />
        );
      }
      return (
        <div>
          {header}
          {body}
        </div>
      );
    }
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

