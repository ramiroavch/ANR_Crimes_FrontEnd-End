import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Card, CardContent, CardHeader, useTheme} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import { Bar } from 'react-chartjs-2';
import axios from "../axios";
import CustomModal from "../components/modal/CustomModal";

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    bodyModal: {
        margin: 0,
        paddingTop: theme.spacing(2)
    }
}));

export default function Dashboard(props) {
    const classes = useStyles();
    const [modal,setModal] = useState (false);
    const [districts, setDistricts] = useState([]);
    const [crimeTypes,setCrimeTypes]= useState([]);
    const [crimesPerType,setCrimesPerType] = useState([]);
    const [crimesPerDistricts,setCrimesPerDistricts] = useState([]);
    const [crimesPerMonth,setCrimesPerMonth] = useState([]);
    const [months,setMonths] = useState([]);
    const handleModal = ()=>{
        setModal(!modal);
    }
    const [modalBody,setModalBody] = useState({});
    useEffect(() => {
        axios.get('/api/crimes/stats',{}
        ).then(({data})=>{
            if(data.success===1) {
                let qPerDistrict = data.data.quantity_per_district.sort((a,b)=> parseInt(a.District) - parseInt(b.District));
                setDistricts(qPerDistrict.map(({District})=>District));
                setCrimesPerDistricts(qPerDistrict.map(({quantity})=>quantity));
                let qPerType = data.data.quantity_per_type;
                setCrimesPerType(qPerType.map(({quantity})=>quantity))
                setCrimeTypes(qPerType.map((a)=>a["Primary Type"]))
                let qPerMonth = data.data.quantity_per_month.sort((a,b)=> parseInt(a.month) - parseInt(b.month))
                setMonths(qPerMonth.map(({month})=>month));
                setCrimesPerMonth(qPerMonth.map(({quantity})=>quantity))

            } else {
                setModalBody({title:"Unexpected error making the prediction",message:data.error ?? 'Unexpected error on server'})
                setModal(true);
            }
        }).catch((error)=>{
            setModalBody({title:"Unexpected error making the prediction",message:error.message?? 'Unexpected error on server'})
            setModal(true);
        })
    }, []);
    const theme = useTheme();

    const data = (data,labels )=> {
        return(
        {
            datasets: [
                {
                    backgroundColor: '#3F51B5',
                    barPercentage: 0.5,
                    barThickness: 12,
                    borderRadius: 4,
                    categoryPercentage: 0.5,
                    data: data,
                    label: 'Quantity of crimes',
                    maxBarThickness: 10
                }
            ],
            labels: labels
        }
        );
    };

    const options = {
        animation: false,
        cornerRadius: 20,
        layout: { padding: 0 },
        legend: { display: false },
        maintainAspectRatio: false,
        responsive: true,
        xAxes: [
            {
                ticks: {
                    fontColor: theme.palette.text.secondary
                },
                gridLines: {
                    display: false,
                    drawBorder: false
                }
            }
        ],
        yAxes: [
            {
                ticks: {
                    fontColor: theme.palette.text.secondary,
                    beginAtZero: true,
                    min: 0
                }
            }
        ],
        tooltips: {
            backgroundColor: theme.palette.background.paper,
            bodyFontColor: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
            borderWidth: 1,
            enabled: true,
            footerFontColor: theme.palette.text.secondary,
            intersect: false,
            mode: 'index',
            titleFontColor: theme.palette.text.primary
        }
    };
    return (
        <div>
            <div>
                <Card {...props}>
                    <CardHeader
                        title="Crimes Per District"
                    />
                    <Divider />
                    <CardContent>
                        <Box
                            sx={{
                                height: 400,
                                position: 'relative'
                            }}
                        >
                            <Bar
                                data={data(crimesPerDistricts,districts)}
                                options={options}
                            />
                        </Box>
                    </CardContent>
                    <Divider />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            p: 2
                        }}
                    >
                    </Box>
                </Card>
            </div>
            <div>
                <Card {...props}>
                    <CardHeader
                        title="Crimes Per Crime Type"
                    />
                    <Divider />
                    <CardContent>
                        <Box
                            sx={{
                                height: 400,
                                position: 'relative'
                            }}
                        >
                            <Bar
                                data={data(crimesPerType,crimeTypes)}
                                options={options}
                            />
                        </Box>
                    </CardContent>
                    <Divider />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            p: 2
                        }}
                    >
                    </Box>
                </Card>
            </div>
            <div>
                <Card {...props}>
                    <CardHeader
                        title="Crimes Per Month"
                    />
                    <Divider />
                    <CardContent>
                        <Box
                            sx={{
                                height: 400,
                                position: 'relative'
                            }}
                        >
                            <Bar
                                data={data(crimesPerMonth,months)}
                                options={options}
                            />
                        </Box>
                    </CardContent>
                    <Divider />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            p: 2
                        }}
                    >
                    </Box>
                </Card>
            </div>
            <div>
                <CustomModal
                    open={modal}
                    handleClose={handleModal}
                    title={modalBody.title}
                >
                    <p className={classes.bodyModal}>{modalBody.message}</p>
                </CustomModal>
            </div>
        </div>
    );
}