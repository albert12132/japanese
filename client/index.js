import React from 'react';
import ReactDOM from 'react-dom';
import { Map } from 'immutable';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import { loadCards } from './actions/api.js';
import App from './presenters/app.js';

const store = createStore(rootReducer, Map(), applyMiddleware(thunkMiddleware));
store.dispatch(loadCards());

const REFRESH_INTERVAL_MS = 2000; // 2 seconds
const REFRESH_BUFFER_MS = 300000; // 5 minutes
setInterval(
  () => {
    const state = store.getState();
    const quizEnabled = state.get('quizEnabled');
    const lastRefreshed = state.get('lastRefreshed');
    if (!quizEnabled && Date.now() - lastRefreshed > REFRESH_BUFFER_MS) {
      console.log('checking for updates');
      store.dispatch(loadCards(lastRefreshed));
    }
  },
  REFRESH_INTERVAL_MS);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

