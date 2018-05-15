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

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

