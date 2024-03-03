import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import axios from "axios";
import ApiCall from '../components/apiCollection/ApiCall';
import Avatar from '@mui/material/Avatar';
import DefaultAdminImage from '../assets/img/defaultImg.png'
import '../styles/AssignEmployeeToTable.css';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};



const ModalComponent = ({ open, handleClose, tableInfo, Employees }) => {
    const [personName, setPersonName] = React.useState([]);
    const [names, setNames] = useState([]);

    const EmployeeNames = Employees.map(EmployeesList => EmployeesList.name);
    const EmployeeId = Employees.map(EmployeesList => EmployeesList.employeeId);

    const [assignEmployeeData, setAssignEmployeeData] = useState({
        employeeId: '',
        tableId: '',
      });
    
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        
    };
    console.log(personName)

    const handleAssign = async () => {
        // Handle assign action here
        showLoader();

        try {
            const response = await axios.post(`${ApiCall.baseUrl}EmployeeTable/create-range`, assignEmployeeData);
            console.log(response)

            if (response.status === 200) {
                navigate("/admin/table-list");
                hideLoader();
            }

        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: "",
            });
        }

    };


    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"

        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 700,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: 1

                }}
            >
                <div style={{ padding: "8px 16px !important" }}>
                    <Typography className='bodyText' sx={{
                        textAlign: 'center', paddingTop: "20px !important"
                    }} id="modal-title" variant="h6" component="h2" gutterBottom>
                        Assign Employee To a Table
                    </Typography>

                </div>

                <Box sx={{ padding: "16px 24px 10px  !important" }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: "16px !important" }}>
                        <div style={{ height: "190px", width: "322px", padding: "12px" }}>
                            <img src={!tableInfo?.image ? DefaultAdminImage : `${ApiCall.getTableImage}${tableInfo?.image}`} alt="Table" style={{ width: 200, }} />
                        </div>

                        <div style={{ height: "190px", width: "322px", padding: "12px" }}>
                            <Box >
                                <Typography variant="h6" gutterBottom className='bodyText'>
                                    Table ID: {tableInfo?.id}
                                </Typography>
                                <Typography variant="h6" gutterBottom className='bodyText'>
                                    Number of Seats: {tableInfo?.numberOfSeats}
                                </Typography>


                                <FormControl sx={{ width: 300 }}>
                                    <InputLabel id="demo-multiple-checkbox-label">Select Employee</InputLabel>
                                    <Select
                                        labelId="demo-multiple-checkbox-label"
                                        id="demo-multiple-checkbox"
                                        multiple
                                        value={personName}
                                        onChange={handleChange}
                                        input={<OutlinedInput label="Select Employee" />}
                                        renderValue={(selected) => (
                                            <div style={{ maxHeight: '70px', overflowY: 'auto', scrollbarWidth: 'none' }}>
                                                {selected.map((name) => (
                                                    <div key={name}>{name}</div>
                                                ))}
                                            </div>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                       {/* {EmployeeNames.map((name) => (
                                            <MenuItem key={name} value={name}>
                                                <Checkbox checked={personName.indexOf(name) > -1} />
                                                <ListItemText primary={name} />
                                            </MenuItem> 
                                        ))} */}
                                        {
                                            Employees.map((employee, index) => (
                                                <MenuItem key={index} value={employee.}>
                                                <Checkbox checked={personName.indexOf(name) > -1} />
                                                <ListItemText primary={name} />
                                            </MenuItem> ))

                                        }
                                    </Select>
                                </FormControl>

                            </Box>
                        </div>
                    </div>

                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: "16px 40px" }}>
                    <Button onClick={handleAssign} variant="contained" className='buttonStyle'>
                        Assign
                    </Button>
                    <Button onClick={handleClose} variant="contained" className='buttonStyle' sx={{ ml: 2 }}>
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalComponent;