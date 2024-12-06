import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { saveTraining } from './trainingapi';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import 'dayjs/locale/fi'



export default function AddTraining(props) {
    const [training, setTraining] = useState({
        date: "",
        duration: "",
        activity: "",
        customer: "",
    });

    const [open, setOpen] = useState(false);

    const [customers, setCustomers] = useState([]);
    useEffect(() => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setCustomers(data._embedded.customers);
            })
            .catch(err => {
                console.error('Error fetching customers:', err);
            });
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        saveTraining(training)
            .then(() => {
                props.handleFetch()
                handleClose();
            })
            .catch(err => console.error(err))
    };

    const handleCustomerChange = (event) => {
        setTraining({ ...training, customer: event.target.value });
    };

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                Add Training
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const email = formJson.email;
                        console.log(email);
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Add Training</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fi">
                        <FormControl fullWidth>
                            <MobileDateTimePicker label="Date" onChange={newDate => setTraining({ ...training, date: newDate })} slots={{
                                textField: (params) => (
                                    <TextField
                                        {...params}
                                        margin="dense"
                                        variant="standard"
                                        fullWidth
                                    />
                                ),
                            }}
                            />
                        </FormControl>
                    </LocalizationProvider>
                    <TextField
                        type="number"
                        margin="dense"
                        name="duration"
                        value={training.duration}
                        onChange={event => setTraining({ ...training, duration: event.target.value })}
                        label="Duration"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="activity"
                        value={training.activity}
                        onChange={event => setTraining({ ...training, activity: event.target.value })}
                        label="Activity"
                        fullWidth
                        variant="standard"
                    />
                    <FormControl variant="standard" fullWidth>
                        <InputLabel id="customer-select-label">Customer</InputLabel>
                        <Select
                            labelId="customer-select-label"
                            id="customer-select"
                            value={training.customer}
                            onChange={handleCustomerChange}
                            label="Customer"
                        >
                            {customers.map((customer) => (
                                <MenuItem key={customer._links.self.href} value={customer._links.self.href}>
                                    {customer.lastname} {customer.firstname}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} type="submit">Add</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
