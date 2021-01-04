import React from 'react';
import App from './App';
import ReactDOM from 'react-dom';
import {createStore, combineReducers} from 'redux';
import loginReducer from './store/reducers/login';
import {Provider} from 'react-redux';

const rootReducer= combineReducers({
    loginReducer
});
const store = createStore(rootReducer,
    window.REDUX_DEVTOOLS_EXTENSION && window.REDUX_DEVTOOLS_EXTENSION());


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

