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
import { ArrowDropDown, Edit, Delete, Visibility, CurrencyRupee, Image as ImageIcon } from '@mui/icons-material';
import './main.css';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconSearch } from '@tabler/icons-react';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import Box from '@mui/material/Box';
import axios from 'axios';
import { API_URL } from 'config/constant';
import { useNavigate } from "react-router-dom";
import { APP_PREFIX_PATH } from 'config/constant';
import { toast } from 'react-toastify';
import JoditEditor from 'jodit-react';
import { style } from '@mui/system';
import { color } from 'framer-motion';

const columns = [
    { id: 's_no', label: 'S.No.', align: 'center' },
    { id: 'actions', label: 'Actions', align: 'center' },
    { id: 'course_name', label: 'Course Name', align: 'center' },
    { id: 'title', label: 'Course Title', align: 'center' },
    { id: 'fees', label: 'Fees (₹)', align: 'center' },
    { id: 'min_max_fees', label: 'Min-Max Fees (₹)', align: 'center' },
    { id: 'duration', label: 'Duration', align: 'center' },
    { id: 'status', label: 'Status', align: 'center' },
    { id: 'date_time', label: 'Created Date', align: 'center' }
];

const ManageCourses = () => {
    const navigate = useNavigate();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const [coursesData, setCoursesData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [courseToEdit, setCourseToEdit] = useState(null);
    const [viewCourse, setViewCourse] = useState(null);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = React.useState('');

    // Edit form states
    const [editCourseName, setEditCourseName] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editFees, setEditFees] = useState('');
    const [editMinFees, setEditMinFees] = useState('');
    const [editMaxFees, setEditMaxFees] = useState('');
    const [editDuration, setEditDuration] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [editActive, setEditActive] = useState(1);
    const [editImage, setEditImage] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState('');
    const [editErrors, setEditErrors] = useState({});

    // Pagination states
    const [totalCourses, setTotalCourses] = useState(0);

    const handleClick = (event, index) => {
        setAnchorEl(event.currentTarget);
        setSelectedIndex(index);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedIndex(null);
    };

    // Fetch courses
    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}get_all_courses`, {
                params: {
                    page: page + 1,
                    limit: rowsPerPage,
                    search: searchQuery
                }
            });

            if (response.data.success) {
                setCoursesData(response.data.data || []);
                setTotalCourses(response.data.pagination?.total || 0);
            } else {
                toast.error(response.data.msg || 'Failed to fetch courses');
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [page, rowsPerPage]);

    useEffect(() => {
        // Debounced search
        const timer = setTimeout(() => {
            fetchCourses();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleAction = (action, course) => {
        handleClose();
        
        switch (action) {
            case 'view':
                setViewCourse(course);
                setShowViewModal(true);
                break;
                
            case 'edit':
                setCourseToEdit(course);
                populateEditForm(course);
                setShowEditModal(true);
                break;
                
            case 'delete':
                setCourseToDelete(course);
                setShowDeleteModal(true);
                break;
                
            case 'toggle_status':
                toggleCourseStatus(course.course_id, course.active === 1 ? 0 : 1);
                break;
        }
    };

    const populateEditForm = (course) => {
        setEditCourseName(course.course_name || '');
        setEditTitle(course.title || '');
        setEditDescription(course.description || '');
        setEditFees(course.fees || '');
        setEditMinFees(course.minimum_fees || '');
        setEditMaxFees(course.maximum_fees || '');
        setEditDuration(course.duration || '');
        setEditCategory(course.category || '');
        setEditActive(course.active || 1);
        setEditImagePreview(course.image ? getImageUrl(course.image) : '');
        setEditImage(null);
        setEditErrors({});
    };

    const toggleCourseStatus = async (courseId, newStatus) => {
        try {
            const response = await axios.post(`${API_URL}toggle_course_status/${courseId}`, {
                status: newStatus
            });

            if (response.data.success) {
                toast.success(response.data.msg);
                fetchCourses();
            } else {
                toast.error(response.data.msg || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error toggling course status:', error);
            toast.error('Failed to update status');
        }
    };

    const deleteCourse = async () => {
        try {
            const response = await axios.delete(`${API_URL}delete_course/${courseToDelete.course_id}`);

            if (response.data.success) {
                toast.success(response.data.msg);
                setShowDeleteModal(false);
                fetchCourses();
            } else {
                toast.error(response.data.msg || 'Failed to delete course');
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            toast.error('Failed to delete course');
        }
    };

    const handleEditImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                setEditErrors(prev => ({ ...prev, image: 'File size should not exceed 2MB' }));
                return;
            }
            
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setEditErrors(prev => ({ ...prev, image: 'Invalid file type. Only JPG, PNG, GIF are allowed' }));
                return;
            }
            
            setEditImage(file);
            setEditImagePreview(URL.createObjectURL(file));
            setEditErrors(prev => ({ ...prev, image: '' }));
        }
    };

    const handleRemoveEditImage = () => {
        setEditImage(null);
        setEditImagePreview('');
    };

    const validateEditForm = () => {
        const errors = {};

        if (!editCourseName.trim()) {
            errors.courseName = 'Please enter course name';
        }
        if (!editTitle.trim()) {
            errors.title = 'Please enter course title';
        }
        if (!editDescription || editDescription.trim() === '<p><br></p>') {
            errors.description = 'Please enter course description';
        }
        if (!editFees || isNaN(editFees) || Number(editFees) < 0) {
            errors.fees = 'Please enter valid fees';
        }
        if (!editMinFees || isNaN(editMinFees) || Number(editMinFees) < 0) {
            errors.minFees = 'Please enter valid minimum fees';
        }
        if (!editMaxFees || isNaN(editMaxFees) || Number(editMaxFees) < 0) {
            errors.maxFees = 'Please enter valid maximum fees';
        }
        
        if (editMinFees && editMaxFees && Number(editMinFees) > Number(editMaxFees)) {
            errors.maxFees = 'Maximum fees should be greater than minimum fees';
        }

        return errors;
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        
        const errors = validateEditForm();
        if (Object.keys(errors).length > 0) {
            setEditErrors(errors);
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('course_name', editCourseName);
            formData.append('title', editTitle);
            formData.append('description', editDescription);
            formData.append('fees', editFees);
            formData.append('minimum_fees', editMinFees);
            formData.append('maximum_fees', editMaxFees);
            formData.append('duration', editDuration);
            formData.append('category', editCategory);
            formData.append('active', editActive);
            
            if (editImage) {
                formData.append('image', editImage);
            }

            const response = await axios.put(`${API_URL}update_course/${courseToEdit.course_id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                toast.success(response.data.msg || 'Course updated successfully');
                setShowEditModal(false);
                fetchCourses();
            } else {
                toast.error(response.data.msg || 'Failed to update course');
            }
        } catch (error) {
            console.error('Error updating course:', error);
            toast.error(error.response?.data?.msg || 'Failed to update course');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_URL.replace('/adminapi', '')}/uploads/courses/${imagePath}`;
    };

    const getStatusBadge = (status) => {
        return status === 1 ? (
            <span className="badge bg-success">Active</span>
        ) : (
            <span className="badge bg-danger">Inactive</span>
        );
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
                    Manage Courses
                </p>
            </div>
            
            <Box alignItems="center" justifyContent="space-between" display="flex" className="mobile-res">
                <OutlinedInput
                    sx={{ pr: 1, pl: 2, my: 2, width: '300px' }}
                    id="input-search-profile"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search courses..."
                    startAdornment={
                        <InputAdornment position="start">
                            <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                        </InputAdornment>
                    }
                />
                <Button 
                    className="btn " 
                    onClick={() => navigate(APP_PREFIX_PATH + "/add-courses")} 
                    style={{ width: '200px'  , backgroundColor: '#3268f1', color: '#fff' }}
                >
                    <AddIcon />
                    Add New Course
                </Button>
            </Box>
            
            {/* Loading State */}
            {loading && (
                <div className="text-center my-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            
            <Paper sx={{ width: '100%', marginTop: '20px' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} align={column.align}>
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {coursesData.length > 0 ? (
                                coursesData.map((row, index) => (
                                    <TableRow hover key={row.course_id || index}>
                                        <TableCell align="center">
                                            {index + 1 + (page * rowsPerPage)}
                                        </TableCell>
                                        
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={(e) => handleClick(e, index)}
                                                endIcon={<ArrowDropDown />}
                                            >
                                                Actions
                                            </Button>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={selectedIndex === index}
                                                onClose={handleClose}
                                            >
                                                <MenuItem onClick={() => handleAction('view', row)}>
                                                    <Visibility fontSize="small" sx={{ mr: 1 }} />
                                                    View
                                                </MenuItem>
                                                <MenuItem onClick={() => handleAction('edit', row)}>
                                                    <Edit fontSize="small" sx={{ mr: 1 }} />
                                                    Edit
                                                </MenuItem>
                                                <MenuItem onClick={() => handleAction('toggle_status', row)} >
                                                    {row.active === 1 ?    'Deactivate' : 'Activate'}
                                                </MenuItem>
                                                <MenuItem onClick={() => handleAction('delete', row)} sx={{ color: 'error.main' }}>
                                                    <Delete fontSize="small" sx={{ mr: 1 }} />
                                                    Delete
                                                </MenuItem>
                                            </Menu>
                                        </TableCell>

                                        <TableCell align="center">
                                            {row.course_name}
                                        </TableCell>

                                        <TableCell align="center">
                                            {row.title}
                                        </TableCell>

                                        <TableCell align="center">
                                            <CurrencyRupee fontSize="small" />
                                            {row.fees}
                                        </TableCell>

                                        <TableCell align="center">
                                            <CurrencyRupee fontSize="small" />
                                            {row.minimum_fees} - 
                                            <CurrencyRupee fontSize="small" />
                                            {row.maximum_fees}
                                        </TableCell>

                                        <TableCell align="center">
                                            {row.duration || 'N/A'}
                                        </TableCell>

                                        <TableCell align="center">
                                            {getStatusBadge(row.active)}
                                        </TableCell>

                                        <TableCell align="center">
                                            {row.createtime}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                                        {loading ? 'Loading...' : 'No courses found'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                {coursesData.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                        <div style={{ marginLeft: 16 }}>
                            <span>Rows per page: </span>
                            <select 
                                value={rowsPerPage} 
                                onChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value));
                                    setPage(0);
                                }}
                                style={{ margin: '0 8px', padding: '4px' }}
                            >
                                {[10, 25, 50].map((size) => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                            <span>Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, totalCourses)} of {totalCourses} entries</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 16 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleChangePage(null, page - 1)}
                                disabled={page === 0}
                            >
                                Previous
                            </Button>
                            <span>Page {page + 1}</span>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleChangePage(null, page + 1)}
                                disabled={page >= Math.ceil(totalCourses / rowsPerPage) - 1}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </Paper>

            {/* View Course Modal */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{color : "#000000"}}>Course Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {viewCourse && (
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold " style={{color : "#4f4e4e9f" , fontFamily : 'revert-layer' }}>Course Name:</label>
                                    <p style={{color : "#bed9e0"}}>{viewCourse.course_name}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color : "#4f4e4e9f" , fontFamily : 'revert-layer'}}>Course Title:</label>
                                    <p style={{color : "#bed9e0"}}>{viewCourse.title}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color : "#4f4e4e9f" , fontFamily : 'revert-layer'}}>Fees:</label>
                                    <p style={{color : "#bed9e0"}} className="fw-bold">
                                        <CurrencyRupee fontSize="small" />
                                        {viewCourse.fees}
                                    </p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color : "#4f4e4e9f" , fontFamily : 'revert-layer'}}>Duration:</label>
                                    <p style={{color : "#bed9e0"}}>{viewCourse.duration || 'N/A'}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color : "#4f4e4e9f" , fontFamily : 'revert-layer'}}>Category:</label>
                                    <p style={{color : "#bed9e0"}}>{viewCourse.category || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color : "#4f4e4e9f" , fontFamily : 'revert-layer'}}>Minimum Fees:</label>
                                    <p style={{color : "#bed9e0"}}>
                                        <CurrencyRupee fontSize="small" />
                                        {viewCourse.minimum_fees}
                                    </p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold"style={{color : "#4f4e4e9f" , fontFamily : 'revert-layer'}}>Maximum Fees:</label>
                                    <p style={{color : "#bed9e0"}}>
                                        <CurrencyRupee fontSize="small" />
                                        {viewCourse.maximum_fees}
                                    </p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color : "#4f4e4e9f" , fontFamily : 'revert-layer'}}>Status:</label>
                                    <p style={{color : "#bed9e0"}}>{getStatusBadge(viewCourse.active)}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold"style={{color : "#4f4e4e9f" , fontFamily : 'revert-layer'}}>Created Date:</label>
                                    <p style={{color : "#bed9e0"}}>{viewCourse.createtime}</p>
                                </div>
                            </div>
                            
                            {viewCourse.image && (
                                <div className="col-12 mb-3">
                                    <label className="form-label fw-bold"style={{color : "#4f4e4e9f" , fontFamily : 'revert-layer'}}>Course Image:</label>
                                    <div className="mt-2">
                                        <img 
                                            src={getImageUrl(viewCourse.image)} 
                                            alt={viewCourse.course_name}
                                            className="img-fluid rounded"
                                            style={{ maxHeight: '300px' }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            
                            <div className="col-12 mb-3">
                                <label className="form-label fw-bold"style={{color : "#4f4e4e9f" , fontFamily : 'revert-layer'}}>Description:</label>
                                <div 
                                    className="border p-3 rounded bg-light fw-bold"
                                    style={{ maxHeight: '300px', overflowY: 'auto' , color: "red" ,  }}
                                    dangerouslySetInnerHTML={{ __html: viewCourse.description || 'No description available' }}
                                />
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button className='fw-bold' variant="secondary" onClick={() => setShowViewModal(false)} style={{color : "#898888"}}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            

            {/* Edit Course Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{color : "#0c0c0cdf"}}>Edit Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <Form.Label style={{color : "#797878"}}>Course Name *</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editCourseName}
                                    onChange={(e) => {
                                        setEditCourseName(e.target.value);
                                        setEditErrors(prev => ({ ...prev, courseName: '' }));
                                    }}
                                    isInvalid={!!editErrors.courseName}
                                    disabled={loading}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {editErrors.courseName}
                                </Form.Control.Feedback>
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Label style={{color : "#797878"}}>Course Title *</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => {
                                        setEditTitle(e.target.value);
                                        setEditErrors(prev => ({ ...prev, title: '' }));
                                    }}
                                    isInvalid={!!editErrors.title}
                                    disabled={loading}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {editErrors.title}
                                </Form.Control.Feedback>
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <Form.Label style={{color : "#797878"}}>Category</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editCategory}
                                    onChange={(e) => setEditCategory(e.target.value)}
                                    placeholder="Enter category"
                                    disabled={loading}
                                />
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <Form.Label style={{color : "#797878"}}>Duration</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editDuration}
                                    onChange={(e) => setEditDuration(e.target.value)}
                                    placeholder="e.g., 6 Months"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <Form.Label style={{color : "#797878"}}>Fees (₹) *</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={editFees}
                                    onChange={(e) => {
                                        setEditFees(e.target.value);
                                        setEditErrors(prev => ({ ...prev, fees: '' }));
                                    }}
                                    isInvalid={!!editErrors.fees}
                                    min="0"
                                    step="0.01"
                                    disabled={loading}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {editErrors.fees}
                                </Form.Control.Feedback>
                            </div>
                            
                            <div className="col-md-4 mb-3">
                                <Form.Label style={{color : "#797878"}}>Minimum Fees (₹) *</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={editMinFees}
                                    onChange={(e) => {
                                        setEditMinFees(e.target.value);
                                        setEditErrors(prev => ({ ...prev, minFees: '' }));
                                    }}
                                    isInvalid={!!editErrors.minFees}
                                    min="0"
                                    step="0.01"
                                    disabled={loading}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {editErrors.minFees}
                                </Form.Control.Feedback>
                            </div>
                            
                            <div className="col-md-4 mb-3">
                                <Form.Label style={{color : "#797878"}}>Maximum Fees (₹) *</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={editMaxFees}
                                    onChange={(e) => {
                                        setEditMaxFees(e.target.value);
                                        setEditErrors(prev => ({ ...prev, maxFees: '' }));
                                    }}
                                    isInvalid={!!editErrors.maxFees}
                                    min="0"
                                    step="0.01"
                                    disabled={loading}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {editErrors.maxFees}
                                </Form.Control.Feedback>
                            </div>
                        </div>
                        
                        <div className="row mb-3">
                            <div className="col-md-12">
                                <Form.Label style={{color : "#797878"}}>Course Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditImageChange}
                                    isInvalid={!!editErrors.image}
                                    disabled={loading}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {editErrors.image}
                                </Form.Control.Feedback>
                                <small className="text-muted">Leave empty to keep current image</small>
                                
                                {editImagePreview && (
                                    <div className="mt-2" style={{ position: 'relative', display: 'inline-block' }}>
                                        <img
                                            src={editImagePreview}
                                            alt="Course preview"
                                            className="img-thumbnail"
                                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
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
                                                padding: 0
                                            }}
                                            onClick={handleRemoveEditImage}
                                            disabled={loading}
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <Form.Label >Status</Form.Label>
                                <Form.Select
                                    value={editActive}
                                    onChange={(e) => setEditActive(parseInt(e.target.value))}
                                    disabled={loading}
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </Form.Select>
                            </div>
                        </div>
                        
                        <div className="row mb-3">
                            <div className="col-12">
                                <Form.Label style={{color : "#797878"}}>Description *</Form.Label>
                                <JoditEditor
                                    value={editDescription}
                                    config={{
                                        readonly: false,
                                        placeholder: 'Enter course description',
                                        buttons: ['bold', 'italic', 'ul', 'ol', 'link', 'unlink', 'source'],
                                        height: 200
                                    }}
                                    onChange={(newContent) => {
                                        setEditDescription(newContent);
                                        setEditErrors(prev => ({ ...prev, description: '' }));
                                    }}
                                />
                                {editErrors.description && (
                                    <div className="text-danger small mt-1">{editErrors.description}</div>
                                )}
                            </div>
                        </div>
                        
                        {Object.keys(editErrors).length > 0 && (
                            <div className="alert alert-danger">
                                Please fix the errors above
                            </div>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{color : "#797878"}} variant="secondary" onClick={() => setShowEditModal(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleEditSubmit} disabled={loading} style={{color : "#3d619e"}}>
                        {loading ? 'Updating...' : 'Update Course'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete the course "{courseToDelete?.course_name}"?</p>
                    <p className="text-danger"><small>This action cannot be undone. All course data will be permanently deleted.</small></p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={deleteCourse} disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ManageCourses;