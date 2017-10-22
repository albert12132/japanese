import React from 'react';
import ReactDOM from 'react-dom';

export default function ListCards(props) {
  const rows = props.cards.map((card) => {
    return (
      <CardSummary
        key={card.card_id}
        card={card}
        deleteCard={props.deleteCard}
      />
    );
  });
  return (
    <div className='row'>
      {rows}
    </div>
  );
}

function CardSummary(props) {
  return (
    <div className='col'>
      <div className='card'>
        <div className='card-body text-nowrap'>
          <h4 className='card-title'>{props.card.kanji}</h4>
          <h6 className='card-subtitle'>{props.card.hiragana}</h6>
          <p className='card-text'>{props.card.meaning}</p>
          <button
            className='btn btn-danger'
            onClick={() => props.deleteCard(props.card.card_id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
