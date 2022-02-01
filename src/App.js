import React, {useEffect, useState} from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'jquery/src/jquery';
import 'popper.js';
import {useDispatch} from "react-redux";
import {checkSession} from "./store/slices/userSlice";
import Admin from "./pages/admin/Admin";
import PrivateRoute from "./components/shared/PrivateRoute";
import PublicRoute from "./components/shared/PublicRoute";
import Public from "./pages/public/Public";

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
                    <Redirect to={'/public/login'}/>
                </Route>
                <PublicRoute path="/public" component={Public}/>
                <PrivateRoute path="/admin" component={Admin}/>
            </Switch>
        </BrowserRouter> : null
    );
}
export default App;