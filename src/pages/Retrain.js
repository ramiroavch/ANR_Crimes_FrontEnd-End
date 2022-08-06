import React, {useEffect, useState} from 'react';
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import {DataGrid} from '@mui/x-data-grid';
import Button from "@material-ui/core/Button";
import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl, InputLabel,
    MenuItem,
    Select,
    TextField
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import UpdateIcon from '@material-ui/icons/Update';
import axios from "../axios";
import CustomModal from "../components/modal/CustomModal";
import * as XLSX from "xlsx";


const useStyles = makeStyles((theme) => ({
    paragraph: {
        paddingTop: 20
    },
    headerContainer: {
        display: "flex",
        justifyContent: "space-between",
        [theme.breakpoints.down("md")]: {display: "flex", flexDirection: "column",marginBottom:theme.spacing(2)}
    },
    spinner: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.2)"
    },
    dialog: {
        position: "relative"
    },
    bodyModal: {
        margin: 0,
        paddingTop: theme.spacing(2)
    },
    formControl: {
        minWidth: 120,
    }
}))

export default function Retrain() {
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openConfirmCsvDialog, setOpenConfirmCsvDialog] = useState(false);
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);
    const [crimeType, setCrimeType] = React.useState("");
    const [district, setDistrict] = React.useState("");
    const [crimeId, setCrimeId] = React.useState("");
    const [coordinateX, setCoordinateX] = React.useState("");
    const [coordinateY, setCoordinateY] = React.useState("");
    const [pageLimit, setPageLimit] = React.useState(1);
    const [modalBody, setModalBody] = useState({});
    const [modal, setModal] = useState(false);
    const [page, setPage] = React.useState(0);
    const [gridLoading, setGridLoading] = React.useState(false);
    const [columnsCsv, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const handleModal = () => {
        setModal(!modal);
    }
    const handleChangeSelect = (event) => {
        setCrimeType(event.target.value);
    };
    const handleCloseCreateDialog = () => {
        if (!loading) {
            setOpenDialog(false);
        }
    }
    const handleCreateDialog = () => {
        setLoading(true);
        axios.post('/api/crimes/add/', {
                "id": String(crimeId),
                "district": String(district),
                "date": "04/18/2019 11:55:00 PM",
                "primary_type": crimeType,
                "x_coordinate": String(coordinateX),
                "y_coordinate": String(coordinateY),
            }
        ).then(({data}) => {
            setLoading(false);
            handleCloseCreateDialog();
        }).catch(({data}) => {
            setLoading(false);
            setError(data ? data.error : "Error inesperado al crear un crimen");
            setShowError(true);
        })
    }
    const handleCloseConfirmDialog = () => {
        if (!loading) {
            setOpenConfirmDialog(false);
        }
    }
    const handleCloseConfirmCsvDialog = () => {
        if (!loading) {
            setOpenConfirmCsvDialog(false);
        }
    }
    const handleCreateConfirmDialog = () => {
        setLoading(true);
        axios.post('/api/ml/train/', {
                "Date": 100000
            }
        ).then(({data}) => {
            setLoading(false);
            handleCloseConfirmDialog();
        }).catch(({data}) => {
            setLoading(false);
            setError(data ? data.error : "Unexpected error training the IA");
            setShowError(true);
        })
    }
    const [rows, setRows] = React.useState([]);

    const columns = [
        {
            field: 'case_number',
            headerName: 'Número del caso',
            width: 200,
            editable: true,
        },
        {
            field: 'x_coordinate',
            headerName: 'Coordenada X',
            type: 'number',
            width: 200,
            editable: true,
        },
        {
            field: 'y_coordinate',
            headerName: 'Coordenada Y',
            type: 'number',
            width: 200,
            editable: true,
        },
        {
            field: 'date',
            headerName: 'Fecha',
            type: 'string',
            width: 200,
            editable: true,
        },
    ];
    useEffect(() => {
        setGridLoading(true);
        const newPage= page+1;
        axios.get('/api/crimes/get?per_page=' + 20 + '&page_number=' + newPage, {}
        ).then(({data}) => {
            if (data.success === 1) {
                setPageLimit(data.data.pages);
                setRows(data.data.crimes);
            } else {
                setModalBody({
                    title: "Error inesperado en la consulta",
                    message: data.error ?? 'Error inesperado en el servidor'
                })
                setModal(true);
            }
        }).catch((error) => {
            setModalBody({
                title: "Error inesperado en la consulta",
                message: error.message ?? 'Error inesperado en el servidor'
            })
            setModal(true);
        }).finally(() => {
            setGridLoading(false);
        })
    }, [page]);

    const handleClickImport = event => {
        document.getElementById("hiddenFileInput").click();
    };

    // process CSV data
    const processData = dataString => {
        const dataStringLines = dataString.split(/\r\n|\n/);
        const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

        const list = [];
        for (let i = 1; i < dataStringLines.length; i++) {
            const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
            if (headers && row.length === headers.length) {
                const obj = {};
                for (let j = 0; j < headers.length; j++) {
                    let d = row[j];
                    if (d.length > 0) {
                        if (d[0] === '"')
                            d = d.substring(1, d.length - 1);
                        if (d[d.length - 1] === '"')
                            d = d.substring(d.length - 2, 1);
                    }
                    if (headers[j]) {
                        obj[headers[j]] = d;
                    }
                }

                // remove the blank rows
                if (Object.values(obj).filter(x => x).length > 0) {
                    list.push(obj);
                }
            }
        }

        // prepare columns list from headers
        const columns = headers.map(c => ({
            name: c,
            selector: c,
        }));

        setData(list);
        setColumns(columns);
    }

    const handleImport = (e) => {
        try {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (evt) => {
                /* Parse data */
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, {type: 'binary'});
                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                /* Convert array of arrays */
                const data = XLSX.utils.sheet_to_csv(ws, {header: 1});
                processData(data);
                setOpenConfirmCsvDialog(true);
            };
            reader.readAsBinaryString(file);
        } catch (err) {
            setModalBody({title: "Error inesperado al procesar el archivo", message: 'Debe validar el formato del archivo'})
            setModal(true);
        }
    }

    const validString = (string) => {
        return string && string !== ""
    }

    const handleCreateConfirmCsvDialog = () => {
        let errors = [];
        let success = 0;
        setLoading(true);
        handleCloseConfirmCsvDialog();
        data.forEach(function (value, index) {
            if (validString(value.id) && validString(value.district) && validString(value.date) && validString(value.x_coordinate) && validString(value.y_coordinate) && validString(value.primary_type)) {
                axios.post('/api/crimes/add/', {
                        "id": value.id,
                        "district": value.district,
                        "date": value.date,
                        "x_coordinate": value.x_coordinate,
                        "y_coordinate": value.y_coordinate,
                        "primary_type": value.primary_type
                    }
                ).then(({data}) => {
                    success++;
                }).catch((response) => {
                    errors[index] = value.id
                });
            } else {
                errors[index] = value.id
            }
        });
        setLoading(false);
        setModal(true);
        setModalBody({title: "Crimen(es) agregado(s) exitosamente", message: 'La agregación ha sido exitosa'});
        if (errors.length > 0) {
            let errorText = "";
            errors.forEach(function (value, index) {
                let rowNumber = index + 1;
                // eslint-disable-next-line no-useless-concat
                errorText = errorText + " Fila: " + rowNumber + " " + "Id: " + value.id + ",";
            });
            setModalBody({title: "Algunas agregaciones han fallado", message: 'Las agregaciones fallidas fueron: ' + errorText});
        }

    }

    return (
        <div>
            {loading ?
                <div className={classes.spinner}>
                    <CircularProgress/>
                </div> : null
            }
            <Typography variant="h4">
                Re-entrenar IA
            </Typography>
            <div className={classes.headerContainer}>
                <Typography variant="subtitle2" className={classes.paragraph} paragraph={true}>
                    Crimenes registrados hasta la fecha:
                </Typography>
                <div>
                    <Button variant="contained" color="primary" onClick={(e) => {
                        e.preventDefault()
                        handleClickImport()
                    }}
                            style={{marginRight: 15}}>
                        <AddIcon/>
                        Importar archivo .csv
                    </Button>
                    <input
                        id={"hiddenFileInput"}
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleImport}
                        style={{display: 'none'}}
                    />
                    <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}
                            style={{marginRight: 15}}>
                        <AddIcon/>
                        Insertar nuevo crimen
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => setOpenConfirmDialog(true)}>
                        <UpdateIcon/>
                        Re-entrenar IA
                    </Button>
                </div>
            </div>
            <div style={{height: 400, width: '100%'}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={20}
                    rowCount={pageLimit}
                    rowsPerPageOptions={[20]}
                    disableSelectionOnClick
                    paginationMode="server"
                    onPageChange={(newPage) => setPage(newPage)}
                    getRowId={row => row.case_number}
                    loading={gridLoading}
                    disableColumnMenu={true}
                />
                <div className={classes.dialog}>
                    <Dialog open={openDialog} onClose={handleCloseCreateDialog} aria-labelledby="form-dialog-title">
                        {loading ?
                            <div className={classes.spinner}>
                                <CircularProgress/>
                            </div> : null
                        }
                        <DialogTitle id="form-dialog-title">Agregar</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Ingrese la información del crimen
                            </DialogContentText>
                            {showError ?
                                <div>
                                    <Typography color="error">
                                        {"Error: " + error}
                                    </Typography>
                                </div> : null
                            }
                            <TextField
                                autoFocus
                                margin="dense"
                                id="crimeId"
                                label="Id Crimen"
                                type="number"
                                fullWidth
                                disabled={loading}
                                onChange={(event) => {
                                    setCrimeId(event.target.value)
                                }}
                            />
                            <FormControl className={classes.formControl}>
                                <InputLabel id="demo-simple-select-label">Tipo de crimen</InputLabel>
                                <Select
                                    labelId="crimeTypeSelect"
                                    id="crimeTypeSelect"
                                    value={crimeType}
                                    onChange={handleChangeSelect}
                                    label="Tipo de crimen"
                                >
                                    <MenuItem value={"ARSON"}>Incendio provocado</MenuItem>
                                    <MenuItem value={"ASSAULT"}>Asalto</MenuItem>
                                    <MenuItem value={"BATTERY"}>Agresión</MenuItem>
                                    <MenuItem value={"BURGLARY"}>Allanamiento de morada</MenuItem>
                                    <MenuItem value={"CONCEALED CARRY LICENSE VIOLATION"}>Infracción de permiso de porte</MenuItem>
                                    <MenuItem value={"CRIM SEXUAL ASSAULT"}>Asalto sexual</MenuItem>
                                    <MenuItem value={"CRIMINAL DAMAGE"}>Daño a la propiedad</MenuItem>
                                    <MenuItem value={"CRIMINAL TRESPASS"}>Invasión a propiedad privada</MenuItem>
                                    <MenuItem value={"DECEPTIVE PRACTICE"}>Práctica engañosa</MenuItem>
                                    <MenuItem value={"GAMBLING"}>Apuestas ilegales</MenuItem>
                                    <MenuItem value={"HOMICIDE"}>Homicidio</MenuItem>
                                    <MenuItem value={"HUMAN TRAFFICKING"}>Trata de personas</MenuItem>
                                    <MenuItem value={"INTERFERENCE WITH PUBLIC OFFICER"}>Interferencia hacia un oficial</MenuItem>
                                    <MenuItem value={"INTIMIDATION"}>Acoso</MenuItem>
                                    <MenuItem value={"KIDNAPPING"}>Secuestro</MenuItem>
                                    <MenuItem value={"LIQUOR LAW VIOLATION"}>Violación de la ley de licores</MenuItem>
                                    <MenuItem value={"MOTOR VEHICLE THEFT"}>Robo Automóvil</MenuItem>
                                    <MenuItem value={"NARCOTICS"}>Narcóticos</MenuItem>
                                    <MenuItem value={"NON-CRIMINAL"}>No Criminal</MenuItem>
                                    <MenuItem value={"OBSCENITY"}>Conducta obscena</MenuItem>
                                    <MenuItem value={"OFFENSE INVOLVING CHILDREN"}>Ofensa a menores</MenuItem>
                                    <MenuItem value={"OTHER NARCOTIC VIOLATION"}>Otras violaciones de narcóticos</MenuItem>
                                    <MenuItem value={"OTHER OFFENSE"}>Otros delitos</MenuItem>
                                    <MenuItem value={"PROSTITUTION"}>Prostitución</MenuItem>
                                    <MenuItem value={"PUBLIC INDECENCY"}>Idencencia pública</MenuItem>
                                    <MenuItem value={"PUBLIC PEACE VIOLATION"}>Alteración de la paz pública</MenuItem>
                                    <MenuItem value={"ROBBERY"}>Hurto</MenuItem>
                                    <MenuItem value={"SEX OFFENSE"}>Ofensa sexual</MenuItem>
                                    <MenuItem value={"STALKING"}>Acoso</MenuItem>
                                    <MenuItem value={"THEFT"}>Hurto</MenuItem>
                                    <MenuItem value={"WEAPONS VIOLATION"}>Violación contra la ley de Armas</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="caseNumber"
                                label="Numero de caso"
                                type="string"
                                fullWidth
                                disabled={loading}
                                onChange={(event) => {
                                    setDistrict(event.target.value)
                                }}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="districtNumber"
                                label="Numero de distrito"
                                type="number"
                                fullWidth
                                disabled={loading}
                                onChange={(event) => {
                                    setDistrict(event.target.value)
                                }}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="xCoordinate"
                                label="Coordenada X"
                                type="number"
                                fullWidth
                                disabled={loading}
                                onChange={(event) => {
                                    setCoordinateX(event.target.value)
                                }}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="yCoordinate"
                                label="Coordenada Y"
                                type="number"
                                fullWidth
                                disabled={loading}
                                onChange={(event) => {
                                    setCoordinateY(event.target.value)
                                }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseCreateDialog} color="primary" disabled={loading}>
                                Cancelar
                            </Button>
                            <Button onClick={handleCreateDialog} color="primary" disabled={loading}>
                                Agregar
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
                            <CircularProgress/>
                        </div> : null
                    }
                    <DialogTitle id="alert-dialog-slide-title">{"Desea re-entrenar la IA?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Confirmar para continuar
                        </DialogContentText>
                        {showError ?
                            <div>
                                <Typography color="error">
                                    {"Error: " + error}
                                </Typography>
                            </div> : null
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseConfirmDialog} color="primary" disabled={loading}>
                            Rechazar
                        </Button>
                        <Button onClick={handleCreateConfirmDialog} color="primary" disabled={loading}>
                            Aceptar
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div>
                <Dialog
                    open={openConfirmCsvDialog}
                    keepMounted
                    onClose={handleCloseConfirmCsvDialog}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    {loading ?
                        <div className={classes.spinner}>
                            <CircularProgress/>
                        </div> : null
                    }
                    <DialogTitle id="alert-dialog-slide-title">{"You want to import this file?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Confirmar para continuar
                        </DialogContentText>
                        {showError ?
                            <div>
                                <Typography color="error">
                                    {"Error: " + error}
                                </Typography>
                            </div> : null
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseConfirmCsvDialog} color="primary" disabled={loading}>
                            Rechazar
                        </Button>
                        <Button onClick={handleCreateConfirmCsvDialog} color="primary" disabled={loading}>
                            Aceptar
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