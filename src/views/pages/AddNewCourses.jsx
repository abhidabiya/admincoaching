import { useState } from "react";
import { API_URL, APP_PREFIX_PATH } from "config/constant";
import { Button, Card, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import JoditEditor from 'jodit-react';
import { useMemo, useRef } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

function AddNewCourses() {
    const [courseName, setCourseName] = useState('');
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fees, setFees] = useState('');
    const [minFees, setMinFees] = useState('');
    const [maxFees, setMaxFees] = useState('');
    const [duration, setDuration] = useState('');
    const [category, setCategory] = useState('');
    
    const [addCourseError, setAddCourseError] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const editor = useRef(null);

    const handleCloseModal = () => {
        setShowModal(false);
        navigate(APP_PREFIX_PATH + '/manage-courses');
    };

    const config1 = useMemo(() => ({
        readonly: false,
        placeholder: 'Enter course description',
        defaultActionOnPaste: 'insert_as_html',
        buttons: [
            'bold', 'italic', '|',
            'ul', 'ol', '|',
            'font', 'fontsize', '|',
            'outdent', 'indent', 'align', '|',
            'hr', '|', 'fullsize', 'brush', '|',
            'table', 'link', '|',
            'undo', 'redo'
        ],
        statusbar: false,
        toolbarAdaptive: false
    }), []);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                setAddCourseError(prev => ({ ...prev, image: 'File size should not exceed 2MB' }));
                return;
            }
            
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setAddCourseError(prev => ({ ...prev, image: 'Invalid file type. Only JPG, PNG, GIF are allowed' }));
                return;
            }
            
            setImage(file);
            setAddCourseError(prev => ({ ...prev, image: '' }));
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
    };

    // Add new course
    const addNewCourse = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        let errors = {};

        // Required fields validation
        if (!courseName.trim()) {
            errors.courseName = 'Please enter course name';
        }
        if (!image) {
            errors.image = 'Please select course image';
        }
        if (!title.trim()) {
            errors.title = 'Please enter course title';
        }
        if (!description || description.trim() === '<p><br></p>') {
            errors.description = 'Please enter course description';
        }
        if (!fees) {
            errors.fees = 'Please enter course fees';
        }
        if (!minFees) {
            errors.minFees = 'Please enter minimum fees';
        }
        if (!maxFees) {
            errors.maxFees = 'Please enter maximum fees';
        }

        // Validate fees values
        if (fees && (isNaN(fees) || Number(fees) < 0)) {
            errors.fees = 'Please enter valid fees';
        }
        if (minFees && (isNaN(minFees) || Number(minFees) < 0)) {
            errors.minFees = 'Please enter valid minimum fees';
        }
        if (maxFees && (isNaN(maxFees) || Number(maxFees) < 0)) {
            errors.maxFees = 'Please enter valid maximum fees';
        }
        
        if (minFees && maxFees && Number(minFees) > Number(maxFees)) {
            errors.maxFees = 'Maximum fees should be greater than minimum fees';
        }

        if (Object.keys(errors).length > 0) {
            setAddCourseError(errors);
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('course_name', courseName);
            formData.append('title', title);
            formData.append('description', description);
            formData.append('fees', fees);
            formData.append('minimum_fees', minFees);
            formData.append('maximum_fees', maxFees);
            
            // Optional fields
            if (duration) formData.append('duration', duration);
            if (category) formData.append('category', category);
            
            if (image) {
                formData.append('image', image);
            }

            console.log('Sending form data...');
            
            const response = await axios.post(`${API_URL}add_course`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log('Response:', response.data);

            if (response.data.success) {
                toast.success(response.data.msg || 'Course added successfully!');
                
                // Reset form
                setCourseName('');
                setImage(null);
                setTitle('');
                setDescription('');
                setFees('');
                setMinFees('');
                setMaxFees('');
                setDuration('');
                setCategory('');
                setAddCourseError({});
                
                // Show success modal
                setShowModal(true);
            } else {
                toast.error(response.data.msg || 'Failed to add course');
                setAddCourseError({ general: response.data.msg });
            }
        } catch (error) {
            console.error('Error adding new course:', error);
            const errorMsg = error.response?.data?.msg || 'Failed to add course. Please try again.';
            toast.error(errorMsg);
            setAddCourseError({ general: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
                <p style={{
                    fontSize: '1.25rem',
                    color: '#121926',
                    fontWeight: '600',
                    fontFamily: 'Poppins',
                    lineHeight: '1.167',
                    marginBottom: '5px'
                }}>
                    Manage Courses / Add Course
                </p>
            </div>
             
            <Card>
                <Card.Header className="bg-white">
                    <div className='text-center fs-5 mb-3'>Add New Course</div>
                    <div>
                        <Form onSubmit={addNewCourse}>
                            {/* Course Name & Title */}
                            <div className='row m-2'>
                                <div className='col-md-6'>
                                    <label htmlFor="courseName" className="form-label">
                                        Course Name *
                                    </label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder='Enter course name' 
                                        value={courseName}
                                        onChange={(e) => {
                                            setCourseName(e.target.value);
                                            setAddCourseError(prev => ({ ...prev, courseName: '' }));
                                        }}
                                        isInvalid={!!addCourseError.courseName}
                                        disabled={loading}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {addCourseError.courseName}
                                    </Form.Control.Feedback>
                                </div>
                             
                                <div className='col-md-6'>
                                    <label htmlFor="courseTitle" className="form-label">
                                        Course Title *
                                    </label>
                                    <Form.Control 
                                        type="text"
                                        placeholder='Enter course title'
                                        value={title}
                                        onChange={(e) => {
                                            setTitle(e.target.value);
                                            setAddCourseError(prev => ({ ...prev, title: '' }));
                                        }}
                                        isInvalid={!!addCourseError.title}
                                        disabled={loading}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {addCourseError.title}
                                    </Form.Control.Feedback>
                                </div>
                            </div>

                            {/* Category & Duration */}
                            <div className='row m-2'>
                                <div className='col-md-6'>
                                    <label htmlFor="category" className="form-label">
                                        Category
                                    </label>
                                    <Form.Control 
                                        type="text"
                                        placeholder='Enter category (e.g., Engineering, Medical)'
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>

                                <div className='col-md-6'>
                                    <label htmlFor="duration" className="form-label">
                                        Duration (e.g., 6 Months)
                                    </label>
                                    <Form.Control 
                                        type="text"
                                        placeholder='e.g., 6 Months'
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Fees Section */}
                            <div className='row m-2'>
                                <div className='col-md-4'>
                                    <label htmlFor="fees" className="form-label">
                                        Course Fees (₹) *
                                    </label>
                                    <Form.Control 
                                        type="number" 
                                        placeholder='Enter course fees'
                                        value={fees}
                                        onChange={(e) => {
                                            setFees(e.target.value);
                                            setAddCourseError(prev => ({ ...prev, fees: '' }));
                                        }}
                                        isInvalid={!!addCourseError.fees}
                                        min="0"
                                        step="0.01"
                                        disabled={loading}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {addCourseError.fees}
                                    </Form.Control.Feedback>
                                </div>

                                <div className='col-md-4'>
                                    <label htmlFor="minFees" className="form-label">
                                        Minimum Fees (₹) *
                                    </label>
                                    <Form.Control 
                                        type="number"
                                        placeholder='Enter minimum fees'
                                        value={minFees}
                                        onChange={(e) => {
                                            setMinFees(e.target.value);
                                            setAddCourseError(prev => ({ ...prev, minFees: '' }));
                                        }}
                                        isInvalid={!!addCourseError.minFees}
                                        min="0"
                                        step="0.01"
                                        disabled={loading}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {addCourseError.minFees}
                                    </Form.Control.Feedback>
                                </div>

                                <div className='col-md-4'>
                                    <label htmlFor="maxFees" className="form-label">
                                        Maximum Fees (₹) *
                                    </label>
                                    <Form.Control 
                                        type="number"
                                        placeholder='Enter maximum fees'
                                        value={maxFees}
                                        onChange={(e) => {
                                            setMaxFees(e.target.value);
                                            setAddCourseError(prev => ({ ...prev, maxFees: '' }));
                                        }}
                                        isInvalid={!!addCourseError.maxFees}
                                        min="0"
                                        step="0.01"
                                        disabled={loading}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {addCourseError.maxFees}
                                    </Form.Control.Feedback>
                                </div>
                            </div>

                            {/* Course Image */}
                            <div className='row m-2'>
                                <div className='col-md-12'>
                                    <label htmlFor="courseImage" className="form-label">
                                        Course Image *
                                    </label>
                                    <Form.Control 
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        isInvalid={!!addCourseError.image}
                                        disabled={loading}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {addCourseError.image}
                                    </Form.Control.Feedback>
                                    
                                    {/* Image Preview */}
                                    {image && (
                                        <div className="mt-2" style={{ position: 'relative', display: 'inline-block' }}>
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt="Course preview"
                                                style={{
                                                    width: '150px',
                                                    height: '150px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    border: '1px solid #ddd'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                style={{
                                                    position: 'absolute',
                                                    top: '-8px',
                                                    right: '-8px',
                                                    borderRadius: '50%',
                                                    width: '25px',
                                                    height: '25px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: 0
                                                }}
                                                onClick={handleRemoveImage}
                                                disabled={loading}
                                            >
                                                <span style={{ fontSize: '18px' }}>×</span>
                                            </button>
                                        </div>
                                    )}
                                    <small className="text-muted">Supported formats: JPG, PNG, JPEG, GIF. Max size: 2MB</small>
                                </div>
                            </div>

                            {/* Course Description */}
                            <div className='row m-2'>
                                <div className='col-md-12'>
                                    <label htmlFor="courseDescription" className="form-label">
                                        Course Description *
                                    </label>
                                    <JoditEditor
                                        ref={editor}
                                        value={description}
                                        config={config1}
                                        onChange={(newContent) => {
                                            setDescription(newContent);
                                            setAddCourseError(prev => ({ ...prev, description: '' }));
                                        }}
                                    />
                                    {addCourseError.description && (
                                        <div className="text-danger mt-1">{addCourseError.description}</div>
                                    )}
                                </div>
                            </div>

                            {/* Error Message */}
                            {addCourseError.general && (
                                <div className='row m-2'>
                                    <div className='col-md-12'>
                                        <div className="alert alert-danger">
                                            {addCourseError.general}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className='text-start m-3'>
                                <Button 
                                    variant="primary" 
                                    type='submit'
                                    disabled={loading}
                                >
                                    {loading ? (
                                        
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" style={{ backgroundColor: '#007dea' }}></span>
                                            Adding Course...
                                        </>
                                    ) : 'Add Course '}
                                </Button>
                                <Button style={{ backgroundColor: '#007dea', borderColor: '#92989d' }}
                                    variant="secondary" 
                                    className="ms-2"
                                    onClick={() => navigate(APP_PREFIX_PATH + '/manage-courses')}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Card.Header>
            </Card>

            {/* Success Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Course Added Successfully</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
                        <p className="mt-3">New course has been added successfully!</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Go to Courses List
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddNewCourses;