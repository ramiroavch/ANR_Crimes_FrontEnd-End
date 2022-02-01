import React from 'react';
import {Route, Switch, useHistory, useRouteMatch} from "react-router-dom";
import Dashboard from "../Dashboard";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import {logout} from "../../store/slices/userSlice";
import clsx from "clsx";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {Button} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SideBar from "../../components/SideBar";
import Container from "@material-ui/core/Container";
import PredictionMap from "../PredictionMap";
import PredictionsHeatMap from "../PredictionsHeatMap";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    title: {
        flexGrow: 1,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
}));

export default function Admin() {
    const history = useHistory();
    const dispatch = useDispatch();
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const handleLogout = () => {
        dispatch(logout());
        history.push("/");
    }
    const handleDrawerClose = () => {
        setOpen(false);
    };

    let {path} = useRouteMatch();

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Big Brother IA
                    </Typography>
                    <Button onClick={handleLogout} variant="contained" disableElevation>
                        <ExitToAppIcon/>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <SideBar
                open={open}
                handleOpen={handleDrawerClose}
            />
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <Switch>
                        <Route exact path={`${path}/dashboard`} component={Dashboard}/>
                        <Route exact path={`${path}/map-prediction`} component={PredictionMap}/>
                        <Route exact path={`${path}/heat-map`} component={PredictionsHeatMap}/>
                    </Switch>
                </Container>
            </main>
        </div>
    );
}