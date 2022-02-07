import React, {useEffect, useState} from 'react';
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import { DataGrid } from '@mui/x-data-grid';
import Button from "@material-ui/core/Button";
import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, MenuItem, Select,
    TextField
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import UpdateIcon from '@material-ui/icons/Update';
import axios from "../axios";
import CustomModal from "../components/modal/CustomModal";


const useStyles = makeStyles((theme) => ({
    paragraph:{
        paddingTop:20
    },
    headerContainer:{
        display:"flex",
        justifyContent:"space-between"
    },
    spinner:{
        position:"absolute",
        top:0,
        bottom:0,
        left:0,
        right:0,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"rgba(0,0,0,0.2)"
    },
    dialog:{
        position:"relative"
    },
    bodyModal: {
        margin: 0,
        paddingTop: theme.spacing(2)
    }
}))

export default function Retrain(){
    const [openDialog,setOpenDialog] = useState(false);
    const [openConfirmDialog,setOpenConfirmDialog] = useState(false);
    const classes = useStyles();
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("");
    const [showError,setShowError] = useState(false);
    const [crimeType,setCrimeType] = React.useState("");
    const [district,setDistrict] = React.useState("");
    const [crimeId,setCrimeId] = React.useState("");
    const [coordinateX,setCoordinateX] = React.useState("");
    const [coordinateY,setCoordinateY] = React.useState("");
    const [pageLimit,setPageLimit] = React.useState(1);
    const [modalBody,setModalBody] = useState({});
    const [modal, setModal] = useState(false);
    const [page, setPage] = React.useState(1);
    const [gridLoading,setGridLoading] = React.useState(false);
    const handleModal = () => {
        setModal(!modal);
    }
    const handleChangeSelect = (event) => {
        setCrimeType(event.target.value);
    };
    const handleCloseCreateDialog= ()=>{
        if(!loading){
            setOpenDialog(false);
        }
    }
    const handleCreateDialog= ()=>{
        setLoading(true);
        axios.post('/api/crimes/add/',{
            "id":String(crimeId),
            "district":String(district),
            "date":"04/18/2019 11:55:00 PM",
            "primary_type":crimeType,
            "x_coordinate":String(coordinateX),
            "y_coordinate":String(coordinateY),
            }
        ).then(({data})=>{
            setLoading(false);
            handleCloseCreateDialog();
        }).catch(({data})=>{
            setLoading(false);
            setError(data? data.error: "Error inesperado al crear un crimen");
            setShowError(true);
        })
    }
    const handleCloseConfirmDialog= ()=>{
        if(!loading){
            setOpenConfirmDialog(false);
        }
    }
    const handleCreateConfirmDialog= ()=>{
        setLoading(true);
        axios.post('/api/ml/train/',{
            "Date":100000
            }
        ).then(({data}) =>{
            setLoading(false);
            handleCloseConfirmDialog();
        }).catch(({data})=>{
            setLoading(false);
            setError(data? data.error: "Error inesperado al volver a entrenar la IA");
            setShowError(true );
        })
    }
    const [rows,setRows] = React.useState([]);

    const columns = [
        {
            field: 'case_number',
            headerName: 'Case Number',
            width: 200,
            editable: true,
        },
        {
            field: 'x_coordinate',
            headerName: 'X Coordinate',
            type: 'number',
            width: 200,
            editable: true,
        },
        {
            field: 'y_coordinate',
            headerName: 'Y Coordinate',
            type: 'number',
            width: 200,
            editable: true,
        },
        {
            field: 'date',
            headerName: 'Date',
            type: 'string',
            width: 200,
            editable: true,
        },
    ];
    useEffect(() => {
        setGridLoading(true);
        axios.get('/api/crimes/get?per_page='+20+'&page_number='+page,{}
        ).then(({data})=>{
            if(data.success===1) {
                setPageLimit(data.data.pages);
                setRows(data.data.crimes);
            } else {
                setModalBody({title:"Unexpected error making the prediction",message:data.error ?? 'Unexpected error on server'})
                setModal(true);
            }
        }).catch((error)=>{
            setModalBody({title:"Unexpected error making the prediction",message:error.message?? 'Unexpected error on server'})
            setModal(true);
        }).finally(()=>{
            setGridLoading(false);
        })
    }, [page]);

    return (
    <div>
        <Typography variant="h4">
            Retrain IA
        </Typography>
        <div className={classes.headerContainer}>
            <Typography variant="subtitle2" className={classes.paragraph} paragraph={true}>
                Crimes registered till date:
            </Typography>
            <div>
                <Button variant="contained" color="primary" onClick={()=>setOpenDialog(true)} style={{marginRight: 15}}>
                    <AddIcon/>
                    New Crime
                </Button>
                <Button variant="contained" color="primary" onClick={()=>setOpenConfirmDialog(true)}>
                    <UpdateIcon/>
                    Retrain IA
                </Button>
            </div>
        </div>
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={20}
                rowCount={pageLimit}
                rowsPerPageOptions={[20]}
                checkboxSelection
                disableSelectionOnClick
                paginationMode="server"
                onPageChange={(newPage) => setPage(newPage)}
                getRowId={row => row.case_number}
                loading={gridLoading}
            />
            <div className={classes.dialog}>
                <Dialog open={openDialog} onClose={handleCloseCreateDialog} aria-labelledby="form-dialog-title">
                    {loading ?
                        <div className={classes.spinner}>
                            <CircularProgress />
                        </div> :null
                    }
                    <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Input the data of the new crime
                        </DialogContentText>
                        { showError ?
                            <div>
                                <Typography color="error">
                                    {"Error: "+error}
                                </Typography>
                            </div>:null
                        }
                        <TextField
                            autoFocus
                            margin="dense"
                            id="crimeId"
                            label="Crime Id"
                            type="number"
                            fullWidth
                            disabled={loading}
                            onChange={(event)=>{setCrimeId(event.target.value)}}
                        />
                        <Select
                            labelId="crimeTypeSelect"
                            id="crimeTypeSelect"
                            value={crimeType}
                            onChange={handleChangeSelect}
                            label="Crime Type"
                        >
                            <MenuItem value={"ARSON"}>Arson</MenuItem>
                            <MenuItem value={"ASSAULT"}>Assault</MenuItem>
                            <MenuItem value={"BATTERY"}>Battery</MenuItem>
                            <MenuItem value={"BURGLARY"}>Burglary</MenuItem>
                            <MenuItem value={"CONCEALED CARRY LICENSE VIOLATION"}>Concealed Carry Permit Violations</MenuItem>
                            <MenuItem value={"CRIM SEXUAL ASSAULT"}>Criminal Sexual Assault</MenuItem>
                            <MenuItem value={"CRIMINAL DAMAGE"}>Criminal Damage</MenuItem>
                            <MenuItem value={"CRIMINAL TRESPASS"}>Criminal Trespass</MenuItem>
                            <MenuItem value={"DECEPTIVE PRACTICE"}>Deceptive Practice</MenuItem>
                            <MenuItem value={"GAMBLING"}>Gambling</MenuItem>
                            <MenuItem value={"HOMICIDE"}>Homicide</MenuItem>
                            <MenuItem value={"HUMAN TRAFFICKING"}>Human Trafficking</MenuItem>
                            <MenuItem value={"INTERFERENCE WITH PUBLIC OFFICER"}>Interference With Public Officer</MenuItem>
                            <MenuItem value={"INTIMIDATION"}>Intimidation</MenuItem>
                            <MenuItem value={"KIDNAPPING"}>Kidnapping</MenuItem>
                            <MenuItem value={"LIQUOR LAW VIOLATION"}>Liquor Law Violation</MenuItem>
                            <MenuItem value={"MOTOR VEHICLE THEFT"}>Motor Vehicle Theft</MenuItem>
                            <MenuItem value={"NARCOTICS"}>Narcotics</MenuItem>
                            <MenuItem value={"NON-CRIMINAL"}>Non Criminal</MenuItem>
                            <MenuItem value={"OBSCENITY"}>Obscenity</MenuItem>
                            <MenuItem value={"OFFENSE INVOLVING CHILDREN"}>Offense Involving Children</MenuItem>
                            <MenuItem value={"OTHER NARCOTIC VIOLATION"}>Other Narcotic Violation</MenuItem>
                            <MenuItem value={"OTHER OFFENSE"}>Other Offense</MenuItem>
                            <MenuItem value={"PROSTITUTION"}>Prostitution</MenuItem>
                            <MenuItem value={"PUBLIC INDECENCY"}>Public Indecency</MenuItem>
                            <MenuItem value={"PUBLIC PEACE VIOLATION"}>Public Peace Violation</MenuItem>
                            <MenuItem value={"ROBBERY"}>Robbery</MenuItem>
                            <MenuItem value={"SEX OFFENSE"}>Sex Offense</MenuItem>
                            <MenuItem value={"STALKING"}>Stalking</MenuItem>
                            <MenuItem value={"THEFT"}>Theft</MenuItem>
                            <MenuItem value={"WEAPONS VIOLATION"}>Weapons Violation</MenuItem>
                        </Select>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="caseNumber"
                            label="Case number"
                            type="string"
                            fullWidth
                            disabled={loading}
                            onChange={(event)=>{setDistrict(event.target.value)}}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="districtNumber"
                            label="District Number"
                            type="number"
                            fullWidth
                            disabled={loading}
                            onChange={(event)=>{setDistrict(event.target.value)}}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="xCoordinate"
                            label="X coordinate"
                            type="number"
                            fullWidth
                            disabled={loading}
                            onChange={(event)=>{setCoordinateX(event.target.value)}}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="yCoordinate"
                            label="y coordinate"
                            type="number"
                            fullWidth
                            disabled={loading}
                            onChange={(event)=>{setCoordinateY(event.target.value)}}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseCreateDialog} color="primary" disabled={loading}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateDialog} color="primary" disabled={loading}>
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
        <div>
            <Dialog
                open={openConfirmDialog}
                keepMounted
                onClose={handleCloseConfirmDialog}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                {loading ?
                    <div className={classes.spinner}>
                        <CircularProgress />
                    </div> :null
                }
                <DialogTitle id="alert-dialog-slide-title">{"You want to retrain de IA?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Please confirm to continue
                    </DialogContentText>
                    { showError ?
                    <div>
                        <Typography color="error">
                            {"Error: "+error}
                        </Typography>
                    </div>:null
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary" disabled={loading}>
                        Disagree
                    </Button>
                    <Button onClick={handleCreateConfirmDialog} color="primary" disabled={loading}>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
        <CustomModal
            open={modal}
            handleClose={handleModal}
            title={modalBody.title}
        >
            <p className={classes.bodyModal}>{modalBody.message}</p>
        </CustomModal>
    </div>
    );
}