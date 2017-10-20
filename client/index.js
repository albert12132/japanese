import React from 'react';
import ReactDOM from 'react-dom';
import CreateCard from './create_card.js';
import ListCards from './list_cards.js';
import Quiz from './quiz.js';
import { GoogleLogin } from 'react-google-login';
import $ from 'jquery';
import { OrderedMap } from 'immutable';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: new OrderedMap(),
      quizEnabled: false,
    }
    this.loadCards();
  }

  loadCards() {
    return $.get('/api/cards', (response) => {
      const cardsMutable = {}
      for (let card of response.cards) {
        cardsMutable[card.card_id] = card;
      }
      this.setState({
        cards: new OrderedMap(cardsMutable)
      });
    });
  }

  addNewCard(kanji, hiragana, meaning) {
    $.post('/api/cards', {
      kanji: kanji,
      hiragana: hiragana,
      meaning: meaning,
    }, (response) => {
      const card = {
        card_id: response.card_id,
        kanji: kanji,
        hiragana: hiragana,
        meaning: meaning,
      };
      this.setState((prevState) => {
        return {
          cards: prevState.cards.set(card.card_id, card),
        };
      });
    });
  }

  deleteCard(card_id) {
    $.post('/api/cards/delete', {
      card_id: card_id
    }, () => {
      this.setState((prevState) => {
        return {
          cards: prevState.cards.delete(card_id),
        };
      });
    });
  }

  setQuizEnabled(enabled) {
    this.setState({
      quizEnabled: enabled,
    });
  }

  render() {
    if (this.state.quizEnabled) {
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

/*
const responseGoogle = (response) => {
  console.log(response.googleId);
  $.post('/api/login', {token: response.tokenId});
}

ReactDOM.render(
  <GoogleLogin
    clientId="758984664053-vfv9uik68cssqfn0s7m6sc60t8u0fon0.apps.googleusercontent.com"
    buttonText="Login"
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
  />,
  document.getElementById('sign-in')
);
*/
