import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Card, CardContent, CardHeader, TextField} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {useSelector} from "react-redux";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CustomModal from "../components/modal/CustomModal";
import axios from "../axios";

const useStyles = makeStyles((theme) => ({
    largeIcon: {
        width: 150,
        height: 150
    },
    errorTitle:{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    iconDiv:{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom:15
    },
    bodyModal: {
        margin: 0,
        paddingTop: theme.spacing(2)
    }
}))

export default function Profile(){
    const classes = useStyles();
    const {user} = useSelector((state) => state.user)
    const[username,setUsername]= React.useState(user.username);
    const[firstName,setFirstName] = React.useState(user.first_name);
    const[lastName,setLastName] = React.useState(user.last_name);
    const [modalBody,setModalBody] = useState({});
    const [modal, setModal] = useState(false);
    const handleModal = () => {
        setModal(!modal);
    }
    const handleUpdate = ()=> {
        if((username && username.trim()!=="") && (lastName && lastName.trim()!=="") && (firstName && firstName.trim()!=="")){
            axios.put("/api/user/"+user.id+"/update/",{
                "first_name": firstName,
                "last_name":lastName,
                "username":username
            }).then((data)=>{
                setModalBody({title:"Changes saved",message:'Your Changes has been saved successfully'})
                setModal(true);
            }).catch((error)=>{
                setModalBody({title:"Unexpected error making the prediction",message:error.message?? 'Unexpected error on server'})
                setModal(true);
            })
        }
    }

return(
    <div>
        <div className={classes.iconDiv}>
            <AccountCircleIcon
                className={classes.largeIcon}
            />
        </div>
        <Card>
            <CardHeader
                subheader="The information can be edited"
                title="Profile"
            />
            <Divider />
            <CardContent>
                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        item
                        md={6}
                        xs={12}
                    >
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            onChange={(event)=>{setUsername(event.target.value)}}
                            required
                            value={username}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid
                        item
                        md={6}
                        xs={12}
                    >
                        <TextField
                            fullWidth
                            label="First name"
                            name="firstName"
                            onChange={(event)=>{setFirstName(event.target.value)}}
                            required
                            value={firstName}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid
                        item
                        md={6}
                        xs={12}
                    >
                        <TextField
                            fullWidth
                            label="Last name"
                            name="lastName"
                            onChange={(event)=>{setLastName(event.target.value)}}
                            required
                            value={lastName}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid
                        item
                        md={6}
                        xs={12}
                    >
                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            required
                            value={user.email}
                            variant="outlined"
                            disabled={true}
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <Divider />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    p: 2
                }}
            >
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleUpdate}
                >
                    Update
                </Button>
            </Box>
        </Card>
        <CustomModal
            open={modal}
            handleClose={handleModal}
            title={modalBody.title}
        >
            <p className={classes.bodyModal}>{modalBody.message}</p>
        </CustomModal>
    </div>
)}