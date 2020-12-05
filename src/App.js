import React from 'react'
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import LogIn from './containers/Login'
import Dashboard from './containers/Dashboard'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import 'jquery/src/jquery'
import 'popper.js'

const App = () =>{
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={LogIn}/>
                <Route exact path="/dashboard" component={Dashboard}/>
            </Switch>
        </BrowserRouter>
    );
}
export default App;