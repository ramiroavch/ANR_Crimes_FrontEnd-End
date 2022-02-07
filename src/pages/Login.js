import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import {ValidateValue} from "../commons/Utils";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useHistory} from "react-router-dom";
import CustomModal from "../components/modal/CustomModal";
import {useDispatch} from "react-redux";
import {login} from '../store/slices/userSlice'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    bodyModal: {
        margin: 0,
        paddingTop: theme.spacing(2)
    }
}));

const Login = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [modal, setModal] = useState(false);
    const handleModal = () => {
        setModal(!modal);
    }
    let actualizarEstado = (data) => {
        updateForm(Object.assign({}, myForm, data));
    };
    const [myForm, updateForm] = useState({
        data: {
            username: {
                value: '',
                clicked: false,
                error: true
            },
            password: {
                value: '',
                clicked: false,
                error: true
            }
        },
        modal: {
            title: '',
            message: '',
            buttonMessage: ''
        },
        error: false,
        ok: false,
        loading: true,
        redirect: false,
    });
    const updateValue = (event, identifier, type) => {
        event.preventDefault();
        const parent = {...myForm};
        const origin = {...parent['data']};
        const element = {...origin[identifier]}
        element.value = event.target.value;
        element.error = ValidateValue(event.target.value, type);
        element.clicked = true;
        origin[identifier] = element;
        parent['data'] = origin;
        parent.error = activateButton(origin);
        updateForm(parent);
    };

    const validateLogin = async (event) => {
        event.preventDefault();
        actualizarEstado({
            loading: true
        })
        dispatch(login(myForm.data.username.value, myForm.data.password.value))
            .then(() => history.push("/admin/dashboard"))
            .catch(({response}) => {
                actualizarEstado({
                    modal: {
                        title: 'Login error',
                        message: response.data.detail ?? '',
                    }
                })
                setModal(true);
            });
    }

    const getError = (identifier) => {
        const origin = {...myForm.data};
        const element = {...origin[identifier]};
        return element.error && element.clicked;
    };

    const activateButton = (data) => {
        const origin = data;
        let error = true;
        for (let element in origin) {
            if (origin[element].error === true) {
                error = false;
            }

        }
        return error;
    };

    const classes = useStyles();

    return (
        <div>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={validateLogin}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            onChange={(event) => updateValue(event, 'username', 'number')}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={(event) => updateValue(event, 'password', 'string')}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                        {/*<Grid container>*/}
                        {/*    <Grid item xs>*/}
                        {/*        <Link href="#" variant="body2">*/}
                        {/*            Forgot password?*/}
                        {/*        </Link>*/}
                        {/*    </Grid>*/}
                        {/*</Grid>*/}
                    </form>
                </div>
            </Container>
            <CustomModal
                open={modal}
                handleClose={handleModal}
                title={myForm.modal.title}
            >
                <p className={classes.bodyModal}>{myForm.modal.message}</p>
            </CustomModal>
        </div>
    );
};


export default Login;