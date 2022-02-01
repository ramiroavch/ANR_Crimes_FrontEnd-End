import {Redirect, Route} from "react-router-dom";
import {selectIsLogged} from "../../store/slices/userSlice";
import {useSelector} from "react-redux";

const PublicRoute = ({ children, ...rest }) => {
    const isLogged = useSelector(selectIsLogged);
    return (
        !isLogged?
            <Route
                {...rest}
                render={children}
            />: <Redirect
                to={{
                    pathname: "/admin/dashboard",
                }}
            />
    );
}

export default PublicRoute