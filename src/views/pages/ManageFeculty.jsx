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
import { APP_PREFIX_PATH } from 'config/constant';
import { useNavigate } from "react-router-dom";
import { encode as base64_encode } from 'base-64';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SubjectIcon from '@mui/icons-material/Subject';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Avatar } from '@mui/material';

const columns = [
    { id: 'S_No', label: 'S.No.', align: 'center' },
    { id: 'actions', label: 'Actions', minWidth: 150, align: 'center' },
    { id: 'profile', label: 'Profile', align: 'center' },
    { id: 'name', label: 'Name', align: 'center' },
    { id: 'email', label: 'Email', align: 'center' },
    { id: 'phone', label: 'Phone', align: 'center' },
    { id: 'subjects', label: 'Subjects', align: 'center' },
    { id: 'experience', label: 'Experience', align: 'center' },
    { id: 'salary', label: 'Salary', align: 'center' },
    { id: 'bond', label: 'Bond', align: 'center' },
    { id: 'qualification', label: 'Qualification', align: 'center' },
    { id: 'date_time', label: 'Join Date', minWidth: 120, align: 'center' }
];

const ManageFaculty = () => {

    const navigate = useNavigate();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    const theme = useTheme();
    const [showModal2, setShowModal2] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const [facultyData, setFacultyData] = React.useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [facultyToDelete, setFacultyToDelete] = useState('');
    const [facultyToEdit, setFacultyToEdit] = useState(null);
    const [facultyToView, setFacultyToView] = useState(null);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    
    // Edit state
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editSubjects, setEditSubjects] = useState('');
    const [editExperience, setEditExperience] = useState('');
    const [editQualification, setEditQualification] = useState('');
    const [editSalary, setEditSalary] = useState('');
    const [editBond, setEditBond] = useState('');
    
    // Error states
    const [editNameError, setEditNameError] = useState('');
    const [editEmailError, setEditEmailError] = useState('');
    const [editPhoneError, setEditPhoneError] = useState('');
    const [error, setError] = useState('');
    
    // Add state
    const [addName, setAddName] = useState('');
    const [addEmail, setAddEmail] = useState('');
    const [addPhone, setAddPhone] = useState('');
    const [addSubjects, setAddSubjects] = useState('');
    const [addExperience, setAddExperience] = useState('');
    const [addBond, setAddBond] = useState('');
    const [addFacultysalary, setAddFacultysalary] = useState('');
    const [addQualification, setAddQualification] = useState('');
    
    // Add error states
    const [addNameError, setAddNameError] = useState('');
    const [addEmailError, setAddEmailError] = useState('');
    const [addPhoneError, setAddPhoneError] = useState('');
    
    const [searchQuery, setSearchQuery] = React.useState('');

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

    // Fetch all faculty members
    const fetchData = () => {
        setLoading(true);
        axios
            .get(`${API_URL}get_all_feculty_members`)
            .then((response) => {
                if (response.data.success) {
                    setFacultyData(response.data.feculty_arr || []);
                } else {
                    setApiError(response.data.msg || 'Failed to fetch faculty data');
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching faculty data:', error);
                setApiError('Error fetching faculty data. Please try again.');
                setLoading(false);
            });
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const handleAction = (action, facultyData) => {
        if (action === 'Edit') {
            setShowEditModal(true);
            setFacultyToEdit(facultyData);
            setEditName(facultyData.name || '');
            setEditEmail(facultyData.email || '');
            setEditPhone(facultyData.mobile || facultyData.phone || '');
            setEditSubjects(facultyData.subject || facultyData.subjects || '');
            setEditExperience(facultyData.experience || '');
            setEditQualification(facultyData.qualification || '');
            setEditSalary(facultyData.salary || '');
            setEditBond(facultyData.feculty_bond || facultyData.bond || '');
            setFacultyToDelete(facultyData.feculty_id || facultyData.faculty_id);
        } else if (action === 'Delete') {
            setShowDeleteModal(true);
            setFacultyToDelete(facultyData.feculty_id || facultyData.faculty_id);
            setSelectedIndex(null);
        } else if (action === 'view') {
            // Fetch single faculty data for view
            fetchFacultyById(facultyData.feculty_id || facultyData.faculty_id);
            setSelectedIndex(null);
        }
    };

    // Fetch single faculty by ID
    const fetchFacultyById = (facultyId) => {
        setLoading(true);
        axios
            .get(`${API_URL}get_fecultyby_id/${facultyId}`)
            .then((response) => {
                if (response.data.success) {
                    const data = response.data.data;
                    setFacultyToView(data && data.length > 0 ? data[0] : null);
                    setShowViewModal(true);
                } else {
                    setApiError(response.data.msg || 'Failed to fetch faculty details');
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching faculty details:', error);
                setApiError('Error fetching faculty details. Please try again.');
                setLoading(false);
            });
    };

    // Delete faculty
    const deleteFaculty = () => {
        setLoading(true);
        axios
            .post(`${API_URL}delete_feculty/${facultyToDelete}`)
            .then((response) => {
                if (response.data.success) {
                    setShowDeleteModal(false);
                    fetchData(); // Refresh the list
                } else {
                    setApiError(response.data.msg || 'Error deleting faculty');
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error deleting faculty:', error);
                setApiError('Error deleting faculty. Please try again.');
                setLoading(false);
            });
    };

    // Edit/Update faculty
    const handleEdit = (e) => {
        e.preventDefault();

        let hasError = false;

        // Clear previous errors
        setEditNameError('');
        setEditEmailError('');
        setEditPhoneError('');
        setError('');

        // Validation
        if (!editName.trim()) {
            setEditNameError('Please enter faculty name');
            hasError = true;
        }

        if (!editEmail.trim()) {
            setEditEmailError('Please enter email');
            hasError = true;
        } else if (!/\S+@\S+\.\S+/.test(editEmail)) {
            setEditEmailError('Please enter valid email');
            hasError = true;
        }

        if (!editPhone.trim()) {
            setEditPhoneError('Please enter phone number');
            hasError = true;
        } else if (!/^\d{10}$/.test(editPhone)) {
            setEditPhoneError('Please enter valid 10-digit phone number');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        setLoading(true);

        // Prepare data for API
        const facultyData = {
            name: editName,
            email: editEmail,
            mobile: editPhone,
            subject: editSubjects,
            experience: editExperience,
            salary: editSalary || '0',
            bond: editBond || '0',
            qualification: editQualification
        };

        axios
            .put(`${API_URL}edit_feculty/${facultyToDelete}`, facultyData)
            .then((response) => {
                if (response.data.success) {
                    fetchData(); // Refresh the list
                    setShowEditModal(false);
                    resetEditForm();
                } else {
                    setError(response.data.msg || 'Error updating faculty');
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error updating faculty:', error);
                setError('Error updating faculty. Please try again.');
                setLoading(false);
            });
    };

    // Add new faculty
    const handleAdd = (e) => {
        e.preventDefault();

        let hasError = false;

        // Clear previous errors
        setAddNameError('');
        setAddEmailError('');
        setAddPhoneError('');
        setError('');

        // Validation
        if (!addName.trim()) {
            setAddNameError('Please enter faculty name');
            hasError = true;
        }

        if (!addEmail.trim()) {
            setAddEmailError('Please enter email');
            hasError = true;
        } else if (!/\S+@\S+\.\S+/.test(addEmail)) {
            setAddEmailError('Please enter valid email');
            hasError = true;
        }

        if (!addPhone.trim()) {
            setAddPhoneError('Please enter phone number');
            hasError = true;
        } else if (!/^\d{10}$/.test(addPhone)) {
            setAddPhoneError('Please enter valid 10-digit phone number');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        setLoading(true);

        // Prepare data for API
        const facultyData = {
            name: addName,
            email: addEmail,
            mobile: addPhone,
            subject: addSubjects,
            experience: addExperience,
            salary: addFacultysalary || '0',
            bond: addBond || '0',
            qualification: addQualification
        };

        axios
            .post(`${API_URL}add_new_feculty`, facultyData)
            .then((response) => {
                if (response.data.success) {
                    setShowModal2(false);
                    fetchData(); // Refresh the list
                    resetAddForm();
                } else {
                    setError(response.data.msg || 'Error adding faculty');
                    // Check if it's a duplicate email error
                    if (response.data.key === 20) {
                        setAddEmailError('This email is already registered');
                    }
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error adding faculty:', error);
                setError('Error adding faculty. Please try again.');
                setLoading(false);
            });
    };

    const resetEditForm = () => {
        setEditName('');
        setEditEmail('');
        setEditPhone('');
        setEditSubjects('');
        setEditExperience('');
        setEditQualification('');
        setEditSalary('');
        setEditBond('');
        setEditNameError('');
        setEditEmailError('');
        setEditPhoneError('');
        setError('');
        setFacultyToEdit(null);
        setFacultyToDelete('');
    };

    const resetAddForm = () => {
        setAddName('');
        setAddEmail('');
        setAddPhone('');
        setAddSubjects('');
        setAddExperience('');
        setAddFacultysalary('');
        setAddBond('');
        setAddQualification('');
        setAddNameError('');
        setAddEmailError('');
        setAddPhoneError('');
        setError('');
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredFaculty = facultyData.filter((faculty) => {
        const lowercasedTerm = searchQuery.toLowerCase();
        const nameMatch = faculty.name?.toLowerCase().includes(lowercasedTerm);
        const emailMatch = faculty.email?.toLowerCase().includes(lowercasedTerm);
        const phoneMatch = faculty.mobile?.toLowerCase().includes(lowercasedTerm);
        const subjectsMatch = faculty.subject?.toLowerCase().includes(lowercasedTerm);
        const qualificationMatch = faculty.qualification?.toLowerCase().includes(lowercasedTerm);
        const dateMatch = faculty.createtime ? String(faculty.createtime).toLowerCase().includes(lowercasedTerm) : false;
        
        return nameMatch || emailMatch || phoneMatch || subjectsMatch || qualificationMatch || dateMatch;
    });

    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setFacultyToView(null);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        resetEditForm();
    };

    const handleCloseAddModal = () => {
        setShowModal2(false);
        resetAddForm();
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
                        marginBottom: '5px'
                    }}
                >
                    Manage Faculty
                </p>
            </div>
            
            <Box alignItems="center" justifyContent="space-between" display="flex" className="mobile-res">
                <OutlinedInput
                    sx={{ pr: 1, pl: 2, my: 2 }}
                    id="input-search-profile"
                    onChange={handleSearch}
                    placeholder="Search faculty by name, email, subject..."
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
                <Button 
                    className="btn" 
                    onClick={() => setShowModal2(true)}
                    style={{ width: '180px', backgroundColor: '#3268f1', color: '#fff' }}
                    disabled={loading}
                >
                    <AddIcon />
                    Add Faculty
                </Button>
            </Box>

            {apiError && (
                <div className="alert alert-danger" style={{ marginTop: '10px' }}>
                    {apiError}
                    <button 
                        className="close" 
                        onClick={() => setApiError('')}
                        style={{ float: 'right', background: 'none', border: 'none' }}
                    >
                        &times;
                    </button>
                </div>
            )}

            {loading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            
            <Paper sx={{ width: '100%', marginTop: '20px' }}>
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
                            {!loading && filteredFaculty.length > 0 ? (
                                filteredFaculty.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.feculty_id || index}>
                                        <TableCell style={{ textAlign: 'center' }}>{row.s_no || index + 1}</TableCell>
                                        
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
                                                    View Details
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

                                        <TableCell style={{ textAlign: 'center' }}>
                                            <Avatar
                                                sx={{ width: 40, height: 40, margin: 'auto', backgroundColor: '#3268f1' }}
                                            >
                                                {row.name?.charAt(0)?.toUpperCase() || 'F'}
                                            </Avatar>
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <PersonIcon sx={{ mr: 1, fontSize: 16 }} />
                                                {row.name || 'N/A'}
                                            </div>
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <EmailIcon sx={{ mr: 1, fontSize: 16 }} />
                                                {row.email || 'N/A'}
                                            </div>
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <PhoneIcon sx={{ mr: 1, fontSize: 16 }} />
                                                {row.mobile || row.phone || 'N/A'}
                                            </div>
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <SubjectIcon sx={{ mr: 1, fontSize: 16 }} />
                                                {row.subject || row.subjects || 'N/A'}
                                            </div>
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center' }}>
                                            {row.experience || 'N/A'}
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center' }}>
                                            {row.salary || 'N/A'}
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center' }}>
                                            {row.feculty_bond || row.bond || 'N/A'}
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center' }}>
                                            {row.qualification || 'N/A'}
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <CalendarTodayIcon sx={{ mr: 1, fontSize: 16 }} />
                                                {row.createtime || row.join_date || 'N/A'}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                !loading && (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '20px' }}>
                                            {searchQuery ? 'No faculty members found matching your search' : 'No Faculty Data Available'}
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
                    <p>
                        {`Showing ${Math.min(filteredFaculty.length > 0 ? page * rowsPerPage + 1 : 0, filteredFaculty.length)} to ${Math.min((page + 1) * rowsPerPage, filteredFaculty.length)} of ${filteredFaculty.length} entries`}
                    </p>
                    <div>
                        <button 
                            onClick={() => handleChangePage(null, page - 1)} 
                            disabled={page === 0 || loading} 
                            style={{ 
                                marginRight: '8px', 
                                border: '1px solid #bcb9b9', 
                                padding: '5px 10px', 
                                borderRadius: '4px', 
                                color: '#333',
                                cursor: (page === 0 || loading) ? 'not-allowed' : 'pointer',
                                backgroundColor: 'transparent',
                                opacity: (page === 0 || loading) ? 0.5 : 1
                            }}
                        >
                            {'<'}
                        </button>
                        <button
                            onClick={() => handleChangePage(null, page + 1)}
                            disabled={(page + 1) * rowsPerPage >= filteredFaculty.length || loading}
                            style={{ 
                                marginRight: '8px', 
                                border: '1px solid #bcb9b9', 
                                padding: '5px 10px', 
                                borderRadius: '4px', 
                                color: '#333',
                                cursor: ((page + 1) * rowsPerPage >= filteredFaculty.length || loading) ? 'not-allowed' : 'pointer',
                                backgroundColor: 'transparent',
                                opacity: ((page + 1) * rowsPerPage >= filteredFaculty.length || loading) ? 0.5 : 1
                            }}
                        >
                            {'>'}
                        </button>
                    </div>
                </div>

                {/* View Faculty Modal */}
                <Modal 
                    show={showViewModal} 
                    onHide={handleCloseViewModal} 
                    size="lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title style={{color : "#2c2c2c"}}>Faculty Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {facultyToView && (
                            <div>
                                <div className="row mb-4">
                                    <div className="col-md-3 d-flex justify-content-center">
                                        <Avatar
                                            sx={{ width: 120, height: 120, backgroundColor: '#3268f1', fontSize: '48px' }}
                                        >
                                            {facultyToView.name?.charAt(0)?.toUpperCase() || 'F'}
                                        </Avatar>
                                    </div>
                                    <div className="col-md-9">
                                        <h4 style={{color : "#5e8bb0"}}>{facultyToView.name || 'N/A'}</h4>
                                        <p className="text-muted mb-1">
                                            <EmailIcon fontSize="small" className="me-2" />
                                            {facultyToView.email || 'N/A'}
                                        </p>
                                        <p className="text-muted mb-1">
                                            <PhoneIcon fontSize="small" className="me-2" />
                                            {facultyToView.mobile || facultyToView.phone || 'N/A'}
                                        </p>
                                        <p className="text-muted">
                                            <CalendarTodayIcon fontSize="small" className="me-2" />
                                            Joined: {facultyToView.createtime || facultyToView.join_date || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <h6 style={{color : "#525252ea"}}>Subjects</h6>
                                        <p style={{color : "#716e6ec5"}}>
                                            <SubjectIcon fontSize="small" className="me-2" />
                                            {facultyToView.subject || facultyToView.subjects || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <h6 style={{color : "#525252ea"}}>Experience</h6>
                                        <p style={{color : "#716e6ec5"}}>{facultyToView.experience || 'N/A'}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <h6 style={{color : "#525252ea"}}>Salary</h6>
                                        <p style={{color : "#716e6ec5"}}>{facultyToView.salary || 'N/A'}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <h6 style={{color : "#525252ea"}}>Bond</h6>
                                        <p style={{color : "#716e6ec5"}}>{facultyToView.feculty_bond || facultyToView.bond || 'N/A'}</p>
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <h6 style={{color : "#525252ea"}}>Qualification</h6>
                                        <p style={{color : "#716e6ec5"}}>{facultyToView.qualification || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{color : "#828181"}} variant="secondary" onClick={handleCloseViewModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Edit Faculty Modal */}
                <Modal 
                    show={showEditModal} 
                    onHide={handleCloseEditModal}
                    size="lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title style={{color : "#535252"}}>Edit Faculty</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleEdit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label style={{color : "#7f7e7e"}} className="form-label">Faculty Name *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${editNameError ? 'is-invalid' : ''}`}
                                        value={editName}
                                        onChange={(e) => {
                                            setEditName(e.target.value);
                                            setEditNameError('');
                                        }}
                                        placeholder="Enter faculty name"
                                        disabled={loading}
                                    />
                                    {editNameError && <div className="text-danger small">{editNameError}</div>}
                                </div>
                                
                                <div className="col-md-6 mb-3">
                                    <label style={{color : "#7f7e7e"}} className="form-label">Email *</label>
                                    <input
                                        type="email"
                                        className={`form-control ${editEmailError ? 'is-invalid' : ''}`}
                                        value={editEmail}
                                        onChange={(e) => {
                                            setEditEmail(e.target.value);
                                            setEditEmailError('');
                                        }}
                                        placeholder="Enter email"
                                        disabled={loading}
                                    />
                                    {editEmailError && <div className="text-danger small">{editEmailError}</div>}
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label style={{color : "#7f7e7e"}} className="form-label">Phone Number *</label>
                                    <input
                                        type="tel"
                                        className={`form-control ${editPhoneError ? 'is-invalid' : ''}`}
                                        value={editPhone}
                                        onChange={(e) => {
                                            setEditPhone(e.target.value);
                                            setEditPhoneError('');
                                        }}
                                        placeholder="Enter 10-digit phone number"
                                        maxLength="10"
                                        disabled={loading}
                                    />
                                    {editPhoneError && <div className="text-danger small">{editPhoneError}</div>}
                                </div>
                                
                                <div className="col-md-6 mb-3">
                                    <label style={{color : "#7f7e7e"}} className="form-label">Subjects</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editSubjects}
                                        onChange={(e) => setEditSubjects(e.target.value)}
                                        placeholder="Enter subjects (comma separated)"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label style={{color : "#7f7e7e"}} className="form-label">Experience</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editExperience}
                                        onChange={(e) => setEditExperience(e.target.value)}
                                        placeholder="e.g., 5 years"
                                        disabled={loading}
                                    />
                                </div>
                                
                                <div className="col-md-6 mb-3">
                                    <label style={{color : "#7f7e7e"}} className="form-label">Salary</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editSalary}
                                        onChange={(e) => setEditSalary(e.target.value)}
                                        placeholder="Enter salary"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label style={{color : "#7f7e7e"}} className="form-label">Bond</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editBond}
                                        onChange={(e) => setEditBond(e.target.value)}
                                        placeholder="e.g., 2 years"
                                        disabled={loading}
                                    />
                                </div>
                                
                                <div className="col-md-6 mb-3">
                                    <label style={{color : "#7f7e7e"}} className="form-label">Qualification</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editQualification}
                                        onChange={(e) => setEditQualification(e.target.value)}
                                        placeholder="Enter qualification"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            
                            {error && <div className="alert alert-danger">{error}</div>}
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{color : "#4b4a4a"}} variant="secondary" onClick={handleCloseEditModal} disabled={loading}>
                            Cancel
                        </Button>
                        <Button style={{color : "#282727"}} variant="primary" onClick={handleEdit} disabled={loading}>
                            {loading ? 'Updating...' : 'Update Faculty'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Add Faculty Modal */}
                <Modal 
                    show={showModal2} 
                    onHide={handleCloseAddModal}
                    size="lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title style={{color : "#0d0909"}}>Add New Faculty</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleAdd}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label" style={{color : "#898989"}}>Faculty Name *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${addNameError ? 'is-invalid' : ''}`}
                                        value={addName}
                                        onChange={(e) => {
                                            setAddName(e.target.value);
                                            setAddNameError('');
                                        }}
                                        placeholder="Enter faculty name"
                                        disabled={loading}
                                    />
                                    {addNameError && <div className="text-danger small">{addNameError}</div>}
                                </div>
                                
                                <div className="col-md-6 mb-3">
                                    <label className="form-label" style={{color : "#898989"}}>Email *</label>
                                    <input
                                        type="email"
                                        className={`form-control ${addEmailError ? 'is-invalid' : ''}`}
                                        value={addEmail}
                                        onChange={(e) => {
                                            setAddEmail(e.target.value);
                                            setAddEmailError('');
                                        }}
                                        placeholder="Enter email"
                                        disabled={loading}
                                    />
                                    {addEmailError && <div className="text-danger small">{addEmailError}</div>}
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label" style={{color : "#898989"}}>Phone Number *</label>
                                    <input
                                        type="tel"
                                        className={`form-control ${addPhoneError ? 'is-invalid' : ''}`}
                                        value={addPhone}
                                        onChange={(e) => {
                                            setAddPhone(e.target.value);
                                            setAddPhoneError('');
                                        }}
                                        placeholder="Enter 10-digit phone number"
                                        maxLength="10"
                                        disabled={loading}
                                    />
                                    {addPhoneError && <div className="text-danger small">{addPhoneError}</div>}
                                </div>
                                
                                <div className="col-md-6 mb-3">
                                    <label className="form-label" style={{color : "#898989"}}>Subjects</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={addSubjects}
                                        onChange={(e) => setAddSubjects(e.target.value)}
                                        placeholder="Enter subjects (comma separated)"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label" style={{color : "#898989"}}>Experience</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={addExperience}
                                        onChange={(e) => setAddExperience(e.target.value)}
                                        placeholder="e.g., 5 years"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label" style={{color : "#898989"}}>Faculty Salary</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter monthly salary"
                                        value={addFacultysalary}
                                        onChange={(e) => setAddFacultysalary(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label" style={{color : "#898989"}}>Bond</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={addBond}
                                        onChange={(e) => setAddBond(e.target.value)}
                                        placeholder="e.g., 2 years"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label" style={{color : "#898989"}}>Qualification</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={addQualification}
                                        onChange={(e) => setAddQualification(e.target.value)}
                                        placeholder="Enter qualification"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            
                            {error && <div className="alert alert-danger">{error}</div>}
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAddModal} style={{backgroundColor : "#7a77779d", color : "#ffff"}} disabled={loading}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleAdd} style={{backgroundColor : "#3268f1", color : "#ffff"}} disabled={loading}>
                            {loading ? 'Adding...' : 'Add Faculty'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal 
                    show={showDeleteModal} 
                    onHide={() => setShowDeleteModal(false)} 
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title style={{color : "#545252"}}>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{color : "#989898"}}>
                        Are you sure you want to delete this faculty member? This action cannot be undone.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{color : "#8e8d8d"}} variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button style={{color : "#3d3d3d"}} variant="danger" onClick={deleteFaculty} disabled={loading}>
                            {loading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Paper>
        </>
    );
};

export default ManageFaculty;