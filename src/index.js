import React from 'react';
import App from './App';
import ReactDOM from 'react-dom';
import {store} from './store';
import {Provider} from 'react-redux';



ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

