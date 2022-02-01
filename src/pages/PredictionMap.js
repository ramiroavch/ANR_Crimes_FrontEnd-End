import React, {useState} from 'react';
import { alpha ,makeStyles} from "@material-ui/core/styles";
import ExploreIcon from '@material-ui/icons/Explore';
import {Button, InputLabel, MenuItem, Select} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import GoogleMapReact from 'google-map-react';
import Typography from "@material-ui/core/Typography";
import {useSelector} from "react-redux";
import axios from '../axios';
import CustomModal from "../components/modal/CustomModal";
import moment from "moment";
import LocationOnIcon from '@material-ui/icons/LocationOn';

const useStyles = makeStyles((theme) => ({
    search:{
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&hover': {backgroundColor: alpha(theme.palette.common.white, 0.25)},
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {marginLeft: theme.spacing(3), width:'auto'}

    },
    paragraph:{
        paddingTop:20
    },
    searchIcon:{
        padding: theme.spacing(0, 2), height: '100%', position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    mapContainer: {
        height: '85vh', width: '100%',
        paddingTop: 20
    },
    markerContainer: {
        position: 'absolute', transform: 'translate(-50%, -50%)', zIndex: 1, '&:hover': { zIndex: 2 },
    },
    pointer: {
        cursor: 'pointer',
    },
    toolbar: {
        display: 'flex', justifyContent: 'space-between',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0), paddingLeft: `calc(1em + ${theme.spacing(4)}px)`, transition: theme.transitions.create('width'), width: '100%', [theme.breakpoints.up('md')]: { width: '20ch' },
    },
    bodyModal: {
        margin: 0,
        paddingTop: theme.spacing(2)
    },
}))

export default function PredictionMap(){
    const [modal, setModal] = useState(false);
    const handleModal = () => {
        setModal(!modal);
    }
    const [modalBody,setModalBody] = useState({});
    const {accessToken} = useSelector((state) => state.user)
    const [crimeType,setCrimeType] = React.useState("");
    const [openMap, setOpenMap] = React.useState(false);
    const classes = useStyles();
    const defaultCenter = { lat:41.85003, lng:-87.65005};
    const [coordinates,setCoordinates] = React.useState({})
    const validString = (string)=>{
        let bool = (string) && !(string==="") && !(string==="undefined")
        return bool;
    }
    const handleChangeSelect = (event) => {
        setCrimeType(event.target.value);
    };
    const handlePrediction = () => {
        if(typeof crimeType!='undefined'){
            let values=['primary_type_ARSON','primary_type_ASSAULT','primary_type_BATTERY','primary_type_BURGLARY',
                        'primary_type_CONCEALED CARRY LICENSE VIOLATION','primary_type_CRIM SEXUAL ASSAULT','primary_type_CRIMINAL DAMAGE',
                        'primary_type_CRIMINAL TRESPASS','primary_type_DECEPTIVE PRACTICE', 'primary_type_GAMBLING','primary_type_HOMICIDE',
                        'primary_type_HUMAN TRAFFICKING','primary_type_INTERFERENCE WITH PUBLIC OFFICER','primary_type_INTIMIDATION','primary_type_KIDNAPPING',
                        'primary_type_LIQUOR LAW VIOLATION','primary_type_MOTOR VEHICLE THEFT','primary_type_NARCOTICS', "primary_type_NON - CRIMINAL",
                        'primary_type_NON-CRIMINAL', 'primary_type_NON-CRIMINAL (SUBJECT SPECIFIED)',
                        'primary_type_OBSCENITY', 'primary_type_OFFENSE INVOLVING CHILDREN', 'primary_type_OTHER NARCOTIC VIOLATION',
                        'primary_type_OTHER OFFENSE', 'primary_type_PROSTITUTION', 'primary_type_PUBLIC INDECENCY', 'primary_type_PUBLIC PEACE VIOLATION',
                        'primary_type_ROBBERY', 'primary_type_SEX OFFENSE','primary_type_STALKING','primary_type_THEFT','primary_type_WEAPONS VIOLATION'
            ]
            let request = {};
            const currentDate = new Date();
            const value = moment(currentDate).format("yyyy-MM-DD HH:mm:ss");
            request["date"] = value;
            values.forEach(function(type,indice,array){
                if(type === crimeType){
                    request[type] = 1
                } else {
                    request[type] = 0
                }
            });
            axios.post('/api/ml/predict/', request,
                {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }
            ).then(({data})=>{
                console.log(data)
                if(data.success===1) {
                    setCoordinates({lat: data.data.x_coordinate, lng: data.data.y_coordinate})
                    setOpenMap(true);
                } else {
                    setModalBody({title:"Unexpected error making the prediction",message:data.error ?? 'Unexpected error on server'})
                    setModal(true);
                }
            }).catch((error)=>{
                setModalBody({title:"Unexpected error making the prediction",message:error.message?? 'Unexpected error on server'})
                setModal(true);
            })
        }
    }
    return(
        <div>
            <Typography variant="h4">
                Predict On Map
            </Typography>
            <Typography variant="subtitle2" className={classes.paragraph} paragraph={true}>
                In this section you can make and find a prediction in the state of Chicago with his corresponding coordinates.
            </Typography>
            <Typography variant="subtitle2" className={classes.paragraph} paragraph={true}>
                Specify the type of crime you want to predict:
            </Typography>
            <InputLabel id="demo-simple-select-outlined-label">Crime Type</InputLabel>
            <Select
                labelId="crimeTypeSelect"
                id="crimeTypeSelect"
                value={crimeType}
                onChange={handleChangeSelect}
                label="CrimeType"
            >
                <MenuItem value={"primary_type_ARSON"}>Arson</MenuItem>
                <MenuItem value={"primary_type_ASSAULT"}>Assault</MenuItem>
                <MenuItem value={"primary_type_BATTERY"}>Battery</MenuItem>
                <MenuItem value={"primary_type_BURGLARY"}>Burglary</MenuItem>
                <MenuItem value={"primary_type_CONCEALED CARRY LICENSE VIOLATION"}>Concealed Carry Permit Violations</MenuItem>
                <MenuItem value={"primary_type_CRIM SEXUAL ASSAULT"}>Criminal Sexual Assault</MenuItem>
                <MenuItem value={"primary_type_CRIMINAL DAMAGE"}>Criminal Damage</MenuItem>
                <MenuItem value={"primary_type_CRIMINAL TRESPASS"}>Criminal Trespass</MenuItem>
                <MenuItem value={"primary_type_DECEPTIVE PRACTICE"}>Deceptive Practice</MenuItem>
                <MenuItem value={"primary_type_GAMBLING"}>Gambling</MenuItem>
                <MenuItem value={"primary_type_HOMICIDE"}>Homicide</MenuItem>
                <MenuItem value={"primary_type_HUMAN TRAFFICKING"}>Human Trafficking</MenuItem>
                <MenuItem value={"primary_type_INTERFERENCE WITH PUBLIC OFFICER"}>Interference With Public Officer</MenuItem>
                <MenuItem value={"primary_type_INTIMIDATION"}>Intimidation</MenuItem>
                <MenuItem value={"primary_type_KIDNAPPING"}>Kidnapping</MenuItem>
                <MenuItem value={"primary_type_LIQUOR LAW VIOLATION"}>Liquor Law Violation</MenuItem>
                <MenuItem value={"primary_type_MOTOR VEHICLE THEFT"}>Motor Vehicle Theft</MenuItem>
                <MenuItem value={"primary_type_NARCOTICS"}>Narcotics</MenuItem>
                <MenuItem value={"primary_type_NON-CRIMINAL"}>Non Criminal</MenuItem>
                <MenuItem value={"primary_type_OBSCENITY"}>Obscenity</MenuItem>
                <MenuItem value={"primary_type_OFFENSE INVOLVING CHILDREN"}>Offense Involving Children</MenuItem>
                <MenuItem value={"primary_type_OTHER NARCOTIC VIOLATION"}>Other Narcotic Violation</MenuItem>
                <MenuItem value={"primary_type_OTHER OFFENSE"}>Other Offense</MenuItem>
                <MenuItem value={"primary_type_PROSTITUTION"}>Prostitution</MenuItem>
                <MenuItem value={"primary_type_PUBLIC INDECENCY"}>Public Indecency</MenuItem>
                <MenuItem value={"primary_type_PUBLIC PEACE VIOLATION"}>Public Peace Violation</MenuItem>
                <MenuItem value={"primary_type_ROBBERY"}>Robbery</MenuItem>
                <MenuItem value={"primary_type_SEX OFFENSE"}>Sex Offense</MenuItem>
                <MenuItem value={"primary_type_STALKING"}>Stalking</MenuItem>
                <MenuItem value={"primary_type_THEFT"}>Theft</MenuItem>
                <MenuItem value={"primary_type_WEAPONS VIOLATION"}>Weapons Violation</MenuItem>
            </Select>
            {
                !openMap && !(validString(crimeType))?
                <Box textAlign='center'>
                <Button onClick={handlePrediction} color="primary" variant="contained">
                    <ExploreIcon/>
                    Make Prediction
                </Button>
                </Box>
                :
                <div>
                    <Box textAlign='center'>
                        <Button onClick={handlePrediction} color="primary" variant="contained">
                            <ExploreIcon/>
                            Make Another Prediction
                        </Button>
                    </Box>
                    <div className={classes.mapContainer}>
                    <GoogleMapReact
                        bootstrapURLKeys={{key: 'AIzaSyCoASMScn6uRn3Q19wCLAxMzCQQQ5yaFws'}}
                        defaultCenter={defaultCenter}
                        center={coordinates}
                        defaultZoom={15}
                        margin={[100, 100, 100, 100]}
                    >
                        <div
                            className={classes.markerContainer}
                            lat={coordinates.lat}
                            lng={coordinates.lng}
                        >
                            <LocationOnIcon color="primary" fontSize="large"/>
                        </div>
                    </GoogleMapReact>
                    </div>
                </div>
            }
            <CustomModal
                open={modal}
                handleClose={handleModal}
                title={modalBody.title}
            >
                <p className={classes.bodyModal}>{modalBody.message}</p>
            </CustomModal>
        </div>
    )

}