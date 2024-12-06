import { useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import AddCustomer from "./AddCustomer";
import Snackbar from '@mui/material/Snackbar';
import { Button } from "@mui/material";
import EditCustomer from "./EditCustomer";

function Customer() {

    const [customer, setCustomer] = useState([]);
    const deletedCustomerRef = useRef(null);
    const [open, setOpen] = useState(false);
    const gridApiRef = useRef(null);

    const [colDefs] = useState([
        { field: 'firstname', width: 130, filter: true },
        { field: 'lastname', width: 130, filter: true  },
        { field: 'streetaddress', filter: true  },
        { field: 'postcode', width: 130, filter: true  },
        { field: 'city', width: 130, filter: true  },
        { field: 'email', filter: true },
        { field: 'phone', width: 130, filter: true  },
        {
            width: 130,
            headerClass: "hover",
            field: "remove",
            cellRenderer: params => <Button size="small" color="error" onClick={() => handleDelete(params.data)}>Delete</Button>,
        },
        {
            field: "edit",
            width: 130,
            headerClass: "hover",
            cellRenderer: params => <EditCustomer data={params.data} handleFetch={handleFetch} />,
        }
    ]);

    const handleFetch = () => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers')
            .then(response => {
                return response.json();
            })
            .then(data => {
                setCustomer(data._embedded.customers)
            })
    }

    const handleDelete = (selectedCustomer) => {
        deletedCustomerRef.current = selectedCustomer;
        setOpen(true);
        setCustomer((prevCustomer) =>
            prevCustomer.filter((customer) => customer._links.self.href !== selectedCustomer._links.self.href)
        );
    };


    const handleDeletePerm = () => {
        fetch(deletedCustomerRef.current._links.self.href, { method: "DELETE" })
            .then(response => {
                return response.json();
            })
            .then(() => handleFetch())
        setOpen(false)
    }


    const handleUndo = () => {
        if (deletedCustomerRef.current) {
            setCustomer((prevCustomer) => [...prevCustomer, deletedCustomerRef.current]);
            deletedCustomerRef.current = null;
        }
        setOpen(false);
    }


    const handleReset = () => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/reset', { method: "POST" })
            .then(() => handleFetch())
    }

    const handleExportCsv = () => {
        const exportParams = {
            columnKeys: ['firstname', 'lastname', 'streetaddress', 'postcode', 'city', 'email', 'phone']
        };
        gridApiRef.current.api.exportDataAsCsv(exportParams);
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', justifyContent: 'center', alignItems: 'center' }}>
                <AddCustomer handleFetch={handleFetch} />
                {/* <button onClick={handleReset}>Reset</button> */}
                <Button onClick={handleExportCsv} variant="outlined">
                    Export to CSV
                </Button>
                <div className="ag-theme-material" style={{ height: '35%', width: 1350 }}>
                    <AgGridReact
                        rowData={customer}
                        columnDefs={colDefs}
                        onGridReady={(params) => {
                            handleFetch();
                            gridApiRef.current = params;
                        }} />
                    <Snackbar
                        open={open}
                        message="Customer deleted"
                        autoHideDuration={3000}
                        onClose={handleDeletePerm}
                        action={
                            <Button color="error" size="small" onClick={handleUndo}>Undo</Button>
                        }
                    />
                </div>
            </div>
        </>
    );
}

export default Customer;
