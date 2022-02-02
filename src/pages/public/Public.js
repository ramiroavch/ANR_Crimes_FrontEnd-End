import React from 'react';
import {Route, Switch, useRouteMatch} from "react-router-dom";
import Dashboard from "../Dashboard";
import Login from "../Login";
import Register from "../Register";

export default function Public() {
    let {path} = useRouteMatch();
    return (
        <Switch>
            <Route exact path={`${path}/login`} component={Login} />
            <Route exact path={`${path}/dashboard`} component={Dashboard}/>
        </Switch>
    );
}