import React from 'react'
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import LogIn from  './components/log-in'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import 'jquery/src/jquery'
import 'popper.js'

const App = () =>{
    return (
        <BrowserRouter>
            <LogIn/>
            <Switch>
                <Route path="*"/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;