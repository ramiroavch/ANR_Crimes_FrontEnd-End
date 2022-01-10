import React from 'react';
import {Route, Switch, useRouteMatch} from "react-router-dom";
import Dashboard from "../Dashboard";

export default function Admin() {
    let {path} = useRouteMatch();
    return (
        <Switch>
            <Route exact path={`${path}/dashboard`} component={Dashboard}/>
        </Switch>
    );
}