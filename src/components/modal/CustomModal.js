import React from 'react';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';

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
        minWidth: '450px',
        maxWidth: '70%',
        padding: theme.spacing(2),
    },
    header: {
        width:"100%",
        display:"flex",
        justifyContent:"space-between",
    },
    title:{
        fontSize:theme.typography.h6.fontSize,
        textTransform:"capitalize"
    },
    closeButton:{
        cursor:"pointer"
    },
    body:{

    }
}));

export default function CustomModal(props) {
    const classes = useStyles();
    const { open, handleClose, title} = props;

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
                    <div className={classes.header}>
                        <h2 className={classes.title}>{title}</h2>
                        <CloseIcon className={classes.closeButton} onClick={handleClose} />
                    </div>
                    <Divider />
                    <Grid >
                        {props.children}
                    </Grid>
                </div>
            </Fade>
        </Modal>
    )

}
