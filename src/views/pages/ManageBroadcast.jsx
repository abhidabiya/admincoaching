import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import { Row, Col, Form, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import { API_URL } from 'config/constant';
import axios from 'axios';

const ManageBroadcast = () => {
  const [value, setValue] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(0); // 0: All Users, 1: Select Users, 2: All Guards, 3: Select Guards
  const [users, setUsers] = useState([]);
  const [guards, setGuards] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedGuards, setSelectedGuards] = useState([]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const contentTypes = {
    allUsers: 0,
    specificUsers: 1,
    allGuards: 2,
    specificGuards: 3,
  };

  // Validate fields based on the current tab
  const validateFields = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Please enter title';
    }
    if (!message.trim()) {
      newErrors.message = 'Please enter message';
    }
    if (content === contentTypes.specificUsers && selectedUsers.length === 0) {
      newErrors.selectedUsers = 'Please select at least one user';
    }
    if (content === contentTypes.specificGuards && selectedGuards.length === 0) {
      newErrors.selectedGuards = 'Please select at least one guard';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch users and guards
  useEffect(() => {
    axios
      .get(`${API_URL}Users`)
      .then((response) => {
        const userOptions = response.data.res.map((user) => ({
          value: user.user_id,
          label: user.f_name + ' ' + user.l_name,
        }));
        setUsers(userOptions);
      })
      .catch((error) => {
        console.error('There was an error fetching the users!', error);
      });

    axios
      .get(`${API_URL}guards`)
      .then((response) => {
        const guardOptions = response.data.res.map((guard) => ({
          value: guard.user_id,
          label: guard.name,
        }));
        setGuards(guardOptions);
      })
      .catch((error) => {
        console.error('There was an error fetching the guards!', error);
      });
  }, []);

  // Handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setContent(newValue); // Update content state based on the selected tab
    setTitle(''); // Reset title
    setMessage(''); // Reset message
    setErrors({}); // Reset errors
    setSelectedUsers([]); // Reset selected users
    setSelectedGuards([]); // Reset selected guards
  };

  // Send broadcast message
  const SendBroadcast = () => {
    if (!validateFields()) return;

    const data = {
      action: 'send',
      subject: title,
      message,
      select_arr:
        content === contentTypes.specificUsers
          ? JSON.stringify(selectedUsers.map((user) => user.value))
          : content === contentTypes.specificGuards
          ? JSON.stringify(selectedGuards.map((guard) => guard.value))
          : '[]',
      userType:
        content === contentTypes.allUsers
          ? 'all'
          : content === contentTypes.specificUsers
          ? 'user'
          : content === contentTypes.allGuards
          ? 'all_guard'
          : 'specific_guard',
    };

    setIsButtonDisabled(true);
    axios
      .post(`${API_URL}send_broadcast`, data)
      .then(() => {
        setModalShow(true);
        setModalMessage('Broadcast message sent successfully');
        setModalTitle('Broadcast Message');
        setSelectedUsers([]);
        setSelectedGuards([]);
        setMessage('');
        setTitle('');
        setErrors({});
      })
      .catch(() => {
        setModalShow(true);
        setModalMessage('Error sending broadcast message');
        setModalTitle('Error');
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  return (
    <>
      <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
        <p
          style={{
            fontSize: '1.25rem',
            color: '#121926',
            fontWeight: '600',
            fontFamily: 'Poppins',
            lineHeight: '1.167',
            marginBottom: '5px',
          }}
        >
          Manage Broadcast
        </p>
      </div>
      <MainCard>
        <Tabs value={value} onChange={handleChange} textColor="secondary" indicatorColor="secondary" aria-label="secondary tabs example">
          <Tab label="All Users" />
          <Tab label="Select Users" />
          <Tab label="All Guards" />
          <Tab label="Select Guards" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Row>
            <Col md={12}>
              <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Title</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="text"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setErrors({ ...errors, title: '' });
                      }}
                      isInvalid={!!errors.title}
                    />
                    {errors.title && <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>}
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Message</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      as="textarea"
                      placeholder="Enter your message"
                      rows={3}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setErrors({ ...errors, message: '' });
                      }}
                      isInvalid={!!errors.message}
                    />
                    {errors.message && <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>}
                  </Col>
                </Form.Group>
                <Button className="btn btn-primary" type="button" onClick={SendBroadcast} disabled={isButtonDisabled}  >
                  Submit
                </Button>
              </Form>
            </Col>
          </Row>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Row>
            <Col md={12}>
              <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlSelect1">
                  <Form.Label>Select Users</Form.Label>
                  <Col sm={10}>
                    <Select
                      isMulti
                      options={users}
                      value={selectedUsers}
                      onChange={(e) => {
                        setSelectedUsers(e);
                        setErrors({ ...errors, selectedUsers: '' });
                      }}
                      isInvalid={!!errors.selectedUsers}
                      placeholder="Select users"
                    />
                    {errors.selectedUsers && (
                      <Form.Control.Feedback type="invalid" style={{ display: 'block', color: 'red' }}>
                        {errors.selectedUsers}
                      </Form.Control.Feedback>
                    )}
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Title</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="text"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setErrors({ ...errors, title: '' });
                      }}
                      isInvalid={!!errors.title}
                    />
                    {errors.title && <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>}
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Message</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      as="textarea"
                      placeholder="Enter your message"
                      rows={3}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setErrors({ ...errors, message: '' });
                      }}
                      isInvalid={!!errors.message}
                    />
                    {errors.message && <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>}
                  </Col>
                </Form.Group>
                <Button className="btn btn-primary" type="button" onClick={SendBroadcast} disabled={isButtonDisabled}>
                  Send
                </Button>
              </Form>
            </Col>
          </Row>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Row>
            <Col md={12}>
              <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Title</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="text"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setErrors({ ...errors, title: '' });
                      }}
                      isInvalid={!!errors.title}
                    />
                    {errors.title && <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>}
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Message</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      as="textarea"
                      placeholder="Enter your message"
                      rows={3}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setErrors({ ...errors, message: '' });
                      }}
                      isInvalid={!!errors.message}
                    />
                    {errors.message && <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>}
                  </Col>
                </Form.Group>
                <Button className="btn"  type="button" onClick={SendBroadcast} disabled={isButtonDisabled}  
                //  style={{ backgroundColor: '#3268f1', color: '#fff' }}
                  >
                  Submit
                </Button>
              </Form>
            </Col>
          </Row>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Row>
            <Col md={12}>
              <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlSelect1">
                  <Form.Label>Select Guards</Form.Label>
                  <Col sm={10}>
                    <Select
                      isMulti
                      options={guards}
                      value={selectedGuards}
                      onChange={(e) => {
                        setSelectedGuards(e);
                        setErrors({ ...errors, selectedGuards: '' });
                      }}
                      isInvalid={!!errors.selectedGuards}
                      placeholder="Select guards"
                    />
                    {errors.selectedGuards && (
                      <Form.Control.Feedback type="invalid" style={{ display: 'block', color: 'red' }}>
                        {errors.selectedGuards}
                      </Form.Control.Feedback>
                    )}
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Title</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="text"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setErrors({ ...errors, title: '' });
                      }}
                      isInvalid={!!errors.title}
                    />
                    {errors.title && <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>}
                  </Col>
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Message</Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      as="textarea"
                      placeholder="Enter your message"
                      rows={3}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setErrors({ ...errors, message: '' });
                      }}
                      isInvalid={!!errors.message}
                    />
                    {errors.message && <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>}
                  </Col>
                </Form.Group>
                <Button className="btn btn-primary" type="button" onClick={SendBroadcast} disabled={isButtonDisabled}>
                  Send
                </Button>
              </Form>
            </Col>
          </Row>
        </TabPanel>
        <Modal show={modalShow} onHide={() => setModalShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalShow(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </MainCard>
    </>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

export default ManageBroadcast;