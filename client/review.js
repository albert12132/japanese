import React from 'react';
import ReactDOM from 'react-dom';

import CreateCard from './create_card.js';
import ListCards from './list_cards.js';

export default function Review(props) {
  return (
    <div className='list-view'>
      <div className='container'>
        <div className='row justify-content-center'>
          <button
            className='btn btn-success btn-block btn-lg col-md-6 col-10'
            onClick={() => props.setQuizEnabled(true)} >
            Start quiz
          </button>
        </div>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-12'>
            <CreateCard
              addNewCard={props.addNewCard}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-12 col-md-12'>
            <ListCards
              cards={props.cards}
              deleteCard={props.deleteCard}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
