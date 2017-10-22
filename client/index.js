import React from 'react';
import ReactDOM from 'react-dom';
import { OrderedMap } from 'immutable';

import Auth from './auth.js';
import Review from './review.js';
import Quiz from './quiz.js';
import AppClient from './client.js';
import './style.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verified: false,
      cards: new OrderedMap(),
      quizEnabled: false,
    }
    this.client = new AppClient();

    this.addNewCard = this.addNewCard.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    this.verifyLogin = this.verifyLogin.bind(this);
    this.setQuizEnabled = this.setQuizEnabled.bind(this);
  }

  addNewCard(kanji, hiragana, meaning) {
    this.client.addNewCard(
      kanji, hiragana, meaning,
      (card) => {
        this.setState((prevState) => {
          return {
            cards: prevState.cards.set(card.card_id, card),
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
        this.setState({
          verified: true,
          cards: new OrderedMap(cards)
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
          stopQuiz={() => this.setQuizEnabled(false)}
        />
      );
    } else {
      return (
        <Review
          addNewCard={this.addNewCard}
          setQuizEnabled={this.setQuizEnabled}
          deleteCard={this.deleteCard}
          cards={this.state.cards.toArray()}
        />
      );
    }
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

