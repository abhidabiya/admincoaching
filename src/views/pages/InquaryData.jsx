import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
    FollowTheSigns,
    Update
} from '@mui/icons-material';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconSearch } from '@tabler/icons-react';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import { Modal } from 'react-bootstrap';
import { encode as base64_encode } from 'base-64';
import { CircularProgress, Alert, AlertTitle } from '@mui/material';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';

const columns = [
    { id: 'number', label: 'S.No.', minWidth: 70, align: 'center' },
    { id: 'Action', label: 'Action', minWidth: 140, align: 'center' },
    { id: 'name', label: 'Name', minWidth: 150, align: 'center' },
    { id: 'user_type', label: 'User Type', minWidth: 130, align: 'center' },
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

const InquaryData = () => {
    const [parkomStatus, setParkomStatus] = useState(null);
    const [gatepassStatus, setGatepassStatus] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(50);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [user_data, setUserAllData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showActiveModal, setShowActiveModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFollowupModal, setShowFollowupModal] = useState(false);
    const [activemodalUserid, setactivemodalUserid] = useState({});
    const [deleteModalUserid, setDeleteModalUserid] = useState(null);
    const [followupModalUserId, setFollowupModalUserId] = useState(null);
    const [deleteReason, setDeleteReason] = useState('');
    const [followupDetails, setFollowupDetails] = useState({
        followup_date: '',
        followup_time: '',
        notes: '',
        next_followup_date: '',
        next_followup_time: '',
        status: 0
    });
    const [msg, setmsg] = useState('');
    const [courses, setCourses] = useState([]);
    const [currentMonth, setCurrentMonth] = useState('');
    const [stats, setStats] = useState({
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
    const [selectedOption, setSelectedOption] = useState("All Users");
    const dropdownRef = useRef(null);

    const userTypeLabels = {
        0: 'Admin',
        1: 'User',
        2: 'Guard',
        3: 'Society Admin',
        4: 'Society Sub Admin',
        5: 'Student Enquiry',
        6: 'Student Admitted'
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

    // Fetch Current Month Data Only
    const fetchUserData = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                page: 1,
                limit: rowsPerPage,
                month_filter: 'current', // 🔥 ONLY CURRENT MONTH
                ...filters
            };

            const response = await axios.get(`${API_URL}inquary_get_all_student_data`, { params });

            if (response.data && response.data.success) {
                if (Array.isArray(response.data.data)) {
                    setUserAllData(response.data.data);
                } else if (Array.isArray(response.data.users)) {
                    setUserAllData(response.data.users);
                } else if (Array.isArray(response.data.user_arr)) {
                    setUserAllData(response.data.user_arr);
                } else {
                    setUserAllData([]);
                }
                setCurrentMonth(response.data.month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));
            } else {
                setUserAllData([]);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to load user data. Please try again.');
            setUserAllData([]);
        } finally {
            setLoading(false);
        }
    }, [rowsPerPage]);

    // Fetch Statistics (Current Month)
    const fetchStatistics = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}enquairy_student_statistics`);
            if (response.data && response.data.success) {
                setStats(response.data.data || response.data.stats || response.data);
                if (response.data.month) {
                    setCurrentMonth(response.data.month);
                }
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    }, []);

    // Fetch Courses
    const fetchCourses = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}enquairy_course_list`);
            if (response.data && response.data.success) {
                setCourses(response.data.data || response.data.courses || []);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
        fetchStatistics();
        fetchCourses();
    }, [fetchUserData, fetchStatistics, fetchCourses]);

    // Filter Functions with Current Month
    const fetchAllUsers = async () => {
        await fetchUserData();
        setSelectedOption("All Users");
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}get_all_student_data`, {
                params: { month_filter: 'current', limit: rowsPerPage }
            });
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
            const response = await axios.get(`${API_URL}get_all_student_data`, {
                params: { month_filter: 'current', type: 'enquiries', limit: rowsPerPage }
            });
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
            const response = await axios.get(`${API_URL}get_all_student_data`, {
                params: { month_filter: 'current', type: 'admissions', limit: rowsPerPage }
            });
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

    // Convert Enquiry to Admission
    const convertEnquiryToAdmission = async (id) => {
        if (window.confirm('Are you sure you want to convert this enquiry to admission?')) {
            try {
                const response = await axios.put(`${API_URL}enquairy_convert_enquiry/${id}`);
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

    // Delete Student
    const deleteStudent = async (id, reason) => {
        try {
            const response = await axios.delete(`${API_URL}enquairy_delete_student/${id}`, {
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

    // Update User Status
    const updateUserStatus = async (userId, statusData) => {
        try {
            const response = await axios.put(`${API_URL}enquiry_update_user_status`, {
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

    // Update Follow-up
    const updateFollowup = async (id, followupData) => {
        try {
            const response = await axios.put(`${API_URL}enquairy_update_followup/${id}`, followupData);
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

    // Filter users based on search
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
                user.admission_type !== undefined && user.admission_type !== null ? admissionTypeLabels[user.admission_type]?.toLowerCase() || '' : '',
                user.student_status !== undefined && user.student_status !== null ? studentStatusLabels[user.student_status]?.toLowerCase() || '' : ''
            ];

            return searchFields.some(field => field && field.includes(lowercasedTerm));
        })
        : [];

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 0: return '#FF9800';
            case 1: return '#2196F3';
            case 2: return '#F44336';
            case 3: return '#4CAF50';
            case 4: return '#9C27B0';
            case 5: return '#607D8B';
            default: return '#757575';
        }
    };

    const formatCurrency = (amount) => {
        return amount ? `₹${parseFloat(amount).toLocaleString('en-IN')}` : '₹0';
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
                <span style={{ marginLeft: '16px' }}>Loading {currentMonth} data...</span>
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
                    onClick={fetchAllUsers}
                    sx={{ mt: 2 }}
                >
                    Retry
                </Button>
            </Alert>
        );
    }

    return (
        <>
            <div className="col-xl-12" style={{ borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#f0f4f8', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <p style={{ fontSize: '1.25rem', color: '#121926', fontWeight: '600', fontFamily: 'Poppins', lineHeight: '1.167', marginBottom: '5px' }}>
                        Manage Enquiries & Students - {currentMonth}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0' }}>
                        View and manage all students, enquiries, and admissions for {currentMonth}
                    </p>
                </div>

                {/* Statistics Dashboard - Current Month */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginTop: '20px',
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
                            {formatCurrency(stats.total_fees_collected)}
                        </p>
                    </Paper>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: '8px', backgroundColor: '#fef2f2' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#dc2626' }}>Fees Pending</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '600', color: '#b91c1c' }}>
                            {formatCurrency(stats.total_fees_pending)}
                        </p>
                    </Paper>
                </div>
            </div>

            {/* Search and Filter */}
            <Box alignItems="center" justifyContent="space-start" display="flex" className="mobile-res">
                <OutlinedInput
                    sx={{ pr: 1, pl: 2, my: 2, flex: 1 }}
                    id="input-search-profile"
                    placeholder={`Search in ${currentMonth} data...`}
                    onChange={handleSearch}
                    startAdornment={
                        <InputAdornment position="start">
                            <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                        </InputAdornment>
                    }
                />

                <div style={{ position: "relative", display: "inline-block", marginLeft: "20px" }} ref={dropdownRef}>
                    <button
                        className="btn"
                        onClick={handleToggle}
                        style={{
                            padding: "10px 20px",
                            cursor: "pointer",
                            borderRadius: "5px",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            background: '#1d2d46',
                            color: "#ffffff",
                            border: 'none'
                        }}
                    >
                        <PersonOutline fontSize="small" />
                        {selectedOption}
                        <ArrowDropDown />
                    </button>
                    {open && (
                        <div style={{
                            position: "absolute",
                            top: "45px",
                            left: "-8px",
                            background: "#0f172a",
                            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
                            borderRadius: "10px",
                            width: "170px",
                            zIndex: 10,
                            overflow: 'hidden'
                        }}>
                            <ul style={{ listStyle: "none", padding: "0", margin: 0 }}>
                                <li
                                    style={{
                                        padding: "12px 16px",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #f0f0f0",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        color: "#82b2f9",
                                        transition: "all 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#060e82b3";
                                        e.currentTarget.style.color = "#fff";
                                        e.currentTarget.style.paddingLeft = "22px";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "transparent";
                                        e.currentTarget.style.color = "#82b2f9";
                                        e.currentTarget.style.paddingLeft = "16px";
                                    }}
                                    onClick={() => fetchAllUsers()}
                                >
                                    <PersonOutline fontSize="small" /> All Users
                                </li>
                                <li
                                    style={{
                                        padding: "12px 16px",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #f0f0f0",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        color: "#82b2f9",
                                        transition: "all 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#060e82b3";
                                        e.currentTarget.style.color = "#fff";
                                        e.currentTarget.style.paddingLeft = "22px";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "transparent";
                                        e.currentTarget.style.color = "#82b2f9";
                                        e.currentTarget.style.paddingLeft = "16px";
                                    }}
                                    onClick={() => fetchStudents()}
                                >
                                    <School fontSize="small" /> Students
                                </li>
                                <li
                                    style={{
                                        padding: "12px 16px",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #f0f0f0",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        color: "#82b2f9",
                                        transition: "all 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#060e82b3";
                                        e.currentTarget.style.color = "#fff";
                                        e.currentTarget.style.paddingLeft = "22px";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "transparent";
                                        e.currentTarget.style.color = "#82b2f9";
                                        e.currentTarget.style.paddingLeft = "16px";
                                    }}
                                    onClick={() => fetchEnquiries()}
                                >
                                    <QueryBuilder fontSize="small" /> Enquiries
                                </li>
                                <li
                                    style={{
                                        padding: "12px 16px",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        color: "#82b2f9",
                                        transition: "all 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#060e82b3";
                                        e.currentTarget.style.color = "#fff";
                                        e.currentTarget.style.paddingLeft = "22px";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "transparent";
                                        e.currentTarget.style.color = "#82b2f9";
                                        e.currentTarget.style.paddingLeft = "16px";
                                    }}
                                    onClick={() => fetchAdmissions()}
                                >
                                    <PersonAdd fontSize="small" /> Admissions
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </Box>

            {/* Table */}
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
                                                fontWeight: '600',
                                                fontSize: '14px',
                                                color: '#ffffffbb',
                                                borderBottom: '1px solid #e5e7eb'
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
                                    >
                                        <TableCell style={{ textAlign: 'center', color: '#ffffff' }}>
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
                                                    padding: '6px 12px',
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

                                                <MenuItem
                                                    onClick={() => handleAction('Edit', row)}
                                                    className="menu-icons"
                                                    style={{ fontSize: '14px' }}
                                                >
                                                    <Edit style={{ marginRight: '8px', fontSize: '18px' }} />
                                                    Edit
                                                </MenuItem>

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

                                        <TableCell align="center">
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '15px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    backgroundColor: row.user_type === 5 || row.user_type === 6 ? '#cde0ee' : '#f3e8ff',
                                                    color: row.user_type === 5 || row.user_type === 6 ? '#1976d2' : '#7c3aed'
                                                }}>
                                                    {userTypeLabels[row.user_type] || 'Unknown'}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center' }}>
                                            {row.admission_type !== undefined && row.admission_type !== null ? (
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    backgroundColor: row.admission_type === 0 ? '#f3e9b7f4' : '#2e6c4c',
                                                    color: row.admission_type === 0 ? '#856404' : '#7bd3b7'
                                                }}>
                                                    {admissionTypeLabels[row.admission_type] || 'N/A'}
                                                </span>
                                            ) : 'N/A'}
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center', color: '#d3d4d6' }}>
                                            {row.course_name || 'N/A'}
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center', color: '#d3d4d6' }}>
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

                                        <TableCell align="center">
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
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
                                            </div>
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center', color: '#898e97' }}>
                                            {row.date_of_admission ? new Date(row.date_of_admission).toLocaleDateString('en-IN') : 'N/A'}
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center', color: '#898e97', fontSize: '13px' }}>
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
                        borderTop: '1px solid #e5e7eb'
                    }}>
                        <p style={{ margin: 0, color: '#cfcfcf', fontSize: '14px' }}>
                            {`Showing ${Math.min(filteredUsers.length > 0 ? page * rowsPerPage + 1 : 0, filteredUsers.length)} to ${Math.min((page + 1) * rowsPerPage, filteredUsers.length)} of ${filteredUsers.length} entries`}
                        </p>
                        <div>
                            <button
                                onClick={() => handleChangePage(null, page - 1)}
                                disabled={page === 0}
                                style={{ marginRight: '8px', border: '1px solid #bcb9b9', padding: '5px 10px', borderRadius: '4px', color: '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer', backgroundColor: 'transparent' }}
                            >
                                {'<'}
                            </button>
                            <button
                                onClick={() => handleChangePage(null, page + 1)}
                                disabled={(page + 1) * rowsPerPage >= filteredUsers.length}
                                style={{ marginRight: '8px', border: '1px solid #bcb9b9', padding: '5px 10px', borderRadius: '4px', color: '#fff', cursor: (page + 1) * rowsPerPage >= filteredUsers.length ? 'not-allowed' : 'pointer', backgroundColor: 'transparent' }}
                            >
                                {'>'}
                            </button>
                        </div>
                    </div>
                </Paper>
            ) : (
                <Paper sx={{ width: '100%', padding: '40px', textAlign: 'center', borderRadius: '12px' }}>
                    <div style={{ color: '#9ca3af', fontSize: '16px' }}>
                        <ErrorOutline style={{ fontSize: '48px', marginBottom: '16px', color: '#d1d5db' }} />
                        <p style={{ marginBottom: '8px', fontSize: '18px', fontWeight: '500' }}>No Data Available for {currentMonth}</p>
                        <p>No {selectedOption.toLowerCase()} found for this month. Try changing your search or filter criteria.</p>
                    </div>
                </Paper>
            )}

            {/* Modals - Keep as is from your existing code */}
            {/* ... (Activate/Deactivate, Delete, Follow-up modals remain same) ... */}

        </>
    );
};

export default InquaryData;