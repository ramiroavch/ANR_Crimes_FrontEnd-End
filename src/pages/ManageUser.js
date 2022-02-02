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
    }
}))

export default function ManageUser(){
    const classes = useStyles();
    const [modalBody,setModalBody] = useState({});
    const [modal, setModal] = useState(false);
    const [loadGrid,setLoadGrid] = useState(false);
    const handleModal = () => {
        setModal(!modal);
    }
    const [rows,setRows] = useState([]);
    useEffect(() => {
        axios.get('/api/user/get',{}
        ).then(({data})=>{
            if(data.success===1) {
                let dataUsers=[];
                 data.data.forEach(function(value,indice,array){
                     dataUsers[indice] = {
                         id:value.id,
                         username: value.username,
                         email: value.email,
                         firstName: value.first_name,
                         lastName: value.last_name
                     }
                 });
                setRows(dataUsers);
                setLoadGrid(false);
            } else {
                setModalBody({title:"Unexpected error making the prediction",message:data.error ?? 'Unexpected error on server'})
                setModal(true);
            }
        }).catch((error)=>{
            setModalBody({title:"Unexpected error making the prediction",message:error.message?? 'Unexpected error on server'})
            setModal(true);
        })
    }, [loadGrid]);
    const handleClick = (event, values) => {
        axios.put('/api/user/'+values.id+'/deactivate/',{}
        ).then(({data}) =>{
            if(data.success===1) {
                setLoadGrid(true);
            } else {
                setModalBody({title:"Unexpected error deleting the user",message:data.error ?? 'Unexpected error on server'})
                setModal(true);
            }
        }
        ).catch((error)=>{
            setModalBody({title:"Unexpected error deleting the user",message:error.message?? 'Unexpected error on server'})
            setModal(true);
        });
    };
    const columns = [
        { field: 'id', headerName: 'ID', width: 120 },
        {
            field: 'username',
            headerName: 'Username',
            width: 150,
            editable: true,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 150,
            editable: true,
        },
        {
            field: 'firstName',
            headerName: 'First name',
            width: 150,
            editable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last name',
            width: 150,
            editable: true,
        },
        {
            field:'',
            renderCell: (cellValues)=>{
                return(
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={(event) => {
                            handleClick(event,cellValues)
                        }}
                    >
                        Eliminar
                    </Button>
                )
            }
        }
    ];

    return (
        <div>
            <Typography variant="h4">
                Users
            </Typography>
            <Typography variant="subtitle2" className={classes.paragraph} paragraph={true}>
                Users Registered:
            </Typography>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
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