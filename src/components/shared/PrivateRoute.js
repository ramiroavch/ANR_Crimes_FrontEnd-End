// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
import {Redirect, Route} from "react-router-dom";
import {selectIsLogged} from "../../store/slices/userSlice";
import {useSelector} from "react-redux";

const PrivateRoute = ({ children, ...rest }) => {
    const isLogged = useSelector(selectIsLogged);
    console.log(isLogged)
    return (
        isLogged?
        <Route
            {...rest}
            render={children}
        />: <Redirect
                to={{
                    pathname: "/login",
                }}
            />
    );
}

export default PrivateRoute