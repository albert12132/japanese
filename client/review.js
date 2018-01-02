import React from 'react';
import CardList from './card_list.js';
import ReviewHeader from './review_header.js';

export default function Review(props) {
  return (
    <div>
      <ReviewHeader
        startQuiz={props.onStartQuiz}
        addNewCard={props.addNewCard}
        tags={props.tags}
        tagsToFilter={props.tagsToFilter}
        updateTagsToFilter={props.updateTagsToFilter}
        updateQuizType={props.updateQuizType}
        quizType={props.quizType}
      />
      <CardList
        updateCard={props.updateCard}
        deleteCard={props.deleteCard}
        cards={props.cards}
        tags={props.tags}
        quizType={props.quizType}
      />
    </div>
  );
}

