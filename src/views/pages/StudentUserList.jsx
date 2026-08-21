import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
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
import { 
    ArrowDropDown, 
    Visibility, 
    Edit, 
    Delete, 
    ToggleOff, 
    School,
    QueryBuilder,
    PersonAdd,
    PersonOutline,
    ErrorOutline,
    Update,
    FollowTheSigns
} from '@mui/icons-material';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconSearch } from '@tabler/icons-react';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';
import { Modal } from 'react-bootstrap';
import { encode as base64_encode } from 'base-64';
import { CircularProgress, Alert, AlertTitle } from '@mui/material';

// Updated columns with new student fields
const columns = [
    { id: 'number', label: 'S.No.', minWidth: 70, align: 'center' },
    { id: 'Action', label: 'Action', minWidth: 140, align: 'center' },
    { id: 'name', label: 'Name', minWidth: 150, align: 'center' },
    { id: 'user_type', label: 'Student Type', minWidth: 130, align: 'center' },
    { id: 'admission_type', label: 'Admission Type', minWidth: 130, align: 'center' },
    { id: 'course_name', label: 'Course', minWidth: 150, align: 'center' },
    { id: 'qualification', label: 'Qualification', minWidth: 130, align: 'center' },
    { id: 'mobile', label: 'Mobile', minWidth: 120, align: 'center' },
    { id: 'parent_contact', label: 'Parent Contact', minWidth: 130, align: 'center' },
    { id: 'total_fees', label: 'Total Fees (₹)', minWidth: 120, align: 'center' },
    { id: 'fees_pending', label: 'Pending Fees (₹)', minWidth: 120, align: 'center' },
    { id: 'student_status', label: 'Status', minWidth: 120, align: 'center' },
    { id: 'date_of_admission', label: 'Admission Date', minWidth: 120, align: 'center' },
    { id: 'createtime', label: 'Created Date', minWidth: 150, align: 'center' }
];

const StudentUserList = () => {
    const [parkomStatus, setParkomStatus] = useState(null);
    const [gatepassStatus, setGatepassStatus] = useState(null);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage] = React.useState(50);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const [user_data, setUserAllData] = React.useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [showActiveModal, setShowActiveModal] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [showFollowupModal, setShowFollowupModal] = React.useState(false);
    const [activemodalUserid, setactivemodalUserid] = React.useState({});
    const [deleteModalUserid, setDeleteModalUserid] = React.useState(null);
    const [followupModalUserId, setFollowupModalUserId] = React.useState(null);
    const [deleteReason, setDeleteReason] = React.useState('');
    const [followupDetails, setFollowupDetails] = React.useState({
        followup_date: '',
        followup_time: '',
        notes: '',
        next_followup_date: '',
        next_followup_time: '',
        status: 0
    });
    const [msg, setmsg] = React.useState('');
    const [courses, setCourses] = React.useState([]);
    const [stats, setStats] = React.useState({
        total_enquiries: 0,
        total_admissions: 0,
        active_admissions: 0,
        completed_admissions: 0,
        total_fees_collected: 0,
        total_fees_pending: 0
    });
    const theme = useTheme();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("All Student");
    const dropdownRef = useRef(null);

    const userTypeLabels = {
        0: 'Admin',
        1: 'Student'
    };

    const admissionTypeLabels = {
        0: 'Enquiry',
        1: 'Admission'
    };

    const studentStatusLabels = {
        0: 'Enquiry Pending',
        1: 'Enquiry Converted',
        2: 'Enquiry Rejected',
        3: 'Admission Active',
        4: 'Admission Completed',
        5: 'Admission Discontinued'
    };

    const followupStatusLabels = {
        0: 'Pending',
        1: 'Contacted',
        2: 'Not Reachable',
        3: 'Interested',
        4: 'Not Interested',
        5: 'Converted'
    };

    useEffect(() => {
        fetchUserData();
        fetchStatistics();
        fetchCourses();
    }, []);

    // 1️⃣ Create Student Record (used for adding new students)
    const createStudentRecord = async (studentData) => {
        try {
            const response = await axios.post(`${API_URL}create_student_record`, studentData);
            if (response.data.success) {
                alert(response.data.message || 'Student record created successfully!');
                fetchUserData();
                return response.data;
            } else {
                alert(response.data.message || 'Failed to create student record');
                return null;
            }
        } catch (error) {
            console.error('Error creating student record:', error);
            alert('Error creating student record');
            return null;
        }
    };

    // 2️⃣ Get all users with pagination & filters
    const fetchUserData = async (page = 1, filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                page: page,
                limit: rowsPerPage,
                ...filters
            };
            
            const response = await axios.get(`${API_URL}get_all_student_data`, { params });
            
            if (response.data && response.data.success) {
                // Handle different response structures
                if (Array.isArray(response.data.data)) {
                    setUserAllData(response.data.data);
                } else if (Array.isArray(response.data.users)) {
                    setUserAllData(response.data.users);
                } else if (Array.isArray(response.data.user_arr)) {
                    setUserAllData(response.data.user_arr);
                } else {
                    setUserAllData([]);
                }
                setSelectedOption("All Student");
            } else {
                setUserAllData([]);
                console.warn('No valid user data found:', response.data);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to load user data. Please try again.');
            setUserAllData([]);
        } finally {
            setLoading(false);
        }
    };

    // 3️⃣ Get single user by ID
    const fetchUserById = async (id) => {
        try {
            const response = await axios.get(`${API_URL}get_student/${id}`);
            if (response.data && response.data.success) {
                return response.data.data || response.data.user;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            return null;
        }
    };

    // 4️⃣ Update student / enquiry record
    const updateStudentRecord = async (id, updateData) => {
        try {
            const response = await axios.put(`${API_URL}update_student/${id}`, updateData);
            if (response.data.success) {
                alert(response.data.message || 'Record updated successfully!');
                fetchUserData();
                return response.data;
            } else {
                alert(response.data.message || 'Failed to update record');
                return null;
            }
        } catch (error) {
            console.error('Error updating student record:', error);
            alert('Error updating record');
            return null;
        }
    };

    // 5️⃣ Convert enquiry → admission
    const convertEnquiryToAdmission = async (id) => {
        if (window.confirm('Are you sure you want to convert this enquiry to admission?')) {
            try {
                const response = await axios.put(`${API_URL}convert_enquiry/${id}`);
                if (response.data.success) {
                    alert(response.data.message || 'Enquiry converted to admission successfully!');
                    fetchUserData();
                    fetchStatistics();
                } else {
                    alert(response.data.message || 'Conversion failed');
                }
            } catch (error) {
                console.error('Error converting enquiry to admission:', error);
                alert('Error converting enquiry to admission');
            }
        }
    };

    // 6️⃣ Soft delete user
    const deleteStudent = async (id, reason) => {
        try {
            const response = await axios.delete(`${API_URL}delete_student/${id}`, {
                data: { delete_reason: reason }
            });
            
            if (response.data.success) {
                alert(response.data.message || 'User deleted successfully');
                fetchUserData();
                fetchStatistics();
                return response.data;
            } else {
                alert(response.data.message || 'Deletion failed');
                return null;
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user');
            return null;
        }
    };

    // 7️⃣ Activate / Deactivate user (Parkom / Gatepass)
    const updateUserStatus = async (userId, statusData) => {
        try {
            const response = await axios.put(`${API_URL}update_user_status`, {
                user_id: userId,
                ...statusData
            });
            
            if (response.data.success) {
                alert(response.data.message || 'Status updated successfully!');
                fetchUserData();
                return response.data;
            } else {
                alert(response.data.message || 'Failed to update status');
                return null;
            }
        } catch (error) {
            console.error('Error updating user status:', error);
            alert('Error updating user status');
            return null;
        }
    };

    // 8️⃣ Student statistics dashboard
    const fetchStatistics = async () => {
        try {
            const response = await axios.get(`${API_URL}student_statistics`);
            if (response.data && response.data.success) {
                setStats(response.data.data || response.data.stats || response.data);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    // 9️⃣ Get course list (dropdown)
    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${API_URL}course_list`);
            if (response.data && response.data.success) {
                setCourses(response.data.data || response.data.courses || []);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    // 🔟 Update follow-up details
    const updateFollowup = async (id, followupData) => {
        try {
            const response = await axios.put(`${API_URL}update_followup/${id}`, followupData);
            if (response.data.success) {
                alert(response.data.message || 'Follow-up updated successfully!');
                fetchUserData();
                return response.data;
            } else {
                alert(response.data.message || 'Failed to update follow-up');
                return null;
            }
        } catch (error) {
            console.error('Error updating follow-up:', error);
            alert('Error updating follow-up details');
            return null;
        }
    };

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleSelect = (option, fetchFunction) => {
        setSelectedOption(option);
        setOpen(false);
        if (fetchFunction) fetchFunction();
    };

    // Filter functions for different user types
    const fetchAllUsers = async () => {
        await fetchUserData();
        setSelectedOption("All Users");
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}get_all_student_data`);
            if (response.data && response.data.success) {
                const userArr = response.data.data || response.data.users || response.data.user_arr || [];
                const students = userArr.filter(user => 
                    user && (user.user_type === 5 || user.user_type === 6)
                );
                setUserAllData(students);
                setSelectedOption("Students");
            } else {
                setUserAllData([]);
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
            setError('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const fetchEnquiries = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}get_all_student_data`);
            if (response.data && response.data.success) {
                const userArr = response.data.data || response.data.users || response.data.user_arr || [];
                const enquiries = userArr.filter(user => 
                    user && user.user_type === 5
                );
                setUserAllData(enquiries);
                setSelectedOption("Enquiries");
            } else {
                setUserAllData([]);
            }
        } catch (error) {
            console.error('Error fetching enquiry data:', error);
            setError('Failed to load enquiries');
        } finally {
            setLoading(false);
        }
    };

    const fetchAdmissions = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}get_all_student_data`);
            if (response.data && response.data.success) {
                const userArr = response.data.data || response.data.users || response.data.user_arr || [];
                const admissions = userArr.filter(user => 
                    user && user.user_type === 6
                );
                setUserAllData(admissions);
                setSelectedOption("Admissions");
            } else {
                setUserAllData([]);
            }
        } catch (error) {
            console.error('Error fetching admission data:', error);
            setError('Failed to load admissions');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

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

    const handleAction = (action, user) => {
        if (!user || !user.user_id) {
            console.error('Invalid user data:', user);
            return;
        }

        if (action === 'View') {
            let encode_user_id = base64_encode(user.user_id.toString());
            navigate(APP_PREFIX_PATH + `/view-user/${encode_user_id}`);
        } else if (action === 'Edit') {
            let encode_user_id = base64_encode(user.user_id.toString());
            navigate(APP_PREFIX_PATH + `/edit-user/${encode_user_id}`);
        } else if (action === 'Activate/Deactivate') {
            setShowActiveModal(true);
            setactivemodalUserid({ 
                user_id: user.user_id, 
                status: user.active_flag,
                user_side: user.user_side,
                parkom_active_flag: user.parkom_active_flag,
                gatepass_active_flag: user.gatepass_active_flag
            });
            
            if (user.user_side === 1) {
                setmsg(user.parkom_active_flag == 0 ? 1 : 0);
                setParkomStatus(user.parkom_active_flag == 0 ? 1 : 0);
            } else if (user.user_side === 2) {
                setmsg(user.gatepass_active_flag == 0 ? 1 : 0);
                setGatepassStatus(user.gatepass_active_flag == 0 ? 1 : 0);
            } else if (user.user_side === 3) {
                setParkomStatus(user.parkom_active_flag);
                setGatepassStatus(user.gatepass_active_flag);
            }
        } else if (action === 'Delete') {
            setDeleteModalUserid(user.user_id);
            setDeleteReason('');
            setShowDeleteModal(true);
        } else if (action === 'Convert to Admission') {
            convertEnquiryToAdmission(user.user_id);
        } else if (action === 'Update Follow-up') {
            setFollowupModalUserId(user.user_id);
            setFollowupDetails({
                followup_date: user.last_followup_date || '',
                followup_time: user.last_followup_time || '',
                notes: user.followup_notes || '',
                next_followup_date: user.next_followup_date || '',
                next_followup_time: user.next_followup_time || '',
                status: user.followup_status || 0
            });
            setShowFollowupModal(true);
        }
        handleClose();
    };

    const handleActivateDeactivate = () => {
        if (activemodalUserid && activemodalUserid.user_id) {
            const { user_id, user_side } = activemodalUserid;
    
            const newParkomStatus = user_side === 1 || user_side === 3 ? parkomStatus : null;
            const newGatepassStatus = user_side === 2 || user_side === 3 ? gatepassStatus : null;
    
            updateUserStatus(user_id, {
                parkomStatus: newParkomStatus,
                gatepassStatus: newGatepassStatus,
            });
            
            setShowActiveModal(false);
        }
    };

    const handleDeleteUser = () => {
        if (!deleteReason.trim()) {
            alert('Please provide a reason for deletion');
            return;
        }

        if (deleteModalUserid) {
            deleteStudent(deleteModalUserid, deleteReason);
            setShowDeleteModal(false);
            setDeleteReason('');
        }
    };

    const handleUpdateFollowup = () => {
        if (followupModalUserId) {
            updateFollowup(followupModalUserId, followupDetails);
            setShowFollowupModal(false);
            setFollowupModalUserId(null);
            setFollowupDetails({
                followup_date: '',
                followup_time: '',
                notes: '',
                next_followup_date: '',
                next_followup_time: '',
                status: 0
            });
        }
    };

    // Safe array check before filtering
    const filteredUsers = Array.isArray(user_data) 
        ? user_data.filter((user) => {
            if (!user) return false;
            
            const lowercasedTerm = searchQuery.toLowerCase();
            
            const searchFields = [
                user.name?.toLowerCase() || '',
                user.email?.toLowerCase() || '',
                user.mobile ? String(user.mobile).toLowerCase() : '',
                user.parent_contact ? String(user.parent_contact).toLowerCase() : '',
                user.course_name?.toLowerCase() || '',
                user.qualification?.toLowerCase() || '',
                user.createtime ? String(user.createtime).toLowerCase() : '',
                user.user_type ? userTypeLabels[user.user_type]?.toLowerCase() || '' : '',
                user.admission_type ? admissionTypeLabels[user.admission_type]?.toLowerCase() || '' : '',
                user.student_status ? studentStatusLabels[user.student_status]?.toLowerCase() || '' : ''
            ];

            return searchFields.some(field => field && field.includes(lowercasedTerm));
        })
        : [];

    // Get status badge color
    const getStatusBadgeColor = (status) => {
        switch(status) {
            case 0: return '#FF9800'; // Enquiry Pending - Orange
            case 1: return '#2196F3'; // Enquiry Converted - Blue
            case 2: return '#F44336'; // Enquiry Rejected - Red
            case 3: return '#4CAF50'; // Admission Active - Green
            case 4: return '#9C27B0'; // Admission Completed - Purple
            case 5: return '#607D8B'; // Admission Discontinued - Grey
            default: return '#757575';
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return amount ? `₹${parseFloat(amount).toLocaleString('en-IN')}` : '₹0';
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
                <span style={{ marginLeft: '16px' }}>Loading user data...</span>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                <AlertTitle>Error</AlertTitle>
                {error}
                <Button 
                    variant="contained" 
                    onClick={fetchUserData} 
                    sx={{ mt: 2 }}
                >
                    Retry
                </Button>
            </Alert>
        );
    }

    return (
        <>
            <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
                <p style={{ fontSize: '1.25rem', color: '#121926', fontWeight: '600', fontFamily: 'Poppins', lineHeight: '1.167', marginBottom: '5px' }}>
                    Manage Students
                </p>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0' }}>
                    View and manage all students, enquiries, and admissions
                </p>
                
                {/* Statistics Dashboard */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '16px', 
                    marginTop: '20px'
                }}>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: '8px', backgroundColor: '#f0f9ff' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#0284c7' }}>Total Enquiries</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#0369a1' }}>
                            {stats.total_enquiries || 0}
                        </p>
                    </Paper>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: '8px', backgroundColor: '#f0fdf4' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#16a34a' }}>Total Admissions</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#15803d' }}>
                            {stats.total_admissions || 0}
                        </p>
                    </Paper>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: '8px', backgroundColor: '#fff7ed' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#ea580c' }}>Fees Collected</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#c2410c' }}>
                            {formatCurrency(stats.total_fees)}
                        </p>
                    </Paper>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: '8px', backgroundColor: '#fef2f2' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#dc2626' }}>Fees Pending</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#b91c1c' }}>
                            {formatCurrency(stats.total_pending)}
                        </p>
                    </Paper>
                </div>
            </div>
            
            <Box alignItems="center" justifyContent="space-start" display="flex" className="mobile-res">
                <OutlinedInput
                    sx={{ pr: 1, pl: 2, my: 2, flex: 1 }}
                    id="input-search-profile"
                    placeholder="Search by name, mobile, course, qualification..."
                    onChange={handleSearch}
                    startAdornment={
                        <InputAdornment position="start">
                            <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                        </InputAdornment>
                    }
                />
                <div style={{ position: "relative", display: "inline-block", marginLeft: "20px" }} ref={dropdownRef}>
                    <button
                        className="btn btn-primary"
                        onClick={handleToggle}
                        style={{ 
                            padding: "10px 20px", 
                            cursor: "pointer", 
                            borderRadius: "5px", 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "5px",
                            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                            border: 'none'
                        }}
                    >
                        {selectedOption} <ArrowDropDown />
                    </button>
                    {open && (
                        <div style={{ 
                            position: "absolute", 
                            top: "45px", 
                            left: "0", 
                            background: "#fff", 
                            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)", 
                            borderRadius: "10px", 
                            width: "200px", 
                            zIndex: 10,
                            overflow: 'hidden'
                        }}>
                            <ul style={{ listStyle: "none", padding: "0", margin: 0 }}>
                                <li 
                                    style={{ 
                                        padding: "12px 16px", 
                                        cursor: "pointer", 
                                        borderBottom: "1px solid #f0f0f0",
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }} 
                                    onClick={() => handleSelect("All Users", fetchAllUsers)}
                                >
                                    <PersonOutline fontSize="small" /> All Student
                                </li>
                                <li 
                                    style={{ 
                                        padding: "12px 16px", 
                                        cursor: "pointer", 
                                        borderBottom: "1px solid #f0f0f0",
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }} 
                                    onClick={() => handleSelect("Students", fetchStudents)}
                                >
                                    <School fontSize="small" /> Students
                                </li>
                                <li 
                                    style={{ 
                                        padding: "12px 16px", 
                                        cursor: "pointer", 
                                        borderBottom: "1px solid #f0f0f0",
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }} 
                                    onClick={() => handleSelect("Enquiries", fetchEnquiries)}
                                >
                                    <QueryBuilder fontSize="small" /> Enquiries
                                </li>
                                <li 
                                    style={{ 
                                        padding: "12px 16px", 
                                        cursor: "pointer",
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }} 
                                    onClick={() => handleSelect("Admissions", fetchAdmissions)}
                                >
                                    <PersonAdd fontSize="small" /> Admissions
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </Box>

            {filteredUsers.length > 0 ? (
                <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell 
                                            key={column.id} 
                                            align={column.align} 
                                            style={{ 
                                                minWidth: column.minWidth,
                                                backgroundColor: '#f8fafc',
                                                fontWeight: '600',
                                                fontSize: '14px',
                                                color: '#1f2937',
                                                borderBottom: '2px solid #e5e7eb'
                                            }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                    <TableRow 
                                        hover 
                                        role="checkbox" 
                                        tabIndex={-1} 
                                        key={row.user_id || index}
                                        style={{ 
                                            backgroundColor: row.user_type === 5 || row.user_type === 6 ? '#f9f9ff' : 'inherit'
                                        }}
                                    >
                                        <TableCell style={{ textAlign: 'center', color: '#4b5563' }}>
                                            {page * rowsPerPage + index + 1}
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <Button
                                                className="btn btn-primary"
                                                aria-label="more"
                                                aria-controls="long-menu"
                                                aria-haspopup="true"
                                                onClick={(event) => handleClick(event, index)}
                                                style={{ 
                                                    width: '100px',
                                                    background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                                                    border: 'none',
                                                    fontSize: '13px',
                                                    padding: '6px 12px'
                                                }}
                                            >
                                                Actions <ArrowDropDown />
                                            </Button>
                                            <Menu
                                                id="long-menu"
                                                anchorEl={anchorEl}
                                                keepMounted
                                                open={selectedIndex === index}
                                                onClose={handleClose}
                                                PaperProps={{
                                                    style: {
                                                        maxHeight: 300,
                                                        width: '200px',
                                                    },
                                                }}
                                            >
                                                <MenuItem
                                                    onClick={() => handleAction('View', row)}
                                                    className="menu-icons"
                                                    style={{ fontSize: '14px' }}
                                                >
                                                    <Visibility style={{ marginRight: '8px', fontSize: '18px' }} />
                                                    View Details
                                                </MenuItem>
                                                
                                                {row.user_type === 5 && (
                                                    <MenuItem
                                                        onClick={() => handleAction('Convert to Admission', row)}
                                                        className="menu-icons"
                                                        style={{ fontSize: '14px', color: '#4CAF50' }}
                                                    >
                                                        <PersonAdd style={{ marginRight: '8px', fontSize: '18px' }} />
                                                        Convert to Admission
                                                    </MenuItem>
                                                )}
                                                
                                                {(row.user_type === 5 || row.user_type === 6) && (
                                                    <MenuItem
                                                        onClick={() => handleAction('Update Follow-up', row)}
                                                        className="menu-icons"
                                                        style={{ fontSize: '14px', color: '#FF9800' }}
                                                    >
                                                        <FollowTheSigns style={{ marginRight: '8px', fontSize: '18px' }} />
                                                        Update Follow-up
                                                    </MenuItem>
                                                )}
                                                
                                                {/* <MenuItem
                                                    onClick={() => handleAction('Edit', row)}
                                                    className="menu-icons"
                                                    style={{ fontSize: '14px' }}
                                                >
                                                    <Edit style={{ marginRight: '8px', fontSize: '18px' }} />
                                                    Edit
                                                </MenuItem> */}
                                                
                                                {row.user_type !== 5 && row.user_type !== 6 && (
                                                    <MenuItem
                                                        onClick={() => handleAction('Activate/Deactivate', row)}
                                                        className="menu-icons"
                                                        style={{ fontSize: '14px' }}
                                                    >
                                                        <ToggleOff style={{ marginRight: '8px', fontSize: '18px' }} />
                                                        Active/Deactive
                                                    </MenuItem>
                                                )}
                                                
                                                <MenuItem
                                                    onClick={() => handleAction('Delete', row)}
                                                    className="menu-icons"
                                                    style={{ fontSize: '14px', color: '#f44336' }}
                                                >
                                                    <Delete style={{ marginRight: '8px', fontSize: '18px' }} />
                                                    Delete
                                                </MenuItem>
                                            </Menu>
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center', fontWeight: '500' }}>
                                            {row.name || 'N/A'}
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                backgroundColor: row.user_type === 5 || row.user_type === 6 ? '#e3f2fd' : '#f3e8ff',
                                                color: row.user_type === 5 || row.user_type === 6 ? '#1976d2' : '#7c3aed'
                                            }}>
                                                {userTypeLabels[row.user_type] || 'Unknown'}
                                            </span>
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center' }}>
                                            {row.admission_type !== undefined && row.admission_type !== null ? (
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    backgroundColor: row.admission_type === 0 ? '#fff3cd' : '#d1e7dd',
                                                    color: row.admission_type === 0 ? '#856404' : '#0f5132'
                                                }}>
                                                    {admissionTypeLabels[row.admission_type] || 'N/A'}
                                                </span>
                                            ) : 'N/A'}
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center', color: '#374151' }}>
                                            {row.course_name || 'N/A'}
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center', color: '#6b7280' }}>
                                            {row.qualification || 'N/A'}
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center', fontWeight: '500' }}>
                                            {row.mobile || 'N/A'}
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center' }}>
                                            {row.parent_contact || 'N/A'}
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center', fontWeight: '600', color: '#059669' }}>
                                            {row.total_fees ? `₹${parseFloat(row.total_fees).toLocaleString('en-IN')}` : 'N/A'}
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center', fontWeight: '600' }}>
                                            {row.fees_pending ? (
                                                <span style={{ 
                                                    color: parseFloat(row.fees_pending) > 0 ? '#dc2626' : '#059669'
                                                }}>
                                                    ₹{parseFloat(row.fees_pending).toLocaleString('en-IN')}
                                                </span>
                                            ) : 'N/A'}
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center' }}>
                                            {row.student_status !== undefined && row.student_status !== null ? (
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    backgroundColor: getStatusBadgeColor(row.student_status) + '20',
                                                    color: getStatusBadgeColor(row.student_status)
                                                }}>
                                                    {studentStatusLabels[row.student_status] || 'N/A'}
                                                </span>
                                            ) : 'N/A'}
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center', color: '#6b7280' }}>
                                            {row.date_of_admission ? new Date(row.date_of_admission).toLocaleDateString('en-IN') : 'N/A'}
                                        </TableCell>
                                        
                                        <TableCell style={{ textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>
                                            {row.createtime ? new Date(row.createtime).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            }) : 'N/A'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '16px 24px',
                        backgroundColor: '#f9fafb',
                        borderTop: '1px solid #e5e7eb'
                    }}>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                            {`Showing ${Math.min(filteredUsers.length > 0 ? page * rowsPerPage + 1 : 0, filteredUsers.length)} to ${Math.min((page + 1) * rowsPerPage, filteredUsers.length)} of ${filteredUsers.length} entries`}
                        </p>
                        <div>
                            <button
                                onClick={() => handleChangePage(null, page - 1)}
                                disabled={page === 0}
                                style={{ 
                                    marginRight: '8px', 
                                    borderRadius: '6px', 
                                    background: page === 0 ? '#f3f4f6' : '#3b82f6',
                                    color: page === 0 ? '#9ca3af' : 'white',
                                    border: '1px solid #e5e7eb',
                                    padding: '8px 16px',
                                    cursor: page === 0 ? 'not-allowed' : 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => handleChangePage(null, page + 1)}
                                disabled={(page + 1) * rowsPerPage >= filteredUsers.length}
                                style={{ 
                                    borderRadius: '6px', 
                                    background: (page + 1) * rowsPerPage >= filteredUsers.length ? '#f3f4f6' : '#3b82f6',
                                    color: (page + 1) * rowsPerPage >= filteredUsers.length ? '#9ca3af' : 'white',
                                    border: '1px solid #e5e7eb',
                                    padding: '8px 16px',
                                    cursor: (page + 1) * rowsPerPage >= filteredUsers.length ? 'not-allowed' : 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </Paper>
            ) : (
                <Paper sx={{ width: '100%', padding: '40px', textAlign: 'center', borderRadius: '12px' }}>
                    <div style={{ color: '#9ca3af', fontSize: '16px' }}>
                        <ErrorOutline style={{ fontSize: '48px', marginBottom: '16px', color: '#d1d5db' }} />
                        <p style={{ marginBottom: '8px', fontSize: '18px', fontWeight: '500' }}>No Data Available</p>
                        <p>No Student found. Try changing your search or filter criteria.</p>
                        <Button 
                            variant="contained" 
                            onClick={fetchUserData}
                            sx={{ mt: 2 }}
                        >
                            Refresh Data
                        </Button>
                    </div>
                </Paper>
            )}

            {/* Active/Deactive Modal */}
            <Modal show={showActiveModal} onHide={() => setShowActiveModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Active/Deactive User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {activemodalUserid.user_side !== 3 
                        ? `Are you sure you want to ${msg === 1 ? "activate" : "deactivate"} this Student?` 
                        : ""}
                    
                    <br /><br />
                    
                    {(activemodalUserid.user_side === 3) && (
                        <div>
                            <label style={{ fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                                For Parkom:
                            </label>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <input
                                        type="radio"
                                        name="parkom"
                                        value="1"
                                        checked={parkomStatus === 1}
                                        onChange={(e) => setParkomStatus(1)}
                                    />
                                    <span>Active</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <input
                                        type="radio"
                                        name="parkom"
                                        value="0"
                                        checked={parkomStatus === 0}
                                        onChange={(e) => setParkomStatus(0)}
                                    />
                                    <span>Deactive</span>
                                </label>
                            </div>
                            
                            <label style={{ fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                                For Gatepass:
                            </label>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <input
                                        type="radio"
                                        name="gatepass"
                                        value="1"
                                        checked={gatepassStatus === 1}
                                        onChange={(e) => setGatepassStatus(1)}
                                    />
                                    <span>Active</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <input
                                        type="radio"
                                        name="gatepass"
                                        value="0"
                                        checked={gatepassStatus === 0}
                                        onChange={(e) => setGatepassStatus(0)}
                                    />
                                    <span>Deactive</span>
                                </label>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowActiveModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        className="btn btn-primary" 
                        onClick={handleActivateDeactivate}
                        style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)', border: 'none' }}
                    >
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete User Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Student</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this Student? This action cannot be undone.</p>
                    <div className="form-group">
                        <label>Reason for deletion:</label>
                        <textarea
                            className="form-control"
                            value={deleteReason}
                            onChange={(e) => setDeleteReason(e.target.value)}
                            rows="3"
                            placeholder="Please provide a reason for deletion..."
                            style={{ marginTop: '8px' }}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleDeleteUser}
                        disabled={!deleteReason.trim()}
                    >
                        Delete User
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Update Follow-up Modal */}
            <Modal show={showFollowupModal} onHide={() => setShowFollowupModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Update Follow-up Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Follow-up Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={followupDetails.followup_date}
                                onChange={(e) => setFollowupDetails({...followupDetails, followup_date: e.target.value})}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Follow-up Time</label>
                            <input
                                type="time"
                                className="form-control"
                                value={followupDetails.followup_time}
                                onChange={(e) => setFollowupDetails({...followupDetails, followup_time: e.target.value})}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Next Follow-up Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={followupDetails.next_followup_date}
                                onChange={(e) => setFollowupDetails({...followupDetails, next_followup_date: e.target.value})}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Next Follow-up Time</label>
                            <input
                                type="time"
                                className="form-control"
                                value={followupDetails.next_followup_time}
                                onChange={(e) => setFollowupDetails({...followupDetails, next_followup_time: e.target.value})}
                            />
                        </div>
                        <div className="col-md-12 mb-3">
                            <label className="form-label">Status</label>
                            <select
                                className="form-control"
                                value={followupDetails.status}
                                onChange={(e) => setFollowupDetails({...followupDetails, status: parseInt(e.target.value)})}
                            >
                                {Object.entries(followupStatusLabels).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-12 mb-3">
                            <label className="form-label">Notes</label>
                            <textarea
                                className="form-control"
                                value={followupDetails.notes}
                                onChange={(e) => setFollowupDetails({...followupDetails, notes: e.target.value})}
                                rows="3"
                                placeholder="Enter follow-up notes..."
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowFollowupModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleUpdateFollowup}
                    >
                        Update Follow-up
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default StudentUserList;