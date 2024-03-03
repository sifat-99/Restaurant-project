import React, { useState } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import UseLoader from "./loader/UseLoader";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ApiCall from "./apiCollection/ApiCall";
import { Link } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AssignEmployeeToTable from "../components/AssignEmployeeToTable.jsx";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import useTable from "../hooks/useTable.jsx";
import { useDispatch } from "react-redux";
import { deleteDataEntry } from "../hooks/tableSlice.js";

const columns = [
  { id: "tableNumber", label: "Table Number", minWidth: "20%" },
  { id: "totalSeats", label: "Total Seats", minWidth: "20%" },
  { id: "bookingStatus", label: "Booking Status", minWidth: "20%" },
  { id: "employees", label: "Employees", minWidth: "20%" },
  { id: "action", label: "Action", minWidth: "20%" },
];

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));


export default function TableList() {
  // const [totalData, setTotalData] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [rows, setRows] = useState([]);
  const [loader, showLoader, hideLoader] = UseLoader();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableInfo, setTableInfo] = useState([]);
  const [assignedEmployeeList, setAssignedEmployeeList] = useState([]);
  const dispatch = useDispatch();

  const [chipData, setChipData] = React.useState([]);
  console.log(chipData);

  const handleDeleteChip = (chipToDelete) => () => {
    setChipData((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key)
    );
  };

  const openModal = (row) => {
    setTableInfo(row);
    setIsModalOpen(true);

    const fetchData = async () => {
      showLoader();
      try {
        const response = await axios.get(
          `${ApiCall.baseUrl}Employee/non-assigned-employees/${row.id}`
        );
        const employeeNames = response.data.map((employee) => employee.name);
        setAssignedEmployeeList(employeeNames);
        hideLoader();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  };

  const closeModal = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsModalOpen(false);
  };

  const handleDelete = (tableId) => {
    dispatch(deleteDataEntry(tableId));
  };

  const { data: rows, totalData } = useTable(page, rowsPerPage);

  console.log(rows);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Paper className="mainPaperStyle">
        <div className="page-top">
          <div>
            <span className="under-line page-title">All Table List</span>
          </div>
          <div>
            <Link to={"/admin/add-table"}>
              <Button variant="outlined" className="topButtonStyle">
                Add Table
              </Button>
            </Link>
          </div>
        </div>
        <div className="mainTableContainer">
          <TableContainer className="tableContainerStyle">
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className="tableHeaderText"
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell align="left" className="tableBodyText">
                        {row?.tableNumber}
                      </TableCell>
                      <TableCell align="left" className="tableBodyText">
                        {row?.numberOfSeats}
                      </TableCell>
                      <TableCell align="left" className="tableBodyText">
                        {!row?.isOccupied ? "Available" : "Not Available"}
                      </TableCell>

                      <TableCell
                        align="left"
                        className="tableBodyText"
                        sx={{
                          flexWrap: "wrap",
                          listStyle: "none",
                          p: 0.5,
                          m: 0,
                        }}
                        component="ul"
                      >
                        {row?.employees.map((employee, index) => (
                          <ListItem key={index}>
                            <Chip
                              label={employee.name}
                              onDelete={() => handleDeleteChip(employee)}
                            />
                          </ListItem>
                        ))}

                        <div>
                          <IconButton
                            aria-label="add-employees"
                            onClick={() => openModal(row)}
                          >
                            <AddCircleOutlineIcon
                              sx={{
                                color: "#96e399",
                                ":hover": { color: "#4CAF50" },
                              }}
                            />
                          </IconButton>
                        </div>
                      </TableCell>
                      <TableCell align="left" className="tableBodyText">
                        <div>
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleDelete(row?.id)}
                          >
                            <DeleteIcon className="deleteButtonStyle" />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[
              10,
              25,
              50,
              100,
              { value: totalData, label: "All" },
            ]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={"Items per page: "}
            classes={{
              input: "MuiTablePagination-input",
              select: "MuiTablePagination-select",
              selectIcon: "MuiTablePagination-selectIcon",
            }}
          />

          {isModalOpen && (
            <AssignEmployeeToTable
              open={isModalOpen}
              handleClose={closeModal}
              tableInfo={tableInfo}
              EmployeeNames={assignedEmployeeList}
            />
          )}
        </div>
      </Paper>
      {loader}
    </>
  );
}
