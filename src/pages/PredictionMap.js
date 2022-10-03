import React, {useState} from 'react';
import {alpha, makeStyles} from "@material-ui/core/styles";
import ExploreIcon from '@material-ui/icons/Explore';
import {Button, FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import GoogleMapReact from 'google-map-react';
import Typography from "@material-ui/core/Typography";
import {useSelector} from "react-redux";
import axios from '../axios';
import CustomModal from "../components/modal/CustomModal";
import moment from "moment";
import LocationOnIcon from '@material-ui/icons/LocationOn';

const useStyles = makeStyles((theme) => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&hover': {backgroundColor: alpha(theme.palette.common.white, 0.25)},
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {marginLeft: theme.spacing(3), width: 'auto'}

    },
    paragraph: {
        paddingTop: 20
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapContainer: {
        height: '85vh', width: '100%',
        paddingTop: 20
    },
    markerContainer: {
        position: 'absolute', transform: 'translate(-50%, -50%)', zIndex: 1, '&:hover': {zIndex: 2},
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
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {width: '20ch'},
    },
    bodyModal: {
        margin: 0,
        paddingTop: theme.spacing(2)
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 140,
    },
}))

export default function PredictionMap() {
    const [modal, setModal] = useState(false);
    const handleModal = () => {
        setModal(!modal);
    }
    const [modalBody, setModalBody] = useState({});
    const {accessToken} = useSelector((state) => state.user)
    const [crimeType, setCrimeType] = React.useState("");
    const [districtNum, setDistrictNum] = React.useState("");
    const [openMap, setOpenMap] = React.useState(false);
    const classes = useStyles();
    const defaultCenter = {lat: 41.85003, lng: -87.65005};
    const [coordinates, setCoordinates] = React.useState({})
    const validString = (string) => {
        let bool = (string) && !(string === "") && !(string === "undefined")
        return bool;
    }
    const handleChangeSelect = (event) => {
        setCrimeType(event.target.value);
    };
    const handleChangeSelectDistrict = (event) => {
        setDistrictNum(event.target.value);
    };
    const handlePrediction = () => {
        if ((typeof crimeType != 'undefined') && (typeof districtNum != 'undefined') ){
            let values = ['primary_type_ARSON', 'primary_type_ASSAULT', 'primary_type_BATTERY', 'primary_type_BURGLARY',
                'primary_type_CONCEALED CARRY LICENSE VIOLATION', 'primary_type_CRIM SEXUAL ASSAULT', 'primary_type_CRIMINAL DAMAGE',
                'primary_type_CRIMINAL TRESPASS', 'primary_type_DECEPTIVE PRACTICE', 'primary_type_GAMBLING', 'primary_type_HOMICIDE',
                'primary_type_HUMAN TRAFFICKING', 'primary_type_INTERFERENCE WITH PUBLIC OFFICER', 'primary_type_INTIMIDATION', 'primary_type_KIDNAPPING',
                'primary_type_LIQUOR LAW VIOLATION', 'primary_type_MOTOR VEHICLE THEFT', 'primary_type_NARCOTICS', "primary_type_NON - CRIMINAL",
                'primary_type_NON-CRIMINAL', 'primary_type_NON-CRIMINAL (SUBJECT SPECIFIED)',
                'primary_type_OBSCENITY', 'primary_type_OFFENSE INVOLVING CHILDREN', 'primary_type_OTHER NARCOTIC VIOLATION',
                'primary_type_OTHER OFFENSE', 'primary_type_PROSTITUTION', 'primary_type_PUBLIC INDECENCY', 'primary_type_PUBLIC PEACE VIOLATION',
                'primary_type_ROBBERY', 'primary_type_SEX OFFENSE', 'primary_type_STALKING', 'primary_type_THEFT', 'primary_type_WEAPONS VIOLATION'
            ]
            let districtIndexes = ['district_1.0','district_2.0','district_3.0','district_4.0','district_5.0','district_6.0','district_7.0',
                'district_8.0','district_9.0','district_10.0','district_11.0','district_12.0','district_14.0','district_15.0',
                'district_16.0','district_17.0','district_18.0','district_19.0','district_20.0','district_22.0','district_24.0',
                'district_25.0','district_31.0']
            let request = {};
            const currentDate = new Date();
            const value = moment(currentDate).format("yyyy-MM-DD HH:mm:ss");
            request["date"] = value;
            values.forEach(function (type, index, array) {
                if (type === crimeType) {
                    request[type] = 1
                } else {
                    request[type] = 0
                }
            });
            districtIndexes.forEach(function(district,index,array){
                if(district === districtNum) {
                    request[district] = 1
                } else {
                    request[district] = 0
                }
            });
            console.log(JSON.stringify(request));
            axios.post('/api/ml/predict/', request,
                {
                    headers: {Authorization: `Bearer ${accessToken}`}
                }
            ).then(({data}) => {
                console.log(data)
                if (data.success === 1) {
                    setCoordinates({lat: data.data.x_coordinate, lng: data.data.y_coordinate})
                    setOpenMap(true);
                } else {
                    setModalBody({
                        title: "Error inesperado al realizar la predicción",
                        message: data.error ?? 'Error inesperado en el servidor'
                    })
                    setModal(true);
                }
            }).catch((error) => {
                setModalBody({
                    title: "Error inesperado realizando la predicción",
                    message: error.message ?? 'Error inesperado en el servidor'
                })
                setModal(true);
            })
        }
    }
    return (
        <div>
            <Typography variant="h4">
                Realizar Predicción
            </Typography>
            <Typography variant="subtitle2" className={classes.paragraph} paragraph={true}>
                En este módulo podrás realizar una predicción y poder visualizar las coordenadas resultantes del crimen
            </Typography>
            <Typography variant="subtitle2" className={classes.paragraph} paragraph={true}>
                Selecciona el tipo de crimen a predecir:
            </Typography>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Tipo de crimen</InputLabel>
                <Select
                    labelId="crimeTypeSelect"
                    id="crimeTypeSelect"
                    value={crimeType}
                    onChange={handleChangeSelect}
                    label="Tipo de crimen"
                >
                    <MenuItem value={"primary_type_ARSON"}>Incendio provocado</MenuItem>
                    <MenuItem value={"primary_type_ASSAULT"}>Asalto</MenuItem>
                    <MenuItem value={"primary_type_BATTERY"}>Agresión</MenuItem>
                    <MenuItem value={"primary_type_BURGLARY"}>Allanamiento de morada</MenuItem>
                    <MenuItem value={"primary_type_CONCEALED CARRY LICENSE VIOLATION"}>Infracción de permiso de porte</MenuItem>
                    <MenuItem value={"primary_type_CRIM SEXUAL ASSAULT"}>Asalto sexual</MenuItem>
                    <MenuItem value={"primary_type_CRIMINAL DAMAGE"}>Daño a la propiedad</MenuItem>
                    <MenuItem value={"primary_type_CRIMINAL TRESPASS"}>Invasión a propiedad privada</MenuItem>
                    <MenuItem value={"primary_type_DECEPTIVE PRACTICE"}>Práctica engañosa</MenuItem>
                    <MenuItem value={"primary_type_GAMBLING"}>Apuestas ilegales</MenuItem>
                    <MenuItem value={"primary_type_HOMICIDE"}>Homicidio</MenuItem>
                    <MenuItem value={"primary_type_HUMAN TRAFFICKING"}>Trata de personas</MenuItem>
                    <MenuItem value={"primary_type_INTERFERENCE WITH PUBLIC OFFICER"}>Interferencia hacia un oficial</MenuItem>
                    <MenuItem value={"primary_type_INTIMIDATION"}>Acoso</MenuItem>
                    <MenuItem value={"primary_type_KIDNAPPING"}>Secuestro</MenuItem>
                    <MenuItem value={"primary_type_LIQUOR LAW VIOLATION"}>Violación de la ley de licores</MenuItem>
                    <MenuItem value={"primary_type_MOTOR VEHICLE THEFT"}>Robo Automóvil</MenuItem>
                    <MenuItem value={"primary_type_NARCOTICS"}>Narcóticos</MenuItem>
                    <MenuItem value={"primary_type_NON-CRIMINAL"}>No Criminal</MenuItem>
                    <MenuItem value={"primary_type_OBSCENITY"}>Conducta obscena</MenuItem>
                    <MenuItem value={"primary_type_OFFENSE INVOLVING CHILDREN"}>Ofensa a menores</MenuItem>
                    <MenuItem value={"primary_type_OTHER NARCOTIC VIOLATION"}>Otras violaciones de narcóticos</MenuItem>
                    <MenuItem value={"primary_type_OTHER OFFENSE"}>Otros delitos</MenuItem>
                    <MenuItem value={"primary_type_PROSTITUTION"}>Prostitución</MenuItem>
                    <MenuItem value={"primary_type_PUBLIC INDECENCY"}>Idencencia pública</MenuItem>
                    <MenuItem value={"primary_type_PUBLIC PEACE VIOLATION"}>Alteración de la paz pública</MenuItem>
                    <MenuItem value={"primary_type_ROBBERY"}>Hurto</MenuItem>
                    <MenuItem value={"primary_type_SEX OFFENSE"}>Ofensa sexual</MenuItem>
                    <MenuItem value={"primary_type_STALKING"}>Acoso</MenuItem>
                    <MenuItem value={"primary_type_THEFT"}>Hurto</MenuItem>
                    <MenuItem value={"primary_type_WEAPONS VIOLATION"}>Violación contra la ley de Armas</MenuItem>
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
                <Select
                    labelId="disctrictNumSelect"
                    id="disctrictNumSelect"
                    value={districtNum}
                    onChange={handleChangeSelectDistrict}
                    label="Distrito"
                >
                    <MenuItem value={"district_1.0"}>1</MenuItem>
                    <MenuItem value={"district_2.0"}>2</MenuItem>
                    <MenuItem value={"district_3.0"}>3</MenuItem>
                    <MenuItem value={"district_4.0"}>4</MenuItem>
                    <MenuItem value={"district_5.0"}>5</MenuItem>
                    <MenuItem value={"district_6.0"}>6</MenuItem>
                    <MenuItem value={"district_7.0"}>7</MenuItem>
                    <MenuItem value={"district_8.0"}>8</MenuItem>
                    <MenuItem value={"district_9.0"}>9</MenuItem>
                    <MenuItem value={"district_10.0"}>10</MenuItem>
                    <MenuItem value={"district_11.0"}>11</MenuItem>
                    <MenuItem value={"district_12.0"}>12</MenuItem>
                    <MenuItem value={"district_14.0"}>14</MenuItem>
                    <MenuItem value={"district_15.0"}>15</MenuItem>
                    <MenuItem value={"district_16.0"}>16</MenuItem>
                    <MenuItem value={"district_17.0"}>17</MenuItem>
                    <MenuItem value={"district_18.0"}>18</MenuItem>
                    <MenuItem value={"district_19.0"}>19</MenuItem>
                    <MenuItem value={"district_20.0"}>20</MenuItem>
                    <MenuItem value={"district_22.0"}>22</MenuItem>
                    <MenuItem value={"district_24.0"}>24</MenuItem>
                    <MenuItem value={"district_25.0"}>25</MenuItem>
                    <MenuItem value={"district_31.0"}>31</MenuItem>

                </Select>
            </FormControl>
            {
                (openMap && (validString(crimeType))) ?
                    <div>
                        <Box textAlign='center'>
                            <Button onClick={handlePrediction} color="primary" variant="contained">
                                <ExploreIcon/>
                                Hacer otra predicción
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
                    :
                    <Box textAlign='center'>
                        <Button onClick={handlePrediction} color="primary" variant="contained">
                            <ExploreIcon/>
                            Hacer Predicción
                        </Button>
                    </Box>

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