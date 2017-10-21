import React from 'react';
import ReactDOM from 'react-dom';
import { GoogleLogin } from 'react-google-login';
import $ from 'jquery';
import { OrderedMap } from 'immutable';

import CreateCard from './create_card.js';
import ListCards from './list_cards.js';
import Quiz from './quiz.js';
import AppClient from './client.js';
import Auth from './auth.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verified: false,
      cards: new OrderedMap(),
      quizEnabled: false,
    }
    this.client = new AppClient();
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
        <div>
          <Quiz
            cards={this.state.cards.toArray()}
          />
          <div className='row justify-content-center'>
            <button
              className='btn btn-danger'
              onClick={() => this.setQuizEnabled(false)} >Stop quiz</button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className='row justify-content-center'>
            <CreateCard
              addNewCard={(kanji, hiragana, meaning) => this.addNewCard(kanji, hiragana, meaning)}
            />
          </div>
          <div className='row justify-content-center'>
            <button
              className='btn btn-primary'
              onClick={() => this.setQuizEnabled(true)} >
              Start quiz
            </button>
          </div>
          <div className='row justify-content-center'>
            <ListCards
              cards={this.state.cards.toArray()}
              deleteCard={(card_id) => this.deleteCard(card_id)}
            />
          </div>
        </div>
      );
    }
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

