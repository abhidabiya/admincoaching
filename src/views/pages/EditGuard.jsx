import { Typography } from "@mui/material";
import { API_URL, APP_PREFIX_PATH } from "config/constant";
import { Button, Card, Form, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import JoditEditor from 'jodit-react';
import { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { decode as base64_decode } from 'base-64';
import { useParams } from "react-router-dom";

function EditGuard() {
    const { user_id } = useParams();
    const decode_user_id = base64_decode(user_id);
    const [guardName, setGuardName] = useState('');
    const [guardImage, setGuardImage] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [addAddress, setAddAddress] = useState('');
    const [password, setPassword] = useState('');
    const [society, setSociety] = useState('');
    const [wing, setWing] = useState('');
    const [timing, setTiming] = useState('');
    const [role, setRole] = useState('');
    const [addTripError, setAddTripError] = useState('');

    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const editor = useRef(null);

    const [adsDetails, setAdsDetails] = useState([]);

    // Society and Building State
    const [societies, setSocieties] = useState([]);
    const [selectedId, setSelectedId] = useState(""); // Selected society_id
    const [buildings, setBuildings] = useState([]);
    const [selectedBId, setSelectedBId] = useState(""); // Selected building_id
    const [error, setError] = useState("");

    // Fetch societies
    useEffect(() => {
        const getSocieties = async () => {
            try {
                const response = await axios.get(`${API_URL}get_society_name`);
                if (response.data.success) {
                    setSocieties(response.data.result);
                } else {
                    setError("No societies found.");
                }
            } catch (err) {
                setError("Error fetching societies.");
                console.error(err);
            }
        };
        getSocieties();
    }, []);

    // Fetch buildings
    useEffect(() => {
        const getBuildings = async () => {
            try {
                const response = await axios.get(`${API_URL}get_building_name`);
                if (response.data.success) {
                    setBuildings(response.data.result);
                } else {
                    setError("No buildings found.");
                }
            } catch (err) {
                setError("Error fetching buildings.");
                console.error(err);
            }
        };
        getBuildings();
    }, []);

    // Fetch guard details
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_URL}get_guard_details?user_id=${decode_user_id}`);
            if (response.data.success) {
                setAdsDetails(response.data.add_arr);
                console.log("adsDetails.society_id ID : ",response.data.add_arr);
                
            } else {
                console.error('Error fetching guard details:', response.data.msg);
            }
        } catch (error) {
            console.error('Error fetching guard details:', error);
        }
    };

    // Update form fields when `adsDetails` changes
    useEffect(() => {
        if (adsDetails) {
            setGuardName(adsDetails.name || '');
            setPhoneNumber(adsDetails.mobile || '');
            setAddAddress(adsDetails.email || '');
            setPassword(adsDetails.password || '');
            setSociety(adsDetails.society_name || '');
            setWing(adsDetails.building_name || '');
            setTiming(adsDetails.timing || '');
            setRole(adsDetails.role || '');

            // Set selected society and building IDs
            setSelectedId(adsDetails.society_id || '');
            setSelectedBId(adsDetails.building_id || '');
            
        }
    }, [adsDetails]);

    const handleCloseModal = () => {
        setShowModal(false);
        navigate(APP_PREFIX_PATH + '/managetrips');
    };

    const addNewTrip = async (e) => {
        e.preventDefault();

        let errors = {};
        if (!guardName) errors.guardName = 'Please enter name';
        if (!phoneNumber) errors.phoneNumber = 'Please enter mobile number';
        if (!addAddress) errors.addAddress = 'Please enter email address';
        // if (!selectedId) errors.society = 'Please select society name';
        // if (!selectedBId) errors.wing = 'Please select building name';
        if (!role) errors.role = 'Please select role';
        // if (!password) errors.password = 'Please enter password';

        if (Object.keys(errors).length > 0) {
            setAddTripError(errors);
            return;
        }

        setAddTripError({});

        const data = new FormData();
        data.append('name', guardName);
        data.append('mobile', phoneNumber);
        data.append('email', addAddress);
        data.append('society_id', selectedId);
        data.append('building_id', selectedBId);
        data.append('role', role);
        // data.append('password', password);
        data.append('user_id', decode_user_id);
        data.append('image', guardImage);

        axios.post(`${API_URL}edit_guard`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            
        })
            .then((response) => {
                if (response.data.key) {
                    setAddTripError({ general: response.data.message });
                } else if (response.data.success) {
                    Swal.fire({
                        title: "Success!",
                        text: "Guard Updated successfully!",
                        icon: "success",
                        confirmButtonColor: "#1976D2",
                        confirmButtonText: "OK",
                    });
                    navigate(APP_PREFIX_PATH + '/manage-feculty');
                }
            })
            .catch((error) => {
                console.error('Error updating guard:', error);
            });
    };

    return (
        <>
            <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
                <p style={{ fontSize: '1.25rem', color: '#121926', fontWeight: '600', fontFamily: 'Poppins', lineHeight: '1.167', marginBottom: '5px' }}>
                    Manage Guard / Edit Guard
                </p>
            </div>
            <Card>
                <Card.Header className="bg-white">
                    <div className='text-center fs-5 mb-3'>Edit Guard</div>
                    <div>
                        <Form onSubmit={addNewTrip}>
                            <div className='row m-2'>
                                <div className='col-md-6'>
                                    <label htmlFor="guardName" className="form-label">Guard Name</label>
                                    <Form.Control
                                        type="text"
                                        placeholder='Enter Name'
                                        value={guardName}
                                        onChange={(e) => {
                                            setGuardName(e.target.value);
                                            setAddTripError((prev) => ({ ...prev, guardName: '' }));
                                        }}
                                        isInvalid={addTripError.guardName}
                                    />
                                    <Form.Control.Feedback type="invalid">{addTripError.guardName}</Form.Control.Feedback>
                                </div>
                                <div className='col-md-6'>
                                    <label htmlFor="phoneNumber" className="form-label">Mobile Number</label>
                                    <Form.Control
                                        type="text"
                                        placeholder='Enter Mobile Number'
                                        value={phoneNumber}
                                        onChange={(e) => {
                                            setPhoneNumber(e.target.value);
                                            setAddTripError((prev) => ({ ...prev, phoneNumber: '' }));
                                        }}
                                        isInvalid={addTripError.phoneNumber}
                                    />
                                    <Form.Control.Feedback type="invalid">{addTripError.phoneNumber}</Form.Control.Feedback>
                                </div>
                            </div>

                            <div className='row m-2'>
                                <div className='col-md-6'>
                                    <label htmlFor="addAddress" className="form-label">Email Address</label>
                                    <Form.Control
                                        type="text"
                                        placeholder='Enter Email Address'
                                        value={addAddress}
                                        onChange={(e) => {
                                            setAddAddress(e.target.value);
                                            setAddTripError((prev) => ({ ...prev, addAddress: '' }));
                                        }}
                                        isInvalid={addTripError.addAddress}
                                    />
                                    <Form.Control.Feedback type="invalid">{addTripError.addAddress}</Form.Control.Feedback>
                                </div>
                                {/* <div className='col-md-6'>
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <Form.Control
                                        type="text"
                                        placeholder='Enter Password'
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setAddTripError((prev) => ({ ...prev, password: '' }));
                                        }}
                                        isInvalid={addTripError.password}
                                    />
                                    <Form.Control.Feedback type="invalid">{addTripError.password}</Form.Control.Feedback>
                                </div> */}

<div className='col-md-6'>
                                    <label htmlFor="roleSelect" className="form-label">Role</label>
                                    <Form.Select
                                        id="roleSelect"
                                        value={role}
                                        onChange={(e) => {
                                            setRole(e.target.value);
                                            setAddTripError((prev) => ({ ...prev, role: '' }));
                                        }}
                                        isInvalid={!!addTripError.role}
                                    >
                                        <option value="">Select Role</option>
                                        <option value="1">Security Guard</option>
                                        <option value="2">Gate Guard</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{addTripError.role}</Form.Control.Feedback>
                                </div>

                            </div>

                            <div className='row m-2'>
                                <div className="col-md-6">
                                    <label htmlFor="societySelect" className="form-label">Society Name</label>
                                    <Form.Select
                                        id="societySelect"
                                        value={selectedId}
                                        onChange={(e) => {
                                            setSelectedId(e.target.value);
                                            setSociety(e.target.value);
                                            setAddTripError((prev) => ({ ...prev, society: '' }));
                                        }}
                                        isInvalid={!!addTripError.society}
                                    >
                                        {/* <option value=""> fgd</option> */}
                                        {societies.map((society) => (
                                            <option key={society.society_id} value={society.society_id}>
                                                {society.society_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{addTripError.society}</Form.Control.Feedback>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="buildingSelect" className="form-label">Building Name</label>
                                    <Form.Select
                                        id="buildingSelect"
                                        value={selectedBId}
                                        onChange={(e) => {
                                            setSelectedBId(e.target.value);
                                            setWing(e.target.value);
                                            setAddTripError((prev) => ({ ...prev, wing: '' }));
                                        }}
                                        isInvalid={!!addTripError.wing}
                                    >
                                        {/* <option value="">Select Building</option> */}
                                        {buildings.map((building) => (
                                            <option key={building.building_id} value={building.building_id}>
                                                {building.building_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{addTripError.wing}</Form.Control.Feedback>
                                </div>
                            </div>

                            <div className='row m-2'>
                               

                                <div className='col-md-6'>
                                    <label htmlFor="profileImage" className="form-label">Profile Image</label>
                                    <Form.Control
                                        type="file"
                                        onChange={(e) => {
                                            setGuardImage(e.target.files[0]);
                                        }}
                                    />
                                </div>
                            </div>

                            {addTripError.general && <span className="text-danger">{addTripError.general}</span>}
                            <div className='text-start m-3'>
                                <Button variant="primary" type='submit'>Save</Button>
                            </div>
                        </Form>
                    </div>
                </Card.Header>
            </Card>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Trip Created</Modal.Title>
                </Modal.Header>
                <Modal.Body>New Trip Created Successfully</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Okay</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditGuard;