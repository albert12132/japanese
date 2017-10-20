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
    <table className='table table-hover'>
      <thead>
        <tr>
          <th>Kanji</th>
          <th>Hiragana</th>
          <th>Meaning</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}

function CardSummary(props) {
  return (
    <tr>
      <td>{props.card.kanji}</td>
      <td>{props.card.hiragana}</td>
      <td>{props.card.meaning}</td>
      <td>
        <button
          className='btn btn-danger'
          onClick={() => props.deleteCard(props.card.card_id)}>
          Delete
        </button>
      </td>
    </tr>
  );
}
