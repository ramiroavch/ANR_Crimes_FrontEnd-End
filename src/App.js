import React, {useEffect, useState} from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'jquery/src/jquery';
import 'popper.js';
import {useDispatch} from "react-redux";
import {checkSession} from "./store/slices/userSlice";
import Admin from "./pages/admin/Admin";
import PrivateRoute from "./components/shared/PrivateRoute";

const App = () => {
    const [initialized,setInitialized] = useState(false)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(checkSession()).finally(()=>setInitialized(true))
    }, [dispatch])
    return (initialized ?
        <BrowserRouter>
            <Switch>
                <Route exact path="/" >
                    <Redirect to={'/login'}/>
                </Route>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/register" component={Register}/>
                <PrivateRoute path="/admin" component={Admin}/>
            </Switch>
        </BrowserRouter> : null
    );
}
export default App;