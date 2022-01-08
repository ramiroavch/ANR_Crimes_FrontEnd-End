import React from 'react';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        minWidth: '30%',
        minHeight: '20%'
    },
    title: {
        padding: theme.spacing(1, 2, 1),
    },
    divider: {
        padding: theme.spacing(0, 1, 0, 1),
    },
    body:{
        padding: theme.spacing(1, 2, 1),
    }
}));

export default function CustomModal(props) {
    const classes = useStyles();
    const { open, handleClose, title,message} = props;

    return(
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <div className={classes.paper}>
                    <div className={classes.title}>
                    <Grid xs={12}>
                        <h3>{title}</h3>
                        {/*<IconButton onClick={handleClose}>*/}
                        {/*    <CloseIcon />*/}
                        {/*</IconButton>*/}
                    </Grid>
                    </div>
                    <Grid xs={12} className={classes.divider}>
                        <Divider />
                    </Grid>
                    <Grid xs={12} className={classes.body}>
                        <p id="transition-modal-description">{message}</p>
                    </Grid>
                </div>
            </Fade>
        </Modal>
    )

}
