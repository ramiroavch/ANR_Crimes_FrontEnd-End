import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Login from './containers/Login';
import Dashboard from './containers/Dashboard';
import Register from './pages/Register';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'jquery/src/jquery';
import 'popper.js';

const App = () =>{
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Login}/>
                <Route exact path="/dashboard" component={Dashboard}/>
                <Route exact path="/register" component={Register}/>
            </Switch>
        </BrowserRouter>
    );
}
export default App;