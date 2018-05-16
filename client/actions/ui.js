
export const SHOW_MODAL = 'SHOW_MODAL';
export function showModal(cardId) {
  return {
    type: SHOW_MODAL,
    cardId,
  };
}

export const HIDE_MODAL = 'HIDE_MODAL';
export function hideModal() {
  return {
    type: HIDE_MODAL,
  };
}

export const TOGGLE_QUIZ = 'TOGGLE_QUIZ';
export function toggleQuiz() {
  return {
    type: TOGGLE_QUIZ,
  };
}

export const UPDATE_QUIZ_TYPE = 'UPDATE_QUIZ_TYPE';
export function updateQuizType(quizType) {
  return {
    type: UPDATE_QUIZ_TYPE,
    quizType,
  };
}

export const SET_FILTERED_TAGS = 'SET_FILTERED_TAGS';
export function setFilteredTags(filteredTags) {
  return {
    type: SET_FILTERED_TAGS,
    filteredTags,
  };
}

export const NOTIFY_CONNECTION = 'NOTIFY_CONNECTION';
export function notifyConnection(isOnline) {
  return {
    type: NOTIFY_CONNECTION,
    isOnline,
  };
}
