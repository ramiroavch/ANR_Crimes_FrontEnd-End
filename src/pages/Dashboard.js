import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Chart from '../components/Chart';
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
}));

export default function Dashboard() {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
                <Paper className={fixedHeightPaper}>
                    <Chart
                        title = "Crimes By Date"
                        yLabel= "Crimes (Y)"
                        xLabel= "Date (X)"
                    />
                </Paper>
            </Grid>
            <Grid item xs={12} md={8} lg={9}>
                <Paper className={fixedHeightPaper}>
                    <Chart
                        title = "Crimes By State"
                        yLabel= "Crimes (Y)"
                        xLabel= "State (X)"
                    />
                </Paper>
            </Grid>
            <Grid item xs={12} md={8} lg={9}>
                <Paper className={fixedHeightPaper}>
                    <Chart
                        title = "Crimes By Week Day"
                        yLabel= "Crimes (Y)"
                        xLabel= "w/ Day (X)"
                    />
                </Paper>
            </Grid>
        </Grid>
    );
}