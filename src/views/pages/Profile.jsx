/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';
import MainCard from 'ui-component/cards/MainCard';
import { Row, Col, Button, Form, InputGroup, Modal, BreadcrumbItem } from 'react-bootstrap';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { API_URL, IMAGE_PATH } from 'config/constant';
import axios from 'axios';
import menuItem from 'menu-items';
import { Breadcrumb } from 'react-bootstrap';
import "./Profile.css"
import imageShow from '../../../src/assets/images/logo.png';

const PasswordField = ({ label, placeholder, value, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Form.Group className="mb-3" controlId={`form${label.replace(' ', '')}`}>
            <Form.Label>{label}</Form.Label>
            <InputGroup>
                <Form.Control type={showPassword ? 'text' : 'password'} placeholder={placeholder} value={value} onChange={onChange} />
                <InputGroup.Text onClick={toggleShowPassword} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </InputGroup.Text>
            </InputGroup>
        </Form.Group>
    );
};

const Profile = () => {
    const [value, setValue] = useState(0);
    const [admin, setAllAdminData] = useState([]);
    const [enlargedImage, setEnlargedImage] = useState(null);
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [oldpassword, setOldPassword] = useState('');
    const [oldPasswordError, setOldPasswordError] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confiremPassword, setConfirmPassword] = useState('');
    const [confiremPasswordError, setConfirmPasswordError] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalShow1, setmodalShow1] = useState(false);
    const [editName, setAdminEditName] = useState('');
    const [editNameError, setEditNameError] = useState('');
    const [editEmail, setAdminEditEmail] = useState('');
    const [editEmailError, setEditEmailError] = useState('');
    const [editImage, setEditImage] = useState(null);
    const [editImageError, setEditImageError] = useState('');
    const [error, setError] = useState('');
    const [charactererror, setCharacteretError] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        let hasError = false;

        if (!oldpassword) {
            setOldPasswordError('Please Enter Current Password');
            hasError = true;
        } else {
            setOldPasswordError('');
        }

        
        
        if(newPassword.length < 6 && newPassword ){
            // setNewPasswordError('Password cannot be less then 6 characters');
            setCharacteretError('Password cannot be less then 6 characters')
                hasError = true;

        } else {
            setCharacteretError('');
        }


        if (!newPassword) {
            setNewPasswordError('Please Enter New Password');
            hasError = true;
        }else {
            setNewPasswordError('');
        } 
        

        // if(newPassword.length < 6 ){
        //     setNewPasswordError('Password cannot be less then 6 characters');
        //     hasError = true;
        // }else{
        //     setNewPasswordError('');
        // }

        if (!confiremPassword) {
            setConfirmPasswordError('Please Enter Confirm Password');
            hasError = true;
        } else {
            setConfirmPasswordError('');
        }
        if (confiremPassword) {
            if (newPassword !== confiremPassword) {
                setConfirmPasswordError('New password and confirm password fields must be equal');
                hasError = true;
            } else {
                setConfirmPasswordError('');
            }
        }
        if(newPassword){
            if(newPassword === oldpassword){
                setNewPasswordError('New password can not be same as old password');
                hasError = true;
            }else {
                setNewPasswordError('');
            }
        }


       

        if (hasError) {
            return;
        }

        const data = { oldpassword, newPassword };

        try {
            const res = await axios.post(`${API_URL}update_admin_password`, data);
            if (res.data.success === false) {
                setOldPasswordError('Current Password is not correct');
            } else if (res.data.key == 'samePassword') {
                setError('New password can not be same as current password');
            } else {
                setModalShow(true);
                setModalMessage('Password updated successfully');
                setModalTitle('Change Password');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setOldPasswordError('');
                setNewPasswordError('');
                setConfirmPasswordError('');
                setError('');
                setTimeout(() => {
                    setModalShow(false);
                }, 2000);
            }
        } catch (error) {
            setModalMessage('Error updating password');
            setModalShow(true);
        }
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setConfirmPasswordError('');
        setNewPasswordError('');
        setOldPasswordError('');
        setEditImageError('');
        setEditEmailError('');
        setEditNameError('');
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_URL}get_admin_data`);
            const adminData = response.data.info[0];
            setAllAdminData(adminData);
            setAdminEditName(adminData.username);
            setAdminEditEmail(adminData.email);
            setEditImage(adminData.image);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleImageClick = (imageUrl) => {
        setEnlargedImage(imageUrl);
        setShowImagePopup(true);
    };

    const handleCloseImage = () => {
        setEnlargedImage(null);
        setShowImagePopup(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileType = file.type;
            if (fileType.startsWith('image/')) {
                setEditImage(file);
                setEditImageError('');
            } else {
                setEditImageError('Please upload valid image format');
                e.target.value = null;
            }
        }
    };

    const handleAdminData = async (e) => {
        e.preventDefault();
        let hasError = false;

        if (!editName) {
            setEditNameError('Please Enter Name');
            hasError = true;
        } else {
            setEditNameError('');
        }

        if (!editEmail) {
            setEditEmailError('Please Enter Email');
            hasError = true;
        } else {
            setEditEmailError('');
        }

        if (!editImage) {
            setEditImageError('Please Select Image');
            hasError = true;
        } else {
            setEditImageError('');
        }

        if (hasError) {
            return;
        }

        const data = new FormData();
        data.append('name', editName);
        data.append('email', editEmail);
        if (editImage) {
            data.append('image', editImage);
        }

        try {
            const res = await axios.post(`${API_URL}edit_admin_profile`, data);
            if (res.data.success) {
                setModalTitle('Update');
                setModalMessage('Profile updated successfully');
                setmodalShow1(true);
                setEditImage('');
                setTimeout(() => setmodalShow1(false), 2000);
                fetchData();
            }
        } catch (error) {
            setModalMessage('Error updating profile');
            setmodalShow1(true);
        }
    };

    const breadcrumbs = menuItem.items
    .filter((item) => item.title !== 'Profile' && item.breadcrumbs !== false)
    .map((item) => (
        <BreadcrumbItem key={item.id} title={item.title}>
            {item.title}
        </BreadcrumbItem>
    ));

    return (
        <div>
            <Breadcrumb>{breadcrumbs}</Breadcrumb>
            <div>
                <Row>
                    <Col lg={4} className="mb-3">
                        <MainCard style={{ height: '425px' }} className="d-flex justify-content-center align-items-center">
                            <img
                                // src={admin.image ? `${IMAGE_PATH}${admin.image}` : `${IMAGE_PATH}placeholder.png`}
                                
                                src={imageShow}
                                alt="Profile"
                                style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                                onClick={() =>
                                    handleImageClick(admin.image ? `${IMAGE_PATH}${admin.image}` : `${IMAGE_PATH}placeholder.png`)
                                }
                            />
                            <Box className="mt-3">
                                <Typography variant="h4" textAlign={'center'}>
                                    {admin.username}
                                </Typography>
                                <Typography variant="body2" className="mt-2">
                                    {admin.email}
                                </Typography>
                            </Box>
                        </MainCard>
                        {showImagePopup && (
                            <div
                                className="enlarged-image-overlay"
                                onClick={handleCloseImage}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        handleCloseImage();
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                            >
                                <span
                                    className="close-button"
                                    onClick={handleCloseImage}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCloseImage();
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                >
                                    &times;
                                </span>
                                <img
                                    src={enlargedImage}
                                    alt="Enlarged Profile Image"
                                    className="enlarged-image"
                                    style={{ width: '30rem', height: '30rem', objectFit: 'cover' }}
                                />
                            </div>
                        )}
                    </Col>

                    <Col lg={8}>
                        <MainCard>
                            <Tabs value={value} onChange={handleChange}>
                                <Tab label="Edit Profile" />
                                <Tab label="Change Password" />
                            </Tabs>
                            {value === 1 && (
                                <Form onSubmit={handleSubmit} className="m-3">
                                    <PasswordField
                                        label="Current password"
                                        className="custom-placeholder"
                                        placeholder="Enter Current Password"
                                        value={oldpassword}
                                        onChange={(e) => {
                                            setOldPassword(e.target.value);
                                            setOldPasswordError('');
                                            setError('');
                                        }}
                                    />
                                    {oldPasswordError && <span className="text-danger">{oldPasswordError}</span>}

                                    <PasswordField
                                        label="New Password"
                                        className="custom-placeholder"
                                        placeholder="Enter New Password"
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            setNewPasswordError('');
                                            setError('');
                                        }}
                                    />
                                    {newPasswordError && <span className="text-danger">{newPasswordError}</span>}
                                    {charactererror && <span className="text-danger">{charactererror}</span>}
                                   
                                    <PasswordField
                                        label="Confirm Password"
                                        className="custom-placeholder"
                                        placeholder="Confirm New Password"
                                        value={confiremPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value), setConfirmPasswordError(''), setError('');
                                        }}
                                    />
                                    {confiremPasswordError && <span className="text-danger">{confiremPasswordError}</span>}
                                    {error && <span className="text-danger">{error}</span>}
                                    <div className="d-flex justify-content-end">
                                        <Button type="submit" variant="primary" className="mt-3">
                                            Change Password
                                        </Button>
                                    </div>
                                </Form>
                            )}

                            {value === 0 && (
                                <Form onSubmit={handleAdminData} className="m-3">
                                    <Form.Group className="mb-3" controlId="formName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Name"
                                            value={editName}
                                            onChange={(e) => setAdminEditName(e.target.value)}
                                        />
                                        {editNameError && <span className="text-danger">{editNameError}</span>}
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter Email"
                                            value={editEmail}
                                            onChange={(e) => setAdminEditEmail(e.target.value)}
                                        />
                                        {editEmailError && <span className="text-danger ">{editEmailError}</span>}
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formFile">
                                        <Form.Label>Profile Image</Form.Label>
                                        <Form.Control type="file" onChange={handleFileChange} />
                                        {editImageError && <span className="text-danger">{editImageError}</span>}
                                    </Form.Group>

                                    <div className="d-flex justify-content-end">
                                        <Button type="submit" variant="primary" className="mt-3">
                                            Update Profile
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </MainCard>
                    </Col>
                </Row>

                {/* Modal for Password Update */}
                <Modal show={modalShow} onHide={() => setModalShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{modalMessage}</Modal.Body>
                    <Modal.Footer></Modal.Footer>
                </Modal>

                {/* Modal for Profile Update */}
                <Modal show={modalShow1} onHide={() => setmodalShow1(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{modalMessage}</Modal.Body>
                    <Modal.Footer></Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default Profile;
