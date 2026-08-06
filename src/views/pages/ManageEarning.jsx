/* eslint-disable react/no-unescaped-entities */
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { ArrowDropDown } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './main.css';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconSearch } from '@tabler/icons-react';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';
import axios from 'axios';
import { API_URL } from 'config/constant';
import { APP_PREFIX_PATH } from 'config/constant';
import { useNavigate } from "react-router-dom";
import { encode as base64_encode } from 'base-64';
import { minWidth, width } from '@mui/system';

// excle
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const columns = [

    { id: 'S_No', label: 'S.No.', align: 'center',  },
    // { id: 'actions', label: 'Actions', minWidth: 150, align: 'center' },
    { id: 'name', label: 'Name', align: 'center' , minWidth: "170px" },
    { id: 'email', label: 'Course Name', align: 'center' , minWidth: "150px"},
    // { id: 'password', label: 'Password', align: 'center' },
    { id: 'society', label: 'Amount',  align: 'center', minWidth: "130px" },
    { id: 'Building', label: 'Payment Mode', align: 'center' , minWidth: "130px"},
    // { id: 'role', label: 'Role', align: 'center' },
    { id: 'role', label: 'Payment Date', align: 'center' },
    { id: 'number', label: 'Duration', minWidth: 170, align: 'center' },
    { id: 'date_time', label: 'Create Date & Time', minWidth: "180px", align: 'center' }
];


const ManageEarning = () => {

    const navigate = useNavigate();

    const randomData = [
        {
            SNo: 1,
            Name: "Alejandro Gómez",
            Email: "alejandro.gomez@example.com",
            TransactionID: "TXN123456",
            Points: "1 hour",
            Number: "Z1-001",
            Earning: "2050",
            CreateDateTime: "25-01-2025 12:28 AM"
        },
        {
            SNo: 2,
            Name: "Sophia Müller",
            Email: "sophia.muller@example.de",
            TransactionID: "TXN789012",
            Points: "2 hours",
            Number: "P2-040",
            Earning: "3575",
            CreateDateTime: "14-02-2025 10:28 AM"
        },
        {
            SNo: 3,
            Name: "Hiroshi Tanaka",
            Email: "hiroshi.tanaka@example.jp",
            TransactionID: "TXN345678",
            Points: "9 hours",
            Number: "K1-123",
            Earning: "1000",
            CreateDateTime: "15-02-2025 11:28 AM"
        },
        {
            SNo: 4,
            Name: "Isabelle Dupont",
            Email: "isabelle.dupont@example.fr",
            TransactionID: "TXN567890",
            Points: "3 hours",
            Number: "Z3-004",
            Earning: "5025",
            CreateDateTime: "24-01-2025 10:28 AM"
        },
        {
            SNo: 5,
            Name: "Luca Rossi",
            Email: "luca.rossi@example.it",
            TransactionID: "TXN678901",
            Points: "4 hours",
            Number: "A2-009",
            Earning: "2580",
            CreateDateTime: "14-02-2025 10:28 AM"
        }
    ];

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    const theme = useTheme();
    const [showModal2, setShowModal2] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const [faq_data, setfaqData] = React.useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [ShowEditModal, setShowEditModal] = useState(false);
    const [faqToDelete, setFaqDelete] = useState('');
    const [guardedit, setGuardedit] = useState('');

    const [editQuestion, setEditQuestion] = useState('');
    const [editAnswer, setEditAnswer] = useState('');
    const [editAnswerError, setEditAnswerError] = useState('');
    const [showMsgModal, setShowMsgModal] = useState(false);
    const [editQuestionError, setEditQuestionError] = useState('');
    const [error, setError] = useState('');
    const [addQuestion, setAddQuestion] = useState('');
    const [addQuestionError, setAddQuestionError] = useState('');
    const [addAnswer, setAddAnswer] = useState('');
    const [addAnswerError, setAddAnswerError] = useState('');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [question, setQuestion] = React.useState('');
    const [answer, setAnswer] = React.useState('');
    const handleClick = (event, index) => {
        setAnchorEl(event.currentTarget);
        setSelectedIndex(index);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setSelectedIndex(null);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    var fetchData = () => {
        axios
            .get(`${API_URL}get_all_guard`)
            .then((response) => {
                // setfaqData(response.data.user_arr);
                console.log("Guard Data :-", response.data.user_arr)
            })
            .catch((error) => {
                console.error('Error fetching faq data :', error);
            });
    };
    React.useEffect(() => {
        fetchData();
        setfaqData(randomData);
    }, []);

    const handleAction = (action, faqData) => {
        if (action === 'Edit') {
            var sub = faqData.user_id;
            var id = base64_encode(sub.toString());
            navigate(APP_PREFIX_PATH + `/edit-guard/${id}`);
            // navigate(APP_PREFIX_PATH + "/edit-guard")



        } else if (action === 'Delete') {
            setShowDeleteModal(true);
            setFaqDelete(faqData.user_id);
            setSelectedIndex(null);
        } else if (action === 'view') {
            var sub = faqData.user_id;
            var id = base64_encode(sub.toString());
            navigate(APP_PREFIX_PATH + `/view-guard/${id}`);
        }
    };
    const deleteFAQ = () => {
        axios
            .post(`${API_URL}delete_guard`, { user_id: faqToDelete })
            .then((response) => {
                if (response.data.success) {
                    setShowDeleteModal(false);
                    fetchData();
                } else {
                    console.error('Error deleting category:', response.data.message);
                }
            })
            .catch((error) => {
                console.error('Error deleting category:', error);
            });
    };

    const handleEdit = (e) => {
        e.preventDefault();

        let hasError = false;

        if (!editQuestion) {
            setEditQuestionError('Please Enter Question');
            hasError = true;
        } else {
            setEditQuestionError('');
        }

        if (!editAnswer) {
            setEditAnswerError('Please Enter Answer');
            hasError = true;
        } else {
            setEditAnswerError('');
        }

        if (hasError) {
            return;
        }

        const data = new FormData();
        data.append('faq_id', faqToDelete);
        data.append('question', editQuestion);
        data.append('answer', editAnswer);

        axios
            .post(`${API_URL}edit_faq`, data)
            .then((response) => {
                if (response.data.key === 'faqAlreadyExist' || response.data.key === 'faqNotFound') {
                    response.data.key === 'faqAlreadyExist' ? setEditQuestionError('Question Already Exists') : setError('FAQ Not Found');
                } else {
                    fetchData();
                    setEditQuestion('');
                    setEditAnswer('');
                    setEditAnswerError('');
                    setShowEditModal(false);
                    setEditQuestionError('');
                    setError('');
                }
            })
            .catch((error) => {
                console.error('Error updating faq:', error);
                setError('Error updating category.');
            });
    };

    const handleAdd = (e) => {
        e.preventDefault();

        let hasError = false;

        if (!addQuestion) {
            setAddQuestionError('Please Enter Question');
            hasError = true;
        } else {
            setAddQuestionError('');
        }

        if (!addAnswer) {
            setAddAnswerError('Please Enter Answer');
            hasError = true;
        } else {
            setAddAnswerError('');
        }

        if (hasError) {
            return;
        }

        const data = new FormData();
        data.append('question', addQuestion);
        data.append('answer', addAnswer);
        axios
            .post(`${API_URL}add_faq`, data)
            .then((response) => {
                if (response.data.key === 'FaqAlreadyExist') {
                    setAddQuestionError('Question Already Exists');
                } else {
                    setShowModal2(false);
                    fetchData();
                    setAddQuestion('');
                    setAddQuestionError('');
                    setAddAnswer('');
                    setAddAnswerError('');
                }
            })
            .catch((error) => {
                console.error('Error adding FAQ:', error);
            });
    };


    // const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    // const currentItemsall = data;

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            randomData.map((user, index) => ({
                'S. No.': 1,
                Name: user.Name,
                Email: user.Email,
                TransactionID: user.TransactionID,
                Points: user.Points,
                Number: user.Number,
                Earning: user.Earning,
                // Total_Earnings: user.Total_Earnings,
                Create_Date_Time: user.CreateDateTime

                // 'Create Date & Time': formatDate(user.createtime)
            }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'UserReport');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'EarningReport.xlsx');
    };


    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredUsers = randomData.filter((user) => {
        const lowercasedTerm = searchQuery.toLowerCase();
        const nameMatch = user.Name?.toLowerCase().includes(lowercasedTerm);
        const roleMatch = user.Email?.toLowerCase().includes(lowercasedTerm);
        const societyMatch = user.TransactionID?.toLowerCase().includes(lowercasedTerm);
        // const wingMatch = user.Points?.toLowerCase().includes(lowercasedTerm);
        const numberMatch = user.Earning ? String(user.Earning).toLowerCase().includes(lowercasedTerm) : false;
        const NumberMatch = user.Number ? String(user.Number).toLowerCase().includes(lowercasedTerm) : false;
        const PointsMatch = user.Points ? String(user.Points).toLowerCase().includes(lowercasedTerm) : false;

        const dateMatch = user.CreateDateTime ? String(user.CreateDateTime).toLowerCase().includes(lowercasedTerm) : false;
        return nameMatch || roleMatch || societyMatch || PointsMatch || numberMatch || NumberMatch || dateMatch;
    });

    const handleShowModal2 = () => setShowModal2(true);
    const handleCloseModal2 = () => {
        setShowModal2(false);
        setAddQuestionError('');
        setAddQuestion('');
        setAddress(''), setAddressError('');
    };

    const handleCloseModal = () => {
        setShowMsgModal(false);
        setQuestion('');
    };
    return (
        <>
            <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
                <p
                    style={{
                        // margin: '2px',
                        fontSize: '1.25rem',
                        color: '#121926',
                        fontWeight: '600',
                        fontFamily: 'Poppins',
                        lineHeight: '1.167',
                        // fontWeight: ' 500',
                        marginBottom: ' 5px'
                    }}
                >
                    Manage Earning
                </p>
            </div>
            <Box alignItems="center" justifyContent="space-between" display="flex" className="mobile-res">
                <OutlinedInput
                    sx={{ pr: 1, pl: 2, my: 2 }}
                    id="input-search-profile"
                    onChange={handleSearch}
                    placeholder="Search"
                    startAdornment={
                        <InputAdornment position="start">
                            <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                        </InputAdornment>
                    }
                    aria-describedby="search-helper-text"
                    inputProps={{
                        'aria-label': 'weight'
                    }}
                />
                <Button className="btn" onClick={exportToExcel} 
                style={{ width: '180px'  , backgroundColor: '#3268f1', color: '#fff' ,marginLeft: '10px' }}
                 >
                    <AddIcon />
                    Export to Excel
                </Button>
            </Box>
            <Paper sx={{ width: '100%', marginTop: '20px' }}>
                {/* <SearchSection /> */}
                <TableContainer sx={{ maxHeight: 640 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {randomData.length > 0 ? (
                                filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        <TableCell style={{ textAlign: 'center' }}>{row.SNo}</TableCell>
                                        {/* <TableCell style={{ textAlign: 'center' }}>
                                            <Button
                                                className="btn btn-primary"
                                                aria-label="more"
                                                aria-controls="long-menu"
                                                aria-haspopup="true"
                                                onClick={(event) => handleClick(event, index)}
                                            >
                                                Actions <ArrowDropDown />
                                            </Button>
                                            <Menu
                                                id="long-menu"
                                                anchorEl={anchorEl}
                                                keepMounted
                                                open={selectedIndex === index}
                                                onClose={handleClose}
                                            >
                                                <MenuItem onClick={() => handleAction('view', row)} className="menu-icons">
                                                    <VisibilityIcon style={{ marginRight: '8px' }} />
                                                    View
                                                </MenuItem>
                                                <MenuItem 
                                                onClick={() => handleAction('Edit', row)} 
                                                // onClick={() => navigate(APP_PREFIX_PATH + "/edit-guard")}
                                                className="menu-icons">
                                                    <EditIcon style={{ marginRight: '8px' }} />
                                                    Edit
                                                </MenuItem>
                                                <MenuItem onClick={() => handleAction('Delete', row)} className="menu-icons">
                                                    <DeleteIcon style={{ marginRight: '8px' }} />
                                                    Delete
                                                </MenuItem>
                                            </Menu>
                                        </TableCell> */}


                                        <TableCell style={{ textAlign: 'center' }}>{row.Name}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>{row.Email}</TableCell>
                                        {/* <TableCell style={{ textAlign: 'center' }}>{row.password}</TableCell> */}

                                        <TableCell style={{ textAlign: 'center' }}>{row.TransactionID}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>{row.Points}</TableCell>
                                        {/* <TableCell style={{ textAlign: 'center' }}>{row.role === 1 ? "Security Guard" : row.role === 2 ? "Gate Guard" : "Unknown Role"}</TableCell> */}
                                        <TableCell style={{ textAlign: 'center' }}>{row.Number}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}> {row.Earning} </TableCell>

                                        <TableCell style={{ textAlign: 'center' }}>{row.CreateDateTime}</TableCell>

                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '20px' }}>
                                        No Data Available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* <TablePagination
          labelRowsPerPage={
            filteredUsers.length > 0
              ? `Showing ${indexOfFirstUser + 1} to ${Math.min(indexOfLastUser, filteredUsers.length)} of ${filteredUsers.length} entries`
              : 'No entries to show'
          }
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) => `${from} - ${to} of ${count}`}
          rowsPerPageOptions={[5, 10, 25, 100]}
        /> */}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p
                        style={{ marginLeft: '26px', marginTop: '15px' }}
                    >{`Showing ${Math.min(filteredUsers.length > 0 ? page * rowsPerPage + 1 : 0, filteredUsers.length)} to ${Math.min((page + 1) * rowsPerPage, filteredUsers.length)} of ${filteredUsers.length} entries`}</p>
                    <div style={{ marginRight: '15px' }}>
                        <button onClick={() => handleChangePage(null, page - 1)} disabled={page === 0} 
                        style={{ marginRight: '8px' , border: '1px solid #bcb9b9', padding: '5px 10px', borderRadius: '4px', color: '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer' , backgroundColor : 'transparent' }}
                        >
                            {'<'}
                        </button>
                        <button
                            onClick={() => handleChangePage(null, page + 1)}
                            disabled={(page + 1) * rowsPerPage >= filteredUsers.length}
                            style={{ border: '1px solid #bcb9b9', padding: '5px 10px', borderRadius: '4px', color: '#fff', cursor: (page + 1) * rowsPerPage >= filteredUsers.length ? 'not-allowed' : 'pointer' , backgroundColor : 'transparent' }}
                        >
                            {'>'}
                        </button>
                    </div>
                </div>

                <Modal
                    show={showModal2}
                    onHide={() => {
                        setAddQuestionError('');
                        setAddQuestion('');
                        setError('');
                        setAddAnswerError('');
                        setAddAnswer('');
                        handleCloseModal2(false);

                        // setAddAnswerError('')
                    }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontSize: '17px' }}>Add Guard</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Add your form fields here */}
                        <form>
                            <div className="mb-3">
                                <label htmlFor="editCategoryName" className="form-label">
                                    Enter Question
                                </label>
                                <textarea
                                    type="text"
                                    value={addQuestion}
                                    onChange={(e) => {
                                        setAddQuestion(e.target.value);
                                        setAddQuestionError('');
                                    }}
                                    className="form-control"
                                    id="editCategoryName"
                                    placeholder="Enter Question "
                                    maxLength={250}
                                />
                                <p style={{ color: 'red' }}>{addQuestionError}</p>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="editCategoryName" className="form-label">
                                    Enter Answer
                                </label>
                                <textarea
                                    type="text"
                                    value={addAnswer}
                                    onChange={(e) => {
                                        setAddAnswer(e.target.value);
                                        setAddAnswerError('');
                                    }}
                                    className="form-control"
                                    id="editCategoryName"
                                    placeholder="Enter answer "
                                    maxLength={350}
                                />
                                <p style={{ color: 'red' }}>{addAnswerError}</p>
                            </div>

                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" className="btn btn-primary " onClick={handleAdd}>
                            Add FAQ
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal
                    show={ShowEditModal}
                    onHide={() => {
                        setShowEditModal(false), setEditQuestionError(''), setEditQuestion('');
                        setEditAnswer(''), setEditAnswerError('');
                        setError('');
                    }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontSize: '17px' }}>Edit FAQ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="editCategoryName" className="form-label">
                                    Enter Question
                                </label>
                                <textarea
                                    type="text"
                                    value={editQuestion}
                                    onChange={(e) => {
                                        setEditQuestion(e.target.value);
                                        setEditQuestionError('');
                                    }}
                                    className="form-control"
                                    id="editCategoryName"
                                    placeholder="Enter Question"
                                    maxLength={250}
                                />
                                <p style={{ color: 'red' }}>{editQuestionError}</p>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editCategoryName" className="form-label">
                                    Enter Answer
                                </label>
                                <textarea
                                    type="text"
                                    value={editAnswer}
                                    onChange={(e) => {
                                        setEditAnswer(e.target.value);
                                        setEditAnswerError('');
                                    }}
                                    className="form-control"
                                    id="editCategoryName"
                                    placeholder="Enter Answer "
                                    maxLength={350}
                                />
                                <p style={{ color: 'red' }}>{editAnswerError}</p>
                            </div>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" className="btn btn-primary " onClick={handleEdit}>
                            Edit FAQ
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this Guard?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" className="btn btn-primary" onClick={deleteFAQ}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showMsgModal} onHide={handleCloseModal} style={{ zIndex: '99999' }}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontSize: '17px' }}>View FAQ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <>
                            <p>Question : {question != null ? question : 'NA'}</p>
                            <p>Answer : {answer != null ? answer : 'NA'}</p>
                        </>
                    </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                </Modal>
            </Paper>
        </>
    );
};

export default ManageEarning;
