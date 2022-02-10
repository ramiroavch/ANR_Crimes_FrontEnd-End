import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import Drawer from "@material-ui/core/Drawer";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import {Link} from "react-router-dom";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ListItemText from "@material-ui/core/ListItemText";
import MapIcon from "@material-ui/icons/Map";
import BarChartIcon from "@material-ui/icons/BarChart";
import {useSelector} from "react-redux";
import ListSubheader from "@material-ui/core/ListSubheader";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    }
}));

export default function SideBar({open}){
    const {user} = useSelector((state) => state.user)
    const classes = useStyles();
    return(
    <Drawer
        variant="permanent"
        classes={{
            paper: classes.drawerPaper,
        }}
        open={open}
    >
        <Divider />
        <List>
            <ListItem button component={Link} to={'/admin/dashboard'}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to={'/admin/map-prediction'}>
                <ListItemIcon>
                    <MapIcon />
                </ListItemIcon>
                <ListItemText primary="Predict On Map" />
            </ListItem>
            <ListItem button component={Link} to={'/admin/heat-map'}>
                <ListItemIcon>
                    <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Heat Map"/>
            </ListItem>
            <ListItem button component={Link} to={'/admin/profile'}>
                <ListItemIcon>
                    <AccountBoxIcon />
                </ListItemIcon>
                <ListItemText primary="Profile"/>
            </ListItem>
        </List>
        <Divider/>
        {user.isAdmin ?
            <List>
                <ListSubheader inset>Admin Modules</ListSubheader>
                <ListItem button component={Link} to={'/admin/retrain'}>
                    <ListItemIcon>
                        <DeveloperBoardIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Retrain IA"/>
                </ListItem>
                <ListItem button component={Link} to={'/admin/users'}>
                    <ListItemIcon>
                        <AssignmentIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Manage Users"/>
                </ListItem>
            </List>:null
        }
    </Drawer>
    )
}