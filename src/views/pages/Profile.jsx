/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';
import MainCard from 'ui-component/cards/MainCard';
import { Row, Col, Button, Form, InputGroup, Modal, Breadcrumb, BreadcrumbItem } from 'react-bootstrap';
import Typography from '@mui/material/Typography';
import { Box, margin } from '@mui/system';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';
import { API_URL, IMAGE_PATH } from 'config/constant';
import axios from 'axios';
import menuItem from 'menu-items';
import './Profile.css';
import imageShow from '../../../src/assets/images/logo.png';
import profileImage from '../../../src/assets/images/logo-profile.png';
// import { remove } from 'immutable';

const PasswordField = ({ label, placeholder, value, onChange, error }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Form.Group className="mb-3" controlId={`form${label.replace(' ', '')}`}>
            <Form.Label className="fw-semibold text-muted">{label}</Form.Label>
            <InputGroup>
                <Form.Control 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder={placeholder} 
                    value={value} 
                    onChange={onChange}
                    isInvalid={!!error}
                    className="shadow-sm" 
                />
                <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }} className="shadow-sm">
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </InputGroup.Text>
                <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
            </InputGroup>
        </Form.Group>
    );
};

const Profile = () => {
    const [value, setValue] = useState(0);
    const [admin, setAllAdminData] = useState([]);
    const [enlargedImage, setEnlargedImage] = useState(null);
    
    // Password States
    const [oldpassword, setOldPassword] = useState('');
    const [oldPasswordError, setOldPasswordError] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    // Profile Edit States
    const [editName, setAdminEditName] = useState('');
    const [editNameError, setEditNameError] = useState('');
    const [editEmail, setAdminEditEmail] = useState('');
    const [editEmailError, setEditEmailError] = useState('');
    const [editImage, setEditImage] = useState(null);
    const [editImageError, setEditImageError] = useState('');

    // Modal States
    const [modalMessage, setModalMessage] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [profileModalShow, setProfileModalShow] = useState(false);

    // Determine Image Source for Preview
    const imagePreviewSrc = editImage 
        ? (editImage instanceof File ? URL.createObjectURL(editImage) : `${IMAGE_PATH}${editImage}`)
        : profileImage;

    const handleChange = (event, newValue) => {
        setValue(newValue);
        // Clear all errors on tab switch
        setOldPasswordError(''); setNewPasswordError(''); setConfirmPasswordError('');
        setEditNameError(''); setEditEmailError(''); setEditImageError('');
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

    useEffect(() => { fetchData(); }, []);

    const handleImageClick = (imageUrl) => {
        setEnlargedImage(imageUrl || imageShow);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setEditImage(file);
                setEditImageError('');
            } else {
                setEditImageError('Please upload a valid image format (jpg, png, etc).');
                e.target.value = null;
            }
        }
    };

    // --- PASSWORD SUBMIT ---
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        let hasError = false;

        if (!oldpassword) { setOldPasswordError('Please Enter Current Password'); hasError = true; } else { setOldPasswordError(''); }
        if (!newPassword) { setNewPasswordError('Please Enter New Password'); hasError = true; } 
        else if (newPassword.length < 6) { setNewPasswordError('Password cannot be less than 6 characters'); hasError = true; }
        else if (newPassword === oldpassword) { setNewPasswordError('New password cannot be the same as the old password'); hasError = true; }
        else { setNewPasswordError(''); }

        if (!confirmPassword) { setConfirmPasswordError('Please Enter Confirm Password'); hasError = true; }
        else if (newPassword !== confirmPassword) { setConfirmPasswordError('New password and confirm password must match'); hasError = true; }
        else { setConfirmPasswordError(''); }

        if (hasError) return;

        try {
            const res = await axios.post(`${API_URL}update_admin_password`, { oldpassword, newPassword });
            if (res.data.success === false) {
                setOldPasswordError('Current Password is incorrect');
            } else if (res.data.key === 'samePassword') {
                setNewPasswordError('New password cannot be the same as current password');
            } else {
                setModalTitle('Success');
                setModalMessage('Password updated successfully');
                setModalShow(true);
                setOldPassword(''); setNewPassword(''); setConfirmPassword('');
                setTimeout(() => setModalShow(false), 2500);
            }
        } catch (error) {
            setModalTitle('Error');
            setModalMessage('Error updating password');
            setModalShow(true);
        }
    };

    // --- PROFILE SUBMIT ---
    const handleAdminData = async (e) => {
        e.preventDefault();
        let hasError = false;

        if (!editName) { setEditNameError('Please Enter Name'); hasError = true; } else { setEditNameError(''); }
        if (!editEmail) { setEditEmailError('Please Enter Email'); hasError = true; } else { setEditEmailError(''); }
        if (!editImage) { setEditImageError('Please Select an Image'); hasError = true; } else { setEditImageError(''); }

        if (hasError) return;

        const data = new FormData();
        data.append('name', editName);
        data.append('email', editEmail);
        if (editImage instanceof File) data.append('image', editImage);

        try {
            const res = await axios.post(`${API_URL}edit_admin_profile`, data);
            if (res.data.success) {
                setModalTitle('Success');
                setModalMessage('Profile updated successfully');
                setProfileModalShow(true);
                fetchData(); // Refresh data
                setTimeout(() => setProfileModalShow(false), 2500);
            }
        } catch (error) {
            setModalTitle('Error');
            setModalMessage('Error updating profile');
            setProfileModalShow(true);
        }
    };

    const breadcrumbs = menuItem.items
        .filter((item) => item.title !== 'Profile' && item.breadcrumbs !== false)
        .map((item) => <BreadcrumbItem key={item.id}>{item.title}</BreadcrumbItem>);

    return (
        <div>
            <Breadcrumb>{breadcrumbs}</Breadcrumb>
            
            <Row className="g-4">
                {/* Left Column - Profile Card */}
                <Col lg={4} md={5}>
                    <MainCard className="profile-card-left h-100">
                        <Box className="d-flex flex-column align-items-center text-center p-4">
                            <div 
                                className="profile-avatar-wrapper mt-5" 
                                onClick={() => handleImageClick(imagePreviewSrc)} 
                                style={{ marginBottom: '20px', cursor: 'pointer', background: 'transparent' }} // Added transparent
                            >
                                <img
                                    src={imagePreviewSrc}
                                    alt="Profile"
                                    className="profile-avatar"
                                    style={{ background: 'transparent' }} // Force image background to be transparent
                                />
                                <div className="profile-avatar-overlay">
                                    <FontAwesomeIcon icon={faCamera} size="lg" />
                                </div>
                            </div>
                            <Typography variant="h5" fontWeight="bold" className="mt-3">
                                {admin.username || 'Admin Name'}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" className="mt-1">
                                {admin.email || 'admin@example.com'}
                            </Typography>
                        </Box>
                    </MainCard>
                </Col>

                {/* Right Column - Forms */}
                <Col lg={8} md={7}>
                    <MainCard>
                        {/* <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                            <Tabs value={value} onChange={handleChange} centered>
                                <Tab label="Edit Profile" />
                                <Tab label="Change Password" />
                            </Tabs>
                        </Box> */}
                        
                        <Tabs sx={{margin : '22px'}} value={value} onChange={handleChange}>
                                <Tab label="Edit Profile" />
                                <Tab label="Change Password" />
                            </Tabs>

                        {/* Change Password Form */}
                        {value === 1 && (
                            <Form onSubmit={handlePasswordSubmit} className="px-3 pb-3">
                                <PasswordField 
                                    label="Current Password"
                                    placeholder="Enter Current Password"
                                    value={oldpassword}
                                    error={oldPasswordError}
                                    onChange={(e) => { setOldPassword(e.target.value); setOldPasswordError(''); }}
                                />
                                <PasswordField
                                    label="New Password"
                                    placeholder="Enter New Password"
                                    value={newPassword}
                                    error={newPasswordError}
                                    onChange={(e) => { setNewPassword(e.target.value); setNewPasswordError(''); }}
                                />
                                <PasswordField
                                    label="Confirm Password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    error={confirmPasswordError}
                                    onChange={(e) => { setConfirmPassword(e.target.value); setConfirmPasswordError(''); }}
                                />
                                <div className="d-flex justify-content-end mt-4 ">
                                    <Button type="submit" variant="none" className="px-4 py-2 shadow-sm" style={{backgroundColor : "#4788f9e2" ,color : "#ffffff" }}>
                                        Update Password
                                    </Button>
                                </div>
                            </Form>
                        )}

                        {/* Edit Profile Form */}
                        {value === 0 && (
                            <Form onSubmit={handleAdminData} className="px-3 pb-3">
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label className="fw-semibold text-muted">Full Name</Form.Label>
                                    <Form.Control style={{textTransform : 'capitalize'}}
                                        type="text"
                                        placeholder="Enter your name"
                                        value={editName}
                                        onChange={(e) => { setAdminEditName(e.target.value); setEditNameError(''); }}
                                        isInvalid={!!editNameError}
                                        className="shadow-sm"
                                    />
                                    <Form.Control.Feedback type="invalid">{editNameError}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label className="fw-semibold text-muted">Email Address</Form.Label>
                                    <Form.Control  style={{textTransform : 'capitalize'}}
                                        type="email" 
                                        placeholder="Enter your email"
                                        value={editEmail}
                                        onChange={(e) => { setAdminEditEmail(e.target.value); setEditEmailError(''); }}
                                        isInvalid={!!editEmailError}
                                        className="shadow-sm"
                                    />
                                    <Form.Control.Feedback type="invalid">{editEmailError}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formFile">
                                    <Form.Label className="fw-semibold text-muted">Profile Image</Form.Label>
                                    <div className="d-flex align-items-center">
                                        <img src={imagePreviewSrc} alt="Preview" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', marginRight: '15px', border: '2px solid #eee' }} />
                                        <Form.Control   style={{textTransform : 'capitalize' }}
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleFileChange} 
                                            isInvalid={!!editImageError}
                                            className="shadow-sm" 
                                        />
                                    </div>
                                    <Form.Control.Feedback type="invalid">{editImageError}</Form.Control.Feedback>
                                </Form.Group>

                                <div className="d-flex justify-content-end mt-4">
                                    <Button type="submit" variant="none" className="px-4 py-2 shadow-sm" style={{backgroundColor : "#4788f9e2" ,color : "#ffffff" }}>
                                        Save Changes
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </MainCard>
                </Col>
            </Row>

            {/* Modal for Enlarged Image */}
            <Modal show={!!enlargedImage} onHide={() => setEnlargedImage(null)} centered size="lg">
                <Modal.Body className="p-0 text-center bg-dark">
                    <img src={enlargedImage} alt="Enlarged Profile" style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain' }} />
                </Modal.Body>
            </Modal>

            {/* Modal for Success/Error Messages */}
            <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
            </Modal>

            <Modal show={profileModalShow} onHide={() => setProfileModalShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
            </Modal>
        </div>
    );
};

export default Profile;







