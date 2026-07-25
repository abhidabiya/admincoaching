import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import './main.css';
import { useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconSearch } from '@tabler/icons-react';
import InputAdornment from '@mui/material/InputAdornment';
// import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import axios from 'axios';
import { API_URL } from 'config/constant';
import { ArrowDropDown } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
// import SendIcon from '@mui/icons-material/Send';
// import { useTheme } from '@mui/material/styles';
import ReplyIcon from '@mui/icons-material/Reply';
const columns = [
  { id: 'number', label: 'S.No.', minWidth: 70, align: 'center' },
  { id: 'actions', label: 'Action', minWidth: 100, align: 'center' },
  { id: 'user_name', label: 'User Name', minWidth: 170, align: 'center' },
  { id: 'email', label: 'Email', minWidth: 170, align: 'center' },
  { id: 'message', label: 'Message', minWidth: 100, align: 'center' },
  { id: 'reply_time', label: 'Replied Date & Time', minWidth: 200, align: 'center' },
  { id: 'status', label: 'Status', minWidth: 170, align: 'center' },
  { id: 'date_time', label: 'Create Date & Time', minWidth: 200, align: 'center' }
];

const ManageContact = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [showModal, setShowModal] = useState(false);
  const [showMsgModal, setShowMsgModal] = useState(false);
  //   const [theme] = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [contact_data, setAllContactUsData] = React.useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [email, setUserEmail] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [titleerror, settitleerror] = useState('');
  const [msgerror, setmsgerror] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [name, setUserName] = useState('');
  const [reply, setReply] = useState(null);

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

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setShowMsgModal(false);
    setReply('');
  };

  const fetchData = () => {
    axios
      .get(`${API_URL}get_contact_us`)
      .then((response) => {
        setAllContactUsData(response.data.contact_arr);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  // React.useEffect(() => {
  //   fetchData();
  // }, []);

  const handleAction = (index, action, user) => {
    console.log('user : ', user);

    setAnchorEl(null);
    setSelectedIndex(null);

    if (action === 'reply') {
      setMessage("");
      setTitle("");
      setSelectedUser(user);
      setShowModal(true);

    }

    if (action === 'view') {
      setSelectedUser(user);
      setShowMsgModal(true);
      setReply(user.reply);
      setMessages(user.message);
      setUserEmail(user.email);
      setUserName(user.name);
    }
  };

  const sendReplyEmail = () => {
    let haserror = false;
    if (!title) {
      settitleerror('Please enter title');
      haserror = true;
    }
    if (!message) {
      setmsgerror('Please enter message');
      haserror = true;
    }
    if (haserror) {
      return;
    }
    setShowModal(false);

    if (selectedUser && selectedUser.email) {
      const { email: email, contact_id: contact_id, name } = selectedUser;
      console.log('sendmail', email, name, title, message);
      axios
        .post(API_URL + 'send_mail', { user_email: email, user_name: name, message, title })
        .then((response) => {
          if (response.data.success) {
            axios
              .post(API_URL + 'update_status', { contact_id, message })
              .then(() => {
                const updatedUserDetails = contact_data.map((user) =>
                  user.contact_id === contact_id ? { ...user, status: 1, reply_datetime: new Date() } : user
                );
                fetchData();
                setShowModal(false);
                setError('');
                setTitle('');
                setMessage('');
              })
              .catch((error) => {
                console.log('Error updating user status:', error);
              });
          } else {
            console.log('Failed to send email:', response.data.msg);
          }
        })
        .catch((error) => {
          console.log('Error sending email:', error);
        });
    } else {
      console.log("No user selected or user's email is invalid");
    }
  };

  const filteredContact = contact_data.filter((user) => {
    const lowercasedTerm = searchQuery.toLowerCase();
    const usernameMatch = user.name?.toLowerCase().includes(lowercasedTerm);
    const emailMatch = user.email?.toLowerCase().includes(lowercasedTerm);
    const statusMatch = user.status_lable_filter?.toLowerCase().includes(lowercasedTerm);
    const msgMatch = user.message?.toLowerCase().includes(lowercasedTerm); // Corrected from messagea to message
    const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
    const replydateMatch = user.reply_datetime ? String(user.reply_datetime).toLowerCase().includes(lowercasedTerm) : false;
    return usernameMatch || emailMatch || dateMatch || replydateMatch || statusMatch || msgMatch;
  });

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
          Manage Contact Us
        </p>
      </div>
      <Box alignItems="center" justifyContent="start" display="flex">
        <OutlinedInput
          sx={{ pr: 1, pl: 2, my: 2 }}
          id="input-search-profile"
          placeholder="Search"
          onChange={handleSearch}
          startAdornment={
            <InputAdornment position="start">
              <IconSearch stroke={1.5} size="1rem" />
            </InputAdornment>
          }
          aria-describedby="search-helper-text"
          inputProps={{
            'aria-label': 'weight'
          }}
        />
      </Box>
      <Paper sx={{ width: '100%' }}>
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
              {filteredContact.length > 0 ? (
                filteredContact.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <>
                    {' '}
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell style={{ textAlign: 'center' }}>{row.s_no}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>
                        <Button
                          className="btn btn-primary"
                          aria-label="more"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={(event) => handleClick(event, index)}
                          style={{ width: '120px' }}
                        >
                          Action <ArrowDropDown />
                        </Button>
                        <Menu id="long-menu" anchorEl={anchorEl} keepMounted open={selectedIndex === index} onClose={handleClose}>
                          <MenuItem onClick={() => handleAction(index, 'view', row)} className="menu-icons">
                            <VisibilityIcon style={{ marginRight: '8px' }} />
                            View
                          </MenuItem>
                          <MenuItem onClick={() => handleAction(index, 'reply', row)} className="menu-icons">
                            <ReplyIcon style={{ marginRight: '8px' }} />
                            Reply
                          </MenuItem>
                        </Menu>
                      </TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{row.name ? row.name : 'NA'}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{row.email ? row.email : 'NA'}</TableCell>
                      <TableCell
                        style={{
                          textAlign: 'center',
                          maxWidth: '150px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={row.message}
                      >
                        {row.message != null ? row.message : 'NA'}
                      </TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{row.reply_datetime != null ? row.reply_datetime : 'NA'}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>
                        <p className="pending-btn" style={{ backgroundColor: row.status === 1 ? '#009640' : '#FFC561' }}>
                          {/* {' '} */}
                          {row.status === 1 ? 'Replied' : 'Pending'}
                        </p>
                      </TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{row.createtime}</TableCell>
                    </TableRow>
                  </>
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



        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p
            style={{ marginLeft: '26px', marginTop: '15px' }}
          >{`Showing ${Math.min(filteredContact.length > 0 ? page * rowsPerPage + 1 : 0, filteredContact.length)} to ${Math.min((page + 1) * rowsPerPage, filteredContact.length)} of ${filteredContact.length} entries`}</p>
          <div>
            <button
              onClick={() => handleChangePage(null, page - 1)}
              disabled={page === 0}
              style={{ borderRadius: '4px', marginRight: '10px', background: 'whitesmoke' }}
            >
              {'<'}
            </button>
            <button
              onClick={() => handleChangePage(null, page + 1)}
              disabled={(page + 1) * rowsPerPage >= filteredContact.length}
              style={{ marginRight: '8px', borderRadius: '4px', background: 'whitesmoke' }}
            >
              {'>'}
            </button>
          </div>
        </div>

        {/* Reply Modal */}
        <Modal show={showModal} onHide={handleCloseModal} style={{ zIndex: '99999' }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Send Reply</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={12}>
                <Form>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" placeholder="Enter Email" value={selectedUser?.email} disabled />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        settitleerror('');
                      }}
                    />
                    <p style={{ color: 'red' }}>{titleerror}</p>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Reply</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter Message"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setmsgerror('');
                      }}
                    />
                    <p style={{ color: 'red' }}>{msgerror}</p>
                  </Form.Group>
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                </Form>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" className="btn btn-primary" onClick={sendReplyEmail}>
              Send
            </Button>
          </Modal.Footer>
        </Modal>

        {/* View Messages Modal */}
        <Modal show={showMsgModal} onHide={handleCloseModal} style={{ zIndex: '99999' }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Messages from {selectedUser?.username}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <>
              <p>User Message: {messages != null ? messages : 'No Message'}</p>
              <p>Admin Reply: {reply != null ? reply : 'No Reply'}</p>
            </>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </Paper>
    </>
  );
};

export default ManageContact;
