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

const columns = [
    { id: 'number', label: 'S.No.', align: 'center' },
    { id: 'actions', label: 'Actions', align: 'center' },
    { id: 'Question', label: 'Question', align: 'center' },
    { id: 'Answer', label: 'Answer', align: 'center' },
    { id: 'date_time', label: 'Create Date & Time', align: 'center' }
];

const ManageFaq = () => {
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
            .get(`${API_URL}get_all_faq`)
            .then((response) => {
                setfaqData(response.data.faq_arr);
            })
            .catch((error) => {
                console.error('Error fetching faq data :', error);
            });
    };
    // React.useEffect(() => {
    //     fetchData();
    // }, []);

    const handleAction = (action, faqData) => {
        if (action === 'Edit') {
            setShowEditModal(true);
            setSelectedIndex(null);
            setEditQuestion(faqData.question);
            setEditAnswer(faqData.answer);
            setFaqDelete(faqData.faq_id);
        } else if (action === 'Delete') {
            setShowDeleteModal(true);
            setFaqDelete(faqData.faq_id);
            setSelectedIndex(null);
        } else if (action === 'view') {
            setShowMsgModal(true);
            setQuestion(faqData.question);
            setAnswer(faqData.answer);
            setSelectedIndex(null);
        }
    };
    const deleteFAQ = () => {
        axios
            .post(`${API_URL}delete_faq`, { faq_id: faqToDelete })
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

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredUsers = faq_data.filter((user) => {
        const lowercasedTerm = searchQuery.toLowerCase();
        const questionMatch = user.question?.toLowerCase().includes(lowercasedTerm);
        const answerMatch = user.answer?.toLowerCase().includes(lowercasedTerm);
        const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
        return questionMatch || dateMatch || answerMatch;
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
                    Manage FAQ's
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
                <Button className="btn btn-primary " onClick={handleShowModal2} style={{ width: '210px' }}>
                <AddIcon />Add FAQ
                    
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
                            {filteredUsers.length > 0 ? (
                                filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        <TableCell style={{ textAlign: 'center' }}>{row.s_no}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
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
                                                <MenuItem onClick={() => handleAction('Edit', row)} className="menu-icons">
                                                    <EditIcon style={{ marginRight: '8px' }} />
                                                    Edit
                                                </MenuItem>
                                                <MenuItem onClick={() => handleAction('Delete', row)} className="menu-icons">
                                                    <DeleteIcon style={{ marginRight: '8px' }} />
                                                    Delete
                                                </MenuItem>
                                            </Menu>
                                        </TableCell>

                                        <TableCell
                                            style={{
                                                textAlign: 'center',
                                                maxWidth: '190px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                            title={row.question}
                                        >
                                            {row.question}
                                        </TableCell>
                                        <TableCell
                                            style={{
                                                textAlign: 'center',
                                                maxWidth: '190px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                            title={row.answer}
                                        >
                                            {row.answer}
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center' }}>{row.createtime}</TableCell>
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
                    <div  style={{ marginRight: '15px' }}>
                        <button onClick={() => handleChangePage(null, page - 1)} disabled={page === 0} style={{ marginRight: '8px' }}>
                            {'<'}
                        </button>
                        <button
                            onClick={() => handleChangePage(null, page + 1)}
                            disabled={(page + 1) * rowsPerPage >= filteredUsers.length}
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
                        <Modal.Title style={{ fontSize: '17px' }}>Add FAQ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Add your form fields here */}
                        <form>
                            <div className="mb-3">
                                <label htmlFor="editCategoryName" className="form-label">
                                    Question
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
                                    Answer
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
                                    Question
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
                                   Answer
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
                            Update
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered style={{marginTop:"-40px"  , overflow:"hidden"}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this FAQ?</Modal.Body>
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

export default ManageFaq;
