import { useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import dayjs from 'dayjs';
import './Training.css'
import Snackbar from '@mui/material/Snackbar';
import { Button } from "@mui/material";
import AddTraining from "./AddTraining";

function Training() {

    const [training, setTraining] = useState([]);
    const deletedTrainingRef = useRef(null);
    const [open, setOpen] = useState(false);

    const [colDefs] = useState([
        {
            field: 'date',
            valueFormatter: (params) => {
                return dayjs(params.value).format('DD.MM.YYYY HH.MM');
            }, filter: true
        },
        { field: 'duration', filter: true },
        { field: 'activity', filter: true },
        {
            field: 'customerFullName',
            filter: true,
            headerName: 'Customer',
            valueGetter: params => {
                const customer = params.data.customer;
                return customer ? `${customer.firstname} ${customer.lastname}` : 'N/A';
            },
        },
        {
            width: 130,
            headerClass: "hover",
            field: "remove",
            cellRenderer: params => <Button size="small" color="error" onClick={() => handleDelete(params.data)}>Delete</Button>
        },

    ]);

    const handleFetch = () => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings')
            .then(response => {
                return response.json();
            })
            .then(data => {
                setTraining(data)
            })
    }

    const handleDelete = (selectedTraining) => {
        deletedTrainingRef.current = selectedTraining;
        setOpen(true);
        setTraining((prevTraining) =>
            prevTraining.filter((training) => training !== selectedTraining)
        );
    };


    const handleDeletePerm = () => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings/' + deletedTrainingRef.current.id, { method: "DELETE" })
            .then(response => {
                return response.json();
            })
            .then(() => handleFetch())
        setOpen(false)
    }


    const handleUndo = () => {
        if (deletedTrainingRef.current) {
            setTraining((prevTraining) => [...prevTraining, deletedTrainingRef.current]);
            deletedTrainingRef.current = null;
        }
        setOpen(false);
    }

    return (
        <>
            <AddTraining handleFetch={handleFetch} />
            <div className="ag-theme-material" style={{ height: 500, width: 960 }}>
                <AgGridReact
                    rowData={training}
                    columnDefs={colDefs}
                    onGridReady={handleFetch} />
                <Snackbar
                    open={open}
                    message="Training deleted"
                    autoHideDuration={3000}
                    onClose={handleDeletePerm}
                    action={
                        <Button color="error" size="small" onClick={handleUndo}>Undo</Button>
                    }
                />
            </div>
        </>
    );
}

export default Training;
