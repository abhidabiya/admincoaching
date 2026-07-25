import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
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
import { Modal, Form, Stack, Pagination } from 'react-bootstrap';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';
import axios from 'axios';
import { API_URL } from 'config/constant';

const columns = [
  { id: 'number', label: 'S.No.', align: 'center' },
  { id: 'actions', label: 'Actions', align: 'center' },
  { id: 'Question', label: 'Question', align: 'center' },
  { id: 'Question Type', label: 'Question Type', align: 'center' },
  { id: 'date_time', label: 'Create Date & Time', align: 'center' }
];

const createData = (number, date_time) => {
  return { number, date_time };
};

const ManageQuestion = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const theme = useTheme();
  const [showModal2, setShowModal2] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [homes_data, setAllHomesData] = React.useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ShowEditModal, setShowEditModal] = useState(false);
  const [questionToDelete, sethomesDelete] = useState('');
  const [editQuestion, setEditQuestion] = useState('');
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [editQuestionError, setEditQuestionError] = useState('');
  const [error, setError] = useState('');
  const [addQuestion, setAddQuestion] = useState('');
  const [addQuestionError, setAddQuestionError] = useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [question, setQuestion] = React.useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [addQuestionType, setAddQuestionType] = React.useState('');
  const [addQuestionTypeError, setAddQuestionTypeError] = React.useState('');
  const [editQuestionType, setEditQuestionType] = React.useState('');
  const [editQuestionTypeError, setEditQuestionTypeError] = React.useState('');

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
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  var fetchData = () => {
    axios
      .get(`${API_URL}get_all_question`)
      .then((response) => {
        setAllHomesData(response.data.homes_arr);
      })
      .catch((error) => {
        console.error('Error fetching data :', error);
      });
  };
  React.useEffect(() => {
    fetchData();
  }, []);

  const handleAction = (action, questionData) => {
    if (action === 'Edit') {
      setShowEditModal(true);
      setSelectedIndex(null);
      setEditQuestion(questionData.question);
      setEditQuestionType(questionData.question_type);
      sethomesDelete(questionData.customer_question_id);
    } else if (action === 'Delete') {
      setShowDeleteModal(true);
      sethomesDelete(questionData.customer_question_id);
      setSelectedIndex(null);
    } else if (action === 'view') {
      setShowMsgModal(true);
      setQuestion(questionData.question);
      setSelectedIndex(null);
    }
  };
  const deleteQuestion = () => {
    axios
      .post(`${API_URL}delete_question`, { customer_question_id: questionToDelete })
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

    if (!editQuestionType) {
      setEditQuestionTypeError('Please Enter Question Type');
      hasError = true;
    } else {
      setEditQuestionTypeError('');
    }

    if (hasError) {
      return;
    }

    const data = new FormData();
    data.append('customer_question_id', questionToDelete);
    data.append('question', editQuestion);
    data.append('questionType', editQuestionType);
    axios
      .post(`${API_URL}edit_question`, data)
      .then((response) => {
        if (response.data.key === 'QuestionAlreadyExist' || response.data.key === 'questionNotFound') {
          response.data.key === 'QuestionAlreadyExist' ? setError('Question Already Exists') : setError('Question Not Found');
        } else {
          fetchData();
          setEditQuestion('');

          setShowEditModal(false);
          setEditQuestionError('');
          setError('');
        }
      })
      .catch((error) => {
        console.error('Error updating category:', error);
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

    if (!addQuestionType) {
      setAddQuestionTypeError('Please Select Question Type');
      hasError = true;
    } else {
      setAddQuestionTypeError('');
    }

    if (hasError) {
      return;
    }

    const data = new FormData();
    data.append('question', addQuestion);
    data.append('questionType', addQuestionType);
    axios
      .post(`${API_URL}add_question`, data)
      .then((response) => {
        if (response.data.key === 'QuestionAlreadyExist') {
          setError('Question Already Exists');
        } else {
          setShowModal2(false);
          fetchData();
          setAddQuestion('');
          setAddQuestionError('');
          setAddQuestionTypeError('');
          setAddQuestionType('');
        }
      })
      .catch((error) => {
        console.error('Error adding Question:', error);
      });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // const filteredUsers = homes_data.filter((user) => {
  //   const lowercasedTerm = searchQuery.toLowerCase();
  //   const titleMatch = user.question?.toLowerCase().includes(lowercasedTerm);
  //   const questionTypeMatch = user.question_type_lable?.toLowerCase().includes(lowercasedTerm);
  //   const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
  //   return titleMatch || dateMatch || questionTypeMatch;
  // });

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

  const usersPerPage = 5;

  // const indexOfLastUser = currentPage * usersPerPage;
  // const indexOfFirstUser = indexOfLastUser - usersPerPage;
  // const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  // const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
            fontWeight: ' 500',
            marginBottom:" 5px",
          }}
        >
          Manage Questions
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
          Add Question
          <AddIcon />
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
            {/* <TableBody>
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
                      <Menu id="long-menu" anchorEl={anchorEl} keepMounted open={selectedIndex === index} onClose={handleClose}>
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
                        maxWidth: '250px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      title={row.question}
                    >
                      {row.question}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{row.question_type_lable}</TableCell>
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
            </TableBody> */}
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

        {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p
            style={{ marginLeft: '26px', marginTop: '15px' }}
          >{`Showing ${Math.min(filteredUsers.length > 0 ? page * rowsPerPage + 1 : 0, filteredUsers.length)} to ${Math.min((page + 1) * rowsPerPage, filteredUsers.length)} of ${filteredUsers.length} entries`}</p>
          <div>
            <button onClick={() => handleChangePage(null, page - 1)} disabled={page === 0} style={{ marginRight: '8px', borderRadius:'4px',background:"whitesmoke" }}>
              {'<'}
            </button>
            <button onClick={() => handleChangePage(null, page + 1)} disabled={(page + 1) * rowsPerPage >= filteredUsers.length} style={{borderRadius:'4px',marginRight: '10px' ,background:"whitesmoke"}}>
              {'>'}
            </button>
          </div>
        </div> */}

        <Modal
          show={showModal2}
          onHide={() => {
            setAddQuestionError('');
            setAddQuestion('');
            setError('');
            setAddQuestionTypeError('');
            setAddQuestionType('');
            handleCloseModal2(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Add Question</Modal.Title>
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
                  Select Question Type
                </label>
                <select
                  value={addQuestionType}
                  onChange={(e) => {
                    setAddQuestionType(e.target.value);
                    setAddQuestionTypeError('');
                  }}
                  className="form-control"
                  id="subscriptionType"
                >
                  <option value="" disabled>
                    Select Question Type
                  </option>
                  <option value="0">Yes/No</option>
                  <option value="1">Text</option>
                  <option value="2">Date</option>
                </select>
                <p style={{ color: 'red' }}>{addQuestionTypeError}</p>
              </div>

              {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" className="btn btn-primary " onClick={handleAdd}>
              Add Question
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={ShowEditModal}
          onHide={() => {
            setShowEditModal(false), setEditQuestionError(''), setEditQuestion('');
            setError('');
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Edit Question</Modal.Title>
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
                  placeholder="Enter Question "
                  maxLength={250}
                />
                <p style={{ color: 'red' }}>{editQuestionError}</p>
              </div>

              <div className="mb-3">
                <label htmlFor="editCategoryName" className="form-label">
                  Select Question Type
                </label>
                <select
                  value={editQuestionType}
                  onChange={(e) => {
                    setEditQuestionType(e.target.value);
                    setEditQuestionTypeError('');
                  }}
                  className="form-control"
                  id="subscriptionType"
                >
                  <option value="" disabled>
                    Select Question Type
                  </option>
                  <option value="0">Yes/No</option>
                  <option value="1">Text</option>
                  <option value="2">Date</option>
                </select>
                <p style={{ color: 'red' }}>{editQuestionTypeError}</p>
              </div>

              {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" className="btn btn-primary " onClick={handleEdit}>
              Edit Question
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this Question?</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" className="btn btn-primary" onClick={deleteQuestion}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showMsgModal} onHide={handleCloseModal} style={{ zIndex: '99999' }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>View Question</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <>
              <p>{question != null ? question : 'NA'}</p>
            </>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </Paper>
    </>
  );
};

export default ManageQuestion;
