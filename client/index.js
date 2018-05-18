import React from 'react';
import ReactDOM from 'react-dom';
import { Map } from 'immutable';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import { loadCards } from './actions/api.js';
import { notifyConnection } from './actions/ui.js';
import App from './presenters/app.js';

const store = createStore(rootReducer, Map(), applyMiddleware(thunkMiddleware));

// Get initial list of cards.
store.dispatch(loadCards());

// Periodically check server for updates.
const REFRESH_INTERVAL_MS = 2000; // 2 seconds
const REFRESH_BUFFER_MS = 300000; // 5 minutes
setInterval(
  () => {
    const state = store.getState();
    const isOnline = state.get('isOnline');
    const quizEnabled = state.get('quizEnabled');
    const showModal = state.get('showModal');
    const lastRefreshed = state.get('lastRefreshed');
    if (isOnline && !showModal && !quizEnabled && Date.now() - lastRefreshed > REFRESH_BUFFER_MS) {
      console.log('checking for updates');
      store.dispatch(loadCards(lastRefreshed));
    }
  },
  REFRESH_INTERVAL_MS);

// Notify user when there is no internet connection.
store.dispatch(notifyConnection(navigator.onLine));
window.addEventListener('online',  () => store.dispatch(notifyConnection(true)));
window.addEventListener('offline', () => store.dispatch(notifyConnection(false)));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

