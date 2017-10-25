import React from 'react';
import ReactDOM from 'react-dom';
import { OrderedMap, Set } from 'immutable';

import Auth from './auth.js';
import Review from './review.js';
import Quiz from './quiz.js';
import AppClient from './client.js';
import './style.css';
import 'bootstrap';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verified: false,
      cards: new OrderedMap(),
      tags: new Set(),
      quizEnabled: false,
    }
    this.client = new AppClient();

    this.addNewCard = this.addNewCard.bind(this);
    this.updateCard = this.updateCard.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    this.verifyLogin = this.verifyLogin.bind(this);
    this.setQuizEnabled = this.setQuizEnabled.bind(this);
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
        const cardMap = new OrderedMap(cards);
        this.setState({
          verified: true,
          cards: cardMap,
          tags: cardMap.toSet().flatMap((card) => card.tags),
        });
      });
    }, failure);
  }

  setQuizEnabled(enabled) {
    this.setState({
      quizEnabled: enabled,
    });
  }

  render() {
    if (!this.state.verified) {
      return (
        <Auth verify={(phrase, failure) => this.verifyLogin(phrase, failure)}/>
      );
    } else if (this.state.quizEnabled) {
      return (
        <Quiz
          cards={this.state.cards.toArray()}
          tags={this.state.tags}
          stopQuiz={() => this.setQuizEnabled(false)}
        />
      );
    } else {
      return (
        <Review
          addNewCard={this.addNewCard}
          setQuizEnabled={this.setQuizEnabled}
          updateCard={this.updateCard}
          deleteCard={this.deleteCard}
          cards={this.state.cards.toArray()}
          tags={this.state.tags}
        />
      );
    }
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

