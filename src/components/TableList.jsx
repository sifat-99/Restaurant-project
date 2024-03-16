import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import UseLoader from './loader/UseLoader';
import { Button, Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ApiCall from './apiCollection/ApiCall';
import { Link, useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AssignEmployeeToTable from '../components/AssignEmployeeToTable.jsx'
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Swal from 'sweetalert2';

const columns = [
    { id: 'tableNumber', label: 'Table Number', minWidth: '20%' },
    { id: 'totalSeats', label: 'Total Seats', minWidth: '20%' },
    { id: 'bookingStatus', label: 'Booking Status', minWidth: '20%' },
    { id: 'employees', label: 'Employees', minWidth: '20%' },
    { id: 'action', label: 'Action', minWidth: '20%' },
];

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

export default function TableList() {

    const [totalData, setTotalData] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState([]);
    const [loader, showLoader, hideLoader] = UseLoader();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tableInfo, setTableInfo] = useState([]);
    const [assignedEmployees, setAssignedEmployees] = useState([]);
    const navigate = useNavigate();

    const handleDeleteChip = async (tableId) => {
        Swal.fire({
            icon: "info",
            iconColor: '#FF6A00',
            title: "Remove Employee",
            text: "Do you want to remove this employee?",
            showCancelButton: true,
            cancelButtonText: "No",
            confirmButtonColor: "#655CC9",
            confirmButtonText: "Yes",
            
            preConfirm: async () => {
                try {
                    showLoader();
                    const response = await axios.delete(`${ApiCall.baseUrl}EmployeeTable/delete/${tableId}`);
        
                    if (response.status === 204) {
                        const updatedEmployees = assignedEmployees.filter(emp => emp.tableId !== tableId);
                        setAssignedEmployees(updatedEmployees);
                        hideLoader();
                    }
        
                } catch (error) {
                    console.error('Error deleting employee:', error);
                }
                hideLoader();
            }
        });
        
    };

    const openModal = (row) => {
        setTableInfo(row);
        setIsModalOpen(true);

        const fetchData = async () => {
            showLoader();
            try {
                const response = await axios.get(`${ApiCall.baseUrl}Employee/non-assigned-employees/${row.id}`);
                setAssignedEmployees(response.data);
                hideLoader();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    };

    const closeModal = (e, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setIsModalOpen(false);
    };

    const handleDelete = (tableId) => {
        async function removeTable(tableId) {
            try {
                showLoader();
                const response = await axios.delete(`${ApiCall.baseUrl}Table/delete/${tableId}`);

                if (response.status === 204) {
                    const updateRows = rows.filter(row => row?.id !== tableId)
                    setRows(updateRows);
                    
                    navigate("/admin/table-list");
                    hideLoader();
                }
                hideLoader();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            hideLoader();
        }
        removeTable(tableId);
    };

    useEffect(() => {
        const fetchData = async () => {
            showLoader();
            try {
                const response = await axios.get(`${ApiCall.baseUrl}Table/datatable?page=${page + 1}&per_page=${rowsPerPage}`);
                setRows(response.data.data);
                setTotalData(response.data.total);
                hideLoader();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [isModalOpen, page, rowsPerPage, assignedEmployees]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            <Paper className='mainPaperStyle'>
                <div className='page-top'>
                    <div>
                        <span className='under-line page-title'>All Table List</span>
                    </div>
                    <div>
                        <Link to={'/admin/add-table'}>
                            <Button variant="outlined" className='topButtonStyle'>Add Table</Button>
                        </Link>
                    </div>
                </div>
                <div className='mainTableContainer '>
                    <TableContainer className='tableContainerStyle'>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell key={column.id} className='tableHeaderText ellipsText textWidth' style={{ minWidth: column.minWidth }}>
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {(
                                    rows
                                        .map((row, rowIndex) => (
                                            <TableRow key={rowIndex} >

                                                <TableCell align="left" className='tableBodyText'>
                                                    {row?.tableNumber}
                                                </TableCell>
                                                <TableCell align="left" className='tableBodyText'>
                                                    {row?.numberOfSeats}
                                                </TableCell>
                                                <TableCell align="left" className='tableBodyText'>
                                                    {!row?.isOccupied ? "Available" : "Not Available"}
                                                </TableCell>

                                                <TableCell align="left" className='tableBodyText' sx={{
                                                    flexWrap: 'wrap',
                                                    listStyle: 'none',
                                                    padding: 0.5,
                                                    margin: 0,
                                                }}
                                                >
                                                    {row?.employees.map((employee, index) => (
                                                        <ListItem key={index}>
                                                            <Chip
                                                                label={employee.name}
                                                                onDelete={() => handleDeleteChip(employee.employeeTableId)}
                                                                sx={{fontSize: "16px"}}
                                                                className='ellipsText textWidth'
                                                            />
                                                        </ListItem>
                                                    ))}

                                                    <div>
                                                        <IconButton aria-label="add-employees" onClick={() => openModal(row)} >
                                                            <AddCircleOutlineIcon sx={{ color: "#96e399", ":hover": { color: "#4CAF50" } }} />
                                                        </IconButton>

                                                    </div>

                                                </TableCell>
                                                <TableCell align="left" className='tableBodyText'>
                                                    <div>
                                                        <IconButton aria-label="delete" onClick={() => handleDelete(row?.id)}>
                                                            <DeleteIcon className='deleteButtonStyle' />
                                                        </IconButton>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50, 100, { value: totalData, label: 'All' }]}
                        component="div"
                        count={totalData}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage={"Items per page: "}
                        classes={{
                            input: 'MuiTablePagination-input',
                            select: 'MuiTablePagination-select',
                            selectIcon: 'MuiTablePagination-selectIcon',
                        }}
                    />
                    {
                        isModalOpen && <AssignEmployeeToTable open={isModalOpen} handleClose={closeModal} tableInfo={tableInfo} Employees={assignedEmployees} />
                    }
                </div>
            </Paper>
            {loader}
        </>
    );
}



