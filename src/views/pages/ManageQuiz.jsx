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
import { minWidth } from '@mui/system';

const columns = [
    { id: 'number', label: 'S.No.', align: 'center', minWidth: "130px" },
    { id: 'actions', label: 'Actions', align: 'center', minWidth: "150px" },
    { id: 'Question', label: 'Question', align: 'center', minWidth: "130px" },
    { id: 'option1', label: 'Option-1', align: 'center', minWidth: "130px" },
    { id: 'option2', label: 'Option-2', align: 'center', minWidth: "130px" },
    { id: 'option3', label: 'Option-3', align: 'center', minWidth: "130px" },
    { id: 'option4', label: 'Option-4', align: 'center', minWidth: "130px" },
    { id: 'date_time', label: 'Create Date & Time', align: 'center', minWidth: "130px" }
];

const ManageQuiz = () => {
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
    const [editAnswer2, setEditAnswer2] = useState('');
    const [editAnswer3, setEditAnswer3] = useState('');
    const [editAnswer4, setEditAnswer4] = useState('');


    const [editAnswerError, setEditAnswerError] = useState('');
    const [editAnswerError2, setEditAnswerError2] = useState('');
    const [editAnswerError3, setEditAnswerError3] = useState('');
    const [editAnswerError4, setEditAnswerError4] = useState('');

    const [showMsgModal, setShowMsgModal] = useState(false);
    const [editQuestionError, setEditQuestionError] = useState('');
    const [error, setError] = useState('');
    const [addQuestion, setAddQuestion] = useState('');
    const [addQuestionError, setAddQuestionError] = useState('');
    const [addAnswer, setAddAnswer] = useState('');
    const [addAnswerIndex, setAddAnswerIndex] = useState('');

    const [addAnswer2, setAddAnswer2] = useState('');
    const [addAnswer3, setAddAnswer3] = useState('');
    const [addAnswer4, setAddAnswer4] = useState('');
    const [correctAdswer, setCorrectAnswer] = useState('');

    const [addAnswerError, setAddAnswerError] = useState('');
    const [addAnswerError2, setAddAnswerError2] = useState('');
    const [addAnswerError3, setAddAnswerError3] = useState('');
    const [addAnswerError4, setAddAnswerError4] = useState('');
    const [CorrectaddAnswerError4, setCorrectAddAnswerError4] = useState('');


    const [searchQuery, setSearchQuery] = React.useState('');
    const [question, setQuestion] = React.useState('');
    const [answer, setAnswer] = React.useState('');

    const [option1, setOption1] = React.useState('');
    const [option2, setOption2] = React.useState('');
    const [option3, setOption3] = React.useState('');
    const [option4, setOption4] = React.useState('');

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
            .get(`${API_URL}get_all_quiz`)
            .then((response) => {
                setfaqData(response.data.questions);
                console.log("Responce data :", response.data.questions);

            })
            .catch((error) => {
                console.error('Error fetching faq data :', error);
            });
    };
    React.useEffect(() => {
        fetchData();
    }, []);

    const handleAction = (action, faqData) => {
        if (action === 'Edit') {
            setShowEditModal(true);
            setSelectedIndex(null);
            setEditQuestion(faqData.question);
            setEditAnswer(faqData.answer);
            setCorrectAnswer(faqData.correct_answer);
            setAddAnswerIndex(1);
            setEditAnswer(faqData.answers[0].answer);
            setEditAnswer2(faqData.answers[1].answer);
            setEditAnswer3(faqData.answers[2].answer);
            setEditAnswer4(faqData.answers[3].answer);


            setFaqDelete(faqData.question_id);
        } else if (action === 'Delete') {
            setShowDeleteModal(true);
            setFaqDelete(faqData.question_id);
            setSelectedIndex(null);
        } else if (action === 'view') {
            setShowMsgModal(true);
            setQuestion(faqData.question);
            setOption1(faqData.answers[0].answer);
            setOption2(faqData.answers[1].answer);
            setOption3(faqData.answers[2].answer);
            setOption4(faqData.answers[3].answer);
            setCorrectAnswer(faqData.correct_answer);
            setSelectedIndex(null);
        }
    };
    const deleteFAQ = () => {
        // alert("hello", faqToDelete)
        console.log(faqToDelete);

        axios
            .post(`${API_URL}delete_quiz`, { question_id: faqToDelete })
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
            setEditAnswerError('Please enter a quiz option');
            hasError = true;
        } else {
            setEditAnswerError('');
        }

        if (!editAnswer2) {
            setEditAnswerError2('Please enter a quiz option');
            hasError = true;
        } else {
            setEditAnswerError2('');
        }

        if (!editAnswer3) {
            setEditAnswerError3('Please enter a quiz option');
            hasError = true;
        } else {
            setEditAnswerError3('');
        }

        if (!editAnswer4) {
            setEditAnswerError4('Please enter a quiz option');
            hasError = true;
        } else {
            setEditAnswerError4('');
        }



        if (!addAnswerIndex) {
            hasError = true;
        }

        if (addAnswerIndex < 1 || addAnswerIndex > 4) {
            setCorrectAddAnswerError4('Correct answer index must be between 1 and 4');
            hasError = true;
        } else {
            setAddAnswerError4('');
        }







        if (hasError) {
            return;
        }


        // console.log("faqToDelete", faqToDelete);
        // console.log("question", question);
        // console.log("editAnswer", editAnswer);
        // console.log("editAnswer2", editAnswer2);
        // console.log("editAnswer3", editAnswer3);
        // console.log("editAnswer4", editAnswer4);
        // alert("Hello")
        const data = new FormData();
        data.append('question_id', faqToDelete);
        data.append('question', editQuestion);
        data.append('answer1', editAnswer);
        data.append('answer2', editAnswer2);
        data.append('answer3', editAnswer3);
        data.append('answer4', editAnswer4);
        data.append('correctAnswerIndex', addAnswerIndex);


        axios
            .post(`${API_URL}edit_quiz`, data)
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
            setAddQuestionError('Please Enter Quiz Question');
            hasError = true;
        } else {
            setAddQuestionError('');
        }

        if (!addAnswer) {
            setAddAnswerError('Please enter a quiz option');
            hasError = true;
        } else {
            setAddAnswerError('');
        }

        if (!addAnswer2) {
            setAddAnswerError2('Please enter a quiz option');
            hasError = true;
        } else {
            setAddAnswerError2('');
        }

        if (!addAnswer3) {
            setAddAnswerError3('Please enter a quiz option');
            hasError = true;
        } else {
            setAddAnswerError3('');
        }

        if (!addAnswer4) {
            setAddAnswerError4('Please enter a quiz option');
            hasError = true;
        } else {
            setAddAnswerError4('');
        }

        if (!addAnswerIndex) {
            
            hasError = true;
        }

        if (addAnswerIndex < 1 || addAnswerIndex > 4) {
            setCorrectAddAnswerError4('Correct answer index must be between 1 and 4');
            hasError = true;
        } else {
            setAddAnswerError4('');
        }

     


        if (hasError) {
            return;
        }

        const data = new FormData();
        data.append('question', addQuestion);
        data.append('answer1', addAnswer);
        data.append('answer2', addAnswer2);
        data.append('answer3', addAnswer3);
        data.append('answer4', addAnswer4);
        data.append('correctAnswerIndex', addAnswerIndex);


        axios
            .post(`${API_URL}add_quiz`, data)
            .then((response) => {
                if (response.data.key === 'QuizAlreadyExist') {
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
        const answerMatch = user.answers[0].answer?.toLowerCase().includes(lowercasedTerm);
        const answerMatch1 = user.answers[1].answer?.toLowerCase().includes(lowercasedTerm);
        const answerMatch2 = user.answers[2].answer?.toLowerCase().includes(lowercasedTerm);
        const answerMatch3 = user.answers[3].answer?.toLowerCase().includes(lowercasedTerm);
        const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
        return questionMatch || dateMatch || answerMatch || answerMatch1 || answerMatch2 || answerMatch3;
    });

    const handleShowModal2 = () => { 
        setShowModal2(true);
        setAddAnswerError('');
        setAddAnswerError2('');
        setAddAnswerError3('');
        setAddAnswerError4('');
        setCorrectAddAnswerError4('');
        setAddAnswer("");
        setAddAnswer2('');
        setAddAnswer3('');
        setAddAnswer4('');
    }
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
                    Manage Quiz
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
                <Button className="btn" onClick={handleShowModal2} 
                style={{ width: '160px'  , backgroundColor: '#3268f1', color: '#fff' ,marginLeft: '10px' }}
                >
                    <AddIcon />
                    Add Quiz
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
                                        <TableCell style={{ textAlign: 'center' }}>   {row.s_no}   </TableCell>
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
                                            {row.answers[0].answer}
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
                                            {row.answers[1].answer}
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
                                            {row.answers[2].answer}
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
                                            {row.answers[3].answer}
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
                    <div style={{ marginRight: '15px' }}>
                        <button onClick={() => handleChangePage(null, page - 1)} disabled={page === 0} 
                        style={{ marginRight: '8px' , border: '1px solid #bcb9b9', padding: '5px 10px', borderRadius: '4px', color: '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer' , backgroundColor : 'transparent' }}
                        >
                            {'<'}
                        </button>
                        <button
                            onClick={() => handleChangePage(null, page + 1)}
                            disabled={(page + 1) * rowsPerPage >= filteredUsers.length}
                            style={{ border: '1px solid #bcb9b9', padding: '5px 10px', borderRadius: '4px', color: '#fff', cursor: (page + 1) * rowsPerPage >= filteredUsers.length ? 'not-allowed' : 'pointer', backgroundColor: 'transparent' }}
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
                        <Modal.Title style={{color : '#0d0909'}}>Add Quiz</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Add your form fields here */}
                        <form>
                            <div className="mb-3">
                                <label htmlFor="editCategoryName" className="form-label" style={{ color: '#898989' }}>
                                    Quiz Question
                                </label>
                                <input
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
                                <p className='mt-2' style={{ color: 'red' }}>{addQuestionError}</p>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editCategoryName" className="form-label" style={{ color: '#898989' }}>
                                    Option-1
                                </label>
                                <input
                                    type="text"
                                    // value={addAnswer}
                                    onChange={(e) => {
                                        setAddAnswer(e.target.value);
                                        setAddAnswerError('');
                                    }}
                                    className="form-control"
                                    id="editCategoryName"
                                    placeholder="Enter answer "
                                    maxLength={350}
                                />
                                <p className='mt-2' style={{ color: 'red' }}>{addAnswerError}</p>
                            </div>

                            {error && <p style={{ color: 'red' }}>{error}</p>}

                            {/* ***************************************************************************************** */}

                            <div className="mb-3">
                                <label htmlFor="editCategoryName" className="form-label" style={{ color: '#898989' }}>
                                    Option-2
                                </label>
                                <input
                                    type="text"
                                    // value={addAnswer2}
                                    onChange={(e) => {
                                        setAddAnswer2(e.target.value);
                                        setAddAnswerError2('');
                                    }}
                                    className="form-control"
                                    id="editCategoryName"
                                    placeholder="Enter answer "
                                    maxLength={350}
                                />
                                <p className='mt-2' style={{ color: 'red' }}>{addAnswerError2}</p>
                            </div>

                            {error && <p style={{ color: 'red' }}>{error}</p>}


                            <div className="mb-3">
                                <label htmlFor="editCategoryName" className="form-label" style={{ color: '#898989' }}>
                                    Option-3
                                </label>
                                <input
                                    type="text"
                                    // value={addAnswer3}
                                    onChange={(e) => {
                                        setAddAnswer3(e.target.value);
                                        setAddAnswerError3('');
                                    }}
                                    className="form-control"
                                    id="editCategoryName"
                                    placeholder="Enter answer "
                                    maxLength={350}
                                />
                                <p className='mt-2' style={{ color: 'red' }}>{addAnswerError3}</p>
                            </div>

                            {error && <p style={{ color: 'red' }}>{error}</p>}

                            <div className="mb-3">
                                <label htmlFor="editCategoryName" className="form-label" style={{ color: '#898989' }}>
                                    Option-4
                                </label>
                                <input
                                    type="text"
                                    // value={addAnswer4}
                                    onChange={(e) => {
                                        setAddAnswer4(e.target.value);
                                        setAddAnswerError4('');
                                    }}
                                    className="form-control"
                                    id="editCategoryName"
                                    placeholder="Enter answer "
                                    maxLength={350}
                                />
                                <p className='mt-2' style={{ color: 'red' }}>{addAnswerError4}</p>
                            </div>

                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            
                            
                            {/* ***************************************************************************************************** */}
                        </form>
                    </Modal.Body>

                    <Modal.Footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div className="mr-3 ml-0 pl-0 " style={{ flex: 1 }}>
                            <input
                                type="number"
                                style={{ width: "250px" }}
                                min={1}
                                max={1}
                                onChange={(e) => {
                                    let value = e.target.value;
                                    if (value.length > 1) {
                                        value = value.slice(0, 1); // Restrict to 1 digit
                                    }
                                    setAddAnswerIndex(value);
                                    setCorrectAddAnswerError4('');
                                }}
                                className="form-control"
                                id="editCategoryName"
                                placeholder="Enter correct answer"
                            />
{CorrectaddAnswerError4 && <p style={{ color: 'red' }}>{CorrectaddAnswerError4}</p>}
                        </div>

                        <Button variant="primary" className="btn " onClick={handleAdd} style={{ backgroundColor: '#3268f1', color: '#fff' , width: '110px' }}>
                            Save
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
                        <Modal.Title style={{ fontSize: '17px' }}>Edit Quiz</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="editCategoryName" className="form-label">
                                    Quiz Question
                                </label>
                                <input
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
                                    Option-1
                                </label>
                                <input
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

                            <div className="mb-3">
                                <label htmlFor="editCategoryName" className="form-label">
                                Option-2
                                </label>
                                <input
                                    type="text"
                                    value={editAnswer2}
                                    onChange={(e) => {
                                        setEditAnswer2(e.target.value);
                                        setEditAnswerError2('');
                                    }}
                                    className="form-control"
                                    id="editCategoryName"
                                    placeholder="Enter Answer "
                                    maxLength={350}
                                />
                                <p style={{ color: 'red' }}>{editAnswerError2}</p>
                            </div>
                            {error && <p style={{ color: 'red' }}>{error}</p>}


                            <div className="mb-3">
                                <label htmlFor="editCategoryName" className="form-label">
                                Option-3
                                </label>
                                <input
                                    type="text"
                                    value={editAnswer3}
                                    onChange={(e) => {
                                        setEditAnswer3(e.target.value);
                                        setEditAnswerError3('');
                                    }}
                                    className="form-control"
                                    id="editCategoryName"
                                    placeholder="Enter Answer "
                                    maxLength={350}
                                />
                                <p style={{ color: 'red' }}>{editAnswerError3}</p>
                            </div>
                            {error && <p style={{ color: 'red' }}>{error}</p>}

                            <div className="mb-3">
                                <label htmlFor="editCategoryName" className="form-label">
                                Options-4
                                </label>
                                <input
                                    type="text"
                                    value={editAnswer4}
                                    onChange={(e) => {
                                        setEditAnswer4(e.target.value);
                                        setEditAnswerError4('');
                                    }}
                                    className="form-control"
                                    id="editCategoryName"
                                    placeholder="Enter Answer "
                                    maxLength={350}
                                />
                                <p style={{ color: 'red' }}>{editAnswerError4}</p>
                            </div>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </form>
                    </Modal.Body>
                    <Modal.Footer>

                    <div className="mr-3 ml-0 pl-0 " style={{ flex: 1 }}>
                            <input
                                type="number"
                                style={{ width: "250px" }}
                                min={1}
                                max={1}
                                value={addAnswerIndex}
                                onChange={(e) => {
                                    let value = e.target.value;
                                    if (value.length > 1 ) {
                                        value = value.slice(0, 1); // Restrict to 1 digit
                                    }
                                    setAddAnswerIndex(value);
                                    setCorrectAddAnswerError4('');
                                }}
                                className="form-control"
                                id="editCategoryName"
                                placeholder="Enter correct answer"
                            />
                              {CorrectaddAnswerError4 && <p style={{ color: 'red' }}>{CorrectaddAnswerError4}</p>}
                        </div>



                        <Button variant="primary" className="btn btn-primary " onClick={handleEdit}>
                            Update
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this Quiz?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" className="btn btn-primary" onClick={deleteFAQ}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showMsgModal} onHide={handleCloseModal} style={{ zIndex: '99999' }}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontSize: '17px' }}>View Quiz </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <>
                            <p>Question : {question != null ? question : 'NA'}</p>
                            <p>Option-1 : {option1 != null ? option1 : 'NA'}</p>
                            <p>Option-2 : {option2 != null ? option2 : 'NA'}</p>
                            <p>Option-3 : {option3 != null ? option3 : 'NA'}</p>
                            <p>Option-4 : {option4 != null ? option4 : 'NA'}</p>
                            <p>Correct Option : {correctAdswer != null ? correctAdswer : 'NA'}</p>

                        </>
                    </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                </Modal>
            </Paper>
        </>
    );
};

export default ManageQuiz;
