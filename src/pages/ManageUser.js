import React, {useEffect, useState} from 'react';
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import { DataGrid } from '@mui/x-data-grid';
import axios from "../axios";
import CustomModal from "../components/modal/CustomModal";
import Button from "@material-ui/core/Button";


const useStyles = makeStyles((theme) => ({
    paragraph:{
        paddingTop:20
    },
    bodyModal: {
        margin: 0,
        paddingTop: theme.spacing(2)
    }
}))

export default function ManageUser(){
    const classes = useStyles();
    const [modalBody,setModalBody] = useState({});
    const [modal, setModal] = useState(false);
    const [loadGrid,setLoadGrid] = useState(false);
    const [gridLoading,setGridLoading] = React.useState(false);
    const handleModal = () => {
        setModal(!modal);
    }
    const [rows,setRows] = useState([]);
    useEffect(() => {
        setGridLoading(true);
        axios.get('/api/user/get',{}
        ).then(({data})=>{
            if(data.success===1) {
                let dataUsers=[];
                 data.data.forEach(function(value,index,array){
                     dataUsers[index] = {
                         id:value.id,
                         username: value.username,
                         email: value.email,
                         firstName: value.first_name,
                         lastName: value.last_name,
                         status:value.is_active?'active':'inactive',
                     }
                 });
                setRows(dataUsers);
                setLoadGrid(false);
            } else {
                setModalBody({title:"Error inesperado al consultar los usuarios",message:data.error ?? 'Error inesperado en el servidor'})
                setModal(true);
            }
        }).catch(({data})=>{
            setModalBody({title:"Error inesperado al consultar los usuarios",message:data.data.detail?? 'Error inesperado en el servidor'})
            setModal(true);
        }).finally(()=>{
            setGridLoading(false);
        })
    }, [loadGrid]);
    const handleClick = (event, values) => {
        axios.put('/api/user/'+values.id+'/activate/',{}
        ).then(({data}) =>{
            if(data.success===1) {
                setLoadGrid(true);
                setLoadGrid(false);
            } else {
                setModalBody({title:"Error inesperado la modificar el usuario",message:data.error ?? 'Error inesperado en el servidor'})
                setModal(true);
            }
        }
        ).catch(({data})=>{
            setModalBody({title:"Error inesperado la modificar el usuario",message:data.data.detail?? 'Error inesperado en el servidor'})
            setModal(true);
        });
    };
    const columns = [
        { field: 'id', headerName: 'ID', width: 120 },
        {
            field: 'username',
            headerName: 'Nombre de usuario',
            width: 200,
            editable: false,
        },
        {
            field: 'email',
            headerName: 'Correo',
            width: 250,
            editable: false,
        },
        {
            field: 'firstName',
            headerName: 'Nombre',
            width: 150,
            editable: false,
        },
        {
            field: 'lastName',
            headerName: 'Apellido',
            width: 150,
            editable: false,
        },
        {
            field: 'status',
            headerName:'Estatus',
            width: 150,
            editable:false
        },
        {
            field:'actions',
            headerName: 'Acciones',
            width: 150,
            disableColumnMenu:true,
            sortable:false,
            editable:false,
            renderCell: (cellValues)=>{
                console.log(cellValues);
                return(
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={(event) => {
                            handleClick(event,cellValues)
                        }}
                    >
                        {cellValues.row.status==='active'?"Desactivar":"Activar"}
                    </Button>
                )
            }
        }
    ];

    return (
        <div>
            <Typography variant="h4">
                Usuarios
            </Typography>
            <Typography variant="subtitle2" className={classes.paragraph} paragraph={true}>
                Usuarios registrados:
            </Typography>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableColumnMenu={true}
                    loading={gridLoading}
                />
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