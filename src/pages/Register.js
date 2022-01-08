import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import {ValidateValue} from "../commons/Utils";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Redirect} from 'react-router-dom';
import axios from '../Axios.js';
import Spinner from '../components/spinner/Spinner.js';
import CustomModal from '../components/modal/CustomModal';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

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
}));

const Register= ()=> {
    const [modal,setModal] = useState (false);
    const handleModal = ()=>{
        setModal(!modal);
    }
    const [myForm,updateForm]= useState({
        data:{
            first_name:{
                value:'',
                clicked:false,
                error:true
            },
            last_name:{
                value:'',
                clicked:false,
                error:true
            },
            email:{
                value:'',
                clicked:false,
                error:true
            },
            username:{
                value: '',
                clicked:false,
                error:true
            },
            password:{
                value:'',
                clicked:false,
                error:true
            },
            confirm_password:{
                value:'',
                clicked:false,
                error:true
            }
        },
        response:{},
        error:false,
        ok:false,
        loading:false,
        redirect:false,
    });
    let actualizarEstado = (data) => {
        updateForm(Object.assign({}, myForm, data));
    };
    const updateValue= (event,identifier,type)=>{
        event.preventDefault();
        const parent = {...myForm};
        const origin= {...parent['data']};
        const element = {...origin[identifier]}
        element.value = event.target.value;
        element.error = ValidateValue(event.target.value,type);
        element.clicked = true;
        origin[identifier]= element;
        parent['data']=origin;
        parent.error=activateButton(origin);
        updateForm (parent);
    };

    const handleSubmit = async (event)=>{
        event.preventDefault();
        try {
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
            ).then((response)=>{
                myForm.redirect = true;
                setModal(true);
                return(<Redirect to={"/login"}/>);
            }).catch((error)=>{
                actualizarEstado({
                        response:error
                    }
                )
            });

        } catch (err){
            actualizarEstado({
                loading:false
            });
        }
    }

    const getError = (identifier)=>{
        const origin= {...myForm.data};
        const element = {...origin[identifier]};
        return element.error && element.clicked;
    };

    const activateButton=(data)=>{
        const origin= data;
        let error = true;
        for (let element in origin){
            if (origin[element].error===true){
                error =false;
            }

        }
        return error;
    };

    const classes = useStyles();
    return (
        myForm.loading  ? <Spinner/> :
        <div>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
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
                                    label="First Name"
                                    name="first_name"
                                    autoFocus
                                    onChange={(event)=>updateValue(event,'first_name','number')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    margin="none"
                                    required
                                    fullWidth
                                    id="last_name"
                                    label="Last Name"
                                    name="last_name"
                                    autoFocus
                                    onChange={(event)=>updateValue(event,'last_name','number')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="none"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoFocus
                                    onChange={(event)=>updateValue(event,'username','number')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="none"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    onChange={(event)=>updateValue(event,'email','number')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="none"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={(event)=>updateValue(event,'password','string')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="none"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={(event)=>updateValue(event,'password','string')}
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
                                    Register
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item>
                                <Link href="/" to="/" variant="body2">
                                    {"Already Have and account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
            <CustomModal
                open = {modal}
                handleClose = {handleModal}
                title = {"hola"}
            >
            </CustomModal>
        </div>
    );
};


export default Register;