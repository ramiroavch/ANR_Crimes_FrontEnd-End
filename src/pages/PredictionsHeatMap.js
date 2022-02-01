import React, {useEffect, useState} from 'react';
import { alpha ,makeStyles} from "@material-ui/core/styles";
import GoogleMapReact from 'google-map-react';
import Typography from "@material-ui/core/Typography";
import {useSelector} from "react-redux";
import axios from '../axios';
import CustomModal from "../components/modal/CustomModal";


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

export default function PredictionHeatMap(){
    const [modal, setModal] = useState(false);
    const handleModal = () => {
        setModal(!modal);
    }
    const [modalBody,setModalBody] = useState({});
    const {accessToken} = useSelector((state) => state.user)
    const classes = useStyles();
    const defaultCenter = { lat:41.85003, lng:-87.65005};
    const [options,setOptions] = React.useState( {
            radius:40,
            opacity:0.6,
        });
    const [heatMapData,setHeatMapData] = React.useState({
        positions:[],
        options:{}
    });
    useEffect(() => {
        axios.get('/api/prediction/get',{},
            {
                headers: { Authorization: `Bearer ${accessToken}` }
            }
        ).then(({data})=>{
            let mapData=[];
            if(data.success===1) {
                data.data.forEach(function(value,indice,array){
                    mapData[indice] = { lat: value.x_coordinate, lng: value.y_coordinate }
                });
                setHeatMapData({
                    positions: mapData,
                    options: options
                });
            } else {
                setModalBody({title:"Unexpected error making the prediction",message:data.error ?? 'Unexpected error on server'})
                setModal(true);
            }
        }).catch((error)=>{
            setModalBody({title:"Unexpected error making the prediction",message:error.message?? 'Unexpected error on server'})
            setModal(true);
        })
    }, []);
    return(
        <div>
            <Typography variant="h4">
                Heat Map
            </Typography>
            <Typography variant="subtitle2" className={classes.paragraph} paragraph={true}>
                In this section you can see a report with a heat map with all the predictions made it by the system
            </Typography>
            <div>
                <div className={classes.mapContainer}>
                    <GoogleMapReact
                        bootstrapURLKeys={{key: 'AIzaSyCoASMScn6uRn3Q19wCLAxMzCQQQ5yaFws'}}
                        defaultCenter={defaultCenter}
                        defaultZoom={15}
                        margin={[100, 100, 100, 100]}
                        heatmapLibrary={true}
                        heatmap={heatMapData}
                    />
                </div>
            </div>
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