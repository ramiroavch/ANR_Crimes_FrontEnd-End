import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import {ValidateValue} from "../commons/Utils";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from '../axios.js';
import CustomModal from '../components/modal/CustomModal';
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(3),
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

const Register = () => {
    const history = useHistory();
    const [modal, setModal] = useState(false);
    const handleModal = () => {
        setModal(!modal);
    }
    const [myForm, updateForm] = useState({
        data: {
            first_name: {
                value: '',
                clicked: false,
                error: true
            },
            last_name: {
                value: '',
                clicked: false,
                error: true
            },
            email: {
                value: '',
                clicked: false,
                error: true
            },
            username: {
                value: '',
                clicked: false,
                error: true
            },
            password: {
                value: '',
                clicked: false,
                error: true
            },
            confirm_password: {
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
        loading: false,
        redirect: false,
    });
    let actualizarEstado = (data) => {
        updateForm(Object.assign({}, myForm, data));
    };
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

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (!validateEmail(myForm.data.email.value)) {
                actualizarEstado({
                    modal: {
                        title: 'Error creando el usuario',
                        message: 'Correo inválido',
                    }
                })
                setModal(true);
            } else if (myForm.data.password.value !== myForm.data.confirm_password.value) {
                actualizarEstado({
                    modal: {
                        title: 'Error creando el usuario',
                        message: 'Las contraseñas no coinciden',
                    }
                })
                setModal(true);
            } else {
                actualizarEstado({
                    loading: true
                })
                await axios.post('/api/user/add/',
                    {
                        "first_name": myForm.data.first_name.value,
                        "last_name": myForm.data.last_name.value,
                        "email": myForm.data.email.value,
                        "username": myForm.data.username.value,
                        "password": myForm.data.password.value,
                        "confirm_password": myForm.data.confirm_password.value
                    }
                ).then((response) => {
                    myForm.redirect = true;
                    history.push("/admin/dashboard");
                }).catch(({response}) => {
                    actualizarEstado({
                        modal: {
                            title: 'Error creando el usuario',
                            message: response.data.error ?? 'Error inesperado',
                        }
                    })
                    setModal(true);
                });
            }

        } catch (err) {
            actualizarEstado({
                loading: false
            });
        }
    }


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
                        Registro
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    margin="none"
                                    required
                                    fullWidth
                                    id="first_name"
                                    label="Nombre"
                                    name="first_name"
                                    autoFocus
                                    onChange={(event) => updateValue(event, 'first_name', 'number')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    margin="none"
                                    required
                                    fullWidth
                                    id="last_name"
                                    label="Apellido"
                                    name="last_name"
                                    autoFocus
                                    onChange={(event) => updateValue(event, 'last_name', 'number')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="none"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Nombre de usuario"
                                    name="username"
                                    autoFocus
                                    onChange={(event) => updateValue(event, 'username', 'number')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="none"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Correo"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    onChange={(event) => updateValue(event, 'email', 'number')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="none"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Contraseña"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={(event) => updateValue(event, 'password', 'string')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="none"
                                    required
                                    fullWidth
                                    name="confirm_password"
                                    label="Confirmar contraseña"
                                    type="password"
                                    id="confirm_password"
                                    autoComplete="current-password"
                                    onChange={(event) => updateValue(event, 'confirm_password', 'string')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Registrar
                                </Button>
                            </Grid>
                        </Grid>
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


export default Register;